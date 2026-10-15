import db from "./db.js";
import { withTransaction } from "./db.js";


/*
========================================================
1. GET ALL PROJECTS
========================================================
*/

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
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC;
    `;

    const result = await db.query(sql);

    return result.rows;
};


/*
========================================================
2. GET UPCOMING PROJECTS
========================================================
*/

const getUpcomingProjects = async (numberOfProjects) => {
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
            ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;

    const result = await db.query(sql, [numberOfProjects]);

    return result.rows;
};


/*
========================================================
3. GET PROJECT DETAILS
========================================================
*/

const getProjectDetails = async (projectId) => {
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
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(sql, [projectId]);

    return result.rows[0];
};


/*
========================================================
4. GET PROJECT CATEGORIES BY PROJECT ID
========================================================
*/

const getProjectCategoriesById = async (projectId) => {
    const sql = `
        SELECT
            c.category_id,
            c.category_name,
            c.description
        FROM category c
        INNER JOIN project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await db.query(sql, [projectId]);

    return result.rows;
};


/*
========================================================
5. CREATE PROJECT
========================================================
*/

const createProject = async (project) => {
    const sql = `
        INSERT INTO project (
            project_name,
            description,
            project_date,
            location,
            volunteers_needed,
            organization_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
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

    const result = await db.query(sql, values);

    return result.rows[0];
};


/*
========================================================
6. UPDATE PROJECT
========================================================
*/

const updateProject = async (projectId, project) => {
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

    const result = await db.query(sql, values);

    return result.rows[0];
};


/*
========================================================
7. GET PROJECT ORGANIZATIONS
========================================================
*/

const getProjectOrganizations = async () => {
    const sql = `
        SELECT
            organization_id,
            organization_name
        FROM organization
        ORDER BY organization_name;
    `;

    const result = await db.query(sql);

    return result.rows;
};


/*
========================================================
8. GET ALL CATEGORIES
========================================================
*/

const getProjectCategories = async () => {
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


/*
========================================================
9. GET CATEGORIES ASSIGNED TO A PROJECT
========================================================
*/

const getAssignedCategories = async (projectId) => {
    const sql = `
        SELECT
            c.category_id,
            c.category_name
        FROM category c
        INNER JOIN project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await db.query(sql, [projectId]);

    return result.rows;
};


/*
========================================================
10. UPDATE PROJECT CATEGORIES
========================================================
*/

const updateProjectCategories = async (
    projectId,
    categoryIds
) => {
    return withTransaction(async (client) => {
        await client.query(
            `
                DELETE FROM project_categories
                WHERE project_id = $1;
            `,
            [projectId]
        );

        if (categoryIds.length === 0) {
            return true;
        }

        const sql = `
            INSERT INTO project_categories (
                project_id,
                category_id
            )
            VALUES ($1, $2);
        `;

        for (const categoryId of categoryIds) {
            await client.query(sql, [
                Number(projectId),
                Number(categoryId)
            ]);
        }

        return true;
    });
};


/*
========================================================
<<<<<<< HEAD
VOLUNTEERING FUNCTIONS (W06 Assignment)
========================================================
*/

