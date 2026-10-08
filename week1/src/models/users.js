import bcrypt from "bcrypt";

import {
    pool
} from "./db.js";


/* ---------------------------------------------------------
   CREATE USER
--------------------------------------------------------- */

const createUser = async (
    name,
    email,
    passwordHash
) => {

    const defaultRole = "user";


    const query = `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role_id
        )
        VALUES (
            $1,
            $2,
            $3,
            (
                SELECT role_id
                FROM roles
                WHERE role_name = $4
            )
        )
        RETURNING user_id
    `;


    const queryParams = [
        name,
        email,
        passwordHash,
        defaultRole
    ];


    const result = await pool.query(
        query,
        queryParams
    );


    if (result.rows.length === 0) {

        throw new Error(
            "Failed to create user"
        );

    }


    if (
        process.env.ENABLE_SQL_LOGGING ===
        "true"
    ) {

        console.log(
            "Created new user with ID:",
            result.rows[0].user_id
        );

    }


    return result.rows[0].user_id;
};


/* ---------------------------------------------------------
   FIND USER BY EMAIL
--------------------------------------------------------- */

const findUserByEmail = async (
    email
) => {

    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            u.role_id,
            r.role_name AS role
        FROM users u
        LEFT JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.email = $1
    `;


    const queryParams = [
        email
    ];


    const result = await pool.query(
        query,
        queryParams
    );


    if (result.rows.length === 0) {

        return null;

    }


    return result.rows[0];
};


/* ---------------------------------------------------------
   GET ALL USERS
--------------------------------------------------------- */

const getAllUsers = async () => {

    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name AS role
        FROM users u
        LEFT JOIN roles r
            ON u.role_id = r.role_id
        ORDER BY u.name ASC
    `;


    const result = await pool.query(
        query
    );


    return result.rows;
};


/* ---------------------------------------------------------
   VERIFY PASSWORD
--------------------------------------------------------- */

const verifyPassword = async (
    password,
    passwordHash
) => {

    return bcrypt.compare(
        password,
        passwordHash
    );
};


/* ---------------------------------------------------------
   AUTHENTICATE USER
--------------------------------------------------------- */

const authenticateUser = async (
    email,
    password
) => {

    const user =
        await findUserByEmail(
            email
        );


    if (!user) {

        return null;

    }


    const passwordIsValid =
        await verifyPassword(
            password,
            user.password_hash
        );


    if (!passwordIsValid) {

        return null;

    }


    delete user.password_hash;


    return user;
};


/* ---------------------------------------------------------
   EXPORTS
--------------------------------------------------------- */

export {
    createUser,
    authenticateUser,
    getAllUsers
};