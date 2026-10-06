import express from "express";

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


const router = express.Router();


/* =========================================================
   HOME
========================================================= */

router.get(
    "/",
    showHomePage
);


/* =========================================================
   ORGANIZATIONS
========================================================= */

router.get(
    "/organizations",
    showOrganizationsPage
);

router.get(
    "/organization/create",
    showCreateOrganizationPage
);

router.post(
    "/organization/create",
    createOrganizationController
);

router.get(
    "/organization/:id/edit",
    showEditOrganizationPage
);

router.post(
    "/organization/:id/edit",
    updateOrganizationController
);

router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);


/* =========================================================
   PROJECTS
========================================================= */

router.get(
    "/projects",
    showProjectsPage
);

router.get(
    "/project/create",
    showCreateProjectPage
);

router.post(
    "/project/create",
    createProjectAction
);

router.get(
    "/project/:id/edit",
    showEditProjectPage
);

router.post(
    "/project/:id/edit",
    updateProjectAction
);

router.get(
    "/project/:id/categories",
    showAssignCategoriesPage
);

router.post(
    "/project/:id/categories",
    updateAssignedCategories
);

router.get(
    "/project/:id",
    showProjectDetailsPage
);


/* =========================================================
   CATEGORIES
========================================================= */

router.get(
    "/categories",
    showCategoriesPage
);

router.get(
    "/category/create",
    showCreateCategoryPage
);

router.post(
    "/category/create",
    createCategoryController
);

router.get(
    "/category/:id/edit",
    showEditCategoryPage
);

router.post(
    "/category/:id/edit",
    updateCategoryController
);

router.get(
    "/category/:id",
    showCategoryDetailsPage
);


export default router;