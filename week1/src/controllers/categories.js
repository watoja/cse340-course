import {
getAllCategories,
getCategoryDetails,
getProjectsByCategory
} from "../models/categories.js";

/**

* Display the categories page.
  */
  const showCategoriesPage = async (req, res, next) => {
  try {
  const categories = await getAllCategories();

  
   res.render("categories", {
       title: "Categories",
       categories
   });
  

  } catch (error) {
  console.error("Error loading categories:", error);

  
   next(error);
  

  }
  };

/**

* Display one category's details page.
  */
  const showCategoryDetailsPage = async (req, res, next) => {
  try {
  const categoryId = Number(req.params.id);

  
   const category = await getCategoryDetails(categoryId);

   if (!category) {
       const error = new Error("Category Not Found");

       error.status = 404;

       return next(error);
   }

   const projects = await getProjectsByCategory(categoryId);

   res.render("category-details", {
       title: category.category_name,
       category,
       projects
   });
  

  } catch (error) {
  console.error("Error loading category details:", error);

  
   next(error);
  

  }
  };

export {
showCategoriesPage,
showCategoryDetailsPage
};
