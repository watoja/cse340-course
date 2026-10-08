import {
    validationResult
} from "express-validator";

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getProjectsByCategoryId
} from "../models/categories.js";


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
                title: "Categories",
                categories
            }
        );
    } catch (error) {
        next(error);
    }
};


const showCategoryDetailsPage = async (
    req,
    res,
    next
) => {
    try {
        const categoryId =
            Number(req.params.id);

        const category =
            await getCategoryById(
                categoryId
            );

        if (!category) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Category Not Found",
                    error: {
                        message:
                            "The category could not be found."
                    }
                }
            );
        }

        const projects =
            await getProjectsByCategoryId(
                categoryId
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
        next(error);
    }
};


const showCreateCategoryPage = (
    req,
    res
) => {
    res.render(
        "new-category",
        {
            title: "Create Category",
            category: {},
            errors: []
        }
    );
};


const createCategoryController = async (
    req,
    res,
    next
) => {
    try {
        const errors =
            validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render(
                "new-category",
                {
                    title: "Create Category",
                    category: req.body,
                    errors:
                        errors.array()
                }
            );
        }

        const category = {
            category_name:
                req.body.category_name,

            description:
                req.body.description
        };

        await createCategory(
            category
        );

        req.flash(
            "success",
            "Category created successfully."
        );

        res.redirect(
            "/categories"
        );
    } catch (error) {
        next(error);
    }
};


const showEditCategoryPage = async (
    req,
    res,
    next
) => {
    try {
        const categoryId =
            Number(req.params.id);

        const category =
            await getCategoryById(
                categoryId
            );

        if (!category) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Category Not Found",
                    error: {
                        message:
                            "The category could not be found."
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
        next(error);
    }
};


const updateCategoryController = async (
    req,
    res,
    next
) => {
    try {
        const categoryId =
            Number(req.params.id);

        const errors =
            validationResult(req);

        if (!errors.isEmpty()) {
            const category = {
                category_id:
                    categoryId,

                category_name:
                    req.body.category_name,

                description:
                    req.body.description
            };

            return res.status(400).render(
                "edit-category",
                {
                    title: "Edit Category",
                    category,
                    errors:
                        errors.array()
                }
            );
        }

        const existingCategory =
            await getCategoryById(
                categoryId
            );

        if (!existingCategory) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Category Not Found",
                    error: {
                        message:
                            "The category could not be found."
                    }
                }
            );
        }

        const category = {
            category_name:
                req.body.category_name,

            description:
                req.body.description
        };

        await updateCategory(
            categoryId,
            category
        );

        req.flash(
            "success",
            "Category updated successfully."
        );

        res.redirect(
            `/category/${categoryId}`
        );
    } catch (error) {
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