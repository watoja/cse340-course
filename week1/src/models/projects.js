import { pool } from "./db.js";

/**

* Get all service projects.
*
* @returns {Promise<Array>} List of all service projects.
  */
  const getAllProjects = async () => {
  const sql = `      SELECT
           p.project_id,
           p.project_name AS title,
           p.description,
           p.project_date AS date,
           p.location,
           p.organization_id,
           o.organization_name
       FROM project AS p
       JOIN organization AS o
           ON p.organization_id = o.organization_id
       ORDER BY p.project_date ASC;
   `;

  const result = await pool.query(sql);

  return result.rows;
  };

/**

* Get upcoming service projects.
*
* @param {number} numberOfProjects - Number of projects to return.
* @returns {Promise<Array>} Upcoming service projects.
  */
  const getUpcomingProjects = async (numberOfProjects) => {
  const sql = `      SELECT
           p.project_id,
           p.project_name AS title,
           p.description,
           p.project_date AS date,
           p.location,
           p.organization_id,
           o.organization_name
       FROM project AS p
       JOIN organization AS o
           ON p.organization_id = o.organization_id
       WHERE p.project_date >= CURRENT_DATE
       ORDER BY p.project_date ASC
       LIMIT $1;
   `;

  const result = await pool.query(sql, [numberOfProjects]);

  return result.rows;
  };

/**

* Get one service project by ID.
*
* @param {number} id - Service project ID.
* @returns {Promise<Object|null>} Project details or null.
  */
  const getProjectDetails = async (id) => {
  const sql = `      SELECT
           p.project_id,
           p.project_name AS title,
           p.description,
           p.project_date AS date,
           p.location,
           p.organization_id,
           o.organization_name
       FROM project AS p
       JOIN organization AS o
           ON p.organization_id = o.organization_id
       WHERE p.project_id = $1;
   `;

  const result = await pool.query(sql, [id]);

  return result.rows[0] || null;
  };

/**

* Get all categories assigned to a service project.
*
* @param {number} id - Service project ID.
* @returns {Promise<Array>} Categories assigned to the project.
  */
  const getCategoriesByProject = async (id) => {
  const sql = `      SELECT
           c.category_id,
           c.category_name,
           c.description
       FROM category AS c
       JOIN project_categories AS pc
           ON c.category_id = pc.category_id
       WHERE pc.project_id = $1
       ORDER BY c.category_name ASC;
   `;

  const result = await pool.query(sql, [id]);

  return result.rows;
  };

/**

* Get all service projects belonging to an organization.
*
* @param {number} organizationId - Organization ID.
* @returns {Promise<Array>} Projects belonging to the organization.
  */
  const getProjectsByOrganizationId = async (organizationId) => {
  const sql = `      SELECT
           p.project_id,
           p.organization_id,
           p.project_name AS title,
           p.description,
           p.project_date AS date,
           p.location
       FROM project AS p
       WHERE p.organization_id = $1
       ORDER BY p.project_date ASC;
   `;

  const result = await pool.query(sql, [organizationId]);

  return result.rows;
  };

export {
getAllProjects,
getUpcomingProjects,
getProjectDetails,
getCategoriesByProject,
getProjectsByOrganizationId
};
