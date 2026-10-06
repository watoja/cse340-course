import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const {
    Pool
} = pg;


/* ---------------------------------------------------------
   DATABASE CONNECTION
--------------------------------------------------------- */

const pool = new Pool({
    connectionString:
        process.env.DB_URL,

    ssl: {
        rejectUnauthorized: false
    },

    connectionTimeoutMillis: 10000,

    idleTimeoutMillis: 30000
});


/* ---------------------------------------------------------
   DATABASE OBJECT
--------------------------------------------------------- */

const db = {

    query: (
        text,
        params
    ) => {

        return pool.query(
            text,
            params
        );
    }

};


/* ---------------------------------------------------------
   TEST CONNECTION
--------------------------------------------------------- */

const testConnection = async () => {

    try {

        const result =
            await pool.query(
                "SELECT NOW()"
            );

        console.log(
            `Database connected successfully at ${result.rows[0].now}`
        );

        return true;

    } catch (error) {

        console.error(
            "Database connection failed:",
            error.message
        );

        throw error;
    }
};


/* ---------------------------------------------------------
   TRANSACTION
--------------------------------------------------------- */

const withTransaction = async (
    callback
) => {

    const client =
        await pool.connect();

    try {

        await client.query(
            "BEGIN"
        );

        const result =
            await callback(client);

        await client.query(
            "COMMIT"
        );

        return result;

    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        client.release();

    }
};


/* ---------------------------------------------------------
   EXPORTS
--------------------------------------------------------- */

export {
    pool,
    db,
    testConnection,
    withTransaction
};

export default db;