
import speakeasy from 'speakeasy';
import { crearUsuario } from '../../querys/users/db_usuarios.js';
import { generarHashContraseña } from '../../Verificador/ValidacionesLogin/verificarContrasena.js';
import { generateQRCode } from '../2FA/generataSecretQr.js';

export const controladorcreateNewUser = async(req, res) =>{    
    try{
        const {nombre, apellido, departamento, correo, password, rol} = req.body;

         // Generar el hash de la contraseña
         const contraseñaEncriptada = await generarHashContraseña(password);

         // Generar el secreto 2FA
        const secret = speakeasy.generateSecret().base32;

        //Insert dentro de la bd
        await crearUsuario(nombre, apellido, departamento, correo, contraseñaEncriptada, rol, secret);
        
        // Generar el QR con el nombre único basado en nombre y apellido
        await generateQRCode(nombre, apellido, secret);

        return res.status(200).json({ success: true, message: "Usuario creado satisfactoriamente" });

    }catch(e){
        console.log(e)
        return res.status(400).json({ success: false, message: "Ha ocurrido un error a la hora de crear el usuario" });
    }

    



    
    
}