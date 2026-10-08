import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import flash from "connect-flash";

import routes from "./src/routes.js";

import {
    testConnection
} from "./src/models/db.js";


dotenv.config();


const app = express();


/* ---------------------------------------------------------
   DIRECTORY SETTINGS
--------------------------------------------------------- */

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);


/* ---------------------------------------------------------
   PORT
--------------------------------------------------------- */

const PORT =
    process.env.PORT || 5500;


/* ---------------------------------------------------------
   VIEW ENGINE
--------------------------------------------------------- */

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(
        __dirname,
        "views"
    )
);


/* ---------------------------------------------------------
   REQUEST BODY
--------------------------------------------------------- */

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.json()
);


/* ---------------------------------------------------------
   STATIC FILES
--------------------------------------------------------- */

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


/* ---------------------------------------------------------
   SESSION
--------------------------------------------------------- */

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "development-secret",

        resave: false,

        saveUninitialized: false,

        cookie: {
            secure: false,

            maxAge:
                1000 * 60 * 60
        }
    })
);


/* ---------------------------------------------------------
   FLASH MESSAGES
--------------------------------------------------------- */

app.use(
    flash()
);


/* ---------------------------------------------------------
   LOCAL VARIABLES
--------------------------------------------------------- */

app.use(
    (req, res, next) => {

        /*
         * Get the currently authenticated
         * user from the session.
         */

        const currentUser =
            req.session.user || null;


        /*
         * Make the current user available
         * to every EJS view.
         */

        res.locals.currentUser =
            currentUser;


        /*
         * Determine whether a user
         * is currently logged in.
         */

        res.locals.isLoggedIn =
            Boolean(currentUser);


        /*
         * Make NODE_ENV available
         * to all EJS views.
         */

        res.locals.NODE_ENV =
            process.env.NODE_ENV ||
            "development";


        /*
         * Make flash messages available
         * to all EJS views.
         */

        res.locals.success =
            req.flash("success");

        res.locals.error =
            req.flash("error");


        next();
    }
);


/* ---------------------------------------------------------
   REQUEST LOGGER
--------------------------------------------------------- */

app.use(
    (req, res, next) => {

        console.log(
            `REQUEST: ${req.method} ${req.originalUrl}`
        );

        next();
    }
);


/* ---------------------------------------------------------
   APPLICATION ROUTES
--------------------------------------------------------- */

app.use(
    "/",
    routes
);


/* ---------------------------------------------------------
   404 ERROR
--------------------------------------------------------- */

app.use(
    (req, res) => {

        res.status(404).render(
            "errors/error",
            {
                title: "Page Not Found",

                error: {
                    message:
                        "The page you are looking for could not be found."
                }
            }
        );
    }
);


/* ---------------------------------------------------------
   500 ERROR
--------------------------------------------------------- */

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );

        res.status(500).render(
            "errors/error",
            {
                title: "Server Error",

                error: err
            }
        );
    }
);


/* ---------------------------------------------------------
   START SERVER
--------------------------------------------------------- */

const startServer = async () => {

    try {

        await testConnection();

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server is running at http://localhost:${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Unable to start server:",
            error.message
        );

        process.exit(1);
    }
};


startServer();