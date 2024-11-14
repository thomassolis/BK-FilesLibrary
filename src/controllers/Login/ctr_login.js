import CustomError from "../../errors/CustomErros.js";
import { UserBannedError } from "../../errors/UserBannedError.js";
import { validacionUsuario } from "../../querys/Login/login.js";
import { generateJWT } from "../jwt/loginToken.js";
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import { verifyTOTP } from "../2FA/verificar2FA.js";


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
    const { authentication } = req.body;
    try {
        const secretByUser = "?>hBo2[wU/ud59RMweyK";
        const isCodeValid = verifyTOTP(secretByUser, authentication);
        console.log(isCodeValid)
        if (isCodeValid)
        {
            const token = await generateJWT(req.user, true);
            res.cookie('BibliotecaMLC', token, { httpOnly: true, secure: true, sameSite: 'strict' });
            return res.status(200).json({ success: true, message: "Código 2FA válido", data:req.user});
        }
        else
        {
            return res.status(401).json({ success: false, message: "Código 2FA inválido" });
        }
    } 
    catch (error) {
        console.log(error)
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
