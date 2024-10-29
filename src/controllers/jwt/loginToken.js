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