
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
