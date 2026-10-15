
import express from "express";

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
} from "./controllers/users.js";

import {
    showHomePage
} from "./controllers/index.js";

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showCreateOrganizationPage,
    createOrganizationController,
    showEditOrganizationPage,
    updateOrganizationController
} from "./controllers/organizations.js";

import {
    showProjectsPage,
    showProjectDetailsPage,
    handleVolunteerAction,
    showVolunteeredProjectsPage,
    showCreateProjectPage,
    createProjectAction,
    showEditProjectPage,
    updateProjectAction,
    showAssignCategoriesPage,
    updateAssignedCategories,
    volunteerForProject,
    removeVolunteerFromProject
} from "./controllers/projects.js";

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showCreateCategoryPage,
    createCategoryController,
    showEditCategoryPage,
    updateCategoryController
} from "./controllers/categories.js";

import {
    validateOrganization,
    validateProject,
    validateCategory
} from "./middleware/validation.js";


const router = express.Router();


/* ---------------------------------------------------------
   HOME
--------------------------------------------------------- */

router.get("/", showHomePage);


/* ---------------------------------------------------------
   ORGANIZATIONS
--------------------------------------------------------- */

router.get(
    "/organizations",
    showOrganizationsPage
);

router.get(
    "/organization/create",
    requireLogin,
    requireRole("admin"),
    showCreateOrganizationPage
);

router.post(
    "/organization/create",
    requireLogin,
    requireRole("admin"),
    validateOrganization,
    createOrganizationController
);

router.get(
    "/organization/:id/edit",
    requireLogin,
    requireRole("admin"),
    showEditOrganizationPage
);

router.post(
    "/organization/:id/edit",
    requireLogin,
    requireRole("admin"),
    validateOrganization,
    updateOrganizationController
);

router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);


/* ---------------------------------------------------------
   PROJECTS & VOLUNTEERING
--------------------------------------------------------- */

router.get(
    "/projects",
    showProjectsPage
);

router.get(
    "/project/create",
    requireLogin,
    requireRole("admin"),
    showCreateProjectPage
);

router.post(
    "/project/create",
    requireLogin,
    requireRole("admin"),
    validateProject,
    createProjectAction
);

router.get(
    "/project/:id/edit",
    requireLogin,
    requireRole("admin"),
    showEditProjectPage
);

router.post(
    "/project/:id/edit",
    requireLogin,
    requireRole("admin"),
    validateProject,
    updateProjectAction
);

router.get(
    "/project/:id/categories",
    requireLogin,
    requireRole("admin"),
    showAssignCategoriesPage
);

router.post(
    "/project/:id/categories",
    requireLogin,
    requireRole("admin"),
    updateAssignedCategories
);


<<<<<<< HEAD
/*
   Protected routes for volunteering and unvolunteering.
*/
=======
/* ---------------------------------------------------------
   PROJECT VOLUNTEERING
   ONLY LOGGED-IN USERS
--------------------------------------------------------- */
>>>>>>> refs/remotes/origin/main

router.post(
    "/project/:id/volunteer",
    requireLogin,
<<<<<<< HEAD
    handleVolunteerAction
);

router.get(
    "/dashboard/volunteering",
    requireLogin,
    showVolunteeredProjectsPage
);


/*
   All users can view project details.
*/
=======
    volunteerForProject
);

router.post(
    "/project/:id/volunteer/remove",
    requireLogin,
    removeVolunteerFromProject
);


/* ---------------------------------------------------------
   PROJECT DETAILS
--------------------------------------------------------- */
>>>>>>> refs/remotes/origin/main

router.get(
    "/project/:id",
    showProjectDetailsPage
);


/* ---------------------------------------------------------
   CATEGORIES
--------------------------------------------------------- */

router.get(
    "/categories",
    showCategoriesPage
);

router.get(
    "/category/create",
    requireLogin,
    requireRole("admin"),
    showCreateCategoryPage
);

router.post(
    "/category/create",
    requireLogin,
    requireRole("admin"),
    validateCategory,
    createCategoryController
);

router.get(
    "/category/:id/edit",
    requireLogin,
    requireRole("admin"),
    showEditCategoryPage
);

router.post(
    "/category/:id/edit",
    requireLogin,
    requireRole("admin"),
    validateCategory,
    updateCategoryController
);

router.get(
    "/category/:id",
    showCategoryDetailsPage
);


/* ---------------------------------------------------------
   USER REGISTRATION
--------------------------------------------------------- */

router.get(
    "/register",
    showUserRegistrationForm
);

router.post(
    "/register",
    processUserRegistrationForm
);


/* ---------------------------------------------------------
   USER LOGIN
--------------------------------------------------------- */

router.get(
    "/login",
    showLoginForm
);

router.post(
    "/login",
    processLoginForm
);


/* ---------------------------------------------------------
   USER LOGOUT
--------------------------------------------------------- */

router.get(
    "/logout",
    processLogout
);


/* ---------------------------------------------------------
   USER DASHBOARD
--------------------------------------------------------- */

router.get(
    "/dashboard",
    requireLogin,
    showDashboard
);


/* ---------------------------------------------------------
   USERS PAGE
   ADMIN ONLY
--------------------------------------------------------- */

router.get(
    "/users",
    requireLogin,
    requireRole("admin"),
    showUsersPage
);


/* ---------------------------------------------------------
   EXPORT ROUTER
--------------------------------------------------------- */

export default router;
