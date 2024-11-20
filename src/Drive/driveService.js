import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const authenticate = () => {
    const keyFilePath = path.join(process.cwd(), 'src/Drive', 'biblioteca-441114-764b4d111738.json');
    const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
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
    const mainFolderId = '1sF7TjGM_UTN0XnHsv4kECpqYdD26I3lf';
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

        console.log(nonFolderFiles); // Opcional: muestra los archivos en la consola
        return nonFolderFiles;
    } catch (error) {
        console.error('Error al listar archivos no carpeta:', error.message);
        return [];
    }
};
