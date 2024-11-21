import { ObtenerArchivoDesdeDrive } from "../../Drive/driveService.js";
import { obtener_Drive_ID_BY_Solicitud, verificar_Permiso_Para_Archivo } from "../../querys/Files/db_files.js";
import { db_Actualizar_Solicitud_Pendientes_Administrador, db_Actualizar_Solicitud_Pendientes_Gerente, db_Insertar_Solicitud_Nueva, db_Obtener_Solicitudes_Pendientes_Administrador, db_Obtener_Solicitudes_Pendientes_Gerente } from "../../querys/solicitudes/db.solicitudes.js";
import { OrdenarDatosEntradaAprobacionAdministrador, OrdenarDatosEntradaAprobacionGerente, OrdernarDataSalidadPentiendesAdministrador, OrdernarDataSalidadPentiendesGerente, ordernarDatosDeEntrada } from "../../Schemas/Datos/dataSolicitud.js";
import fs from 'fs'
export const ctr_AgregarNuevaSolicitud = async (req, res) => {
  const rol = req.user.nombre_rol;
  const data = ordernarDatosDeEntrada(req.body, req.user);
  const ArchivosPermitidos = await verificar_Permiso_Para_Archivo(rol, data.ID_Archivo);

  if (!ArchivosPermitidos || ArchivosPermitidos.length === 0) {
      return res.json({ success: false, message: 'Permiso denegado para el archivo.' });
  }

  try {
      const resultadoInsercion = await db_Insertar_Solicitud_Nueva(data);
      return res.json({ success: true, data: resultadoInsercion });
  } catch (error) {
      console.error('Error al insertar nueva solicitud:', error);
      return res.status(500).json({ success: false, message: 'Error al insertar la solicitud.' });
  }
};


export const ctr_VerSolicitudesPendientesGerencia = async (req, res) => {
  try
  {
      const rol = req.user.nombre_rol;
      if (rol !== 'GER') { return res.status(403).json({ success: false, message: 'Acceso denegado' }); }

      const SolicitudesPendientes = await db_Obtener_Solicitudes_Pendientes_Gerente();

      if (!SolicitudesPendientes || SolicitudesPendientes.length === 0) {
          return res.status(404).json({ success: false, message: 'No hay solicitudes pendientes.' });
      }

      const SolicitudesPendientesOrdenadas = OrdernarDataSalidadPentiendesGerente(SolicitudesPendientes)
      return res.status(200).json({ success: true, data: SolicitudesPendientesOrdenadas });
  } 
  catch (error)
  {
      console.error('Error al obtener solicitudes pendientes para gerencia:', error.message);
      return res.status(500).json({ success: false, message: 'Error al obtener las solicitudes pendientes.' });
  }
};


export const ctr_AprovacionesGerenteSolicitudes = async (req, res) => {
  try {
      const rol = req.user.nombre_rol;

      if (rol !== 'GER')
      {
          return res.status(403).json({success: false, message: 'No tienes permiso para realizar esta acción. Solo un gerente puede aprobar o rechazar solicitudes.'});
      }

      const Data = OrdenarDatosEntradaAprobacionGerente(req.body, req.user.id_usuario);
      console.log(Data)
      const resultado = await db_Actualizar_Solicitud_Pendientes_Gerente(Data);

      if (resultado.success) {
          if (Data.FueAprobado)
          {
            return res.status(200).json({ success: true, message: 'Solicitud aprobada exitosamente. Ha sido enviada a los administradores.' });
          } 
          else
          {
            return res.status(200).json({ success: true, message: 'Solicitud rechazada. No se enviará a los administradores.' });  
          }
      } 
      else
      {
          console.error('Error al actualizar la solicitud:', resultado.error);
          return res.status(500).json({ success: false, message: 'Error al procesar la solicitud. Intenta nuevamente.' });
      }
  } 
  catch (error)
  {
      console.error('Error en el proceso de aprobación/rechazo:', error);
      return res.status(500).json({
          success: false,
          message: 'Error interno del servidor al procesar la solicitud.'
      });
  }
};


export const ctr_VerSolicitudesPendientesAdministrador= async (req, res) => {
    try
    {
        const rol = req.user.nombre_rol;
        if (rol !== 'ADM') { return res.status(403).json({ success: false, message: 'Acceso denegado' }); }
  
        const SolicitudesPendientes = await db_Obtener_Solicitudes_Pendientes_Administrador(rol);
  
        if (!SolicitudesPendientes || SolicitudesPendientes.length === 0) {
            return res.status(404).json({ success: false, message: 'No hay solicitudes pendientes.' });
        }

        const SolicitudesPendientesOrdenadas = OrdernarDataSalidadPentiendesAdministrador(SolicitudesPendientes)
        return res.status(200).json({ success: true, data: SolicitudesPendientesOrdenadas });
    } 
    catch (error)
    {
        console.error('Error al obtener solicitudes pendientes para Administrador:', error.message);
        return res.status(500).json({ success: false, message: 'Error al obtener las solicitudes pendientes.' });
    }
  };
  

export const ctr_AprovacionesAdministradorSolicitudes = async (req, res) => {
    try {
        const rol = req.user.nombre_rol;
        if (rol !== 'ADM')
        {
            return res.status(403).json({success: false, message: 'No tienes permiso para realizar esta acción. Solo un gerente puede aprobar o rechazar solicitudes.'});
        }
  
        const Data = OrdenarDatosEntradaAprobacionAdministrador(req.body, req.user.id_usuario);

        console.log(Data)
        const resultado = await db_Actualizar_Solicitud_Pendientes_Administrador(Data);
  
        if (resultado.success) {
            if (Data.FueAprobado)
            {
                const Drive_ID_Email = await  obtener_Drive_ID_BY_Solicitud(Data.IdSolicitud)
                const tempFilePath = await ObtenerArchivoDesdeDrive(Drive_ID_Email.driveID);

                if (tempFilePath) {
                    console.log(tempFilePath)
                   // fs.unlinkSync(tempFilePath);
                } else {
                    console.log('NO EXISTE EL ARCHIVO');
                }

              return res.status(200).json({ success: true, message: 'Solicitud aprobada exitosamente. Ha sido enviada a los administradores.' });
            } 
            else
            {
              return res.status(200).json({ success: true, message: 'Solicitud rechazada. No se enviará a los administradores.' });  
            }
        } 
        else
        {
            console.error('Error al actualizar la solicitud:', resultado.error);
            return res.status(500).json({ success: false, message: 'Error al procesar la solicitud. Intenta nuevamente.' });
        }
    } 
    catch (error)
    {
        console.error('Error en el proceso de aprobación/rechazo:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al procesar la solicitud.'
        });
    }
  };