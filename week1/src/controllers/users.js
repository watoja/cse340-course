
import bcrypt from "bcrypt";

import {
    createUser,
    authenticateUser,
    getAllUsers
} from "../models/users.js";


/* ---------------------------------------------------------
   SHOW REGISTRATION FORM
--------------------------------------------------------- */

const showUserRegistrationForm = (
    req,
    res
) => {

    res.render(
        "register",
        {
            title: "Register"
        }
    );
};


/* ---------------------------------------------------------
   PROCESS REGISTRATION FORM
--------------------------------------------------------- */

const processUserRegistrationForm = async (
    req,
    res
) => {

    const {
        name,
        email,
        password
    } = req.body;

    try {

        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(
            password,
            salt
        );

        await createUser(
            name,
            email,
            passwordHash
        );

        req.flash(
            "success",
            "Registration successful. You can now log in."
        );

        return res.redirect("/login");

    } catch (error) {

        console.error(
            "Error registering user:",
            error.message
        );

        return res.status(500).render(
            "register",
            {
                title: "Register",
                error:
                    "An error occurred during registration. Please try again."
            }
        );
    }
};


/* ---------------------------------------------------------
   SHOW LOGIN FORM
--------------------------------------------------------- */

const showLoginForm = (
    req,
    res
) => {

    res.render(
        "login",
        {
            title: "Login"
        }
    );
};


/* ---------------------------------------------------------
   PROCESS LOGIN FORM
--------------------------------------------------------- */

const processLoginForm = async (
    req,
    res
) => {

    const {
        email,
        password
    } = req.body;

    try {

        const user = await authenticateUser(
            email,
            password
        );

        if (!user) {

            console.log(
                "LOGIN: Authentication failed."
            );

            req.flash(
                "error",
                "Invalid email or password."
            );

            return res.redirect("/login");
        }

        /*
         * Store the authenticated user in the session.
         */

        req.session.user = user;

        /*
         * Diagnostic logging.
         * Do not log passwords or password hashes.
         */

        if (process.env.NODE_ENV !== "production") {

            console.log(
                "LOGIN: Authentication succeeded."
            );

            console.log(
                "LOGIN: Session ID:",
                req.sessionID
            );

            console.log(
                "LOGIN: Session contains user:",
                Boolean(req.session.user)
            );
        }

        /*
         * Save the session before redirecting.
         */

        return req.session.save((error) => {

            if (error) {

                console.error(
                    "LOGIN: Session save failed:",
                    error.message
                );

                req.flash(
                    "error",
                    "Unable to save your login session. Please try again."
                );

                return res.redirect("/login");
            }

            if (process.env.NODE_ENV !== "production") {

                console.log(
                    "LOGIN: Session saved successfully."
                );
            }

            req.flash(
                "success",
                "Login successful!"
            );

            return res.redirect("/dashboard");
        });

    } catch (error) {

        console.error(
            "Error during login:",
            error.message
        );

        req.flash(
            "error",
            "An error occurred during login. Please try again."
        );

        return res.redirect("/login");
    }
};


/* ---------------------------------------------------------
   PROCESS LOGOUT
--------------------------------------------------------- */

const processLogout = (
    req,
    res
) => {

    if (!req.session) {
        return res.redirect("/login");
    }

    req.session.destroy(
        (error) => {

            if (error) {

                console.error(
                    "Error destroying session:",
                    error.message
                );

                return res.redirect("/login");
            }

            res.clearCookie("connect.sid");

            return res.redirect("/login");
        }
    );
};


/* ---------------------------------------------------------
   REQUIRE LOGIN MIDDLEWARE
--------------------------------------------------------- */

const requireLogin = (
    req,
    res,
    next
) => {

    if (
        !req.session ||
        !req.session.user
    ) {

        if (process.env.NODE_ENV !== "production") {

            console.log(
                "AUTH: Dashboard access denied.",
                {
                    sessionExists: Boolean(req.session),
                    userExists: Boolean(req.session?.user),
                    sessionID: req.sessionID
                }
            );
        }

        req.flash(
            "error",
            "You must be logged in to access that page."
        );

        return res.redirect("/login");
    }

    return next();
};


/* ---------------------------------------------------------
   REQUIRE ROLE MIDDLEWARE
--------------------------------------------------------- */

const requireRole = (
    requiredRole
) => {

    return (
        req,
        res,
        next
    ) => {

        if (
            !req.session ||
            !req.session.user
        ) {

            req.flash(
                "error",
                "You must be logged in to access that page."
            );

            return res.redirect("/login");
        }

        if (
            req.session.user.role !== requiredRole
        ) {

            req.flash(
                "error",
                "You do not have permission to access that page."
            );

            return res.redirect("/dashboard");
        }

        return next();
    };
};


/* ---------------------------------------------------------
   SHOW DASHBOARD
--------------------------------------------------------- */

const showDashboard = (
    req,
    res
) => {

    const user = req.session.user;

    return res.render(
        "dashboard",
        {
            title: "Dashboard",
            name: user.name,
            email: user.email,
            role: user.role
        }
    );
};


/* ---------------------------------------------------------
   SHOW USERS PAGE
--------------------------------------------------------- */

const showUsersPage = async (
    req,
    res
) => {

    try {

        const users = await getAllUsers();

        return res.render(
            "users",
            {
                title: "Users",
                users
            }
        );

    } catch (error) {

        console.error(
            "Error retrieving users:",
            error.message
        );

        return res.status(500).render(
            "errors/error",
            {
                title: "Server Error",
                error
            }
        );
    }
};


/* ---------------------------------------------------------
   EXPORTS
--------------------------------------------------------- */

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};