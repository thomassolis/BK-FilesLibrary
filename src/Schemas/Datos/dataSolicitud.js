import {ObtenerFechaYHoraActual } from "../Fechas/fechasHoras.js";

export const ordernarDatosDeEntrada = (data, user) => {
    const rol = user.nombre_rol;
    
    let fecha_solicitud;
    let OPE_Comentario = null;
    let ADM_Comentario = null;
    let ADM_Aproved = false;
    const id_Archivo = data.fileId;
    let OPE_UserID = null;
    let ADM_UserID = null;
    let Estado_Solicitud = null

    if (rol === 'OPE') {
        fecha_solicitud = ObtenerFechaYHoraActual();
        OPE_Comentario = data.motivo_solicitud.length > 500 ? data.motivo_solicitud.slice(0, 500).toUpperCase(): data.motivo_solicitud.toUpperCase();
        OPE_UserID = user.id_usuario
        Estado_Solicitud='SOLICITADA'
    }

    if (rol === 'GER') {
        fecha_solicitud = ObtenerFechaYHoraActual();
        ADM_Comentario = data.motivo_solicitud.length > 500 ? data.motivo_solicitud.slice(0, 500).toUpperCase() : data.motivo_solicitud.toUpperCase();
        OPE_Comentario = data.motivo_solicitud.length > 500 ? data.motivo_solicitud.slice(0, 500).toUpperCase() : data.motivo_solicitud.toUpperCase();
        ADM_Aproved = true;
        OPE_UserID = user.id_usuario
        ADM_UserID = user.id_usuario
        Estado_Solicitud='APROVED GERENTE'
    }

    return {
        Fecha_Solicitud: fecha_solicitud,
        OPE_Comentario: OPE_Comentario,
        ADM_Comentario: ADM_Comentario,
        ADM_Aproved: ADM_Aproved,
        ID_Archivo: id_Archivo,
        OPE_UserID: OPE_UserID,
        ADM_UserID: ADM_UserID || null,
        Estado_Solicitud:Estado_Solicitud
    };
};

