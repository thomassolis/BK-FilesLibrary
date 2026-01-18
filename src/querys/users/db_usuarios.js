import { pool } from "../../../config/db.js"
import { generateQRCode } from "../../controllers/2FA/generataSecretQr.js";

//CREACIÓN DE USUARIO EN LA BD
export const crearUsuario = async (
  nombre,
  apellido,
  departamento,
  correo,
  contraseñaEncriptada,
  rol,
  secret
) => {
  // Iniciar transacción (PostgreSQL)
  const transaction = await pool.connect();

  try {
    await transaction.query("BEGIN");

    // Insert (Postgres usa $1..$n en vez de @params)
    const result = await transaction.query(
      `
      INSERT INTO public.usuarios
        (nombre, apellido, email, "contraseña", id_rol, secret, departamento)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_usuario;
      `,
      [nombre, apellido, correo, contraseñaEncriptada, rol, secret, departamento]
    );

    // Generar el QR con el nombre único basado en nombre y apellido
    const generated = await generateQRCode(nombre, apellido, secret);

    if (!generated) {
      await transaction.query("ROLLBACK");
      throw new Error(`Error al generar el QR del usuario ${nombre} ${apellido}`);
    }

    await transaction.query("COMMIT");

    // Similar a rowsAffected[0] en mssql: devolvemos 1 si insertó
    return 1;
  } catch (error) {
    try {
      await transaction.query("ROLLBACK");
    } catch (_) {}

    console.error("Error al crear el usuario, ", error.message);
    throw new Error("Error al crear el usuario");
  } finally {
    transaction.release();
  }
};


//VERIFICAR SI EL SECRETO CONCUERDA CON EL USUARIO POR MEDIO DEL CORREO ELECTRÓNICO
export const secretVerification = async (userEmail) => {
  try {
    const result = await pool.query(
      `SELECT secret
       FROM public.usuarios
       WHERE email = $1
       LIMIT 1;`,
      [userEmail]
    );

    return result.rows?.[0]?.secret ?? null;
  } catch (e) {
    console.log("error en secretVerification", e);
    throw new Error("Error al obtener el secreto");
  }
};



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