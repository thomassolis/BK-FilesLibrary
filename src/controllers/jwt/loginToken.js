import jwt from 'jsonwebtoken';

const JWT_SECRET = 'por la causa!';

export const generateJWT = async (userData, is2FAAuthenticated = false) => {
    try {
        const payload = {
            id_usuario: userData.id_usuario,
            nombre: userData.nombre,
            nombre_rol: userData.nombre_rol,
            is2FAAuthenticated:is2FAAuthenticated
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h', audience: 'BiblioteMLC'});
        return token;
    } 
    catch (error)
    {
        console.error('Error al generar el token JWT:', error);
        throw new Error('No se pudo generar el token');
    }
};

function verificarToken(req, res, next) {
    const token  = req.cookies.BibliotecaMLC
    if (!token) {
        req.user = {};
        return res.status(403).send({ auth: false, message: 'Acceso inválido, favor iniciar sesión nuevamente' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err);
            req.user = {};
            return res.status(401).send({ auth: false, message: 'Acceso inválido, favor iniciar sesión nuevamente' });            
        }
        req.user = decoded;
        next();
    });
}

export default verificarToken;