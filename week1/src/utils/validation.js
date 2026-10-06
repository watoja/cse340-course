/* =========================================================
   VALIDATION FUNCTIONS
========================================================= */


/* ---------------------------------------------------------
   ORGANIZATION VALIDATION
--------------------------------------------------------- */

const validateOrganization = (
    organization
) => {
    const errors = [];

    const name =
        organization.organization_name
            ?.trim() || "";

    const description =
        organization.description
            ?.trim() || "";

    const website =
        organization.website
            ?.trim() || "";

    const email =
        organization.contact_email
            ?.trim() || "";


    if (name.length < 2) {
        errors.push(
            "Organization name must be at least 2 characters."
        );
    }


    if (description.length < 10) {
        errors.push(
            "Organization description must be at least 10 characters."
        );
    }


    if (
        website &&
        !/^https?:\/\/.+/i.test(website)
    ) {
        errors.push(
            "Website must begin with http:// or https://."
        );
    }


    if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        errors.push(
            "Please provide a valid email address."
        );
    }


    return errors;
};


/* ---------------------------------------------------------
   PROJECT VALIDATION
--------------------------------------------------------- */

const validateProject = (
    project
) => {
    const errors = [];

    const name =
        project.project_name
            ?.trim() || "";

    const description =
        project.description
            ?.trim() || "";

    const date =
        project.project_date || "";

    const location =
        project.location
            ?.trim() || "";

    const volunteers =
        Number(
            project.volunteers_needed
        );

    const organizationId =
        Number(
            project.organization_id
        );


    if (name.length < 2) {
        errors.push(
            "Project name must be at least 2 characters."
        );
    }


    if (description.length < 10) {
        errors.push(
            "Project description must be at least 10 characters."
        );
    }


    if (!date) {
        errors.push(
            "Project date is required."
        );
    }


    if (location.length < 2) {
        errors.push(
            "Project location must be at least 2 characters."
        );
    }


    if (
        !Number.isInteger(volunteers) ||
        volunteers < 1
    ) {
        errors.push(
            "Volunteers needed must be at least 1."
        );
    }


    if (
        !Number.isInteger(organizationId) ||
        organizationId < 1
    ) {
        errors.push(
            "Please select an organization."
        );
    }


    return errors;
};
/* ---------------------------------------------------------
   CATEGORY VALIDATION
--------------------------------------------------------- */

const validateCategory = (
    category
) => {
    const errors = [];

    const name =
        category.category_name
            ?.trim() || "";

    const description =
        category.description
            ?.trim() || "";


    if (name.length < 2) {
        errors.push(
            "Category name must be at least 2 characters."
        );
    }


    if (description.length < 10) {
        errors.push(
            "Category description must be at least 10 characters."
        );
    }


    return errors;
};


/* ---------------------------------------------------------
   EXPORT
--------------------------------------------------------- */

export {
    validateOrganization,
    validateProject,
    validateCategory
};