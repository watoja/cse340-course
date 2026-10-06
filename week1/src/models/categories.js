import db from "./db.js";


/* GET ALL CATEGORIES */
const getAllCategories = async () => {
    const sql = `
        SELECT
            category_id,
            category_name,
            description
        FROM category
        ORDER BY category_name;
    `;

    const result = await db.query(sql);

    return result.rows;
};


/* GET CATEGORY BY ID */
const getCategoryById = async (
    categoryId
) => {
    const sql = `
        SELECT
            category_id,
            category_name,
            description
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(
        sql,
        [Number(categoryId)]
    );

    return result.rows[0];
};


/* GET PROJECTS FOR CATEGORY */
const getProjectsByCategoryId = async (
    categoryId
) => {
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.description,
            p.project_date,
            p.location,
            p.volunteers_needed,
            p.organization_id,
            o.organization_name
        FROM project p
        INNER JOIN project_categories pc
            ON p.project_id = pc.project_id
        LEFT JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC;
    `;

    const result = await db.query(
        sql,
        [Number(categoryId)]
    );

    return result.rows;
};


/* CREATE CATEGORY */
const createCategory = async (
    category
) => {
    const sql = `
        INSERT INTO category (
            category_name,
            description
        )
        VALUES (
            $1,
            $2
        )
        RETURNING
            category_id,
            category_name,
            description;
    `;

    const values = [
        category.category_name?.trim(),
        category.description?.trim()
    ];

    console.log(
        "CATEGORY INSERT VALUES:",
        values
    );

    const result = await db.query(
        sql,
        values
    );

    console.log(
        "CATEGORY INSERT RESULT:",
        result.rows[0]
    );

    return result.rows[0];
};


/* UPDATE CATEGORY */
const updateCategory = async (
    categoryId,
    category
) => {
    const sql = `
        UPDATE category
        SET
            category_name = $1,
            description = $2
        WHERE category_id = $3
        RETURNING
            category_id,
            category_name,
            description;
    `;

    const values = [
        category.category_name?.trim(),
        category.description?.trim(),
        Number(categoryId)
    ];

    console.log(
        "CATEGORY UPDATE ID:",
        categoryId
    );

    console.log(
        "CATEGORY UPDATE VALUES:",
        values
    );

    const result = await db.query(
        sql,
        values
    );

    console.log(
        "CATEGORY UPDATE RESULT:",
        result.rows[0]
    );

    return result.rows[0];
};


export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    createCategory,
    updateCategory
};