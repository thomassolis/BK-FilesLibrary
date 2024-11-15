import { listFilesInDrive, ObtenerArchivoDesdeDrive } from "../../Drive/driveService.js";
import { verificar_Permiso_Para_Archivo } from "../../querys/Files/db_files.js";
import { db_Insertar_Solicitud_Nueva } from "../../querys/solicitudes/db.solicitudes.js";
import { ordernarDatosDeEntrada } from "../../Schemas/Datos/dataSolicitud.js";


export const ctr_AgregarNuevaSolicitud = async (req, res) => {
    const data = ordernarDatosDeEntrada(req.body, req.user)
    const ArchivosPermitidos = await verificar_Permiso_Para_Archivo(rol, data.id_Archivo)

    if(ArchivosPermitidos)
    {
        
        const insertarDatos = await db_Insertar_Solicitud_Nueva(data)
    }
    res.json({ success: false });
};
