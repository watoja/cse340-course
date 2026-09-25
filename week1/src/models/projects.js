import db from "./db.js";

/**
 * Get all projects from the database.
 *
 * @returns {Promise<Array>} List of projects.
 */
const getAllProjects = async () => {
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.description,
            TO_CHAR(p.project_date, 'YYYY-MM-DD') AS project_date,
            p.location,
            p.volunteers_needed,
            p.organization_id,
            o.organization_name
        FROM project AS p
        INNER JOIN organization AS o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date DESC;
    `;

    const result = await db.query(sql);

    return result.rows;
};


/**
 * Get one project by its ID.
 *
 * @param {number} projectId - The project ID.
 * @returns {Promise<Object|undefined>} One project or undefined.
 */
const getProjectById = async (projectId) => {
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.description,
            TO_CHAR(p.project_date, 'YYYY-MM-DD') AS project_date,
            p.location,
            p.volunteers_needed,
            p.organization_id,
            o.organization_name
        FROM project AS p
        INNER JOIN organization AS o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(sql, [projectId]);

    return result.rows[0];
};


export {
    getAllProjects,
    getProjectById
};