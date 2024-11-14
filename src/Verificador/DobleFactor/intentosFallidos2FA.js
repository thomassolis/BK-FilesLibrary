import { pool } from './database';
import sql from 'mssql';

const MAX_INTENTOS_2FA = 5;
const BAN_DURATION_2FA = 30 * 60 * 1000; // 30 minutos

export const incrementarIntentosFallidos2FA = async (userId) => {
    const result = await pool.request()
        .input("userId", sql.Int, userId)
        .query(`UPDATE [BibliotecaMLC].[dbo].[Usuarios]
                SET 
                    num_intentos_2fa = num_intentos_2fa + 1,
                    isBaned_2fa = CASE WHEN num_intentos_2fa + 1 >= @MAX_INTENTOS_2FA THEN 1 ELSE isBaned_2fa END,
                    fecha_baneo_2fa = CASE WHEN num_intentos_2fa + 1 >= @MAX_INTENTOS_2FA THEN GETDATE() ELSE fecha_baneo_2fa END
                WHERE id_usuario = @userId`);

    return result.rowsAffected > 0;
};


