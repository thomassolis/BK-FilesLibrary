import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbsetting_Mlc = {
    user: process.env.USER,
    password: process.env.PASS,
    server: process.env.SERVER,
    database: process.env.DB,
    options: {
        encrypt: false,
      },
};

const pool = new sql.ConnectionPool(dbsetting_Mlc);
const poolConnect = pool.connect();

const connectDB = async () => {
    try {
        await poolConnect;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        throw new Error('No se pudo conectar a la base de datos');
    }
};

const closeDB = async () => {
    try {
        await pool.close();
    } catch (error) {
        console.error('Error al cerrar la conexión a la base de datos:', error.message);
    }
};

export { connectDB, closeDB, pool };
