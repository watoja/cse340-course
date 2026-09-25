
import {
    getOrganizationDetails
} from "../models/organizations.js";


const buildOrganizationDetails = async (req, res, next) => {
    try {
        const organizationId = Number(req.params.id);

        const organization = await getOrganizationDetails(organizationId);

        if (!organization) {
            const error = new Error("Organization Not Found");

            error.status = 404;

            return next(error);
        }

        res.render("organization-details", {
            title: organization.organization_name,
            organization
        });
    } catch (error) {
        console.error("Error loading organization details:", error);

        next(error);
    }
};


export {
    buildOrganizationDetails
};

