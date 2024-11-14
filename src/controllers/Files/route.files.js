import sql from 'mssql';
import { connectDB, pool } from '../../../config/db.js';





export const getManagerApproval = async (req, res) => {    
    const { userName, textAreaValue, fileName, OPEUserName, OPEComment, fileId, approvedGER, folder, approvedADM } = req.body;
    try {
        // Usa el objeto pool ya conectado para realizar la consulta
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


export const getHistorial = async(req, res) => {
    // AQUI CONSULTO A LA BASE DE DATOS QUE ME DE TODAS LAS SOLICITUDES 
    try{
        
        if(req.user.nombre_rol === 'GERENCIA'){
            const result = await pool.request()
            
                .query(
                    `
                        SELECT
                            Archivos.nombre as 'Nombre_del_archivo',
                            Usuarios.nombre as 'Nombre_de_solicitante',
                            Solicitudes.motivo_solicitud AS 'motivo_de_la_solicitud'
                        FROM Solicitudes
                            INNER JOIN
                                Archivos on Archivos.id_archivo = Solicitudes.id_archivo
                            INNER JOIN
                                Usuarios on Usuarios.id_usuario = Solicitudes.id_solicitante
                    `
                );
                //Obtener los datos de la consulta
                const data = result.recordset;

                //Enviar los datos al front
                res.status(200).json(data)
    
        } else if(req.user.nombre_rol === 'ADMINISTRADOR'){
            const result = await pool.request()

                .query(
                    `
                        SELECT
                            Archivos.nombre AS 'Nombre_del_archivo',
                            Solicitante.nombre AS 'Nombre_de_solicitante',
                            Roles.Nombre AS 'Rol_De_Solicitante', 
                            Solicitudes.motivo_solicitud AS 'motivo_de_la_solicitud',
                            Gerente.nombre AS 'Gerente_que_aprobo_solicitud',
                            Solicitudes.comentarioGerente AS 'Comentario_gerente'
                        FROM 
                            Solicitudes
                            INNER JOIN Archivos ON Archivos.id_archivo = Solicitudes.id_archivo
                            INNER JOIN Usuarios AS Solicitante ON Solicitante.id_usuario = Solicitudes.id_solicitante
                            INNER JOIN Usuarios AS Gerente ON Gerente.id_usuario = Solicitudes.id_gerente
                            INNER JOIN Roles ON Roles.id_rol = Solicitante.id_rol
                        WHERE
                            Solicitudes.aprobacionGerencia = 1
                    `
                )
            //Obtener los datos de la consulta
            const data = result.recordset;

            //Enviar los datos al front
            res.status(200).json(data)


        }
        
       

        
    }catch(error){
        console.log('Error al consultar las solicitudes: ', error.message);
        res.status(500).json({
            succes: false,
            message: 'Error al consultar las solicitudes',
            error: error.message
        })
    }


 
};

export const oficialHistory = async (req, res) => {
    const result = await pool.request()
        .query(
            `
               SELECT
                    Archivos.nombre AS 'Nombre_del_archivo',
                    Solicitante.nombre AS 'Nombre_de_solicitante',
                    Roles.Nombre AS 'Rol_De_Solicitante', 
                    Solicitudes.motivo_solicitud AS 'motivo_de_la_solicitud',
                    Solicitudes.fecha_solicitud AS 'fecha_solicitud',
                    Gerente.nombre AS 'Gerente_que_aprobo_solicitud',
                    Solicitudes.aprobacionGerencia AS 'aprobacion_gerencia',
                    Solicitudes.comentarioGerente AS 'Comentario_gerente',
                    Solicitudes.fecha_aprobacion_gerencial AS 'fecha_aprobacion_gerente',
                    Administrador.nombre AS 'nombre_administrador',
                    Solicitudes.aprobacionAdministracion AS 'aprobacion_administracion',
                    Solicitudes.comentarioAdministrador AS 'Comentario_administracion'
                FROM 
                    Solicitudes
                    INNER JOIN Archivos ON Archivos.id_archivo = Solicitudes.id_archivo
                    INNER JOIN Usuarios AS Solicitante ON Solicitante.id_usuario = Solicitudes.id_solicitante
                    INNER JOIN Usuarios AS Gerente ON Gerente.id_usuario = Solicitudes.id_gerente
                    INNER JOIN Usuarios AS Administrador ON Administrador.id_usuario = Solicitudes.id_gerente
                    INNER JOIN Roles ON Roles.id_rol = Solicitante.id_rol 
            `
        )
         //Obtener los datos de la consulta
         const data = result.recordset;

         //Enviar los datos al front
         res.status(200).json(data)
}