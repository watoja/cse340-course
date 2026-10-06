import {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization
} from "../models/organizations.js";

import {
    validateOrganization
} from "../utils/validation.js";


/* =========================================================
   SHOW ALL ORGANIZATIONS
========================================================= */

const showOrganizationsPage = async (
    req,
    res,
    next
) => {
    try {
        const organizations =
            await getAllOrganizations();

        res.render(
            "organizations",
            {
                title: "Organizations",
                organizations
            }
        );
    } catch (error) {
        next(error);
    }
};


/* =========================================================
   SHOW ORGANIZATION DETAILS
========================================================= */

const showOrganizationDetailsPage = async (
    req,
    res,
    next
) => {
    try {
        const organizationId =
            Number(req.params.id);

        if (
            !Number.isInteger(
                organizationId
            )
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Organization Not Found",

                    error: {
                        message:
                            "The requested organization does not exist."
                    }
                }
            );
        }

        const organization =
            await getOrganizationById(
                organizationId
            );

        if (!organization) {
            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Organization Not Found",

                    error: {
                        message:
                            "The requested organization does not exist."
                    }
                }
            );
        }

        res.render(
            "organization-details",
            {
                title:
                    organization.organization_name,

                organization
            }
        );
    } catch (error) {
        next(error);
    }
};


/* =========================================================
   SHOW CREATE FORM
========================================================= */

const showCreateOrganizationPage = async (
    req,
    res
) => {
    res.render(
        "new-organization",
        {
            title: "Add Organization",

            organization: {
                organization_name: "",
                description: "",
                website: "",
                contact_email: "",
                phone: "",
                location: "",
                image: ""
            },

            errors: []
        }
    );
};


/* =========================================================
   CREATE ORGANIZATION
========================================================= */

const createOrganizationController = async (
    req,
    res,
    next
) => {
    try {
        console.log(
            "POST /organization/create received"
        );

        console.log(
            "FORM DATA:",
            req.body
        );

        const errors =
            validateOrganization(
                req.body
            );

        if (errors.length > 0) {
            return res.status(400).render(
                "new-organization",
                {
                    title: "Add Organization",
                    organization: req.body,
                    errors
                }
            );
        }

        const organization =
            await createOrganization(
                req.body
            );

        console.log(
            "DATABASE RESULT:",
            organization
        );

        req.flash(
            "success",
            "Organization created successfully."
        );

        res.redirect(
            "/organizations"
        );
    } catch (error) {
        console.error(
            "CREATE ORGANIZATION ERROR:",
            error
        );

        next(error);
    }
};


/* =========================================================
   SHOW EDIT FORM
========================================================= */

const showEditOrganizationPage = async (
    req,
    res,
    next
) => {
    try {
        const organizationId =
            Number(req.params.id);

        console.log(
            "EDIT PAGE ID:",
            organizationId
        );

        if (
            !Number.isInteger(
                organizationId
            )
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Organization Not Found",

                    error: {
                        message:
                            "The requested organization does not exist."
                    }
                }
            );
        }

        const organization =
            await getOrganizationById(
                organizationId
            );

        console.log(
            "ORGANIZATION FOR EDIT:",
            organization
        );

        if (!organization) {
            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Organization Not Found",

                    error: {
                        message:
                            "The requested organization does not exist."
                    }
                }
            );
        }

        res.render(
            "edit-organization",
            {
                title: "Edit Organization",
                organization,
                errors: []
            }
        );
    } catch (error) {
        console.error(
            "SHOW EDIT ERROR:",
            error
        );

        next(error);
    }
};


/* =========================================================
   UPDATE ORGANIZATION
========================================================= */

const updateOrganizationController = async (
    req,
    res,
    next
) => {
    try {
        const organizationId =
            Number(req.params.id);

        console.log(
            "POST EDIT ID:",
            organizationId
        );

        console.log(
            "EDIT FORM DATA:",
            req.body
        );

        if (
            !Number.isInteger(
                organizationId
            )
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Organization Not Found",

                    error: {
                        message:
                            "The requested organization does not exist."
                    }
                }
            );
        }

        const errors =
            validateOrganization(
                req.body
            );

        if (errors.length > 0) {
            return res.status(400).render(
                "edit-organization",
                {
                    title:
                        "Edit Organization",

                    organization: {
                        ...req.body,
                        organization_id:
                            organizationId
                    },

                    errors
                }
            );
        }

        const updated =
            await updateOrganization(
                organizationId,
                req.body
            );

        console.log(
            "UPDATED ORGANIZATION:",
            updated
        );

        if (!updated) {
            return res.status(404).render(
                "errors/error",
                {
                    title:
                        "Organization Not Found",

                    error: {
                        message:
                            "The organization could not be updated."
                    }
                }
            );
        }

        req.flash(
            "success",
            "Organization updated successfully."
        );

        res.redirect(
            `/organization/${organizationId}`
        );
    } catch (error) {
        console.error(
            "UPDATE ORGANIZATION ERROR:",
            error
        );

        next(error);
    }
};


/* =========================================================
   EXPORTS
========================================================= */

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showCreateOrganizationPage,
    createOrganizationController,
    showEditOrganizationPage,
    updateOrganizationController
};