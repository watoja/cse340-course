import { pool } from "./db.js";

/**

* Get all organizations from the database.
  */
  const getAllOrganizations = async () => {
  const sql = `      SELECT
           organization_id,
           organization_name,
           description,
           website,
           contact_email,
           phone,
           location,
           image
       FROM organization
       ORDER BY organization_name ASC;
   `;

  const result = await pool.query(sql);

  return result.rows;
  };

/**

* Get one organization by ID.
*
* @param {number} organizationId - Organization ID.
  */
  const getOrganizationDetails = async (organizationId) => {
  const sql = `      SELECT
           organization_id,
           organization_name,
           description,
           website,
           contact_email,
           phone,
           location,
           image
       FROM organization
       WHERE organization_id = $1;
   `;

  const result = await pool.query(sql, [organizationId]);

  return result.rows.length > 0 ? result.rows[0] : null;
  };

export {
getAllOrganizations,
getOrganizationDetails
};
