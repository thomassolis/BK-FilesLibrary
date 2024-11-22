
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
            .input('id_archivo', sql.Int, id_archivo)
            .query(query);
       return result.recordset
    } catch (error) {
        console.error('Error al obtener archivos permitidos:', error.message);
       return {}
    }
};

export const obtener_Drive_ID_BY_Solicitud =  async (id_Solicitud) =>
{
    try {
        await pool.connect();
        const query = `
        SELECT 
            Arch.driveID
        FROM 
            [BibliotecaMLC].[dbo].[Solicitudes] AS Solic
        INNER JOIN 
            [BibliotecaMLC].[dbo].[Archivos] AS Arch
            ON Solic.id_archivo = Arch.id_archivo
        INNER JOIN 
            [BibliotecaMLC].[dbo].[Usuarios] AS [User]
            ON [User].id_usuario = Solic.id_solicitante
        INNER JOIN 
            [BibliotecaMLC].[dbo].[Permisos_archivo] AS Perm
            ON Perm.id_archivo = Arch.id_archivo AND Perm.id_rol = [User].id_rol
        WHERE 
            Solic.aprobacionGerencia = 1 
            AND Solic.aprobacionAdministracion = 1
            and Solic.id_solicitud =@id_Solicitud
            `;

        const result = await pool.request()
            .input('id_Solicitud', sql.Int, id_Solicitud)
            .query(query);
       return result.recordset[0]

    } catch (error) {
        console.error('Error al obtener archivos permitidos:', error.message);
       return {}
    }
}