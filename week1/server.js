import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { testConnection } from "./src/models/db.js";
import { getCategories } from "./src/models/categories.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5500;
const NODE_ENV = process.env.NODE_ENV || "development";


// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }

    next();
});


// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;

    next();
});


// Built-in Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


/**
 * Home page
 */
app.get("/", (req, res) => {
    res.render("index", {
        title: "Home"
    });
});


/**
 * Categories page
 */
app.get("/categories", async (req, res, next) => {
    try {
        const categories = await getCategories();

        console.log("Categories retrieved from database:");
        console.table(categories);

        res.render("categories", {
            title: "Categories",
            categories
        });
    } catch (error) {
        console.error("Error loading categories:", error);
        next(error);
    }
});


/**
 * Organizations page
 */
app.get("/organizations", async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        console.log("Organizations retrieved from database:");
        console.table(organizations);

        res.render("organizations", {
            title: "Organizations",
            organizations
        });
    } catch (error) {
        console.error("Error loading organizations:", error);
        next(error);
    }
});


/**
 * Service Projects page
 */
app.get("/projects", async (req, res, next) => {
    try {
        const projects = await getAllProjects();

        console.log("Service projects retrieved from database:");
        console.table(projects);

        res.render("projects", {
            title: "Service Projects",
            projects
        });
    } catch (error) {
        console.error("Error loading service projects:", error);
        next(error);
    }
});


/**
 * Test route for 500 errors
 */
app.get("/test-error", (req, res, next) => {
    const err = new Error("This is a test error");

    err.status = 500;

    next(err);
});


/**
 * Catch-all route for 404 errors
 */
app.use((req, res, next) => {
    const err = new Error("Page Not Found");

    err.status = 404;

    next(err);
});


/**
 * Global error handler
 */
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error("Error occurred:", err.message);
    console.error("Stack trace:", err.stack);

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? "404" : "500";

    // Prepare data for the template
    const context = {
        title: status === 404 ? "Page Not Found" : "Server Error",
        error: err.message,
        stack: err.stack
    };

    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
});


/**
 * Start server and test database connection.
 */
app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(
            `Server is running at http://localhost:${PORT}`
        );

        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error(
            "Error connecting to the database:",
            error.message
        );
    }
});