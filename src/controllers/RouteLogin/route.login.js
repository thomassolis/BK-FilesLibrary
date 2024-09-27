import CustomError from "../../errors/CustomErros.js";
import { UserBannedError } from "../../errors/UserBannedError.js";
import { validacionUsuario } from "../../querys/Login/login.js";
import { generateJWT } from "../jwt/loginToken.js";

export const controladorRutaLoginPost = async (req, res) => {
    console.log(req.body)
    const { Email, Password } = req.body;
    try
    {
<<<<<<< HEAD
        const userData = await validacionUsuario(Email, Password);
=======
        const userData = await validacionUsuario(email, password);
        const token = await generateJWT(userData)
        res.cookie('BibliotecaMLC', token, { httpOnly: true, secure: true, sameSite: 'strict' });
>>>>>>> dda1ac71f6a25d2468cf044b567bb05a874b3edb
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