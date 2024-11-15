export const replaceDriveIDWithArchivoID = (archivosEnDrive, ArchivosPermitidos) => {
    const replaceIDRecursively = (folder) => {
        if (folder.files) {
            folder.files = folder.files.map(file => {
                const permiso = ArchivosPermitidos.find(archivo => archivo.driveID === file.id);
                if (permiso) {
                    return { ...file, id: permiso.id_archivo };
                }
                return file;
            });
        }

        Object.values(folder).forEach(subFolder => {
            if (typeof subFolder === 'object' && subFolder !== null) {
                replaceIDRecursively(subFolder);
            }
        });
    };

    replaceIDRecursively(archivosEnDrive);
    return archivosEnDrive;
};