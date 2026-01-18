import { listFilesInDrive, ObtenerArchivoDesdeDrive, ObtenerLinkArchivoDrive } from "../../Drive/driveService.js"
import { db_Obtener_Archivos_Permitidos_Por_Usuario, verificar_Permiso_Para_Archivo } from "../../querys/Files/db_files.js"
import fs from 'fs';
import path from 'path';
import { replaceDriveIDWithArchivoID } from "../../Schemas/Datos/dataFiles.js";

const mimeTypes = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls": "application/vnd.ms-excel",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export const ctr_Archivos_por_rol = async (req, res) => {
    const Rol = req.user.nombre_rol;
    try {
        const ArchivosPermitidos = await db_Obtener_Archivos_Permitidos_Por_Usuario(Rol);

        if (!ArchivosPermitidos) {
            res.json({ success: true, data: [] });            
        }

        const driveIDsPermitidos = ArchivosPermitidos.map(archivo => archivo.driveID);
        const archivosEnDrive = await listFilesInDrive(driveIDsPermitidos);

        if (!archivosEnDrive) {
            res.json({ success: true, data: [] });
        }

        const dataFormateada = replaceDriveIDWithArchivoID(archivosEnDrive, ArchivosPermitidos)
        res.json({ success: true, data: dataFormateada });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: true, message: 'Error al obtener los archivos' });
    }    
};

export const ctr_Archivos_Copia = async (req, res) => {
    const Rol = req.user?.nombre_rol;
    const id_archivo = req.params.idDrive;
    try {
        const esPermitidoVer = await verificar_Permiso_Para_Archivo(Rol, id_archivo);
        console.log('esPermitidoVer: ', esPermitidoVer)
        if (!esPermitidoVer ) {
            return res.status(403).json({ success: false, message: 'Ha ocurrido un error al obtener los archivos' });
        }

        if (esPermitidoVer.length === 0) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para visualizar este archivo' });
        }

        if (Rol === 'GER') {
            const archivoCopia = esPermitidoVer[0].path;
            const filePath = path.resolve('src/ArchivosCopia/', archivoCopia);
            if (!fs.existsSync(filePath))
            {
                console.error('Archivo no encontrado en la ruta:', filePath);
                return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
            }
    
            try
            {
                const fileBuffer = fs.readFileSync(filePath);
                const ext = path.extname(filePath).toLowerCase();
                const contentType = mimeTypes[ext] || "application/octet-stream";
                res.setHeader("Content-Type", contentType);
                res.setHeader("Content-Disposition", `inline; filename="${path.basename(filePath)}"`);                
                console.log('fileBuffer: ', fileBuffer)
                return res.send(fileBuffer);
            } 
            catch (error) {
                console.error('Error al procesar el archivo:', error);
                if (!res.headersSent) {
                    return res.status(500).json({ success: false, message: 'Error al procesar el archivo' });
                }
            }
        }

        if (Rol === 'ADM' || Rol === 'CEO')
            {
                const DriveId = esPermitidoVer[0].driveID;
                try
                {
                    const archivoLink = await ObtenerLinkArchivoDrive(DriveId);
                    console.log('archivoLink> ', archivoLink)
                    return res.json({ success: true, link: archivoLink });
                }
                catch (error)
                {
                    console.error('Error al obtener el enlace del archivo:', error.message);
                    return res.status(500).json({ success: false, message: 'Error al obtener el enlace del archivo' });
                }
            }
        return res.status(403).json({ success: false, message: 'No tienes permiso para visualizar este archivo' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Error al obtener los archivos' });
    }
};

export const ctr_Archivo_Drive = async (req, res) => {
    const Rol = req.user.nombre_rol
    const id_archivo = req.params.idDrive;   

    try {
        const esPermitidoVer = await verificar_Permiso_Para_Archivo(Rol, id_archivo);

        if (!esPermitidoVer ) {
            return res.status(403).json({ success: false, message: 'Ha ocurrido un error al obtener los archivos' });
        }

        if (esPermitidoVer.length === 0) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para ver este archivo' });
        }
    
        const DriveId = esPermitidoVer[0].driveID;
        
        const ArchivoPdf = await ObtenerArchivoDesdeDrive(DriveId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="archivo.pdf"');
        res.sendFile(ArchivoPdf, (error) => {
            if (error)
            {
                console.error('Error al enviar el archivo:', error);
                res.status(500).json({ success: false, message: 'Error al enviar el archivo' });
            }

            fs.unlink(ArchivoPdf, (err) => {
                if (err) console.error('Error al eliminar el archivo temporal:', err);
            });
        });
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        return res.status(500).json({ success: false, message: 'Error al procesar el archivo' });
    }
};
