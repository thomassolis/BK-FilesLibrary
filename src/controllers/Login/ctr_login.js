import CustomError from "../../errors/CustomErros.js";
import { UserBannedError } from "../../errors/UserBannedError.js";
import { validacionUsuario } from "../../querys/Login/login.js";
import { generateJWT } from "../jwt/loginToken.js";
import { verifyTOTP } from "../2FA/verificar2FA.js";
import { pool } from "../../../config/db.js";
import  sql from "mssql";
import { secretVerification } from "../../querys/users/db_usuarios.js";
export const controladorRutaLoginPost = async (req, res) => {    
    const { Email, Password } = req.body;
    console.log('entre al login')
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
    const { authentication, userEmail  } = req.body;  // Asegúrate de pasar el email para buscar el secreto del usuario

    try {
        const secretByUser = await secretVerification(userEmail); // Obtener el secreto desde la base de datos

        if (!secretByUser) {
            console.error('Error al obtener el secretVerification');
            return res.status(404).json({ success: false, message: "Error al obtener la verificación" });
        } 
        const isCodeValid = verifyTOTP(secretByUser, authentication);  // Verificar el código con el secreto del usuario

        if (isCodeValid) {
            const token = await generateJWT(req.user, true);
            res.cookie('BibliotecaMLC', token, { httpOnly: true, secure: true, sameSite: 'strict' });
            return res.status(200).json({ success: true, message: "Código 2FA válido", data: req.user });
        } else {
            return res.status(400).json({ success: false, message: "Código 2FA inválido" });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Código 2FA inválido por error" });
    }
};


export const controladorRutaLogout = (req, res) => {
    try {
        res.clearCookie('BibliotecaMLC', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({ success: true, message: 'Logout exitoso', error: false });
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
        res.status(500).json({ error: true, success: false, message: "Ha ocurrido un error inesperado al cerrar sesión" });
    }
};
