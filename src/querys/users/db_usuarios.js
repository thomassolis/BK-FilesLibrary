import { pool } from "../../../config/db.js"
import sql from 'mssql';
import { generateQRCode } from "../../controllers/2FA/generataSecretQr.js";

//CREACIÓN DE USUARIO EN LA BD
export const crearUsuario = async(nombre, apellido, departamento, correo, contraseñaEncriptada, rol, secret) => {
    // Iniciar transacción
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // Ejecutar la consulta de inserción
        const result = await transaction.request()
            .input("nombre", sql.VarChar, nombre)
            .input("apellido", sql.VarChar, apellido)
            .input("email", sql.VarChar, correo)
            .input("contraseña", sql.VarChar, contraseñaEncriptada) // Usa la contraseña encriptada          
            .input("id_rol", sql.VarChar, rol)
            .input("secret", sql.VarChar, secret)  // Almacenar el secreto
            .input("departamento", sql.VarChar, departamento)  // Almacenar el secreto
            .query(`
                INSERT INTO [BibliotecaMLC].[dbo].[Usuarios] 
                ([nombre], [apellido], [email], [contraseña], [id_rol], [secret], [departamento])
                VALUES 
                (@nombre, @apellido, @email, @contraseña, @id_rol, @secret, @departamento)
            `);

        // Generar el QR con el nombre único basado en nombre y apellido
        const generated = await generateQRCode(nombre, apellido, secret);

        if (!generated) {
            // En caso de error se revierte el insert
            await transaction.rollback();
            throw new Error(`Error al general el QR del usuario ${nombre} ${apellido}`);            
        }

        // Si todo está bien, se realiza un commit y se hace el insert
        await transaction.commit();
        
        return result.rowsAffected[0];
    } catch (error) {
        // En caso de error se revierte el insert
        await transaction.rollback();
        console.error('Error al crear el usuario, ', error.message);
        throw new Error('Error al crear el usuario');
    }
}

//VERIFICAR SI EL SECRETO CONCUERDA CON EL USUARIO POR MEDIO DEL CORREO ELECTRÓNICO
export const secretVerification = async(userEmail) =>{
    try{

        await pool.connect();
        const result = await pool.request()
            .input("email", sql.VarChar, userEmail)
            .query(`
                SELECT secret FROM [BibliotecaMLC].[dbo].[Usuarios] WHERE email = @email
            `);

        return result.recordset[0].secret;

    }catch(e){
        console.log('error en secretVerification',e)
        throw new Error('Error al obtener el secreto');
    }
}


//VALIDA QUE EL CORREO NO ESTE REGISTRADO EN LA BASE DE DATOS
export const validarCorreoBD = async (email) => {
    console.log(email)
    try {
        const result = await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`
                    SELECT email FROM [BibliotecaMLC].[dbo].[Usuarios] WHERE email = @Email
                `);

        return result.recordset[0];
    } catch (error) {
        console.error('Error al verificar el email, ', error.message);
        throw new Error('Error al validar el correo');
    }
}