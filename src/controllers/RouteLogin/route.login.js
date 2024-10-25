import CustomError from "../../errors/CustomErros.js";
import { UserBannedError } from "../../errors/UserBannedError.js";
import { validacionUsuario } from "../../querys/Login/login.js";
import { generateJWT } from "../jwt/loginToken.js";
import { fileURLToPath } from 'url';
import path from "path";
import { promises as fs } from 'fs';  // Cambiar a fs.promises
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDirectory = path.join(__dirname, '../../'); // Cambia 'your-folder-path' por la ruta donde están tus carpetas
const validFolders = ['ADM', 'OPE', 'GER'];
// Función recursiva para obtener archivos y subcarpetas
let fileId = 0;
import multer from "multer";

let dataTest =[{
    userName: "THOMAS",
    textAreaValue: "porfavor liberar archivo",
    fileId: 2,
    fileName: "archivo ultra secreto ",
    NumeroSolicitud: "2"
}, {
    userName: "DAVID",
    textAreaValue: "necesito hacer solicitud",
    fileId: 3,
    fileName: "archivo mega secreto ",
    NumeroSolicitud:3
}   ] 


const getFilesRecursively = async (folderPath) => {
    let fileTree = {};

    // Leer el contenido de la carpeta
    const items = await fs.readdir(folderPath, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(folderPath, item.name);

        if (item.isDirectory()) {
            // Llamar recursivamente para obtener los archivos dentro de la subcarpeta
            fileTree[item.name] = await getFilesRecursively(itemPath);
        } else {
            // Si es un archivo, añadirlo al array de archivos de la carpeta actual
            if (!fileTree["files"]) {
                fileTree["files"] = [];
            }
            // Añadir el archivo con un ID secuencial
            fileTree["files"].push({ id: ++fileId, name: item.name });
        }
    }

    return fileTree;
};

// Importar la base de datos o modelo si fuera necesario
// const HistoryModel = require('path_to_model');

export const oficialHistory = async (req, res) => {
    try {
        // Aquí podrías obtener datos de la base de datos si lo necesitaras
        // const historyData = await HistoryModel.find(); // Suponiendo que tienes un modelo llamado HistoryModel

        // Para este ejemplo, vamos a simular algunos datos
        const historyData = [
            { id: 1, event: "File uploaded", timestamp: "2024-10-21 10:30:00" },
            { id: 2, event: "File deleted", timestamp: "2024-10-22 14:00:00" },
            { id: 3, event: "File downloaded", timestamp: "2024-10-23 09:00:00" }
        ];

        // Enviar la respuesta con los datos del historial
        res.status(200).json({
            success: true,
            data: historyData,
            message: 'Historial obtenido exitosamente'
        });

    } catch (error) {
        // En caso de error, devolvemos una respuesta de error
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el historial'
        });
    }
};




export const controladorRutaLoginPost = async (req, res) => {
    const { Email, Password } = req.body;
    try
    {
        const userData = await validacionUsuario(Email, Password);
        const token = await generateJWT(userData)
        res.cookie('BibliotecaMLC', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({ Data: userData, success: true, error: false });
    } 

    catch (error)
    {
        console.error('Error al iniciar sesión:', error.message);
        if (error instanceof CustomError) {
            const response = { error: true, success: false, message: error.message, };
            
            if (error instanceof UserBannedError)
            {
                response.segundosBan = error.segundosBan;
                response.isBan = error.isBan;
            }
            res.status(error.statusCode).json(response);
        } 
        else
        {
            res.status(500).json({ error: true, success: false, message: "Ha ocurrido un error inesperado" });
        }
    }
};

export const controladorRutaAuthenticationPost = async (req, res) => {
    const { authentication } = req.body;  // Obtener el código de autenticación enviado desde el frontend

    try {
        // Aquí puedes simular una validación del código de autenticación.
        // Para este ejemplo, asumimos que el código correcto es "123456".
        if (authentication === "1") {
            // Simular datos que se envían de vuelta si la autenticación es exitosa
            const userData = {
                userRol: "ADM",  // Puedes cambiar estos valores según tu lógica
                userName: "ADMIN",
                banTime: 0,  // Si el banTime es 0, significa que el usuario no está baneado
                isBan: false  // El usuario no está baneado
            };

            // Enviar respuesta con los datos simulados
            res.status(200).json({
                success: true,
                status: 200,
                Data: userData  // Aquí enviamos el objeto con los datos simulados
            });
        } else if (authentication === "2") {
            // Simular datos que se envían de vuelta si la autenticación es exitosa
            const userData = {
                userRol: "GER",  // Puedes cambiar estos valores según tu lógica
                userName: "GERENTE",
                banTime: 0,  // Si el banTime es 0, significa que el usuario no está baneado
                isBan: false  // El usuario no está baneado
            };

            // Enviar respuesta con los datos simulados
            res.status(200).json({
                success: true,
                status: 200,
                Data: userData  // Aquí enviamos el objeto con los datos simulados
            });
        } else if (authentication === "3") {
            // Simular datos que se envían de vuelta si la autenticación es exitosa
            const userData = {
                userRol: "OPE",  // Puedes cambiar estos valores según tu lógica
                userName: "OPERADOR",
                banTime: 0,  // Si el banTime es 0, significa que el usuario no está baneado
                isBan: false  // El usuario no está baneado
            };

            // Enviar respuesta con los datos simulados
            res.status(200).json({
                success: true,
                status: 200,
                Data: userData  // Aquí enviamos el objeto con los datos simulados
            });
        }    
        else if (authentication === "ban123") {
            // Simular el caso de que el usuario está temporalmente baneado
            const banTime = 3600;  // Ejemplo: 1 hora de baneo en segundos

            res.status(429).json({
                success: false,
                status: 429,
                message: "Demasiados intentos fallidos. Estás temporalmente baneado.",
                segundosBan: {
                    seconds: banTime
                }
            });
        } else {
            // Si el código de autenticación es incorrecto
            res.status(401).json({
                success: false,
                status: 401,
                message: "Código de autenticación incorrecto"
            });
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        // Manejo de errores del servidor
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error en el servidor"
        });
    }
};



