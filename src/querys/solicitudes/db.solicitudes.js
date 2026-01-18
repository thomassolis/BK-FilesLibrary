
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

// pool = new Pool({ connectionString: ... })
export const db_Insertar_Solicitud_Nueva = async (data) => {
  const query = `
    INSERT INTO Solicitudes (
      Fecha_Solicitud,
      motivo_solicitud,
      comentarioGerente,
      aprobacionGerencia,
      id_archivo,
      id_solicitante,
      id_gerente,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id_solicitud;
  `;

  const values = [
    data.Fecha_Solicitud,                 // timestamp / timestamptz
    data.OPE_Comentario,                  // text
    data.GEN_Comentario ?? null,          // text nullable
    data.GEN_Aproved,                     // boolean
    data.ID_Archivo,                      // integer
    data.OPE_UserID,                      // integer
    data.GEN_UserID ?? null,              // integer nullable
    data.Estado_Solicitud ?? null         // text nullable (o cambia a default si quieres)
  ];

  try {
    // si tu connectDB en postgres solo asegura pool listo, llámalo aquí si aplica
    // await connectDB();

    const result = await pool.query(query, values);
    return { success: true, id_solicitud: result.rows[0].id_solicitud };
  } catch (error) {
    console.error("Error al insertar datos en PostgreSQL:", error.message);
    return { success: false, error: error.message };
  }
};


export const db_Obtener_Solicitudes_Pendientes_Gerente = async () => {
  try {
    const query = `
      SELECT
        s.id_solicitud,
        a.nombre AS "Nombre_del_archivo",
        u.nombre AS "Nombre_de_solicitante",
        s.motivo_solicitud AS "motivo_solicitud"
      FROM solicitudes s
      LEFT JOIN archivos a ON a.id_archivo = s.id_archivo
      LEFT JOIN usuarios u ON u.id_usuario = s.id_solicitante
      WHERE s.status = 'SOLICITADA'
      ORDER BY s.id_solicitud DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error gerente pendientes:", error.message);
    return [];
  }
};

export const db_Actualizar_Solicitud_Pendientes_Gerente = async (data) => {
  try {
    const query = `
      UPDATE solicitudes
      SET
        comentariogerente = $1,
        aprobaciongerencia = $2,
        fecha_aprobacion_gerencial = $3,
        id_gerente = $4,
        status = $5
      WHERE id_solicitud = $6;
    `;

    const values = [
      data.ComentarioGerente ?? null,
      data.FueAprobado, // boolean
      data.HoraAprobacionGerente ?? null, // timestamp/timestamptz
      data.GerenteID ?? null,
      data.EstadoNuevo,
      data.IdSolicitud,
    ];

    const result = await pool.query(query, values);
    return { success: true, rowsAffected: result.rowCount };
  } catch (error) {
    console.error("Error al actualizar solicitud gerente:", error.message);
    return { success: false, error: error.message };
  }
};

export const db_Obtener_Solicitudes_Pendientes_Administrador = async () => {
  try {
    const query = `
      SELECT
        s.id_solicitud,
        s.motivo_solicitud AS "Comentario_Operador",
        s.comentariogerente AS "Comentario_Gerente",
        a.nombre AS "Nombre_Archivo",
        solicitante.nombre AS "Nombre_solicitante",
        gerente.nombre AS "Nombre_Gerente",
        solicitante.id_rol AS "Rol_Solicitante"
      FROM solicitudes s
      INNER JOIN archivos a
        ON a.id_archivo = s.id_archivo
      INNER JOIN usuarios AS solicitante
        ON solicitante.id_usuario = s.id_solicitante
      LEFT JOIN usuarios AS gerente
        ON gerente.id_usuario = s.id_gerente
      WHERE s.status = 'APROBACION 1'
      ORDER BY s.id_solicitud DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error(`Error admin pendientes: ${error.message}`);
    return [];
  }
};

