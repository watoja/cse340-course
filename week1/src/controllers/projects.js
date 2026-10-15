
import {
    validationResult
} from "express-validator";

import {
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
        const projects = await getUpcomingProjects(
            NUMBER_OF_UPCOMING_PROJECTS
        );

        return res.render("projects", {
            title: "Upcoming Service Projects",
            projects
        });
    } catch (error) {
        return next(error);
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
        const projectId = Number(req.params.id);

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            return res.status(404).render("errors/error", {
                title: "Project Not Found",
                error: {
                    message: "The requested project could not be found."
                }
            });
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render("errors/error", {
                title: "Project Not Found",
                error: {
                    message: "The requested project could not be found."
                }
            });
        }

<<<<<<< HEAD

        const categories =
            await getProjectCategoriesById(
                projectId
            );


        let isVolunteered = false;

        if (
            req.session &&
            req.session.user
        ) {

            const userId =
                req.session.user.user_id;

            isVolunteered =
                await checkUserVolunteered(
                    userId,
                    projectId
                );

        }


        res.render(
            "project-details",
            {
                title:
                    project.project_name,

                project,

                categories,

                isVolunteered
            }
        );

    } catch (error) {

        next(error);

    }
};


/* ---------------------------------------------------------
   HANDLE VOLUNTEER ACTION (ADD / REMOVE)
--------------------------------------------------------- */

const handleVolunteerAction = async (
    req,
    res,
    next
) => {

    try {

        const projectId =
            Number(req.params.id);

        const userId =
            req.session.user.user_id;

        const { action } = req.body;


        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {

            return res.status(404).render(
                "errors/error",
                {
                    title: "Project Not Found",
                    error: {
                        message: "The requested project could not be found."
                    }
                }
            );

        }


        if (action === "add") {

            await addVolunteer(
                userId,
                projectId
            );

            req.flash(
                "success",
                "You have successfully volunteered for this project."
            );

        } else if (action === "remove") {

            await removeVolunteer(
                userId,
                projectId
            );

            req.flash(
                "success",
                "You have been removed from this project's volunteer list."
            );

        } else {

            req.flash(
                "error",
                "Invalid action requested."
            );

        }


        res.redirect(
            `/project/${projectId}`
        );

    } catch (error) {

        next(error);

    }
};


/* ---------------------------------------------------------
   SHOW VOLUNTEERED PROJECTS PAGE
--------------------------------------------------------- */

const showVolunteeredProjectsPage = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            req.session.user.user_id;

        const projects =
            await getVolunteeredProjects(
                userId
            );


        res.render(
            "volunteering",
            {
                title:
                    "My Volunteered Projects",

                projects
            }
=======
        const categories = await getProjectCategoriesById(
            projectId
>>>>>>> refs/remotes/origin/main
        );

        const currentUser = req.session?.user || null;
        const isLoggedIn = Boolean(currentUser);
        let hasVolunteered = false;

        if (isLoggedIn && currentUser.user_id) {
            const volunteeredProjects = await getVolunteeredProjects(
                currentUser.user_id
            );

            hasVolunteered = volunteeredProjects.some(
                (volunteeredProject) =>
                    Number(volunteeredProject.project_id) === projectId
            );
        }

        return res.render("project-details", {
            title: project.project_name,
            project,
            categories,
            isLoggedIn,
            currentUser,
            hasVolunteered,
            success: req.flash("success"),
            errors: req.flash("error")
        });
    } catch (error) {
        return next(error);
    }
};


/* ---------------------------------------------------------
   VOLUNTEER FOR A PROJECT
   LOGIN IS REQUIRED IN ROUTES
--------------------------------------------------------- */

const volunteerForProject = async (
    req,
    res,
    next
) => {
    try {
        const projectId = Number(req.params.id);
        const user = req.session?.user;

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            req.flash("error", "Invalid project selected.");
            return res.redirect("/projects");
        }

        if (!user || !user.user_id) {
            req.flash(
                "error",
                "Your user session is invalid. Please log in again."
            );

            return res.redirect("/login");
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            req.flash("error", "The requested project could not be found.");
            return res.redirect("/projects");
        }

        const added = await addProjectVolunteer(
            user.user_id,
            projectId
        );

        if (added) {
            req.flash(
                "success",
                `You are now volunteering for "${project.project_name}".`
            );
        } else {
            req.flash(
                "success",
                "You are already volunteering for this project."
            );
        }

        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        return next(error);
    }
};


/* ---------------------------------------------------------
   REMOVE VOLUNTEER FROM A PROJECT
   LOGIN IS REQUIRED IN ROUTES
--------------------------------------------------------- */

