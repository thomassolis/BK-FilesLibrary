import { pool } from "../../../config/db.js";
import sql from 'mssql';
import { generarHashContraseña } from "../../Verificador/ValidacionesLogin/verificarContraseña.js";

const crearUsuario = async () => {
    try {
        // Datos del nuevo usuario
        const nombre = "Jaime";
        const apellido = "Doe";
        const email = "gerente@gmail.com";
        const contraseña = "mlc"; // Contraseña en texto plano
        const numIntentos = 0;
        const isBaned = false;
        const fechaBaneo = null;
        const idRol = 'GER'; // Cambia esto al ID de rol adecuado en tu base de datos

        // Generar el hash de la contraseña
        const contraseñaEncriptada = await generarHashContraseña(contraseña);

        // Ejecutar la consulta de inserción
        const result = await pool.request()
            .input("nombre", sql.VarChar, nombre)
            .input("apellido", sql.VarChar, apellido)
            .input("email", sql.VarChar, email)
            .input("contraseña", sql.VarChar, contraseñaEncriptada) // Usa la contraseña encriptada
            .input("num_intentos", sql.Int, numIntentos)
            .input("isBaned", sql.Bit, isBaned)            
            .input("id_rol", sql.VarChar, idRol)
            .query(`
                INSERT INTO [BibliotecaMLC].[dbo].[Usuarios] 
                ([nombre], [apellido], [email], [contraseña], [num_intentos], [isBaned], [id_rol])
                VALUES 
                (@nombre, @apellido, @email, @contraseña, @num_intentos, @isBaned, @id_rol)
            `);

        console.log("Usuario creado exitosamente con contraseña encriptada");
    } catch (error) {
        console.error("Error al crear el usuario:", error.message);
        throw error;
    }
};

export default crearUsuario;