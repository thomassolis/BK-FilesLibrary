import jwt from 'jsonwebtoken';


const JWT_SECRET = 'por la causa!';


export const generateJWT = async (userData) => {
    const payload = {
        id_usuario: userData.id_usuario,
        nombre: userData.nombre,
        email: userData.email,
        nombre_rol: userData.nombre_rol,
    };

    const token = jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: '1h',  // El token expira en 1 hora
            audience: 'BiblioteMLC',  // Validación de audiencia
        }
    );

    return token;
};