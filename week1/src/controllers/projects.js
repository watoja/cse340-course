
import {
    getUpcomingProjects,
    getProjectDetails
} from "../models/projects.js";


/**
 * Display the upcoming service projects.
 */
const buildProjects = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(5);

        console.log("=================================");
        console.log("UPCOMING PROJECTS DATA:");
        console.table(projects);
        console.log("FIRST PROJECT:");
        console.log(projects[0]);
        console.log("FIRST PROJECT DATE:");
        console.log(projects[0]?.date);
        console.log("=================================");

        res.render("projects", {
            title: "Upcoming Service Projects",
            projects
        });
    } catch (error) {
        console.error("Error loading upcoming service projects:", error);
        next(error);
    }
};


/**
 * Display the details of one service project.
 */
const buildProjectDetails = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            const error = new Error("Project Not Found");
            error.status = 404;

            return next(error);
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            const error = new Error("Project Not Found");
            error.status = 404;

            return next(error);
        }

        res.render("project-details", {
            title: project.title,
            project
        });
    } catch (error) {
        console.error("Error loading project details:", error);
        next(error);
    }
};


export {
    buildProjects,
    buildProjectDetails
};

