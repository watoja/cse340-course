
import { pool } from "./db.js";

/**
 * Get all categories from the database.
 *
 * @returns {Promise<Array>} List of categories.
 */
const getCategories = async () => {
    const sql = `
        SELECT
            category_id,
            category_name,
            description
        FROM category
        ORDER BY category_name;
    `;

    const result = await pool.query(sql);

    return result.rows;
};

export {
    getCategories
};
