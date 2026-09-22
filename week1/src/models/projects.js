import db from "./db.js";

/**
 * Get all service projects along with their organization names.
 *
 * @returns {Promise<Array>} A list of service projects.
 */
async function getAllProjects() {
    const sql = `
        SELECT
            project.project_id,
            project.project_name,
            project.description,
            project.project_date,
            project.location,
            project.volunteers_needed,
            organization.organization_name
        FROM project
        INNER JOIN organization
            ON project.organization_id = organization.organization_id
        ORDER BY project.project_date;
    `;

    const result = await db.query(sql);

    return result.rows;
}

export { getAllProjects };