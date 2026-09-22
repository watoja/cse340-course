import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { testConnection } from "./src/models/db.js";
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
app.get("/categories", (req, res) => {
    res.render("categories", {
        title: "Categories"
    });
});

/**
 * Service Projects page
 */
app.get("/projects", async (req, res) => {
    try {
        const projects = await getAllProjects();

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
 * 404 error handler
 */
app.use((req, res) => {
    res.status(404).render("error", {
        title: "Page Not Found",
        message: "The page you requested could not be found."
    });
});

/**
 * Start the server and test the database connection.
 */
app.listen(PORT, async () => {
    try {
        await testConnection();

        // Test the projects query and display the results in the console.
        const projects = await getAllProjects();

        console.log("Service projects retrieved from database:");
        console.table(projects);

        console.log(
            `Server is running at http://localhost:${PORT}`
        );

        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error(
            "Error connecting to the database or retrieving projects:",
            error.message
        );
    }
});