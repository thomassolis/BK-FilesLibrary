import { pool } from "../../../config/db.js";
import { resetearBaneo } from "./resetearBaneo.js";
import { verificarBaneo } from "../../Verificador/ValidacionesLogin/verificarBaneo.js";
import { verificarContraseña } from "../../Verificador/ValidacionesLogin/verificarContrasena.js";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialserror.js";
import CustomError from "../../errors/CustomErros.js";
import { InternalServerError } from "../../errors/serverErrors.js";

export const validacionUsuario = async (Email, PassWord) => {
  try {
    const query = `
      SELECT
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.email,
        u."contraseña"      AS contraseña,
        u.num_intentos,
        u.isbaned           AS "isBaned",
        u.fecha_baneo,
        r.id_rol            AS nombre_rol
      FROM public.usuarios u
      LEFT JOIN public.roles r
        ON u.id_rol = r.id_rol
      WHERE u.email = $1
      LIMIT 1;
    `;

    const { rows } = await pool.query(query, [Email]);
    const user = rows[0];

    if (!user) {
      throw new InvalidCredentialsError();
    }

    verificarBaneo(user);

    // OJO: aquí tu "user.contraseña" funciona porque lo alias-eamos como "contraseña"
    await verificarContraseña(PassWord, user.contraseña, user.id_usuario, user.num_intentos);

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
  } catch (error) {
    console.error("Error al autenticar usuario:", error.message);
    if (error instanceof CustomError) throw error;
    throw new InternalServerError();
  }
};



export const ObtenerEmailPorIdUser = async (userID) => {
    try {
        const query = `
            SELECT email
            FROM public.usuarios
            WHERE id_usuario = $1
            LIMIT 1
        `;
        
        const { rows } = await pool.query(query, [userID]);

        if (rows.length === 0) {
            console.warn(`No se encontró un usuario con el ID ${userID}`);
            return null;
        }

        return rows[0].email;
    } catch (error) {
        console.error("Error al obtener el email del usuario:", error);
        throw new Error("Error al obtener el email del usuario");
    }
};
