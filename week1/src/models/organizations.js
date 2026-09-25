
import { pool } from "./db.js";

/**
 * Get all organizations from the database.
 *
 * @returns {Promise<Array>} List of organizations.
 */
const getAllOrganizations = async () => {
    const sql = `
        SELECT
            organization_id,
            organization_name,
            description,
            website,
            contact_email,
            phone,
            location,
            image
        FROM organization
        ORDER BY organization_name;
    `;

    const result = await pool.query(sql);

    return result.rows;
};

/**
 * Get one organization by its ID.
 *
 * @param {number} id Organization ID.
 * @returns {Promise<Object|null>} Organization details.
 */
const getOrganizationDetails = async (id) => {
    const sql = `
        SELECT
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

    const result = await pool.query(sql, [id]);

    return result.rows[0] || null;
};

export {
    getAllOrganizations,
    getOrganizationDetails
};
