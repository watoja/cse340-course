import db from "./db.js";

/**
 * Get all organizations from the database.
 *
 * @returns {Promise<Array>} List of organizations.
 */
async function getAllOrganizations() {
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

    const result = await db.query(sql);

    return result.rows;
}

export { getAllOrganizations };