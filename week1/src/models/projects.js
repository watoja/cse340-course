import db from "./db.js";
import { withTransaction } from "./db.js";


const getAllProjects = async () => {

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
        LEFT JOIN organization o
            ON p.organization_id =
               o.organization_id
        ORDER BY p.project_date ASC;
    `;

    const result =
        await db.query(sql);

    return result.rows;
};


const getUpcomingProjects = async (
    numberOfProjects
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
        LEFT JOIN organization o
            ON p.organization_id =
               o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;

    const result =
        await db.query(
            sql,
            [numberOfProjects]
        );

    return result.rows;
};


const getProjectDetails = async (
    projectId
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
        LEFT JOIN organization o
            ON p.organization_id =
               o.organization_id
        WHERE p.project_id = $1;
    `;

    const result =
        await db.query(
            sql,
            [projectId]
        );

    return result.rows[0];
};


const getProjectCategoriesById =
    async (projectId) => {

        const sql = `
            SELECT
                c.category_id,
                c.category_name,
                c.description
            FROM category c
            INNER JOIN project_categories pc
                ON c.category_id =
                   pc.category_id
            WHERE pc.project_id = $1
            ORDER BY c.category_name;
        `;

        const result =
            await db.query(
                sql,
                [projectId]
            );

        return result.rows;
    };


const createProject = async (
    project
) => {

    const sql = `
        INSERT INTO project (
            project_name,
            description,
            project_date,
            location,
            volunteers_needed,
            organization_id
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        )
        RETURNING
            project_id,
            project_name;
    `;

    const values = [
        project.project_name?.trim(),
        project.description?.trim(),
        project.project_date,
        project.location?.trim(),
        Number(project.volunteers_needed),
        Number(project.organization_id)
    ];

    console.log(
        "PROJECT INSERT VALUES:",
        values
    );

    const result =
        await db.query(
            sql,
            values
        );

    console.log(
        "PROJECT INSERT RESULT:",
        result.rows[0]
    );

    return result.rows[0];
};


const updateProject = async (
    projectId,
    project
) => {

    const sql = `
        UPDATE project
        SET
            project_name = $1,
            description = $2,
            project_date = $3,
            location = $4,
            volunteers_needed = $5,
            organization_id = $6
        WHERE project_id = $7
        RETURNING
            project_id,
            project_name,
            description,
            project_date,
            location,
            volunteers_needed,
            organization_id;
    `;

    const values = [
        project.project_name?.trim(),
        project.description?.trim(),
        project.project_date,
        project.location?.trim(),
        Number(project.volunteers_needed),
        Number(project.organization_id),
        Number(projectId)
    ];

    console.log(
        "PROJECT UPDATE ID:",
        projectId
    );

    console.log(
        "PROJECT UPDATE VALUES:",
        values
    );

    const result =
        await db.query(
            sql,
            values
        );

    console.log(
        "PROJECT UPDATE RESULT:",
        result.rows[0]
    );

    return result.rows[0];
};


const getProjectOrganizations = async () => {

    const sql = `
        SELECT
            organization_id,
            organization_name
        FROM organization
        ORDER BY organization_name;
    `;

    const result =
        await db.query(sql);

    return result.rows;
};


const getProjectCategories = async () => {

    const sql = `
        SELECT
            category_id,
            category_name,
            description
        FROM category
        ORDER BY category_name;
    `;

    const result =
        await db.query(sql);

    return result.rows;
};


const getAssignedCategories = async (
    projectId
) => {

    const sql = `
        SELECT
            c.category_id,
            c.category_name
        FROM category c
        INNER JOIN project_categories pc
            ON c.category_id =
               pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result =
        await db.query(
            sql,
            [projectId]
        );

    return result.rows;
};


const updateProjectCategories = async (
    projectId,
    categoryIds
) => {

    return withTransaction(
        async (client) => {

            await client.query(
                `
                    DELETE FROM project_categories
                    WHERE project_id = $1;
                `,
                [projectId]
            );

            if (
                categoryIds.length === 0
            ) {
                return true;
            }

            const sql = `
                INSERT INTO project_categories (
                    project_id,
                    category_id
                )
                VALUES ($1, $2);
            `;

            for (
                const categoryId
                of categoryIds
            ) {

                await client.query(
                    sql,
                    [
                        Number(projectId),
                        Number(categoryId)
                    ]
                );
            }

            return true;
        }
    );
};


export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectCategoriesById,
    createProject,
    updateProject,
    getProjectOrganizations,
    getProjectCategories,
    getAssignedCategories,
    updateProjectCategories
};