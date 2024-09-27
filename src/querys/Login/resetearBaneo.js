import { pool } from "../../../config/db.js";
import sql from 'mssql';

export const resetearBaneo = async (idUsuario) => {
    await pool.request()
        .input("idUsuario", sql.Int, idUsuario)
        .query(`UPDATE [BibliotecaMLC].[dbo].[Usuarios] 
                SET 
                    [num_intentos] = 0,
                    [isBaned] = 0,
                    [fecha_baneo] = NULL
                WHERE 
                    [id_usuario] = @idUsuario`);
};