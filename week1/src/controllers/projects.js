import {
    validationResult
} from "express-validator";

import {
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
} from "../models/projects.js";


const NUMBER_OF_UPCOMING_PROJECTS = 5;


/* ---------------------------------------------------------
   SHOW PROJECTS PAGE
--------------------------------------------------------- */

const showProjectsPage = async (
    req,
    res,
    next
) => {

    try {

        const projects =
            await getUpcomingProjects(
                NUMBER_OF_UPCOMING_PROJECTS
            );


        res.render(
            "projects",
            {
                title:
                    "Upcoming Service Projects",

                projects
            }
        );

    } catch (error) {

        next(error);

    }
};


/* ---------------------------------------------------------
   SHOW PROJECT DETAILS PAGE
--------------------------------------------------------- */

const showProjectDetailsPage = async (
    req,
    res,
    next
) => {

    try {

        const projectId =
            Number(req.params.id);


        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {

            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Project Not Found",

                    error: {
                        message:
                            "The requested project could not be found."
                    }
                }
            );

        }


        const project =
            await getProjectDetails(
                projectId
            );


        if (!project) {

            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Project Not Found",

                    error: {
                        message:
                            "The requested project could not be found."
                    }
                }
            );

        }


        const categories =
            await getProjectCategoriesById(
                projectId
            );


        res.render(
            "project-details",
            {
                title:
                    project.project_name,

                project,

                categories
            }
        );

    } catch (error) {

        next(error);

    }
};


/* ---------------------------------------------------------
   SHOW CREATE PROJECT PAGE
   ADMIN ACCESS IS PROTECTED IN ROUTES
--------------------------------------------------------- */

const showCreateProjectPage = async (
    req,
    res,
    next
) => {

    try {

        const organizations =
            await getProjectOrganizations();


        res.render(
            "new-project",
            {
                title:
                    "Create Project",

                project: {},

                organizations,

                errors: []
            }
        );

    } catch (error) {

        next(error);

    }
};


/* ---------------------------------------------------------
   CREATE PROJECT
   ADMIN ACCESS IS PROTECTED IN ROUTES
--------------------------------------------------------- */

const createProjectAction = async (
    req,
    res,
    next
) => {

    try {

        const errors =
            validationResult(req);


        const project = {
            project_name:
                req.body.project_name,

            description:
                req.body.description,

            project_date:
                req.body.project_date,

            location:
                req.body.location,

            volunteers_needed:
                req.body.volunteers_needed,

            organization_id:
                req.body.organization_id
        };


        if (!errors.isEmpty()) {

            const organizations =
                await getProjectOrganizations();


            return res.status(400).render(
                "new-project",
                {
                    title:
                        "Create Project",

                    project,

                    organizations,

                    errors:
                        errors.array()
                }
            );

        }


        const createdProject =
            await createProject(
                project
            );


        req.flash(
            "success",
            `Project "${createdProject.project_name}" was created successfully.`
        );


        res.redirect(
            `/project/${createdProject.project_id}`
        );

    } catch (error) {

        next(error);

    }
};


/* ---------------------------------------------------------
   SHOW EDIT PROJECT PAGE
   ADMIN ACCESS IS PROTECTED IN ROUTES
--------------------------------------------------------- */

const showEditProjectPage = async (
    req,
    res,
    next
) => {

    try {

        const projectId =
            Number(req.params.id);


        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {

            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Project Not Found",

                    error: {
                        message:
                            "The requested project could not be found."
                    }
                }
            );

        }


        const project =
            await getProjectDetails(
                projectId
            );


        if (!project) {

            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Project Not Found",

                    error: {
                        message:
                            "The requested project could not be found."
                    }
                }
            );

        }


        const organizations =
            await getProjectOrganizations();


        res.render(
            "edit-project",
            {
                title:
                    "Edit Project",

                project,

                organizations,

                errors: []
            }
        );

    } catch (error) {

        next(error);

    }
};


/* ---------------------------------------------------------
   UPDATE PROJECT
   ADMIN ACCESS IS PROTECTED IN ROUTES
--------------------------------------------------------- */

