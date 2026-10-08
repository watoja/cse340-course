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


import {
    validateOrganization,
    validateProject,
    validateCategory
} from "./middleware/validation.js";


const router = express.Router();


router.get(
    "/",
    showHomePage
);


/*
 * Organizations
 */

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
    validateOrganization,
    createOrganizationController
);

router.get(
    "/organization/:id/edit",
    showEditOrganizationPage
);

router.post(
    "/organization/:id/edit",
    validateOrganization,
    updateOrganizationController
);

router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);


/*
 * Projects
 */

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
    validateProject,
    createProjectAction
);

router.get(
    "/project/:id/edit",
    showEditProjectPage
);

router.post(
    "/project/:id/edit",
    validateProject,
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


/*
 * Categories
 */

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
    validateCategory,
    createCategoryController
);

router.get(
    "/category/:id/edit",
    showEditCategoryPage
);

router.post(
    "/category/:id/edit",
    validateCategory,
    updateCategoryController
);

router.get(
    "/category/:id",
    showCategoryDetailsPage
);


export default router;