export const ctrFilesByUser = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        // Validar si la carpeta está en la lista de carpetas válidas
        if (!validFolders.includes(fileName)) {
            return res.status(400).json({ error: 'Carpeta no válida' });
        }

        // Construir la ruta de la carpeta
        const folderPath = path.join(__dirname, "../../Archivos", fileName);

        // Obtener la estructura de archivos y carpetas
        const files = await getFilesRecursively(folderPath);


        // Enviar la estructura de archivos como respuesta
        console.log(files)
        res.json(files);
    } catch (error) {
        console.error("Error al leer los archivos:", error);
        res.status(500).json({ error: 'Error al leer los archivos' });
    }
};


export const filesData = async (req, res) => {
    const { fileId, fileName, textAreaValue } = req.body;  

 
    // Devuelve una respuesta al cliente
    res.json({ message: "Datos recibidos correctamente", fileId, fileName, textAreaValue });
};



//RECIBIENDO LOS ARCHIVOS DEL ADMINISTRADOR


// Configurar dónde se almacenarán los archivos y cómo se nombrarán
// Obtener __dirname en ES Module

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Especificar la carpeta donde se almacenarán los archivos subidos
      cb(null, path.join(__dirname, '../../../src/uploads'));  // Asegúrate de que la carpeta 'uploads' exista
    },
    filename: (req, file, cb) => {
      // Asignar un nombre único a cada archivo usando la fecha actual
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

// Filtrar por tipo de archivo (opcional)
const fileFilter = (req, file, cb) => {
    // Puedes limitar los tipos de archivos permitidos (por ejemplo, solo imágenes y PDFs)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no permitido'), false);
    }
  };
// Configuración de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limitar el tamaño de los archivos a 5MB
  }).array('files');  // 'files' es el nombre del campo en el formulario que contiene los archivos

  
// Función del controlador adminFiles
export const adminFiles = (req, res) => {
    // Usar multer para manejar la subida
    upload(req, res, (err) => {
        if (err) {
            console.log('Error al subir archivos:', err);
            return res.status(400).json({ message: 'Error al subir los archivos', error: err.message });
        }
        
        // console.log('Archivos subidos correctamente:', req.files);
        res.status(200).json({
        message: 'Archivos subidos exitosamente',
        files: req.files,
        });
    });
  };

  export const historialData=(req,res)=>{
    const { userName,textAreaValue, fileId, fileName } = req.body;
    try
    {
        //AQUI GUARDO EN LA BASE DE DATOS
        console.log(userName);
        console.log(textAreaValue);
        console.log(fileId);
        console.log(fileName);
        res.status(200).json({success: true, error: false });
    } 

    catch (error)
    {
        // console.error('Error al recibir datos del archivo:', error.message);
    }
    
  }


export const getHistorial = (req, res) => {
    // Usar multer para manejar la subida
    // AQUI CONSULTO A LA BASE DE DATOS QUE ME TODAS LAS SOLICITUDES 

   res.status(200).json(dataTest)
};

export const getHistorialAdmin = (req, res) => {
    // Usar multer para manejar la subida
    // AQUI CONSULTO A LA BASE DE DATOS QUE ME TODAS LAS SOLICITUDES 

   res.status(200).json(dataTest)
  };

  export const getHistorial2 = (req, res) => {
    const datosNuevos = req.body
    // Usar multer para manejar la subida
    // AQUI CONSULTO A LA BASE DE DATOS QUE ME TODAS LAS SOLICITUDES 
    let newDatatest  = [datosNuevos, ...dataTest];
    dataTest=newDatatest
   res.status(200).json( newDatatest)
  };

  export const getManagerApproval = (req, res) =>{
    const {userName, textAreaValue, fileName, OPEUserName, OPEComment, fileId} = req.body

    console.log(userName);
    console.log(textAreaValue);
    console.log(fileName);
    console.log(OPEUserName);
    console.log(OPEComment);
    console.log(fileId);

    res.status(200).json({
        success: true,
        status: 200,
        Data: 'Datos recibidos'  // Aquí enviamos el objeto con los datos simulados
    });
  }


  

