import {
    validationResult
} from "express-validator";

import {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization
} from "../models/organizations.js";


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
            ) ||
            organizationId < 1
        ) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Organization Not Found",
                    error: {
                        message:
                            "The requested organization could not be found."
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
                    title: "Organization Not Found",
                    error: {
                        message:
                            "The requested organization could not be found."
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


const showCreateOrganizationPage = async (
    req,
    res
) => {
    res.render(
        "new-organization",
        {
            title: "Create Organization",
            organization: {},
            errors: []
        }
    );
};


const createOrganizationController = async (
    req,
    res,
    next
) => {
    try {

        const errors =
            validationResult(req);

        const organization = {
            organization_name:
                req.body.organization_name,
            description:
                req.body.description,
            website:
                req.body.website,
            contact_email:
                req.body.contact_email,
            phone:
                req.body.phone,
            location:
                req.body.location
        };

        if (!errors.isEmpty()) {

            return res.status(400).render(
                "new-organization",
                {
                    title:
                        "Create Organization",
                    organization,
                    errors:
                        errors.array()
                }
            );
        }

        const createdOrganization =
            await createOrganization(
                organization
            );

        req.flash(
            "success",
            `Organization "${createdOrganization.organization_name}" was created successfully.`
        );

        res.redirect(
            `/organization/${createdOrganization.organization_id}`
        );

    } catch (error) {
        next(error);
    }
};


const showEditOrganizationPage = async (
    req,
    res,
    next
) => {
    try {

        const organizationId =
            Number(req.params.id);

        const organization =
            await getOrganizationById(
                organizationId
            );

        if (!organization) {
            return res.status(404).render(
                "errors/error",
                {
                    title: "Organization Not Found",
                    error: {
                        message:
                            "The requested organization could not be found."
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
        next(error);
    }
};


const updateOrganizationController =
    async (
        req,
        res,
        next
    ) => {

        try {

            const organizationId =
                Number(req.params.id);

            const errors =
                validationResult(req);

            const existingOrganization =
                await getOrganizationById(
                    organizationId
                );

            if (!existingOrganization) {
                return res.status(404).render(
                    "errors/error",
                    {
                        title:
                            "Organization Not Found",
                        error: {
                            message:
                                "The requested organization could not be found."
                        }
                    }
                );
            }

            const organization = {
                organization_name:
                    req.body.organization_name,
                description:
                    req.body.description,
                website:
                    req.body.website,
                contact_email:
                    req.body.contact_email,
                phone:
                    req.body.phone,
                location:
                    req.body.location,
                image:
                    existingOrganization.image
            };

            if (!errors.isEmpty()) {

                return res.status(400).render(
                    "edit-organization",
                    {
                        title:
                            "Edit Organization",
                        organization,
                        errors:
                            errors.array()
                    }
                );
            }

            const updatedOrganization =
                await updateOrganization(
                    organizationId,
                    organization
                );

            req.flash(
                "success",
                `Organization "${updatedOrganization.organization_name}" was updated successfully.`
            );

            res.redirect(
                `/organization/${updatedOrganization.organization_id}`
            );

        } catch (error) {
            next(error);
        }
    };


export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showCreateOrganizationPage,
    createOrganizationController,
    showEditOrganizationPage,
    updateOrganizationController
};