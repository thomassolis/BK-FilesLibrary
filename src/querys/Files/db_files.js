
import { pool } from "../../../config/db.js";
import  sql from "mssql";

export const db_Obtener_Archivos_Permitidos_Por_Usuario = async (rol) => {
    try {
        await pool.connect();
        const query = `SELECT 
                permiso.[verArchivo],
                permiso.[enviarSolicitud],
                permiso.[id_archivo],
                permiso.[id_rol],
                archivo.[nombre],
                archivo.[driveID]
            FROM 
                [BibliotecaMLC].[dbo].[Permisos_archivo] AS permiso
            JOIN 
                [BibliotecaMLC].[dbo].[Archivos] AS archivo
            ON 
                permiso.[id_archivo] = archivo.[id_archivo]
            WHERE 
                permiso.[id_rol] = @id_rol;`;

        const result = await pool.request()
            .input('id_rol', sql.VarChar, rol)
            .query(query);

       return result.recordset
    } catch (error) {
        console.error('Error al obtener archivos permitidos:', error.message);
       return {}
    }
};

export const verificar_Permiso_Para_Archivo = async (rol, id_archivo) => {
    try {
        await pool.connect();
        const query = `
        SELECT 
                archivo.[nombre],
                archivo.[driveID],
				archivo.path
            FROM 
                [BibliotecaMLC].[dbo].[Permisos_archivo] AS permiso
            JOIN 
                [BibliotecaMLC].[dbo].[Archivos] AS archivo
            ON 
                permiso.[id_archivo] = archivo.[id_archivo]
            WHERE 
                permiso.[id_rol] = @rol
				and Archivo.id_archivo =@id_archivo`;

        const result = await pool.request()
            .input('rol', sql.VarChar, rol)
            .input('id_archivo', sql.VarChar, id_archivo)
            .query(query);

       return result.recordset
    } catch (error) {
        console.error('Error al obtener archivos permitidos:', error.message);
       return {}
    }
};