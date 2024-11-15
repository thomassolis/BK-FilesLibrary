import { construirFechaUTC5, ObtenerFechaYHoraActual } from "../Fechas/fechasHoras.js";

export const ordernarDatosDeEntrada = (data, user) => {
    const rol = user.nombre_rol
    const Data ={
        id_Archivo: data.fileId,
        CommentsOperador: data.motivo_solicitud.length > 500 ? data.motivo_solicitud.slice(0, 500) : data.motivo_solicitud
    };

    let fecha_solicitud
    let OPE_Comentario
    //const { userName, textAreaValue, fileName, OPEUserName, OPEComment, fileId, approvedGER, folder, approvedADM } = req.body;

    console.log(user)
    console.log(rol)
    console.log(data)

    if(rol =='OPE')
    {
        fecha_solicitud = ObtenerFechaYHoraActual()
        OPE_Comentario = data.motivo_solicitud.length > 500 ? data.motivo_solicitud.slice(0, 500) : data.motivo_solicitud
    }

    if(rol =='ADM')
        {
            fecha_solicitud = ObtenerFechaYHoraActual()
            OPE_Comentario = data.motivo_solicitud.length > 500 ? data.motivo_solicitud.slice(0, 500) : data.motivo_solicitud
        }

    return Data
};
