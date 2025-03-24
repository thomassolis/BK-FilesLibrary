import { pool } from "../../../config/db.js";
import sql from 'mssql';
import { construirFechaUTC5 } from "../../Schemas/Fechas/fechasHoras.js";

export const incrementarIntentosFallidos = async (idUsuario, intentosActuales) => {
    const MAX_INTENTOS = 5;
    const nuevoNumeroIntentos = intentosActuales + 1;
    const isBaned = nuevoNumeroIntentos >= MAX_INTENTOS ? 1 : 0;

    let fechaBaneo = null;
    if (isBaned) {
        const ahora = new Date();
        fechaBaneo = construirFechaUTC5(ahora);
    }

    try {
        await pool.request()
        .input("idUsuario", sql.Int, idUsuario)
        .input("num_intentos", sql.Int, nuevoNumeroIntentos)
        .input("isBaned", sql.Bit, isBaned)
        .input("fecha_baneo", sql.VarChar, fechaBaneo)
        .query(`UPDATE [BibliotecaMLC].[dbo].[Usuarios] 
                SET 
                    [num_intentos] = @num_intentos,
                    [isBaned] = @isBaned,
                    [fecha_baneo] = @fecha_baneo
                WHERE 
                    [id_usuario] = @idUsuario`);
    } catch (error) {
        console.error(`Error al actualizar el numero de intentos fallidos, ${error.message}`);
        throw new Error('Error al actualizar el numero de intentos fallidos');        
    }    
};