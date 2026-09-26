import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./src/routes.js";
import { testConnection } from "./src/models/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5500;
const NODE_ENV = process.env.NODE_ENV || "development";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
if (NODE_ENV === "development") {
console.log(`${req.method} ${req.url}`);
}


next();


});

app.use((req, res, next) => {
res.locals.NODE_ENV = NODE_ENV;
next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

app.use((req, res, next) => {
const error = new Error("Page Not Found");


error.status = 404;

next(error);


});

app.use((error, req, res, next) => {
console.error("Error occurred:", error.message);
console.error("Stack trace:", error.stack);


const status = error.status || 500;
const template = status === 404 ? "404" : "500";

const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: error.message,
    stack: error.stack
};

res.status(status).render(`errors/${template}`, context);


});

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
