import { ObtenerFechaYHoraActual } from "../Fechas/fechasHoras.js";

export const ordernarDatosDeEntrada = (data, user) => {
    const rol = user.nombre_rol;

    let fecha_solicitud = ObtenerFechaYHoraActual();
    let OPE_Comentario = null;
    let GEN_Comentario = null;
    let GEN_Aproved = false;
    const id_Archivo = data.fileId;
    let OPE_UserID = null;
    let GEN_UserID = null;
    let Estado_Solicitud = null;
    let Fecha_AprovacionGerencia = null;

    const comentario_truncado = data.motivo_solicitud.length > 500
        ? data.motivo_solicitud.slice(0, 500).toUpperCase()
        : data.motivo_solicitud.toUpperCase();

    if (rol === 'OPE') {
        OPE_Comentario = comentario_truncado;
        OPE_UserID = user.id_usuario;
        Estado_Solicitud = 'SOLICITADA';
    }

    if (rol === 'GER') {
        GEN_Comentario = comentario_truncado;
        OPE_Comentario = comentario_truncado;
        GEN_Aproved = true;
        OPE_UserID = user.id_usuario;
        GEN_UserID = user.id_usuario;
        Estado_Solicitud = 'APROBACION 1';
        Fecha_AprovacionGerencia = ObtenerFechaYHoraActual();
    }

    return {
        Fecha_Solicitud: fecha_solicitud,
        OPE_Comentario: OPE_Comentario,
        GEN_Comentario: GEN_Comentario,
        GEN_Aproved: GEN_Aproved,
        ID_Archivo: id_Archivo,
        OPE_UserID: OPE_UserID,
        GEN_UserID: GEN_UserID || null,
        Estado_Solicitud: Estado_Solicitud,
    };
};

export const OrdernarDataSalidadPentiendesGerente = (data) => {
    return data.map(item => ({
        ID_Solicitudes: item.id_solicitud,
        Nombre_del_archivo: item.Nombre_del_archivo,
        Nombre_de_solicitante: item.Nombre_de_solicitante,
        motivo_solicitud: item.motivo_solicitud
    }));
};

export const OrdenarDatosEntradaAprobacionGerente = (data, idUser) => {
    const ComentarioGerente = data.comentarioGerente ? data.comentarioGerente.slice(0, 500): null;
    const FueAprobado =  data.approvedGER === true;
    const HoraAprobacionGerente = ObtenerFechaYHoraActual()
    const IdSolicitud = data.ID_Solicitudes
    let EstadoNuevo
    const GerenteID = idUser

    if(FueAprobado)
    {
        EstadoNuevo = "APROBACION 1"
    }
    else
    {
        EstadoNuevo = "REJECT BY GERENTE"
    }

    return {
        ComentarioGerente,
        FueAprobado,
        HoraAprobacionGerente,
        IdSolicitud,
        EstadoNuevo,
        GerenteID
    }
}


export const OrdernarDataSalidadPentiendesAdministrador = (data) => {
    const toUpperCaseSafe = (value) => (value ? value.toUpperCase() : null);
    return data.map(item => ({
        ID_Solicitudes: item.id_solicitud,
        Nombre_del_archivo: item.Nombre_Archivo,
        Nombre_de_solicitante: toUpperCaseSafe(item.Nombre_solicitante),
        Gerente_que_aprobo_solicitud: toUpperCaseSafe(item.Nombre_Gerente),
        Rol_De_Solicitante: toUpperCaseSafe(item.Rol_Solicitante),
        motivo_solicitud: toUpperCaseSafe(item.Comentario_Operador),
        comentarioGerente: toUpperCaseSafe(item.Comentario_Gerente)
    }));
};



export const OrdenarDatosEntradaAprobacionAdministrador = (data, idUser) => {
    const ComentarioAdmnistrador = data.comentarioAdministracion ? data.comentarioAdministracion.slice(0, 500): null;
    const FueAprobado =  data.approvedADM === true;
    const HoraAprobacionAdministrador = ObtenerFechaYHoraActual()
    const IdSolicitud = data.ID_Solicitudes? data.ID_Solicitudes: 106
    let EstadoNuevo
    const AdminID = idUser
    
    if(FueAprobado)
    {
        EstadoNuevo = "APROBACION 2"
    }
    else
    {
        EstadoNuevo = "REJECT BY ADMINISTRADOR"
    }

    return {
        ComentarioAdmnistrador,
        FueAprobado,
        HoraAprobacionAdministrador,
        IdSolicitud,
        EstadoNuevo,
        AdminID
    }
}