import jwt from 'jsonwebtoken';
import express from 'express';

const JWT_SECRET = 'por la causa!';

export const generateJWT = async (userData) => {
    const payload = {
        id_usuario: userData.id_usuario,
        nombre: userData.nombre,
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


function verificarToken(req, res, next) {
    const token  = req.cookies.BibliotecaMLC
    if (!token) {
        req.user = {};
        return res.status(403).send({ auth: false, message: 'Acceso inválido, favor iniciar sesión nuevamente' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err); // Imprimir el mensaje de error
            req.user = {};
            return res.status(401).send({ auth: false, message: 'Acceso inválido, favor iniciar sesión nuevamente' });            
        }
        req.user = decoded;
        next();
    });
}

export default verificarToken;

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err)
            {
                return res.sendStatus(403).json({message:"Token Invalido o No proporcionado"});
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401).json({message:"Token Invalido o No proporcionado"});
    }
};