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

        const salt =
            await bcrypt.genSalt(10);


        const passwordHash =
            await bcrypt.hash(
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


        res.redirect(
            "/login"
        );

    } catch (error) {

        console.error(
            "Error registering user:",
            error
        );


        res.status(500).render(
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

        const user =
            await authenticateUser(
                email,
                password
            );


        if (user) {

            req.session.user = user;


            req.flash(
                "success",
                "Login successful!"
            );


            if (
                res.locals.NODE_ENV ===
                "development"
            ) {

                console.log(
                    "User logged in:",
                    user
                );

            }


            res.redirect(
                "/dashboard"
            );

        } else {

            req.flash(
                "error",
                "Invalid email or password."
            );


            res.redirect(
                "/login"
            );

        }

    } catch (error) {

        console.error(
            "Error during login:",
            error
        );


        req.flash(
            "error",
            "An error occurred during login. Please try again."
        );


        res.redirect(
            "/login"
        );

    }
};


/* ---------------------------------------------------------
   PROCESS LOGOUT
--------------------------------------------------------- */

const processLogout = (
    req,
    res
) => {

    req.session.destroy(
        (error) => {

            if (error) {

                console.error(
                    "Error destroying session:",
                    error
                );


                return res.redirect(
                    "/login"
                );

            }


            res.redirect(
                "/login"
            );

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

        req.flash(
            "error",
            "You must be logged in to access that page."
        );


        return res.redirect(
            "/login"
        );

    }


    next();
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


            return res.redirect(
                "/login"
            );

        }


        if (
            req.session.user.role !==
            requiredRole
        ) {

            req.flash(
                "error",
                "You do not have permission to access that page."
            );


            return res.redirect(
                "/dashboard"
            );

        }


        next();

    };
};


/* ---------------------------------------------------------
   SHOW DASHBOARD
--------------------------------------------------------- */

const showDashboard = (
    req,
    res
) => {

    const user =
        req.session.user;


    res.render(
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

        const users =
            await getAllUsers();


        res.render(
            "users",
            {
                title: "Users",

                users
            }
        );

    } catch (error) {

        console.error(
            "Error retrieving users:",
            error
        );


        res.status(500).render(
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