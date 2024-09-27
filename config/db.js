import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbsetting_Mlc = {
    user: process.env.USER,
    password: process.env.PASS,
    server: process.env.SERVER,
    database: process.env.DB,
    options: {
        encrypt: false, // Dependiendo de tu entorno, podrías necesitar activar esto
      },
};

const pool = new sql.ConnectionPool(dbsetting_Mlc);
const poolConnect = pool.connect(); // Esto inicia la conexión al momento de cargar el módulo

const connectDB = async () => {
    try {
        await poolConnect; // Espera a que el pool se conecte
        console.log('Conexión a la base de datos establecida');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        throw new Error('No se pudo conectar a la base de datos');
    }
};

const closeDB = async () => {
    try {
        await pool.close();
        console.log('Conexión a la base de datos cerrada');
    } catch (error) {
        console.error('Error al cerrar la conexión a la base de datos:', error.message);
    }
};

export { connectDB, closeDB, pool };
