import bcrypt from "bcrypt";

import {
    createUser,
    authenticateUser,
    getAllUsers
} from "../models/users.js";

import {
    getVolunteeredProjects
} from "../models/projects.js";


/* ---------------------------------------------------------
   SHOW REGISTRATION FORM
--------------------------------------------------------- */

const showUserRegistrationForm = (req, res) => {
    res.render("register", {
        title: "Register",
        success: req.flash("success"),
        errors: req.flash("error")
    });
};


/* ---------------------------------------------------------
   PROCESS REGISTRATION FORM
--------------------------------------------------------- */

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash(
            "success",
            "Registration successful. You can now log in."
        );

        return res.redirect("/login");
    } catch (error) {
        console.error("Error registering user:", error.message);

        if (error.code === "23505") {
            req.flash(
                "error",
                "An account with that email address already exists."
            );

            return res.redirect("/register");
        }

        return res.status(500).render("register", {
            title: "Register",
            error: "An error occurred during registration. Please try again.",
            errors: [
                "An error occurred during registration. Please try again."
            ]
        });
    }
};


/* ---------------------------------------------------------
   SHOW LOGIN FORM
--------------------------------------------------------- */

const showLoginForm = (req, res) => {
    res.render("login", {
        title: "Login",
        success: req.flash("success"),
        errors: req.flash("error")
    });
};


/* ---------------------------------------------------------
   PROCESS LOGIN FORM
--------------------------------------------------------- */

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }

        if (user.user_id === undefined || user.user_id === null) {
            console.error(
                "LOGIN: Authenticated user is missing user_id."
            );

            req.flash(
                "error",
                "Unable to establish your account session. Please contact support."
            );

            return res.redirect("/login");
        }

        req.session.user = user;

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

            req.flash("success", "Login successful!");

            return res.redirect("/dashboard");
        });
    } catch (error) {
        console.error("Error during login:", error.message);

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

const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect("/login");
    }

    req.session.destroy((error) => {
        if (error) {
            console.error(
                "Error destroying session:",
                error.message
            );

            return res.redirect("/login");
        }

        res.clearCookie("connect.sid");

        return res.redirect("/login");
    });
};


/* ---------------------------------------------------------
   REQUIRE LOGIN MIDDLEWARE
--------------------------------------------------------- */

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
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

const requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash(
                "error",
                "You must be logged in to access that page."
            );

            return res.redirect("/login");
        }

        if (req.session.user.role !== requiredRole) {
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

<<<<<<< HEAD
const showDashboard = async (
    req,
    res,
    next
) => {

    try {

        const user = req.session.user;

        const projects = await getVolunteeredProjects(
            user.user_id
        );

        return res.render(
            "dashboard",
            {
                title: "Dashboard",
                name: user.name,
                email: user.email,
                role: user.role,
                projects
            }
        );

    } catch (error) {

        next(error);

=======
const showDashboard = async (req, res) => {
    const user = req.session?.user;

    if (!user) {
        req.flash(
            "error",
            "You must be logged in to access your dashboard."
        );

        return res.redirect("/login");
    }

    try {
        const volunteeredProjects = await getVolunteeredProjects(
            user.user_id
        );

        return res.render("dashboard", {
            title: "Dashboard",
            name: user.name,
            email: user.email,
            role: user.role,
            volunteeredProjects,
            success: req.flash("success"),
            errors: req.flash("error")
        });
    } catch (error) {
        console.error(
            "Error loading dashboard:",
            error.message
        );

        req.flash(
            "error",
            "Unable to load your dashboard. Please try again."
        );

        return res.status(500).render("errors/error", {
            title: "Server Error",
            error: {
                message: "Unable to load the dashboard."
            }
        });
>>>>>>> refs/remotes/origin/main
    }
};


/* ---------------------------------------------------------
   SHOW USERS PAGE
--------------------------------------------------------- */

const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();

        return res.render("users", {
            title: "Users",
            users,
            success: req.flash("success"),
            errors: req.flash("error")
        });
    } catch (error) {
        console.error(
            "Error retrieving users:",
            error.message
        );

        return res.status(500).render("errors/error", {
            title: "Server Error",
            error: {
                message: "Unable to retrieve registered users."
            }
        });
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