const addVolunteer = async (
    userId,
    projectId
) => {

    const sql = `
        INSERT INTO volunteers (
            user_id,
            project_id
        )
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;

    await db.query(
        sql,
        [Number(userId), Number(projectId)]
    );

    return true;
};


const removeVolunteer = async (
    userId,
    projectId
) => {

    const sql = `
        DELETE FROM volunteers
        WHERE user_id = $1
          AND project_id = $2;
    `;

    await db.query(
        sql,
        [Number(userId), Number(projectId)]
    );

    return true;
};


const checkUserVolunteered = async (
    userId,
    projectId
) => {

    const sql = `
        SELECT 1
        FROM volunteers
        WHERE user_id = $1
          AND project_id = $2;
    `;

    const result =
        await db.query(
            sql,
            [Number(userId), Number(projectId)]
        );

    return result.rows.length > 0;
};


const getVolunteeredProjects = async (
    userId
) => {

=======
11. ADD A USER AS A PROJECT VOLUNTEER
========================================================

When a new signup is created:
- Decrease volunteers_needed by 1.
- Never reduce the count below zero.
- Do not change the count for duplicate signups.

Returns true when the signup is created.
Returns false when the user already signed up.
========================================================
*/

const addProjectVolunteer = async (
    userId,
    projectId
) => {
    return withTransaction(async (client) => {
        /*
         * Lock the project row so concurrent applications
         * cannot update its volunteer count simultaneously.
         */
        const projectResult = await client.query(
            `
                SELECT project_id, volunteers_needed
                FROM project
                WHERE project_id = $1
                FOR UPDATE;
            `,
            [Number(projectId)]
        );

        if (projectResult.rowCount === 0) {
            return false;
        }

        /*
         * Insert the signup only if this user has not
         * already signed up for the same project.
         */
        const signupResult = await client.query(
            `
                INSERT INTO project_volunteers (
                    user_id,
                    project_id
                )
                VALUES ($1, $2)
                ON CONFLICT (user_id, project_id)
                DO NOTHING
                RETURNING user_id, project_id;
            `,
            [
                Number(userId),
                Number(projectId)
            ]
        );

        /*
         * A duplicate signup must not change the count.
         */
        if (signupResult.rowCount === 0) {
            return false;
        }

        /*
         * Decrease the remaining number of volunteers needed.
         * GREATEST prevents the value from becoming negative.
         */
        await client.query(
            `
                UPDATE project
                SET volunteers_needed =
                    GREATEST(
                        COALESCE(volunteers_needed, 0) - 1,
                        0
                    )
                WHERE project_id = $1;
            `,
            [Number(projectId)]
        );

        return true;
    });
};


/*
========================================================
12. REMOVE A USER FROM A PROJECT
========================================================

When an existing signup is removed:
- Increase volunteers_needed by 1.
- Do not change the count if no signup was removed.

Returns true when the signup is removed.
========================================================
*/

const removeProjectVolunteer = async (
    userId,
    projectId
) => {
    return withTransaction(async (client) => {
        /*
         * Lock the project row before changing the count.
         */
        const projectResult = await client.query(
            `
                SELECT project_id
                FROM project
                WHERE project_id = $1
                FOR UPDATE;
            `,
            [Number(projectId)]
        );

        if (projectResult.rowCount === 0) {
            return false;
        }

        /*
         * Delete only this user's signup for this project.
         */
        const deleteResult = await client.query(
            `
                DELETE FROM project_volunteers
                WHERE user_id = $1
                  AND project_id = $2
                RETURNING user_id, project_id;
            `,
            [
                Number(userId),
                Number(projectId)
            ]
        );

        /*
         * If no signup existed, do not increase the count.
         */
        if (deleteResult.rowCount === 0) {
            return false;
        }

        /*
         * Restore one volunteer position.
         */
        await client.query(
            `
                UPDATE project
                SET volunteers_needed =
                    COALESCE(volunteers_needed, 0) + 1
                WHERE project_id = $1;
            `,
            [Number(projectId)]
        );

        return true;
    });
};


/*
========================================================
13. GET PROJECTS A USER HAS VOLUNTEERED FOR
========================================================

Returns the user's volunteered projects,
including organization details and signup date.
========================================================
*/

const getVolunteeredProjects = async (userId) => {
>>>>>>> refs/remotes/origin/main
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.description,
            p.project_date,
            p.location,
            p.volunteers_needed,
            p.organization_id,
<<<<<<< HEAD
            o.organization_name
        FROM project p
        INNER JOIN volunteers v
            ON p.project_id = v.project_id
        LEFT JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.project_date ASC;
    `;

    const result =
        await db.query(
            sql,
            [Number(userId)]
        );
=======
            o.organization_name,
            pv.signup_date
        FROM project_volunteers pv
        INNER JOIN project p
            ON pv.project_id = p.project_id
        LEFT JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY
            p.project_date ASC NULLS LAST,
            p.project_name ASC;
    `;

    const result = await db.query(
        sql,
        [Number(userId)]
    );
>>>>>>> refs/remotes/origin/main

    return result.rows;
};


<<<<<<< HEAD
=======
/*
========================================================
14. EXPORT MODEL FUNCTIONS
========================================================
*/

>>>>>>> refs/remotes/origin/main
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
    updateProjectCategories,
<<<<<<< HEAD
    addVolunteer,
    removeVolunteer,
    checkUserVolunteered,
=======
    addProjectVolunteer,
    removeProjectVolunteer,
>>>>>>> refs/remotes/origin/main
    getVolunteeredProjects
};