import CustomError from "../../errors/CustomErros.js";
import { validacionUsuario } from "../../querys/Login/login.js";

export const controladorRutaLoginPost = async (req, res) => {
    console.log(req.body)
    const { Email, Password } = req.body;
    try
    {
        const userData = await validacionUsuario(Email, Password);
        res.status(200).json({Data: userData, success: true });
    } 

    catch (error)
    {
        console.error('Error al iniciar sesión:', error.message);
        if (error instanceof CustomError)
        {
            res.status(error.statusCode).json({
                error: true,
                message: error.message
            });
        }
        else
        {
            res.status(500).json({
                error: true,
                message: "Ha ocurrido un error inesperado"
            });
        }
    }
};