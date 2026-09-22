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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
app.get("/categories", async (req, res) => {
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

        res.status(500).render("error", {
            title: "Server Error",
            message: "Unable to load categories."
        });
    }
});


/**
 * Organizations page
 */
app.get("/organizations", async (req, res) => {
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

        res.status(500).render("error", {
            title: "Server Error",
            message: "Unable to load organizations."
        });
    }
});


/**
 * Service Projects page
 */
app.get("/projects", async (req, res) => {
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

        res.status(500).render("error", {
            title: "Server Error",
            message: "Unable to load service projects."
        });
    }
});


/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).render("error", {
        title: "Page Not Found",
        message: "The page you requested could not be found."
    });
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