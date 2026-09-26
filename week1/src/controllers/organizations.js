import {
getAllOrganizations,
getOrganizationDetails
} from "../models/organizations.js";

import {
getProjectsByOrganizationId
} from "../models/projects.js";

/**

* Display the organizations page.
  */
  const showOrganizationsPage = async (req, res, next) => {
  try {
  const organizations = await getAllOrganizations();

  
   res.render("organizations", {
       title: "Organizations",
       organizations
   });
  

  } catch (error) {
  console.error(
  "Error loading organizations:",
  error
  );

  
   next(error);
  

  }
  };

/**

* Display one organization's details and service projects.
  */
  const showOrganizationDetailsPage = async (req, res, next) => {
  try {
  const organizationId = Number(req.params.id);

  
   if (
       !Number.isInteger(organizationId) ||
       organizationId <= 0
   ) {
       const error = new Error(
           "Organization Not Found"
       );

       error.status = 404;

       return next(error);
   }

   const organizationDetails =
       await getOrganizationDetails(organizationId);

   if (!organizationDetails) {
       const error = new Error(
           "Organization Not Found"
       );

       error.status = 404;

       return next(error);
   }

   const projects =
       await getProjectsByOrganizationId(
           organizationId
       );

   res.render("organization", {
       title: "Organization Details",
       organizationDetails,
       projects
   });
  

  } catch (error) {
  console.error(
  "Error loading organization details:",
  error
  );


   next(error);
  

  }
  };

export {
showOrganizationsPage,
showOrganizationDetailsPage
};
