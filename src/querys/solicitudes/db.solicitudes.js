
import { connectDB, pool} from "../../../config/db.js";
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

export const db_Insertar_Solicitud_Nueva = async (data) => {    
    try {
        await connectDB()
        const query = `
            INSERT INTO Solicitudes (Fecha_Solicitud, motivo_solicitud, comentarioGerente, aprobacionGerencia, id_archivo, id_solicitante, id_gerente, status)
            VALUES (@Fecha_Solicitud, @OPE_Comentario, @GEN_Comentario, @GEN_Aproved, @ID_Archivo, @OPE_UserID, @GEN_UserID, @Estado_Solicitud);
        `;

        // Ejecutar el query usando los parámetros proporcionados
        const result = await pool.request()
            .input('Fecha_Solicitud', sql.DateTime, data.Fecha_Solicitud)
            .input('OPE_Comentario', sql.VarChar(sql.MAX), data.OPE_Comentario)
            .input('GEN_Comentario', sql.VarChar(sql.MAX), data.GEN_Comentario || null)
            .input('GEN_Aproved', sql.Bit, data.GEN_Aproved)
            .input('ID_Archivo', sql.Int, data.ID_Archivo)
            .input('OPE_UserID', sql.Int, data.OPE_UserID)
            .input('GEN_UserID', sql.Int, data.GEN_UserID || null)
            .input('Estado_Solicitud', sql.VarChar(sql.MAX), data.Estado_Solicitud || null)

            .query(query);

        return true
    } 
    catch (error)
    {
        console.log('Error al insertar datos en la base de datos:', error.message);
        return false
    }
};


export const db_Obtener_Solicitudes_Pendientes_Gerente = async(rol) =>
{
    try
    {
        await connectDB()
        const query = `
           Select
                Solicitudes.id_solicitud,
                Archivos.nombre as 'Nombre_del_archivo',
                Usuarios.nombre as 'Nombre_de_solicitante',
                Solicitudes.motivo_solicitud AS 'motivo_solicitud'
            FROM Solicitudes
                INNER JOIN
                    Archivos on Archivos.id_archivo = Solicitudes.id_archivo
                INNER JOIN
                    Usuarios on Usuarios.id_usuario = Solicitudes.id_solicitante
                      where status ='SOLICITADA'
            order by id_solicitud desc
        `;

        const result = await pool.request().query(query);
        return result.recordset
    }
    catch (error)
    {
        console.log(error)
        return {}
    }
}