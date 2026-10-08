import {
    body
} from "express-validator";


/*
 * Organization validation
 */
const validateOrganization = [
    body("organization_name")
        .trim()
        .notEmpty()
        .withMessage(
            "Organization name is required."
        )
        .isLength({
            min: 2
        })
        .withMessage(
            "Organization name must be at least 2 characters."
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage(
            "Organization description is required."
        )
        .isLength({
            min: 10
        })
        .withMessage(
            "Organization description must be at least 10 characters."
        ),

    body("website")
        .optional({
            values: "falsy"
        })
        .trim()
        .isURL({
            require_protocol: true
        })
        .withMessage(
            "Website must be a valid URL beginning with http:// or https://."
        ),

    body("contact_email")
        .optional({
            values: "falsy"
        })
        .trim()
        .isEmail()
        .withMessage(
            "Please provide a valid email address."
        ),

    body("phone")
        .optional({
            values: "falsy"
        })
        .trim(),

    body("location")
        .optional({
            values: "falsy"
        })
        .trim()
];


/*
 * Project validation
 */
const validateProject = [
    body("project_name")
        .trim()
        .notEmpty()
        .withMessage(
            "Project name is required."
        )
        .isLength({
            min: 2
        })
        .withMessage(
            "Project name must be at least 2 characters."
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage(
            "Project description is required."
        )
        .isLength({
            min: 10
        })
        .withMessage(
            "Project description must be at least 10 characters."
        ),

    body("project_date")
        .notEmpty()
        .withMessage(
            "Project date is required."
        )
        .isISO8601()
        .withMessage(
            "Please provide a valid project date."
        ),

    body("location")
        .trim()
        .notEmpty()
        .withMessage(
            "Project location is required."
        )
        .isLength({
            min: 2
        })
        .withMessage(
            "Project location must be at least 2 characters."
        ),

    body("volunteers_needed")
        .notEmpty()
        .withMessage(
            "The number of volunteers is required."
        )
        .isInt({
            min: 1
        })
        .withMessage(
            "Volunteers needed must be at least 1."
        ),

    body("organization_id")
        .notEmpty()
        .withMessage(
            "Please select an organization."
        )
        .isInt({
            min: 1
        })
        .withMessage(
            "Please select a valid organization."
        )
];


/*
 * Category validation
 */
const validateCategory = [
    body("category_name")
        .trim()
        .notEmpty()
        .withMessage(
            "Category name is required."
        )
        .isLength({
            min: 2
        })
        .withMessage(
            "Category name must be at least 2 characters."
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage(
            "Category description is required."
        )
        .isLength({
            min: 10
        })
        .withMessage(
            "Category description must be at least 10 characters."
        )
];


export {
    validateOrganization,
    validateProject,
    validateCategory
};