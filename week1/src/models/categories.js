import { pool } from "./db.js";

/**

* Get all categories.
*
* @returns {Promise<Array>} All categories.
  */
  const getAllCategories = async () => {
  const sql = `      SELECT
           category_id,
           category_name,
           description
       FROM category
       ORDER BY category_name ASC;
   `;

  const result = await pool.query(sql);

  return result.rows;
  };

/**

* Get one category by ID.
*
* @param {number} id - Category ID.
* @returns {Promise<Object|null>} Category or null.
  */
  const getCategoryDetails = async (id) => {
  const sql = `      SELECT
           category_id,
           category_name,
           description
       FROM category
       WHERE category_id = $1;
   `;

  const result = await pool.query(sql, [id]);

  return result.rows[0] || null;
  };

/**

* Get all projects belonging to a category.
*
* @param {number} id - Category ID.
* @returns {Promise<Array>} Projects belonging to the category.
  */
  const getProjectsByCategory = async (id) => {
  const sql = `      SELECT
           p.project_id,
           p.project_name AS title,
           p.description,
           p.project_date AS date,
           p.location,
           p.volunteers_needed,
           p.organization_id,
           o.organization_name
       FROM project AS p
       JOIN project_categories AS pc
           ON p.project_id = pc.project_id
       JOIN organization AS o
           ON p.organization_id = o.organization_id
       WHERE pc.category_id = $1
       ORDER BY p.project_date ASC;
   `;

  const result = await pool.query(sql, [id]);

  return result.rows;
  };

export {
getAllCategories,
getCategoryDetails,
getProjectsByCategory
};
