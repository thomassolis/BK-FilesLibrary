
import { pool } from "../../../config/db.js";

export const db_Obtener_Archivos_Permitidos_Por_Usuario = async (rol) => {
  try {
    const query = `
      SELECT 
        permiso.verarchivo      AS "verArchivo",
        permiso.enviarsolicitud AS "enviarSolicitud",
        permiso.id_archivo      AS "id_archivo",
        permiso.id_rol          AS "id_rol",
        archivo.nombre          AS "nombre",
        archivo.driveid         AS "driveID"
      FROM public.permisos_archivo AS permiso
      JOIN public.archivos AS archivo
        ON permiso.id_archivo = archivo.id_archivo
      WHERE permiso.id_rol = $1
        AND permiso.verarchivo = true;
    `;

    const result = await pool.query(query, [rol]);

    return result.rows;
  } catch (error) {
    console.error("Error al obtener archivos permitidos:", error.message);
    throw new Error("Error al obtener archivos permitidos");
  }
};


export const verificar_Permiso_Para_Archivo = async (rol, id_archivo) => {
  try {
    const query = `
      SELECT 
        archivo.nombre      AS "nombre",
        archivo.driveid     AS "driveID",
        archivo.path        AS "path"
      FROM public.permisos_archivo AS permiso
      JOIN public.archivos AS archivo
        ON permiso.id_archivo = archivo.id_archivo
      WHERE permiso.id_rol = $1
        AND archivo.id_archivo = $2
        AND permiso.verarchivo = true
      LIMIT 1;
    `;

    const result = await pool.query(query, [rol, id_archivo]);

    // Para que se parezca a recordset de mssql:
    return result.rows;
  } catch (error) {
    console.error("Error al obtener archivos permitidos:", error.message);
    throw new Error(`Error al obtener archivos permitidos: ${error.message}`);
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