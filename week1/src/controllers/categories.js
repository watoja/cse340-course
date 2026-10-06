import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    createCategory,
    updateCategory
} from "../models/categories.js";

import {
    validateCategory
} from "../utils/validation.js";


/* SHOW CATEGORIES PAGE */
const showCategoriesPage = async (
    req,
    res,
    next
) => {
    try {
        const categories =
            await getAllCategories();

        res.render(
            "categories",
            {
                title: "Service Categories",
                categories
            }
        );
    } catch (error) {
        next(error);
    }
};


/* SHOW CATEGORY DETAILS */
const showCategoryDetailsPage = async (
    req,
    res,
    next
) => {
    try {
        const categoryId =
            Number(req.params.id);

        console.log(
            "GET CATEGORY DETAILS ID:",
            categoryId
        );

        if (
            !Number.isInteger(categoryId) ||
            categoryId < 1
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Category Not Found",
                    error: {
                        message:
                            "The requested category does not exist."
                    }
                }
            );
        }

        const category =
            await getCategoryById(
                categoryId
            );

        console.log(
            "CATEGORY DETAILS:",
            category
        );

        if (!category) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Category Not Found",
                    error: {
                        message:
                            "The requested category does not exist."
                    }
                }
            );
        }

        const projects =
            await getProjectsByCategoryId(
                categoryId
            );

        console.log(
            "CATEGORY PROJECTS:",
            projects
        );

        res.render(
            "category-details",
            {
                title:
                    category.category_name,
                category,
                projects
            }
        );
    } catch (error) {
        console.error(
            "SHOW CATEGORY DETAILS ERROR:",
            error
        );

        next(error);
    }
};


/* SHOW CREATE CATEGORY PAGE */
const showCreateCategoryPage = async (
    req,
    res,
    next
) => {
    try {
        res.render(
            "new-category",
            {
                title: "Add Category",
                category: {
                    category_name: "",
                    description: ""
                },
                errors: []
            }
        );
    } catch (error) {
        next(error);
    }
};


/* CREATE CATEGORY */
const createCategoryController = async (
    req,
    res,
    next
) => {
    try {
        console.log(
            "CATEGORY FORM DATA:",
            req.body
        );

        const errors =
            validateCategory(
                req.body
            );

        if (errors.length > 0) {

            return res.status(400).render(
                "new-category",
                {
                    title: "Add Category",
                    category: req.body,
                    errors
                }
            );
        }

        const category =
            await createCategory(
                req.body
            );

        console.log(
            "CATEGORY DATABASE RESULT:",
            category
        );

        req.flash(
            "success",
            "Category created successfully."
        );

        res.redirect(
            `/category/${category.category_id}`
        );

    } catch (error) {

        console.error(
            "CREATE CATEGORY ERROR:",
            error
        );

        /*
         * PostgreSQL error 23505 means
         * a UNIQUE value already exists.
         */
        if (
            error.code === "23505" &&
            error.constraint ===
                "category_category_name_key"
        ) {

            return res.status(400).render(
                "new-category",
                {
                    title: "Add Category",
                    category: req.body,
                    errors: [
                        "A category with this name already exists. Please choose a different category name."
                    ]
                }
            );
        }

        next(error);
    }
};


/* SHOW EDIT CATEGORY PAGE */
const showEditCategoryPage = async (
    req,
    res,
    next
) => {
    try {
        const categoryId =
            Number(req.params.id);

        console.log(
            "GET EDIT CATEGORY ID:",
            categoryId
        );

        if (
            !Number.isInteger(categoryId) ||
            categoryId < 1
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Category Not Found",
                    error: {
                        message:
                            "The requested category does not exist."
                    }
                }
            );
        }

        const category =
            await getCategoryById(
                categoryId
            );

        console.log(
            "CATEGORY FOR EDIT:",
            category
        );

        if (!category) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Category Not Found",
                    error: {
                        message:
                            "The requested category does not exist."
                    }
                }
            );
        }

        res.render(
            "edit-category",
            {
                title: "Edit Category",
                category,
                errors: []
            }
        );

    } catch (error) {

        console.error(
            "SHOW EDIT CATEGORY ERROR:",
            error
        );

        next(error);
    }
};


/* UPDATE CATEGORY */
const updateCategoryController = async (
    req,
    res,
    next
) => {
    try {
        const categoryId =
            Number(req.params.id);

        console.log(
            "POST EDIT CATEGORY ID:",
            categoryId
        );

        console.log(
            "CATEGORY EDIT FORM DATA:",
            req.body
        );

        if (
            !Number.isInteger(categoryId) ||
            categoryId < 1
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Category Not Found",
                    error: {
                        message:
                            "The requested category does not exist."
                    }
                }
            );
        }

        const errors =
            validateCategory(
                req.body
            );

        if (errors.length > 0) {

            return res.status(400).render(
                "edit-category",
                {
                    title: "Edit Category",
                    category: {
                        ...req.body,
                        category_id: categoryId
                    },
                    errors
                }
            );
        }

        const updated =
            await updateCategory(
                categoryId,
                req.body
            );

        console.log(
            "UPDATED CATEGORY:",
            updated
        );

        if (!updated) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Category Not Found",
                    error: {
                        message:
                            "The category could not be updated."
                    }
                }
            );
        }

        req.flash(
            "success",
            "Category updated successfully."
        );

        res.redirect(
            `/category/${categoryId}`
        );

    } catch (error) {

        console.error(
            "UPDATE CATEGORY ERROR:",
            error
        );

        /*
         * Handle duplicate category names
         * during editing.
         */
        if (
            error.code === "23505" &&
            error.constraint ===
                "category_category_name_key"
        ) {

            return res.status(400).render(
                "edit-category",
                {
                    title: "Edit Category",
                    category: {
                        ...req.body,
                        category_id: categoryId
                    },
                    errors: [
                        "A category with this name already exists. Please choose a different category name."
                    ]
                }
            );
        }

        next(error);
    }
};


export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showCreateCategoryPage,
    createCategoryController,
    showEditCategoryPage,
    updateCategoryController
};