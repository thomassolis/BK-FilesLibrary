
import bcrypt from 'bcryptjs';
import { incrementarIntentosFallidos } from '../../querys/Login/intentosFallidos.js';
import { InvalidCredentialsError } from '../../errors/InvalidCredentialserror.js';

export const verificarContraseña = async (password, hash, usuario, intentos) => {
    const passwordMatch = await bcrypt.compare(password, hash);
    if (!passwordMatch) {
        await incrementarIntentosFallidos(usuario, intentos)
        throw new InvalidCredentialsError
    }
};


export const generarHashContraseña = async (password) => {
    const saltRounds = 10; // Número de rondas de sal para hacer más seguro el hash
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error al generar el hash de la contraseña');
    }
};

