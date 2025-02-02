import { pool } from "../../../config/db.js"
import sql from 'mssql';

//CREACIÓN DE USUARIO EN LA BD
export const crearUsuario = async(nombre, apellido, departamento, correo, contraseñaEncriptada, rol, secret) => {
// Ejecutar la consulta de inserción
        const result = await pool.request()
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

            console.log("Usuario creado exitosamente con contraseña encriptada y secreto 2FA");

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

        return result

    }catch(e){
        console.log('error en secretVerification',e)
    }
}