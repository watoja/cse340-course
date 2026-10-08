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
    showCreateProjectPage,
    createProjectAction,
    showEditProjectPage,
    updateProjectAction,
    showAssignCategoriesPage,
    updateAssignedCategories
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

router.get(
    "/",
    showHomePage
);


/* ---------------------------------------------------------
   ORGANIZATIONS
--------------------------------------------------------- */

/*
   All users can view organizations.
*/

router.get(
    "/organizations",
    showOrganizationsPage
);


/*
   Only administrators can create organizations.
*/

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


/*
   Only administrators can edit organizations.
*/

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


/*
   All users can view organization details.
*/

router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);


/* ---------------------------------------------------------
   PROJECTS
--------------------------------------------------------- */

/*
   All users can view the projects list.
*/

router.get(
    "/projects",
    showProjectsPage
);


/*
   Only administrators can create projects.
*/

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


/*
   Only administrators can edit projects.
*/

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


/*
   Only administrators can assign categories
   to projects.
*/

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


/*
   All users can view project details.
*/

router.get(
    "/project/:id",
    showProjectDetailsPage
);


/* ---------------------------------------------------------
   CATEGORIES
--------------------------------------------------------- */

/*
   All users can view categories.
*/

router.get(
    "/categories",
    showCategoriesPage
);


/*
   Only administrators can create categories.
*/

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


/*
   Only administrators can edit categories.
*/

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


/*
   All users can view category details.
*/

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