export const db_Actualizar_Solicitud_Pendientes_Administrador = async (data) => {
  try {
    const query = `
      UPDATE solicitudes
      SET
        comentarioadministrador = $1,
        aprobacionadministracion = $2,
        fecha_aprobacion_administrativa = $3,
        id_administrador = $4,
        status = $5
      WHERE id_solicitud = $6;
    `;

    const values = [
      data.ComentarioAdmnistrador ?? null,
      data.FueAprobado, // boolean
      data.HoraAprobacionAdministrador ?? null,
      data.AdminID ?? null,
      data.EstadoNuevo,
      data.IdSolicitud,
    ];

    const result = await pool.query(query, values);
    return { success: true, rowsAffected: result.rowCount };
  } catch (error) {
    console.error("Error al actualizar solicitud admin:", error.message);
    return { success: false, error: error.message };
  }
};

export const db_Obtener_Historial_Administrador = async () => {
  try {
    const query = `
      SELECT
        a.nombre AS "Nombre_del_archivo",
        solicitante.nombre AS "Nombre_de_solicitante",
        r.nombre AS "Rol_De_Solicitante",
        s.motivo_solicitud AS "motivo_de_la_solicitud",
        s.fecha_solicitud AS "fecha_solicitud",
        gerente.nombre AS "Gerente_que_aprobo_solicitud",
        s.aprobaciongerencia AS "aprobacion_gerencia",
        s.comentariogerente AS "Comentario_gerente",
        s.fecha_aprobacion_gerencial AS "fecha_aprobacion_gerente",
        administrador.nombre AS "nombre_administrador",
        s.aprobacionadministracion AS "aprobacion_administracion",
        s.comentarioadministrador AS "Comentario_administracion"
      FROM solicitudes s
      INNER JOIN archivos a ON a.id_archivo = s.id_archivo
      INNER JOIN usuarios AS solicitante ON solicitante.id_usuario = s.id_solicitante
      LEFT JOIN usuarios AS gerente ON gerente.id_usuario = s.id_gerente
      LEFT JOIN usuarios AS administrador ON administrador.id_usuario = s.id_administrador
      INNER JOIN roles r ON r.id_rol = solicitante.id_rol;
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error historial admin:", error.message);
    return [];
  }
};

export const db_ObtenerCorreoMiGerente = async (UserID) => {
  try {
    const query = `
      SELECT gerente.email AS "EmailGerente"
      FROM usuarios operador
      JOIN usuarios gerente
        ON operador.departamento = gerente.departamento
        AND gerente.id_rol = 'GER'
      WHERE operador.id_usuario = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [UserID]);
    return result.rows?.[0]?.EmailGerente ?? "";
  } catch (error) {
    console.error("Error obtener correo gerente:", error.message);
    return "";
  }
};

export const db_ObtenerNombreDeArchivoSegunID = async (idArchivo) => {
  try {
    const query = `
      SELECT nombre
      FROM archivos
      WHERE id_archivo = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [idArchivo]);
    return result.rows?.[0]?.nombre ?? "Archivo No encontrado";
  } catch (error) {
    console.error("Error obtener nombre archivo:", error.message);
    return "Archivo No encontrado";
  }
};

export const db_ObtenerDataSolicitud = async (idSolicitud) => {
  try {
    const query = `
      SELECT
        solicitante.nombre AS "Nombre_de_solicitante",
        a.nombre AS "Nombre_Archivo",
        s.motivo_solicitud AS "motivo_de_la_solicitud",
        s.fecha_solicitud AS "fecha_solicitud",
        gerente.nombre AS "Gerente_que_aprobo_solicitud",
        s.comentariogerente AS "Comentario_gerente",
        s.fecha_aprobacion_gerencial AS "fecha_aprobacion_gerente"
      FROM solicitudes s
      INNER JOIN archivos a ON a.id_archivo = s.id_archivo
      INNER JOIN usuarios AS solicitante ON solicitante.id_usuario = s.id_solicitante
      LEFT JOIN usuarios AS gerente ON gerente.id_usuario = s.id_gerente
      LEFT JOIN usuarios AS administrador ON administrador.id_usuario = s.id_administrador
      INNER JOIN roles r ON r.id_rol = solicitante.id_rol
      WHERE s.id_solicitud = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [idSolicitud]);
    return result.rows?.[0] ?? {};
  } catch (error) {
    console.error("Error obtener data solicitud:", error.message);
    return {};
  }
};