
import { pool } from "../../../config/db.js";
import  sql from "mssql";

export const db_Obtener_Archivos_Permitidos_Por_Usuario = async (rol) => {
    try {
        await pool.connect();
        const query = `SELECT 
                permiso.[verArchivo],
                permiso.[enviarSolicitud],
                permiso.[id_archivo],
                permiso.[id_rol],
                archivo.[nombre],
                archivo.[driveID]
            FROM 
                [BibliotecaMLC].[dbo].[Permisos_archivo] AS permiso
            JOIN 
                [BibliotecaMLC].[dbo].[Archivos] AS archivo
            ON 
                permiso.[id_archivo] = archivo.[id_archivo]
            WHERE 
                permiso.[id_rol] = @id_rol;`;

        const result = await pool.request()
            .input('id_rol', sql.VarChar, rol)
            .query(query);

       return result.recordset
    } catch (error) {
        console.error('Error al obtener archivos permitidos:', error.message);
       return {}
    }
};

export const db_Insertar_Solicitud_Nueva = async (data) => {    
    const { userName, textAreaValue, fileName, OPEUserName, OPEComment, fileId, approvedGER, folder, approvedADM } = req.body;

    try {
        const idUsuario = req.user.id_usuario;  

        if(req.user.nombre_rol === 'OPERADOR'){
            console.log('fileId: ', fileId);
    
            const result = await pool.request()
            .input('idUsuario', sql.Int, idUsuario)
            .input('TextAreaValue', sql.NVarChar, textAreaValue)
            .input('FileId', sql.Int, fileId)
            .query(`
                INSERT INTO Solicitudes (id_solicitante, id_archivo, motivo_solicitud, fecha_aprobacion_administrativa, fecha_aprobacion_gerencial)
                VALUES (@idUsuario, 5, @textAreaValue, null, null)
            `);


            console.log(req.body)

        }else if(req.user.nombre_rol === 'GERENCIA' && approvedGER == undefined){
     
            const result = await pool.request()    
            .input('idUsuario', sql.Int, idUsuario)        
            .input('TextAreaValue', sql.NVarChar, textAreaValue)
            .input('FileId', sql.Int, fileId)
            .input('approvedGER', sql.Int, approvedGER)
            .query(`
                INSERT INTO Solicitudes (id_gerente, comentarioGerente, aprobacionGerencia, fecha_aprobacion_gerencial, fecha_solicitud, id_archivo, id_solicitante, motivo_solicitud)
                    VALUES
                        (@idUsuario, @TextAreaValue, 1, GETDATE(), GETDATE(), 5, @idUsuario, @TextAreaValue)                    
            `);

            console.log(req.body)
        }else if(req.user.nombre_rol === 'GERENCIA' && approvedGER == true){
     
            const result = await pool.request()    
            .input('idUsuario', sql.Int, idUsuario)        
            .input('TextAreaValue', sql.NVarChar, textAreaValue)
            .input('FileId', sql.Int, fileId)
            .input('approvedGER', sql.Int, approvedGER)
            .query(`
                UPDATE Solicitudes 
                    SET 
                        id_gerente =  @idUsuario,
                        comentarioGerente = @TextAreaValue,
                        aprobacionGerencia = 1,
                        fecha_aprobacion_gerencial = GETDATE()
                    WHERE
                        id_archivo = 5
            `);

            console.log(req.body)
        }else if(req.user.nombre_rol === 'GERENCIA' && approvedGER == false){
           
            const result = await pool.request()    
            .input('idUsuario', sql.Int, idUsuario)        
            .input('UserName', sql.NVarChar, userName)
            .input('TextAreaValue', sql.NVarChar, textAreaValue)
            .input('FileName', sql.NVarChar, fileName)
            .input('OPEUserName', sql.NVarChar, OPEUserName)
            .input('OPEComment', sql.NVarChar, OPEComment)
            .input('FileId', sql.Int, fileId)
            .input('approvedGER', sql.Int, approvedGER)
            .query(`
                UPDATE Solicitudes 
                    SET 
                        id_gerente =  @idUsuario,
                        comentarioGerente = @TextAreaValue,
                        aprobacionGerencia = 0,
                        fecha_aprobacion_gerencial = GETDATE()
                    WHERE
                        id_archivo = 5
            `);

            console.log(req.body)
        }else if(req.user.nombre_rol === 'ADMINISTRADOR' && approvedADM== true){            
            const result = await pool.request()    
            .input('idUsuario', sql.Int, idUsuario)        
            .input('TextAreaValue', sql.NVarChar, textAreaValue)
            .input('FileId', sql.Int, fileId)
            .input('approvedGER', sql.Int, approvedGER)
            .query(`
                UPDATE Solicitudes 
                    SET 
                        id_administrador =  @idUsuario,
                        comentarioAdministrador = @TextAreaValue,
                        aprobacionAdministracion = 1,
                        fecha_aprobacion_administrativa = GETDATE()
                    WHERE
                        id_archivo = 5
            `);

            console.log(req.body)
        }else if(req.user.nombre_rol === 'ADMINISTRADOR' && approvedADM== false){            
            const result = await pool.request()    
            .input('idUsuario', sql.Int, idUsuario)        
            .input('TextAreaValue', sql.NVarChar, textAreaValue)
            .input('FileId', sql.Int, fileId)
            .input('approvedGER', sql.Int, approvedGER)
            .query(`
                UPDATE Solicitudes 
                    SET 
                        id_administrador =  @idUsuario,
                        comentarioAdministrador = @TextAreaValue,
                        aprobacionAdministracion = 0,
                        fecha_aprobacion_administrativa = GETDATE()
                    WHERE
                        id_archivo = 5
            `);

            console.log(req.body)
        }

        
        res.status(200).json({
            success: true,
            status: 200,
            data: 'Datos insertados en la base de datos'
        });
    } catch (error) {
        console.error('Error al insertar datos en la base de datos:', error.message);
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Error al insertar datos en la base de datos'
        });
    }
};
