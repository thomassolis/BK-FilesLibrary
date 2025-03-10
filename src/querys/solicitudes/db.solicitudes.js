
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
        await connectDB();
        const query = `
            INSERT INTO Solicitudes (Fecha_Solicitud, motivo_solicitud, comentarioGerente, aprobacionGerencia, id_archivo, id_solicitante, id_gerente, status)
            OUTPUT INSERTED.id_solicitud -- Captura el ID generado automáticamente
            VALUES (@Fecha_Solicitud, @OPE_Comentario, @GEN_Comentario, @GEN_Aproved, @ID_Archivo, @OPE_UserID, @GEN_UserID, @Estado_Solicitud);
        `;

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

        return { success: true, id_solicitud: result.recordset[0].id_solicitud };
    } 
    catch (error) {
        console.error('Error al insertar datos en la base de datos:', error.message);
        return { success: false, error: error.message };
    }
};



export const db_Obtener_Solicitudes_Pendientes_Gerente = async() =>
{
    try
    {
        await connectDB()
        const query = `
           SELECT
                Solicitudes.id_solicitud,
                Archivos.nombre AS 'Nombre_del_archivo',
                Usuarios.nombre AS 'Nombre_de_solicitante',
                Solicitudes.motivo_solicitud AS 'motivo_solicitud'
            FROM Solicitudes
                LEFT JOIN Archivos ON Archivos.id_archivo = Solicitudes.id_archivo
                LEFT JOIN Usuarios ON Usuarios.id_usuario = Solicitudes.id_solicitante
            WHERE status = 'SOLICITADA'
            ORDER BY id_solicitud DESC;
        `;

        const result = await pool.request().query(query);
        return result.recordset
    }
    catch (error)
    {
        return {}
    }
}

export const db_Actualizar_Solicitud_Pendientes_Gerente = async(data)=>
{
    try
    {
        await connectDB()
        const query = `
        UPDATE [BibliotecaMLC].[dbo].[Solicitudes]
            SET [comentarioGerente]  = @ComentarioGerente,
                [aprobacionGerencia] = @FueAprobado,
                [fecha_aprobacion_gerencial] = @HoraAprobacionGerente,
                [id_gerente] =@GerenteID,
                [status] = @EstadoNuevo
        WHERE id_solicitud =@IdSolicitud`;

        const result = await pool.request()
        .input('ComentarioGerente', sql.VarChar(500), data.ComentarioGerente)
        .input('FueAprobado', sql.Bit, data.FueAprobado)
        .input('HoraAprobacionGerente', sql.DateTime, data.HoraAprobacionGerente)
        .input('EstadoNuevo', sql.VarChar(100), data.EstadoNuevo)
        .input('GerenteID', sql.Int, data.GerenteID)
        .input('IdSolicitud', sql.Int, data.IdSolicitud)
        .query(query);

        return { success: true, rowsAffected: result.rowsAffected[0] };
    } catch (error) {
        console.error('Error al actualizar solicitud:', error);
        return { success: false, error: error.message };
    }
}


export const db_Obtener_Solicitudes_Pendientes_Administrador = async() =>
    {
        try
        {
            await connectDB()
            const query = `
            SELECT
                    Solicitudes.id_solicitud,
                    Solicitudes.motivo_solicitud AS 'Comentario_Operador',
                    Solicitudes.comentarioGerente AS 'Comentario_Gerente',
                    Archivos.nombre AS 'Nombre_Archivo',
                    Solicitante.nombre AS 'Nombre_solicitante',
                    Gerente.nombre AS 'Nombre_Gerente',
                    Solicitante.id_rol AS 'Rol_Solicitante'
            FROM Solicitudes
            INNER JOIN Archivos 
                    ON Archivos.id_archivo = Solicitudes.id_archivo
            INNER JOIN Usuarios AS Solicitante
                    ON Solicitante.id_usuario = Solicitudes.id_solicitante
            LEFT JOIN Usuarios AS Gerente
                    ON Gerente.id_usuario = Solicitudes.id_gerente
            WHERE status = 'APROBACION 1'
            ORDER BY Solicitudes.id_solicitud DESC
                `;

        const result = await pool.request().query(query);
        return result.recordset;
        }
        catch (error)
        {
            console.error(`Error al obtener las solictudes pendientes del Administrador, ${error.message}`);
            return {}
        }
    }

export const db_Actualizar_Solicitud_Pendientes_Administrador = async (data) => {
  try {
    await connectDB();
    const query = `
                UPDATE [BibliotecaMLC].[dbo].[Solicitudes]
                    SET [comentarioAdministrador]  = @ComentarioAdmnistrador,
                        [aprobacionAdministracion] = @FueAprobado,
                        [fecha_aprobacion_administrativa] = @HoraAprobacionAdministrador,
                        [id_administrador] =@AdminID,
                        [status] = @EstadoNuevo
                WHERE id_solicitud =@IdSolicitud`;

    const result = await pool
      .request()
      .input("ComentarioAdmnistrador", sql.VarChar(500), data.ComentarioAdmnistrador)
      .input("FueAprobado", sql.Bit, data.FueAprobado)
      .input("HoraAprobacionAdministrador", sql.DateTime, data.HoraAprobacionAdministrador)
      .input("EstadoNuevo", sql.VarChar(100), data.EstadoNuevo)
      .input("AdminID", sql.Int, data.AdminID)
      .input("IdSolicitud", sql.Int, data.IdSolicitud)
      .query(query);

    return { success: true, rowsAffected: result.rowsAffected[0] };
  } catch (error) {
    console.error("Error al actualizar solicitud:", error);
    return { success: false, error: error.message };
  }
};


