
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
    console.error("Error al obtener archivos permitidostest:", error.message);
    throw new Error(`Error al obtener archivos permitidos: ${error.message}`);
  }
};


export const obtener_Drive_ID_BY_Solicitud = async (id_Solicitud) => {
  console.log('id_Solicitud', id_Solicitud)
    try {
        const query = `
        SELECT 
            Arch."driveid"
        FROM 
            "solicitudes" AS Solic
        INNER JOIN 
            "archivos" AS Arch
            ON Solic."id_archivo" = Arch."id_archivo"
        INNER JOIN 
            "usuarios" AS "User"
            ON "User"."id_usuario" = Solic."id_solicitante"
        INNER JOIN 
            "permisos_archivo" AS Perm
            ON Perm."id_archivo" = Arch."id_archivo" AND Perm."id_rol" = "User"."id_rol"
        WHERE 
            Solic."aprobaciongerencia" = TRUE 
            AND Solic."aprobacionadministracion" = TRUE
            AND Solic."id_solicitud" = $1
        `;

        const result = await pool.query(query, [id_Solicitud]);
        console.log('result',result)
        return result.rows[0]; // PostgreSQL devuelve los resultados en `rows`
    } catch (error) {
        console.error('Error al obtener archivos permitidos:', error.message);
        return {}; // Retorna un objeto vacío en caso de error
    }
}
