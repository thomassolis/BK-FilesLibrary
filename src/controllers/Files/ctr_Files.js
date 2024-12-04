import { listFilesInDrive, ObtenerArchivoDesdeDrive, ObtenerLinkArchivoDrive } from "../../Drive/driveService.js"
import { db_Obtener_Archivos_Permitidos_Por_Usuario, verificar_Permiso_Para_Archivo } from "../../querys/Files/db_files.js"
import fs from 'fs';
import path from 'path';
import { replaceDriveIDWithArchivoID } from "../../Schemas/Datos/dataFiles.js";

export const ctr_Archivos_por_rol = async (req, res) => {
    const Rol = req.user.nombre_rol;
    const ArchivosPermitidos = await db_Obtener_Archivos_Permitidos_Por_Usuario(Rol);
    const driveIDsPermitidos = ArchivosPermitidos.map(archivo => archivo.driveID);
    const archivosEnDrive = await listFilesInDrive(driveIDsPermitidos);
    const dataFormateada = replaceDriveIDWithArchivoID(archivosEnDrive, ArchivosPermitidos)
    res.json({ success: true, data: dataFormateada });
};

export const ctr_Archivos_Copia = async (req, res) => {
    const Rol = req.user?.nombre_rol;
    const id_archivo = req.params.idDrive;

    if (Rol === 'GER') {
        const esPermitidoVer = await verificar_Permiso_Para_Archivo(Rol, id_archivo);

        if (esPermitidoVer.length === 0) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para ver este archivo' });
        }

        const archivoCopia = esPermitidoVer[0].path;
        const filePath = path.resolve('src', archivoCopia);

        if (!fs.existsSync(filePath))
        {
            console.error('Archivo no encontrado en la ruta:', filePath);
            return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
        }

        try {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
            return res.sendFile(filePath, (error) => {
                if (error) {
                    console.error('Error al enviar el archivo:', error);
                    if (!res.headersSent) {
                        res.status(500).json({ success: false, message: 'Error al enviar el archivo' });
                    }
                }
            });
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            if (!res.headersSent) {
                return res.status(500).json({ success: false, message: 'Error al procesar el archivo' });
            }
        }
    }

    if (Rol === 'ADM')
    {
        const esPermitidoVer = await verificar_Permiso_Para_Archivo(Rol, id_archivo);

        if (esPermitidoVer.length === 0)
        {
            return res.status(403).json({ success: false, message: 'No tienes permiso para ver este archivo' });
        }
        const DriveId = esPermitidoVer[0].driveID;
        try
        {
            const archivoLink = await ObtenerLinkArchivoDrive(DriveId);
            return res.json({ success: true, link: archivoLink });
        }
        catch (error)
        {
            console.error('Error al obtener el enlace del archivo:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener el enlace del archivo' });
        }
    }
    return res.status(403).json({ success: false, message: 'No tienes permiso para visualizar este archivo' });
};

export const ctr_Archivo_Drive = async (req, res) => {
    const Rol = req.user.nombre_rol
    const id_archivo = req.params.idDrive;    
    const esPermitidoVer = await verificar_Permiso_Para_Archivo(Rol, id_archivo);

    if (esPermitidoVer.length === 0) {
        return res.status(403).json({ success: false, message: 'No tienes permiso para ver este archivo' });
    }

    const DriveId = esPermitidoVer[0].driveID;

    try {
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