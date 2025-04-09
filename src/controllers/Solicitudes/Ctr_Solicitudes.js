import { ObtenerArchivoDesdeDrive } from "../../Drive/driveService.js";
import {
  obtener_Drive_ID_BY_Solicitud,
  verificar_Permiso_Para_Archivo,
} from "../../querys/Files/db_files.js";
import {
  db_Actualizar_Solicitud_Pendientes_Administrador,
  db_Actualizar_Solicitud_Pendientes_Gerente,
  db_Insertar_Solicitud_Nueva,
  db_Obtener_Historial_Administrador,
  db_Obtener_Solicitudes_Pendientes_Administrador,
  db_Obtener_Solicitudes_Pendientes_Gerente,
  db_ObtenerCorreoMiGerente,
  db_ObtenerDataSolicitud,
  db_ObtenerNombreDeArchivoSegunID,
} from "../../querys/solicitudes/db.solicitudes.js";
import {
  OrdenarDatosEntradaAprobacionAdministrador,
  OrdenarDatosEntradaAprobacionGerente,
  OrdernarDataSalidadPentiendesAdministrador,
  OrdernarDataSalidadPentiendesGerente,
  ordernarDatosDeEntrada,
} from "../../Schemas/Datos/dataSolicitud.js";
import fs from "fs";
import {
  enviarCorreo,
  enviarCorreoAdministrador_aprobacionGerencia,
  enviarNotificacionGerente,
} from "../Email/EnviadorCorreos.js";
import { ObtenerEmailPorIdUser } from "../../querys/Login/login.js";
import { getIO } from "../../socket/socket.js";

export const ctr_AgregarNuevaSolicitud = async (req, res) => {
  const rol = req.user.nombre_rol;
  const io = getIO();
  const data = ordernarDatosDeEntrada(req.body, req.user);
  const ArchivosPermitidos = await verificar_Permiso_Para_Archivo(
    rol,
    data.ID_Archivo
  );
  const mailAdministradores = ["analistamlc3@gmail.com", "analistadedatosmultimodal@mlc.com.pa"];
  if (!ArchivosPermitidos || ArchivosPermitidos.length === 0) {
    return res.json({
      success: false,
      message: "Permiso denegado para el archivo.",
    });
  }

  try {
    const resultadoInsercion = await db_Insertar_Solicitud_Nueva(data);
    if (!resultadoInsercion.success) {
      return res
        .status(500)
        .json({ success: false, message: "Error al insertar la solicitud." });
    }
    if (rol === "OPE") {
      const MailMiGerente = await db_ObtenerCorreoMiGerente(
        req.user.id_usuario
      );
      const NombreArchivo = await db_ObtenerNombreDeArchivoSegunID(
        data.ID_Archivo
      );
      await enviarNotificacionGerente(
        MailMiGerente,
        req.user.nombre,
        NombreArchivo,
        data.OPE_Comentario,
        false
      );
      io.emit("Nueva_Solicitud_Opr", {
        ID_Solicitudes: resultadoInsercion.id_solicitud,
        Nombre_del_archivo: NombreArchivo,
        Nombre_de_solicitante: req.user.nombre,
        motivo_solicitud: data.OPE_Comentario,
      });
    } else if (rol === "GER") {
      const NombreArchivo = await db_ObtenerNombreDeArchivoSegunID(data.ID_Archivo);
      await enviarNotificacionGerente(
        mailAdministradores,
        req.user.nombre,
        NombreArchivo,
        data.OPE_Comentario,
        true
      );
      io.emit("Nueva_Solicitud_Gerente", {
        ID_Solicitudes: resultadoInsercion.id_solicitud,
        Nombre_de_solicitante: req.user.nombre,
        Nombre_del_archivo: NombreArchivo,
        Rol_De_Solicitante: "GERENTE",
        motivo_solicitud: data.OPE_Comentario,
        Gerente_que_aprobo_solicitud: req.user.nombre,
        comentarioGerente: data.OPE_Comentario,
      });
    }

    return res.json({ success: true, data: resultadoInsercion });
  } catch (error) {
    console.error("Error al insertar nueva solicitud:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al insertar la solicitud." });
  }
};

export const ctr_VerSolicitudesPendientesGerencia = async (req, res) => {
  try {
    const rol = req.user.nombre_rol;
    if (rol !== "GER") {
      return res
        .status(403)
        .json({ success: false, message: "Acceso denegado" });
    }

    const SolicitudesPendientes =
      await db_Obtener_Solicitudes_Pendientes_Gerente();

    if (!SolicitudesPendientes || SolicitudesPendientes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No hay solicitudes pendientes." });
    }

    const SolicitudesPendientesOrdenadas = OrdernarDataSalidadPentiendesGerente(
      SolicitudesPendientes
    );
    return res
      .status(200)
      .json({ success: true, data: SolicitudesPendientesOrdenadas });
  } catch (error) {
    console.error(
      "Error al obtener solicitudes pendientes para gerencia:",
      error.message
    );
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener las solicitudes pendientes.",
      });
  }
};

