import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    getProjectOrganizations,
    getProjectCategories,
    getAssignedCategories,
    updateProjectCategories
} from "../models/projects.js";

import {
    validateProject
} from "../utils/validation.js";


/* SHOW PROJECTS PAGE */
const showProjectsPage = async (
    req,
    res,
    next
) => {
    try {
        const projects =
            await getUpcomingProjects(5);

        res.render(
            "projects",
            {
                title: "Upcoming Service Projects",
                projects
            }
        );
    } catch (error) {
        next(error);
    }
};


/* SHOW PROJECT DETAILS */
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
                    title: "Project Not Found",
                    error: {
                        message:
                            "The requested project does not exist."
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
                    title: "Project Not Found",
                    error: {
                        message:
                            "The requested project does not exist."
                    }
                }
            );
        }

        res.render(
            "project-details",
            {
                title: project.project_name,
                project
            }
        );
    } catch (error) {
        next(error);
    }
};


/* SHOW CREATE PROJECT PAGE */
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
                title: "Add Project",
                project: {
                    project_name: "",
                    description: "",
                    project_date: "",
                    location: "",
                    volunteers_needed: "",
                    organization_id: ""
                },
                organizations,
                errors: []
            }
        );
    } catch (error) {
        next(error);
    }
};


/* CREATE PROJECT */
const createProjectAction = async (
    req,
    res,
    next
) => {
    try {
        console.log(
            "POST /project/create received"
        );

        console.log(
            "PROJECT FORM DATA:",
            req.body
        );

        const errors =
            validateProject(
                req.body
            );

        if (errors.length > 0) {
            const organizations =
                await getProjectOrganizations();

            return res.status(400).render(
                "new-project",
                {
                    title: "Add Project",
                    project: req.body,
                    organizations,
                    errors
                }
            );
        }

        const project =
            await createProject(
                req.body
            );

        console.log(
            "PROJECT DATABASE RESULT:",
            project
        );

        req.flash(
            "success",
            "Project created successfully."
        );

        res.redirect(
            `/project/${project.project_id}`
        );
    } catch (error) {
        console.error(
            "CREATE PROJECT ERROR:",
            error
        );

        next(error);
    }
};


/* SHOW EDIT PROJECT PAGE */
const showEditProjectPage = async (
    req,
    res,
    next
) => {
    try {
        const projectId =
            Number(req.params.id);

        console.log(
            "GET EDIT PROJECT ID:",
            projectId
        );

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Project Not Found",
                    error: {
                        message:
                            "The requested project does not exist."
                    }
                }
            );
        }

        const project =
            await getProjectDetails(
                projectId
            );

        console.log(
            "PROJECT FOR EDIT:",
            project
        );

        if (!project) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Project Not Found",
                    error: {
                        message:
                            "The requested project does not exist."
                    }
                }
            );
        }

        const organizations =
            await getProjectOrganizations();

        res.render(
            "edit-project",
            {
                title: "Edit Project",
                project,
                organizations,
                errors: []
            }
        );
    } catch (error) {
        console.error(
            "SHOW EDIT PROJECT ERROR:",
            error
        );

        next(error);
    }
};


/* UPDATE PROJECT */
const updateProjectAction = async (
    req,
    res,
    next
) => {
    try {
        const projectId =
            Number(req.params.id);

        console.log(
            "POST EDIT PROJECT ID:",
            projectId
        );

        console.log(
            "PROJECT EDIT FORM DATA:",
            req.body
        );

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Project Not Found",
                    error: {
                        message:
                            "The requested project does not exist."
                    }
                }
            );
        }

        const errors =
            validateProject(
                req.body
            );

        if (errors.length > 0) {
            const organizations =
                await getProjectOrganizations();

            return res.status(400).render(
                "edit-project",
                {
                    title: "Edit Project",
                    project: {
                        ...req.body,
                        project_id: projectId
                    },
                    organizations,
                    errors
                }
            );
        }

        const updated =
            await updateProject(
                projectId,
                req.body
            );

        console.log(
            "UPDATED PROJECT:",
            updated
        );

        if (!updated) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Project Not Found",
                    error: {
                        message:
                            "The project could not be updated."
                    }
                }
            );
        }

        req.flash(
            "success",
            "Project updated successfully."
        );

        res.redirect(
            `/project/${projectId}`
        );
    } catch (error) {
        console.error(
            "UPDATE PROJECT ERROR:",
            error
        );

        next(error);
    }
};


/* SHOW ASSIGN CATEGORIES PAGE */
const showAssignCategoriesPage = async (
    req,
    res,
    next
) => {
    try {
        const projectId =
            Number(req.params.id);

        console.log(
            "ASSIGN CATEGORIES PROJECT ID:",
            projectId
        );

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Project Not Found",
                    error: {
                        message:
                            "The requested project does not exist."
                    }
                }
            );
        }

        const project =
            await getProjectDetails(
                projectId
            );

        console.log(
            "ASSIGN CATEGORIES PROJECT:",
            project
        );

        if (!project) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Project Not Found",
                    error: {
                        message:
                            "The requested project does not exist."
                    }
                }
            );
        }

        const categories =
            await getProjectCategories();

        console.log(
            "ALL CATEGORIES:",
            categories
        );

        const assignedCategories =
            await getAssignedCategories(
                projectId
            );

        console.log(
            "ASSIGNED CATEGORIES:",
            assignedCategories
        );

        const assignedCategoryIds =
            assignedCategories.map(
                (category) =>
                    Number(category.category_id)
            );

        console.log(
            "ASSIGNED CATEGORY IDS:",
            assignedCategoryIds
        );

        res.render(
            "assign-categories",
            {
                title:
                    "Assign Project Categories",
                project,
                categories,
                assignedCategoryIds,
                errors: []
            }
        );
    } catch (error) {
        console.error(
            "SHOW ASSIGN CATEGORIES ERROR:",
            error
        );

        next(error);
    }
};


/* UPDATE ASSIGNED CATEGORIES */
const updateAssignedCategories = async (
    req,
    res,
    next
) => {
    try {
        const projectId =
            Number(req.params.id);

        console.log(
            "UPDATE CATEGORY PROJECT ID:",
            projectId
        );

        console.log(
            "CATEGORY FORM DATA:",
            req.body
        );

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Project Not Found",
                    error: {
                        message:
                            "The requested project does not exist."
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
                    title: "Project Not Found",
                    error: {
                        message:
                            "The requested project does not exist."
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
                    (id) => Number(id)
                )
                .filter(
                    (id) =>
                        Number.isInteger(id) &&
                        id > 0
                );

        console.log(
            "CATEGORY IDS TO SAVE:",
            categoryIds
        );

        await updateProjectCategories(
            projectId,
            categoryIds
        );

        req.flash(
            "success",
            "Project categories updated successfully."
        );

        res.redirect(
            `/project/${projectId}`
        );
    } catch (error) {
        console.error(
            "UPDATE PROJECT CATEGORIES ERROR:",
            error
        );

        next(error);
    }
};


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