import { pool } from "../../../config/db.js";
import sql from 'mssql';
import { resetearBaneo } from "./resetearBaneo.js";
import { verificarBaneo } from "../../Verificador/ValidacionesLogin/verificarBaneo.js";
import { verificarContraseña } from "../../Verificador/ValidacionesLogin/verificarContraseña.js";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialserror.js";
import CustomError from "../../errors/CustomErros.js";
import { InternalServerError } from "../../errors/serverErrors.js";

export const validacionUsuario = async (Email, PassWord) => {
    try {
        const result = await pool.request()
            .input("Email", sql.VarChar, Email)
            .query(`SELECT 
                        U.[id_usuario],
                        U.[nombre], 
                        U.[apellido], 
                        U.[email], 
                        U.[contraseña], 
                        U.[num_intentos],
                        U.[isBaned],
                        U.[fecha_baneo],
                        R.[Nombre] AS nombre_rol
                    FROM 
                        [BibliotecaMLC].[dbo].[Usuarios] U
                    LEFT JOIN 
                        [BibliotecaMLC].[dbo].[Roles] R
                    ON 
                        U.[id_rol] = R.[id_rol]
                    WHERE 
                    U.[email] = @Email`);

        const user = result.recordset[0];
        
        if (!user) {
            throw new InvalidCredentialsError
        }

        verificarBaneo(user)
        await verificarContraseña(PassWord, user.contraseña, user.id_usuario, user.num_intentos)


        if (user.isBaned) {
            await resetearBaneo(user.id_usuario);
        }

        
        return {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            nombre_rol: user.nombre_rol,
        };

    } 
    catch (error) {
        console.error('Error al autenticar usuario:', error.message);
        if (error instanceof CustomError) {
            throw error;
        }
        throw new InternalServerError
    }
};