export const ctr_AprovacionesGerenteSolicitudes = async (req, res) => {
  try {
    const io = getIO();
    const rol = req.user.nombre_rol;
    const mailAdministradores = ["correo1@example.com", "correo2@example.com"];

    if (rol !== "GER") {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "No tienes permiso para realizar esta acción. Solo un gerente puede aprobar o rechazar solicitudes.",
        });
    }

    const Data = OrdenarDatosEntradaAprobacionGerente(
      req.body,
      req.user.id_usuario
    );
    const resultado = await db_Actualizar_Solicitud_Pendientes_Gerente(Data);

    if (resultado.success) {
      if (Data.FueAprobado) {
        const dataSolicitud = await db_ObtenerDataSolicitud(Data.IdSolicitud);
        await enviarCorreoAdministrador_aprobacionGerencia(
          mailAdministradores,
          dataSolicitud,
          req.user.nombre
        );
        io.emit("Nueva_Solicitud_Gerente", {
          ID_Solicitudes: Data.IdSolicitud,
          Nombre_de_solicitante: dataSolicitud.Nombre_de_solicitante,
          Nombre_del_archivo: dataSolicitud.Nombre_Archivo,
          Rol_De_Solicitante: "OPERADOR",
          motivo_solicitud: dataSolicitud.motivo_de_la_solicitud,
          Gerente_que_aprobo_solicitud:
            dataSolicitud.Gerente_que_aprobo_solicitud,
          comentarioGerente: dataSolicitud.Comentario_gerente,
        });
        return res
          .status(200)
          .json({
            success: true,
            message:
              "Solicitud aprobada exitosamente. Ha sido enviada a los administradores.",
          });
      } else {
        return res
          .status(200)
          .json({
            success: true,
            message:
              "Solicitud rechazada. No se enviará a los administradores.",
          });
      }
    } else {
      console.error("Error al actualizar la solicitud:", resultado.error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Error al procesar la solicitud. Intenta nuevamente.",
        });
    }
  } catch (error) {
    console.error("Error en el proceso de aprobación/rechazo:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al procesar la solicitud.",
    });
  }
};

export const ctr_VerSolicitudesPendientesAdministrador = async (req, res) => {
  try {
    const rol = req.user.nombre_rol;
    if (rol !== "ADM") {
      return res
        .status(403)
        .json({ success: false, message: "Acceso denegado" });
    }

    const SolicitudesPendientes =
      await db_Obtener_Solicitudes_Pendientes_Administrador(rol);

    if (!SolicitudesPendientes || SolicitudesPendientes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No hay solicitudes pendientes." });
    }

    const SolicitudesPendientesOrdenadas =
      OrdernarDataSalidadPentiendesAdministrador(SolicitudesPendientes);
    return res
      .status(200)
      .json({ success: true, data: SolicitudesPendientesOrdenadas });
  } catch (error) {
    console.error(
      "Error al obtener solicitudes pendientes para Administrador:",
      error.message
    );
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener las solicitudes pendientes.",
      });
  }
};

export const ctr_AprovacionesAdministradorSolicitudes = async (req, res) => {
  try {
    const rol = req.user.nombre_rol;

    if (rol !== "ADM")
    {
        return res.status(403).json({ success: false, message: "No tienes permiso para realizar esta acción. Solo un Administrador puede aprobar o rechazar solicitudes."});  
    }

    const Data = OrdenarDatosEntradaAprobacionAdministrador( req.body, req.user.id_usuario );
    const resultado = await db_Actualizar_Solicitud_Pendientes_Administrador(Data);

    if (resultado.success) {
      if (Data.FueAprobado) {
        const Drive_ID_Email = await obtener_Drive_ID_BY_Solicitud(Data.IdSolicitud);
        
        if (!Drive_ID_Email || !Drive_ID_Email.driveID)
        {
            return res .status(404) .json({ success: false, message: "No se pudo encontrar el archivo asociado a la solicitud aprobada.", }); 
        }

        const tempFilePath = await ObtenerArchivoDesdeDrive(
          Drive_ID_Email.driveID
        );

        if (!tempFilePath) {
          return res.status(500).json({
            success: false,
            message: "Error al descargar el archivo desde Drive.",
          });
        }

        const emailTo = await ObtenerEmailPorIdUser(req.user.id_usuario);
        if (!emailTo) {
          return res.status(404).json({
            success: false,
            message:
              "No se pudo obtener el correo electrónico del solicitante.",
          });
        }

        const emailResponse = await enviarCorreo({
          subject: "Notificación de Aprobación",
          to: "analistadedatos2multimodal@mlc.com.pa",
          // bcc: "analistadedatosmultimodal@mlc.com.pa",
          fileAttached: tempFilePath,
          ComentarioAdmin: Data.ComentarioAdmnistrador,
        });

        if (!emailResponse.success) {
          return res.status(500).json({
            success: false,
            message:
              "La solicitud fue aprobada, pero ocurrió un error al enviar el correo.",
          });
        }

        fs.unlinkSync(tempFilePath);
        return res .status(200) .json({ success: true, message: `Solicitud aprobada exitosamente. Se ha enviado el archivo al correo ${emailTo}.`, });
      } else {
        return res.status(200).json({ success: true, message: "Solicitud rechazada. No se enviará a los administradores.", });
      }
    }
    else
    {
      console.error("Error al actualizar la solicitud:", resultado.error);
      return res.status(500).json({ success: false, message: "Error al procesar la solicitud. Intenta nuevamente.", });
    }
  } catch (error) {
    console.error("Error en el proceso de aprobación/rechazo:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor al procesar la solicitud.", });
  }
};

export const ctr_ObtenerHistorialAdministrador = async (req, res) => {
  try {
    const rol = req.user.nombre_rol;
    if (rol !== "ADM") {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "No tienes permiso para realizar esta acción. Solo un Administrador puede ver el historial de solictudes.",
        });
    }
    const DataHistorial = await db_Obtener_Historial_Administrador();
    res.json({ success: true, Data: DataHistorial });
  } catch (error) {
    console.log("Error en el ctr_ObtenerHistorialAdministrador: ", error);
    return res.status(500).json({ success: false, message: "Error al obtener el historial del administrador.", });
  }
};