export const db_Obtener_Historial_Administrador = async () => {
    try {
        await connectDB();
        const query = `
        SELECT
            Archivos.nombre AS 'Nombre_del_archivo',
            Solicitante.nombre AS 'Nombre_de_solicitante',
            Roles.Nombre AS 'Rol_De_Solicitante', 
            Solicitudes.motivo_solicitud AS 'motivo_de_la_solicitud',
            Solicitudes.fecha_solicitud AS 'fecha_solicitud',
            Gerente.nombre AS 'Gerente_que_aprobo_solicitud',
            Solicitudes.aprobacionGerencia AS 'aprobacion_gerencia',
            Solicitudes.comentarioGerente AS 'Comentario_gerente',
            Solicitudes.fecha_aprobacion_gerencial AS 'fecha_aprobacion_gerente',
            Administrador.nombre AS 'nombre_administrador',
            Solicitudes.aprobacionAdministracion AS 'aprobacion_administracion',
            Solicitudes.comentarioAdministrador AS 'Comentario_administracion'
        FROM 
            Solicitudes
            INNER JOIN Archivos ON Archivos.id_archivo = Solicitudes.id_archivo
            INNER JOIN Usuarios AS Solicitante ON Solicitante.id_usuario = Solicitudes.id_solicitante
            LEFT JOIN Usuarios AS Gerente ON Gerente.id_usuario = Solicitudes.id_gerente
            LEFT JOIN Usuarios AS Administrador ON Administrador.id_usuario = Solicitudes.id_administrador
            INNER JOIN Roles ON Roles.id_rol = Solicitante.id_rol;
        `;

        const result = await pool.request().query(query); // Corrección aquí
        return result.recordset; // Retorna los resultados
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error.message); // Log del error
        return []; // Devuelve un arreglo vacío en caso de error
    }
};


export const db_ObtenerCorreoMiGerente = async (UserID)=>
{
    try {
        await connectDB();
        const query = `
       SELECT 
        TOP 1 gerente.email AS EmailGerente
        FROM 
            [BibliotecaMLC].[dbo].[Usuarios] operador
        JOIN 
            [BibliotecaMLC].[dbo].[Usuarios] gerente
            ON operador.Departamento = gerente.Departamento
            AND gerente.id_rol = 'GER'
        WHERE 
            operador.id_usuario = @idUsuario;
                `;
        const result = await pool.request()
        .input('idUsuario', sql.Int, UserID)
        .query(query);
        return result.recordset[0].EmailGerente;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return ""
    }
}


export const db_ObtenerNombreDeArchivoSegunID = async(idArchivo) =>
    {
        try {
            await connectDB();
            const query = `
            SELECT TOP (1)
                [nombre]
            FROM [BibliotecaMLC].[dbo].[Archivos]
            where id_archivo = @idArchivo
                    `;
            const result = await pool.request()
            .input('idArchivo', sql.Int, idArchivo)
            .query(query);
            return result.recordset[0].nombre;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return "Archivo No encontrado"
        }
    }


 
export const db_ObtenerDataSolicitud = async (idSolicitud) =>
{
    try {
        await connectDB();
        const query = `
        SELECT

            Solicitante.nombre AS 'Nombre_de_solicitante',
			Archivos.nombre as 'Nombre_Archivo',
            Solicitudes.motivo_solicitud AS 'motivo_de_la_solicitud',
            Solicitudes.fecha_solicitud AS 'fecha_solicitud',
            Gerente.nombre AS 'Gerente_que_aprobo_solicitud',
            Solicitudes.comentarioGerente AS 'Comentario_gerente',
            Solicitudes.fecha_aprobacion_gerencial AS 'fecha_aprobacion_gerente'
        FROM 
            Solicitudes
            INNER JOIN Archivos ON Archivos.id_archivo = Solicitudes.id_archivo
            INNER JOIN Usuarios AS Solicitante ON Solicitante.id_usuario = Solicitudes.id_solicitante
            LEFT JOIN Usuarios AS Gerente ON Gerente.id_usuario = Solicitudes.id_gerente
            LEFT JOIN Usuarios AS Administrador ON Administrador.id_usuario = Solicitudes.id_administrador
            INNER JOIN Roles ON Roles.id_rol = Solicitante.id_rol
		where Solicitudes.id_solicitud =@idSolicitud
                `;
        const result = await pool.request()
        .input('idSolicitud', sql.Int, idSolicitud)
        .query(query);
        return result.recordset[0];
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return {}
    }


}