const updateProjectAction = async (
    req,
    res,
    next
) => {

    try {

        const projectId =
            Number(req.params.id);


        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {

            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Project Not Found",

                    error: {
                        message:
                            "The requested project could not be found."
                    }
                }
            );

        }


        const errors =
            validationResult(req);


        const project = {
            project_id:
                projectId,

            project_name:
                req.body.project_name,

            description:
                req.body.description,

            project_date:
                req.body.project_date,

            location:
                req.body.location,

            volunteers_needed:
                req.body.volunteers_needed,

            organization_id:
                req.body.organization_id
        };


        if (!errors.isEmpty()) {

            const organizations =
                await getProjectOrganizations();


            return res.status(400).render(
                "edit-project",
                {
                    title:
                        "Edit Project",

                    project,

                    organizations,

                    errors:
                        errors.array()
                }
            );

        }


        const updatedProject =
            await updateProject(
                projectId,
                project
            );


        if (!updatedProject) {

            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Project Not Found",

                    error: {
                        message:
                            "The requested project could not be found."
                    }
                }
            );

        }


        req.flash(
            "success",
            `Project "${updatedProject.project_name}" was updated successfully.`
        );


        res.redirect(
            `/project/${updatedProject.project_id}`
        );

    } catch (error) {

        next(error);

    }
};


/* ---------------------------------------------------------
   SHOW ASSIGN CATEGORIES PAGE
   ADMIN ACCESS IS PROTECTED IN ROUTES
--------------------------------------------------------- */

const showAssignCategoriesPage =
    async (
        req,
        res,
        next
    ) => {

        try {

            const projectId =
                Number(req.params.id);


            if (
                !Number.isInteger(projectId) ||
                projectId < 1
            ) {

                return res.status(404).render(
                    "errors/error",
                    {
                        title:
                            "Project Not Found",

                        error: {
                            message:
                                "The requested project could not be found."
                        }
                    }
                );

            }


            const project =
                await getProjectDetails(
                    projectId
                );


            if (!project) {

                return res.status(404).render(
                    "errors/error",
                    {
                        title:
                            "Project Not Found",

                        error: {
                            message:
                                "The requested project could not be found."
                        }
                    }
                );

            }


            const categories =
                await getProjectCategories();


            const assignedCategories =
                await getAssignedCategories(
                    projectId
                );


            const assignedCategoryIds =
                assignedCategories.map(
                    (category) =>
                        Number(
                            category.category_id
                        )
                );


            res.render(
                "assign-categories",
                {
                    title:
                        "Assign Categories",

                    project,

                    categories,

                    assignedCategoryIds,

                    errors: []
                }
            );

        } catch (error) {

            next(error);

        }
    };


/* ---------------------------------------------------------
   UPDATE ASSIGNED CATEGORIES
   ADMIN ACCESS IS PROTECTED IN ROUTES
--------------------------------------------------------- */

const updateAssignedCategories =
    async (
        req,
        res,
        next
    ) => {

        try {

            const projectId =
                Number(req.params.id);


            if (
                !Number.isInteger(projectId) ||
                projectId < 1
            ) {

                return res.status(404).render(
                    "errors/error",
                    {
                        title:
                            "Project Not Found",

                        error: {
                            message:
                                "The requested project could not be found."
                        }
                    }
                );

            }


            let categoryIds =
                req.body.category_ids || [];


            if (
                !Array.isArray(categoryIds)
            ) {

                categoryIds = [
                    categoryIds
                ];

            }


            categoryIds =
                categoryIds
                    .map(
                        (categoryId) =>
                            Number(categoryId)
                    )
                    .filter(
                        (categoryId) =>
                            Number.isInteger(
                                categoryId
                            ) &&
                            categoryId > 0
                    );


            await updateProjectCategories(
                projectId,
                categoryIds
            );


            req.flash(
                "success",
                "Project categories were updated successfully."
            );


            res.redirect(
                `/project/${projectId}`
            );

        } catch (error) {

            next(error);

        }
    };


/* ---------------------------------------------------------
   EXPORTS
--------------------------------------------------------- */

export {
    showProjectsPage,
    showProjectDetailsPage,
    showCreateProjectPage,
    createProjectAction,
    showEditProjectPage,
    updateProjectAction,
    showAssignCategoriesPage,
    updateAssignedCategories
};