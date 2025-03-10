import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const authenticate = () => {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            type: process.env.GOOGLE_TYPE,
            project_id: process.env.GOOGLE_PROJECT_ID,
            private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Convertir saltos de línea
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_CLIENT_ID,
            auth_uri: process.env.GOOGLE_AUTH_URI,
            token_uri: process.env.GOOGLE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
            client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
        },
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    return auth;
};

const listFolderContentsRecursively = async (drive, folderId, allowedDriveIDs, isRoot = false) => {
    try {
        const response = await drive.files.list({
            fields: 'files(id, name, mimeType)',
            q: `'${folderId}' in parents`,
        });

        const files = response.data.files;
        const folderContents = isRoot ? {} : { files: [] }; // Solo incluye "files" si no es la raíz

        for (const file of files) {
            if (file.mimeType === 'application/vnd.google-apps.folder') {
                // Llamada recursiva para subcarpetas usando el nombre de la carpeta como clave
                folderContents[file.name] = await listFolderContentsRecursively(drive, file.id, allowedDriveIDs, false);
            } else if (allowedDriveIDs.includes(file.id)) {
                // Si no es carpeta y está permitido, lo agrega a "files"
                if (!isRoot) {
                    folderContents.files.push({
                        id: file.id,
                        name: file.name,
                    });
                }
            }
        }

        return folderContents;
    } catch (error) {
        console.error('Error al listar archivos:', error.message);
        return isRoot ? {} : { files: [] }; // Retorna según el nivel (raíz o no)
    }
};

export const listFilesInDrive = async (DriveIDs) => {
    const auth = authenticate();
    const drive = google.drive({ version: 'v3', auth });
    const mainFolderId = '1DPXQBbVtGbpD3nnKS8CE35G5PCWfKxzV';
    const driveStructure = await listFolderContentsRecursively(drive, mainFolderId, DriveIDs, true);
    return driveStructure;
};

export const ObtenerArchivoDesdeDrive = async (Drive_Id) => {
    const auth = authenticate();
    const drive = google.drive({ version: 'v3', auth });

    try {
        // Obtener metadatos del archivo para recuperar el nombre real
        const fileMetadata = await drive.files.get({ fileId: Drive_Id, fields: 'name' });

        const fileName = fileMetadata.data.name; // Nombre real del archivo
        const shortUUID = uuidv4().slice(0, 14); // Reducir el UUID a 14 caracteres
        const tempFilePath = path.join(process.cwd(), 'temp', `${shortUUID}-${fileName}`);

        // Crear directorio 'temp' si no existe
        if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
            fs.mkdirSync(path.join(process.cwd(), 'temp'));
        }

        // Descargar el archivo desde Google Drive
        const response = await drive.files.get(
            { fileId: Drive_Id, alt: 'media' },
            { responseType: 'stream' }
        );

        const dest = fs.createWriteStream(tempFilePath);
        await new Promise((resolve, reject) => {
            response.data
                .on('end', () => {
                    console.log('Archivo descargado correctamente.');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error al descargar el archivo:', err);
                    reject(err);
                })
                .pipe(dest);
        });
        

        return tempFilePath; // Ruta al archivo descargado con el nombre modificado

    } catch (error) {
        console.error('Error al obtener el archivo desde Drive:', error.message);
        return {};
    }
};


export const listNonFolderFilesInDrive = async () => {
    const auth = authenticate();
    const drive = google.drive({ version: 'v3', auth });

    try {
        const response = await drive.files.list({
            fields: 'files(id, name, mimeType)',
            q: "mimeType != 'application/vnd.google-apps.folder'", // Filtra para excluir carpetas
        });

        // Extrae solo los archivos que no son carpetas
        const nonFolderFiles = response.data.files.map(file => ({
            id: file.id,
            name: file.name,
            type: file.mimeType,
        }));

        //console.log(nonFolderFiles); // Opcional: muestra los archivos en la consola
        return nonFolderFiles;
    } catch (error) {
        console.error('Error al listar archivos no carpeta:', error.message);
        return [];
    }
};



export const ObtenerLinkArchivoDrive = async (Drive_Id) => {
    const auth = authenticate();
    const drive = google.drive({ version: "v3", auth });

    try {
        // 🔹 Crear permiso temporal (anyone can read)
        const permiso = await drive.permissions.create({
            fileId: Drive_Id,
            requestBody: {
                role: "reader",
                type: "anyone", // Permite acceso público
            },
        });

        setTimeout(async () => {
            try {
                await drive.permissions.delete({
                    fileId: Drive_Id,
                    permissionId: permiso.data.id, // Eliminar el permiso creado
                });
                console.log(`⏳ Permiso eliminado para el archivo ${Drive_Id}`);
            } catch (error) {
                console.error("❌ Error al eliminar el permiso:", error.message);
            }
        }, 5 * 60 * 1000); 
        return `https://drive.google.com/file/d/${Drive_Id}/preview`;

    } catch (error) {
        console.error("❌ Error al hacer público el archivo temporalmente:", error);
        throw error;
    }
};



/*

export const ObtenerTodosLosArchivosDesdeDrive = async (carpetaPadreId) => {
    const auth = authenticate(); // Autenticación en Google Drive
    const drive = google.drive({ version: 'v3', auth });

    try {
        const response = await drive.files.list({
            q: `'${carpetaPadreId}' in parents and trashed=false`,
            pageSize: 1000, // Número de archivos por página (máximo recomendado)
            fields: 'files(id, name, mimeType, size, modifiedTime)', // Campos que queremos recuperar
        });

        const archivos = response.data.files;
        console.log(archivos)

        if (!archivos.length) {
            console.log('No se encontraron archivos en Google Drive.');
            return [];
        }

        console.log(`📂 Se encontraron ${archivos.length} archivos en Drive.`);
        return archivos; // Retorna la lista de archivos con su ID, nombre y tipo

    } catch (error) {
        console.error('⚠️ Error al obtener los archivos desde Drive:', error.message);
        return [];
    }
};

await ObtenerTodosLosArchivosDesdeDrive('1IjpYoGj-py_uyOpJjWuMWuYh1YIjA-wE')*/
