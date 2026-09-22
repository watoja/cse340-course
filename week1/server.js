import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { testConnection } from "./src/models/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5500;
const NODE_ENV = process.env.NODE_ENV || "development";

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the location of the views
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.render("index", {
        title: "Home"
    });
});

// Categories page
app.get("/categories", (req, res) => {
    res.render("categories", {
        title: "Categories"
    });
});

// 404 page
app.use((req, res) => {
    res.status(404).render("error", {
        title: "Page Not Found",
        message: "The page you requested could not be found."
    });
});

// Start server and test database connection
app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(
            `Server is running at http://127.0.0.1:${PORT}`
        );

        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error(
            "Error connecting to the database:",
            error.message
        );
    }
});