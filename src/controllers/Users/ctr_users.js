
import speakeasy from 'speakeasy';
import { crearUsuario, validarCorreoBD } from '../../querys/users/db_usuarios.js';
import { generarHashContraseña } from '../../Verificador/ValidacionesLogin/verificarContrasena.js';

export const controladorcreateNewUser = async(req, res) =>{    
    try{
        const {nombre, apellido, departamento, correo, password, rol} = req.body;

        // const existEmail = await validarCorreoBD(correo);

        // //valida que el correo no este registrado en la BD
        // if (existEmail) {
        //     return res.json({ success: false, message: 'El correo ingresado se encuentra registrado' })
        // }

         // Generar el hash de la contraseña
         const contraseñaEncriptada = await generarHashContraseña(password);

         // Generar el secreto 2FA
        const secret = speakeasy.generateSecret().base32;

        //Insert dentro de la bd
        const createdUser = await crearUsuario(nombre, apellido, departamento, correo, contraseñaEncriptada, rol, secret);

        if (!createdUser) {
            return res.status(401).json({ success: false, message: `No se pudo crear el usuario ${nombre} ${apellido}` });
        }

        return res.status(200).json({ success: true, message: "Usuario creado satisfactoriamente" });

    }catch(e){
        console.log(e)
        return res.status(400).json({ success: false, message: "Ha ocurrido un error a la hora de crear el usuario" });
    }
    
}