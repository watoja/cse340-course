
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/**
 * Test the PostgreSQL database connection.
 */
const testConnection = async () => {
    try {
        const client = await pool.connect();

        console.log("Database connection successful.");

        client.release();
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

export { pool, testConnection };