const removeVolunteerFromProject = async (
    req,
    res,
    next
) => {
    try {
        const projectId = Number(req.params.id);
        const user = req.session?.user;

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            req.flash("error", "Invalid project selected.");
            return res.redirect("/dashboard");
        }

        if (!user || !user.user_id) {
            req.flash(
                "error",
                "Your user session is invalid. Please log in again."
            );

            return res.redirect("/login");
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            req.flash("error", "The requested project could not be found.");
            return res.redirect("/dashboard");
        }

        const removed = await removeProjectVolunteer(
            user.user_id,
            projectId
        );

        if (removed) {
            req.flash(
                "success",
                `You have been removed from "${project.project_name}".`
            );
        } else {
            req.flash(
                "error",
                "You were not signed up to volunteer for this project."
            );
        }

        /*
         * Return the user to the page where the action was submitted.
         * Dashboard forms include a returnTo field in the next step
         * if you want to distinguish the two destinations reliably.
         */
        const returnTo = req.body.returnTo;

        if (returnTo === "dashboard") {
            return res.redirect("/dashboard");
        }

        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        return next(error);
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
        const organizations = await getProjectOrganizations();

        return res.render("new-project", {
            title: "Create Project",
            project: {},
            organizations,
            errors: []
        });
    } catch (error) {
        return next(error);
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
        const errors = validationResult(req);

        const project = {
            project_name: req.body.project_name,
            description: req.body.description,
            project_date: req.body.project_date,
            location: req.body.location,
            volunteers_needed: req.body.volunteers_needed,
            organization_id: req.body.organization_id
        };

        if (!errors.isEmpty()) {
            const organizations = await getProjectOrganizations();

            return res.status(400).render("new-project", {
                title: "Create Project",
                project,
                organizations,
                errors: errors.array()
            });
        }

        const createdProject = await createProject(project);

        req.flash(
            "success",
            `Project "${createdProject.project_name}" was created successfully.`
        );

        return res.redirect(
            `/project/${createdProject.project_id}`
        );
    } catch (error) {
        return next(error);
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
        const projectId = Number(req.params.id);

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            return res.status(404).render("errors/error", {
                title: "Project Not Found",
                error: {
                    message: "The requested project could not be found."
                }
            });
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render("errors/error", {
                title: "Project Not Found",
                error: {
                    message: "The requested project could not be found."
                }
            });
        }

        const organizations = await getProjectOrganizations();

        return res.render("edit-project", {
            title: "Edit Project",
            project,
            organizations,
            errors: []
        });
    } catch (error) {
        return next(error);
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
        const projectId = Number(req.params.id);

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            return res.status(404).render("errors/error", {
                title: "Project Not Found",
                error: {
                    message: "The requested project could not be found."
                }
            });
        }

        const errors = validationResult(req);

        const project = {
            project_id: projectId,
            project_name: req.body.project_name,
            description: req.body.description,
            project_date: req.body.project_date,
            location: req.body.location,
            volunteers_needed: req.body.volunteers_needed,
            organization_id: req.body.organization_id
        };

        if (!errors.isEmpty()) {
            const organizations = await getProjectOrganizations();

            return res.status(400).render("edit-project", {
                title: "Edit Project",
                project,
                organizations,
                errors: errors.array()
            });
        }

        const updatedProject = await updateProject(
            projectId,
            project
        );

        if (!updatedProject) {
            return res.status(404).render("errors/error", {
                title: "Project Not Found",
                error: {
                    message: "The requested project could not be found."
                }
            });
        }

        req.flash(
            "success",
            `Project "${updatedProject.project_name}" was updated successfully.`
        );

        return res.redirect(
            `/project/${updatedProject.project_id}`
        );
    } catch (error) {
        return next(error);
    }
};


/* ---------------------------------------------------------
   SHOW ASSIGN CATEGORIES PAGE
   ADMIN ACCESS IS PROTECTED IN ROUTES
--------------------------------------------------------- */

const showAssignCategoriesPage = async (
    req,
    res,
    next
) => {
    try {
        const projectId = Number(req.params.id);

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            return res.status(404).render("errors/error", {
                title: "Project Not Found",
                error: {
                    message: "The requested project could not be found."
                }
            });
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render("errors/error", {
                title: "Project Not Found",
                error: {
                    message: "The requested project could not be found."
                }
            });
        }

        const categories = await getProjectCategories();

        const assignedCategories = await getAssignedCategories(
            projectId
        );

        const assignedCategoryIds = assignedCategories.map(
            (category) => Number(category.category_id)
        );

        return res.render("assign-categories", {
            title: "Assign Categories",
            project,
            categories,
            assignedCategoryIds,
            errors: []
        });
    } catch (error) {
        return next(error);
    }
};


/* ---------------------------------------------------------
   UPDATE ASSIGNED CATEGORIES
   ADMIN ACCESS IS PROTECTED IN ROUTES
--------------------------------------------------------- */

const updateAssignedCategories = async (
    req,
    res,
    next
) => {
    try {
        const projectId = Number(req.params.id);

        if (
            !Number.isInteger(projectId) ||
            projectId < 1
        ) {
            return res.status(404).render("errors/error", {
                title: "Project Not Found",
                error: {
                    message: "The requested project could not be found."
                }
            });
        }

        let categoryIds = req.body.category_ids || [];

        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        categoryIds = categoryIds
            .map((categoryId) => Number(categoryId))
            .filter(
                (categoryId) =>
                    Number.isInteger(categoryId) &&
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

        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        return next(error);
    }
};


/* ---------------------------------------------------------
   EXPORTS
--------------------------------------------------------- */

export {
    showProjectsPage,
    showProjectDetailsPage,
<<<<<<< HEAD
    handleVolunteerAction,
    showVolunteeredProjectsPage,
=======
    volunteerForProject,
    removeVolunteerFromProject,
>>>>>>> refs/remotes/origin/main
    showCreateProjectPage,
    createProjectAction,
    showEditProjectPage,
    updateProjectAction,
    showAssignCategoriesPage,
    updateAssignedCategories
};
