import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("✅ Connected to PostgreSQL");
        client.release();
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error.message);
        throw new Error("No se pudo conectar a la base de datos");
    }
};

const closeDB = async () => {
    try {
        await pool.end();
        console.log("🔌 Conexión cerrada");
    } catch (error) {
        console.error("Error al cerrar la conexión:", error.message);
    }
};

export { connectDB, closeDB, pool };