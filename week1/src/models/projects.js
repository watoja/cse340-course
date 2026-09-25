
import { pool } from "./db.js";

/**
 * Get all service projects from the database.
 *
 * @returns {Promise<Array>} List of all service projects.
 */
const getAllProjects = async () => {
    const sql = `
        SELECT
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
 * Get the next upcoming service projects.
 *
 * @param {number} number_of_projects Number of projects to retrieve.
 * @returns {Promise<Array>} List of upcoming service projects.
 */
const getUpcomingProjects = async (number_of_projects) => {
    const sql = `
        SELECT
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

    const result = await pool.query(sql, [number_of_projects]);

    return result.rows;
};

/**
 * Get one service project by its ID.
 *
 * @param {number} id Service project ID.
 * @returns {Promise<Object|null>} Service project details.
 */
const getProjectDetails = async (id) => {
    const sql = `
        SELECT
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

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails
};
