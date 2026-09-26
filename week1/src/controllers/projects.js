import {
getAllProjects,
getUpcomingProjects,
getProjectDetails,
getCategoriesByProject
} from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**

* Display all service projects.
  */
  const showProjectsPage = async (req, res, next) => {
  try {
  const projects = await getAllProjects();

  
   res.render("projects", {
       title: "Service Projects",
       projects
   });
  

  } catch (error) {
  console.error(
  "Error loading service projects:",
  error
  );

  
   next(error);
  

  }
  };

/**

* Display one service project's details.
  */
  const showProjectDetailsPage = async (req, res, next) => {
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

   const categories =
       await getCategoriesByProject(projectId);

   res.render("project", {
       title: "Project Details",
       project,
       categories
   });
  

  } catch (error) {
  console.error(
  "Error loading project details:",
  error
  );

  
   next(error);
  

  }
  };

export {
showProjectsPage,
showProjectDetailsPage
};
