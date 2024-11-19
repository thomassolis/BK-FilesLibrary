import { verificar_Permiso_Para_Archivo } from "../../querys/Files/db_files.js";
import { db_Insertar_Solicitud_Nueva, db_Obtener_Solicitudes_Pendientes_Gerente } from "../../querys/solicitudes/db.solicitudes.js";
import { OrdernarDataSalidadPentiendesGerente, ordernarDatosDeEntrada } from "../../Schemas/Datos/dataSolicitud.js";


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
  try {
      const rol = req.user.nombre_rol;

      if (rol !== 'GER') {
          return res.status(403).json({ success: false, message: 'Acceso denegado' });
      }

      const SolicitudesPendientes = await db_Obtener_Solicitudes_Pendientes_Gerente();

      if (!SolicitudesPendientes || SolicitudesPendientes.length === 0) {
          return res.status(404).json({ success: false, message: 'No hay solicitudes pendientes.' });
      }

      const SolicitudesPendientesOrdenadas = OrdernarDataSalidadPentiendesGerente(SolicitudesPendientes)

      console.log(SolicitudesPendientesOrdenadas)
      return res.status(200).json({ success: true, data: SolicitudesPendientesOrdenadas });
  } catch (error) {
      console.error('Error al obtener solicitudes pendientes para gerencia:', error.message);
      return res.status(500).json({ success: false, message: 'Error al obtener las solicitudes pendientes.' });
  }
};
