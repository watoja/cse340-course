
import {
    getUpcomingProjects,
    getProjectDetails
} from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**
 * Display the upcoming service projects page.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next function.
 */
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(
            NUMBER_OF_UPCOMING_PROJECTS
        );

        res.render("projects", {
            title: "Upcoming Service Projects",
            projects
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Display one service project's details.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next function.
 */
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        const project = await getProjectDetails(projectId);

        if (!project) {
            const error = new Error("Project Not Found");
            error.status = 404;

            return next(error);
        }

        res.render("project", {
            title: project.title,
            project
        });
    } catch (error) {
        next(error);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage
};
