import { verificar_Permiso_Para_Archivo } from "../../querys/Files/db_files.js";
import { db_Insertar_Solicitud_Nueva } from "../../querys/solicitudes/db.solicitudes.js";
import { ordernarDatosDeEntrada } from "../../Schemas/Datos/dataSolicitud.js";


export const ctr_AgregarNuevaSolicitud = async (req, res) => {
    const rol = req.user.nombre_rol

    const data = ordernarDatosDeEntrada(req.body, req.user)
    const ArchivosPermitidos = await verificar_Permiso_Para_Archivo(rol, data.id_Archivo)
    
    if(ArchivosPermitidos)
    {
        
      console.log(data)
    }
    res.json({ success: false });
};
