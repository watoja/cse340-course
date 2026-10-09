
/*
========================================================
CSE340 COMMUNITY SERVICE PROJECTS
USER MODEL
========================================================

Responsibilities:
- Register new users.
- Find users by email.
- Authenticate users using bcrypt.
- Retrieve all users and their roles for administrators.
- Create or update the administrator testing account
  when explicitly requested.

Security:
- SQL queries use parameters.
- New users receive the "user" role.
- Passwords are verified using bcrypt.
- Password hashes are never returned by authenticateUser().
- Administrator setup does not run automatically.
========================================================
*/

import bcrypt from "bcrypt";

import {
    pool
} from "./db.js";


/* ---------------------------------------------------------
   NORMALIZE EMAIL
--------------------------------------------------------- */

const normalizeEmail = (email) => {
    return email.trim().toLowerCase();
};


/* ---------------------------------------------------------
   CREATE USER
--------------------------------------------------------- */

const createUser = async (
    name,
    email,
    passwordHash
) => {

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof passwordHash !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !passwordHash.trim()
    ) {
        throw new Error(
            "Name, email, and password hash are required."
        );
    }

    const normalizedName = name.trim();
    const normalizedEmail = normalizeEmail(email);
    const defaultRole = "user";

    const query = `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role_id
        )
        SELECT
            $1,
            $2,
            $3,
            role_id
        FROM roles
        WHERE role_name = $4
        RETURNING user_id;
    `;

    const queryParams = [
        normalizedName,
        normalizedEmail,
        passwordHash,
        defaultRole
    ];

    const result = await pool.query(
        query,
        queryParams
    );

    if (result.rows.length === 0) {
        throw new Error(
            'Unable to create user. Check that the "user" role exists.'
        );
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(
            "Created user with ID:",
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

    if (
        typeof email !== "string" ||
        !email.trim()
    ) {
        return null;
    }

    const normalizedEmail = normalizeEmail(email);

    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            u.role_id,
            r.role_name AS role
        FROM users AS u
        INNER JOIN roles AS r
            ON u.role_id = r.role_id
        WHERE LOWER(u.email) = $1
        LIMIT 1;
    `;

    const result = await pool.query(
        query,
        [normalizedEmail]
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
            r.role_name AS role,
            u.created_at
        FROM users AS u
        INNER JOIN roles AS r
            ON u.role_id = r.role_id
        ORDER BY
            u.name ASC,
            u.user_id ASC;
    `;

    const result = await pool.query(query);

    return result.rows;
};


/* ---------------------------------------------------------
   VERIFY PASSWORD
--------------------------------------------------------- */

const verifyPassword = async (
    password,
    passwordHash
) => {

    if (
        typeof password !== "string" ||
        typeof passwordHash !== "string" ||
        !passwordHash
    ) {
        return false;
    }

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

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return null;
    }

    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordIsValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!passwordIsValid) {
        return null;
    }

    // Never expose the password hash to the session or views.
    const {
        password_hash,
        ...authenticatedUser
    } = user;

    return authenticatedUser;
};


/* ---------------------------------------------------------
   ENSURE ADMINISTRATOR TESTING ACCOUNT
--------------------------------------------------------- */

/*
 * Required testing credentials:
 *
 * Email: admin@example.com
 * Password: cse340!
 *
 * Call this function explicitly when setting up the
 * assignment testing account. It does not run at startup.
 *
 * If the account already exists, its password and role
 * are updated to the required testing values.
 */

const ensureAdminAccount = async () => {

    const adminName = "CSE340 Administrator";
    const adminEmail = "admin@example.com";
    const adminPassword = "cse340!";

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        /*
         * Find the administrator role.
         */

        const roleResult = await client.query(
            `
                SELECT role_id
                FROM roles
                WHERE role_name = $1
                LIMIT 1;
            `,
            ["admin"]
        );

        if (roleResult.rows.length === 0) {
            throw new Error(
                'The "admin" role does not exist. Create it before setting up the testing account.'
            );
        }

        const adminRoleId = roleResult.rows[0].role_id;

        /*
         * Hash the required testing password.
         */

        const passwordHash = await bcrypt.hash(
            adminPassword,
            10
        );

        /*
         * Check whether the account already exists.
         */

        const userResult = await client.query(
            `
                SELECT user_id
                FROM users
                WHERE LOWER(email) = LOWER($1)
                LIMIT 1
                FOR UPDATE;
            `,
            [adminEmail]
        );

        let adminUser;

        if (userResult.rows.length > 0) {

            /*
             * Update the existing testing account.
             */

            const updateResult = await client.query(
                `
                    UPDATE users
                    SET
                        name = $1,
                        password_hash = $2,
                        role_id = $3
                    WHERE user_id = $4
                    RETURNING user_id, name, email, role_id;
                `,
                [
                    adminName,
                    passwordHash,
                    adminRoleId,
                    userResult.rows[0].user_id
                ]
            );

            adminUser = updateResult.rows[0];

        } else {

            /*
             * Create the testing account directly with
             * the administrator role.
             */

            const insertResult = await client.query(
                `
                    INSERT INTO users (
                        name,
                        email,
                        password_hash,
                        role_id
                    )
                    VALUES ($1, $2, $3, $4)
                    RETURNING user_id, name, email, role_id;
                `,
                [
                    adminName,
                    adminEmail,
                    passwordHash,
                    adminRoleId
                ]
            );

            adminUser = insertResult.rows[0];
        }

        await client.query("COMMIT");

        console.log(
            "Administrator testing account is ready:",
            {
                user_id: adminUser.user_id,
                name: adminUser.name,
                email: adminUser.email,
                role: "admin"
            }
        );

        return adminUser;

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


/* ---------------------------------------------------------
   EXPORT MODEL FUNCTIONS
--------------------------------------------------------- */

export {
    createUser,
    findUserByEmail,
    authenticateUser,
    getAllUsers,
    ensureAdminAccount
};