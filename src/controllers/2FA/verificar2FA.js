import  speakeasy from 'speakeasy';
const JWT_SECRET = 'por la causa!';
import jwt from 'jsonwebtoken';

export const verifyTOTP = (secret, token) => {
    const verified = speakeasy.totp.verify({
        secret: secret,      // Secreto en formato ASCII o base32
        encoding: "ascii",   // Cambia a 'base32' si el secreto está en ese formato
        token: token         // Código TOTP de 6 dígitos ingresado por el usuario
    });
    return verified;
};

export const is2FAuthenticate = (req, res, next) => {
    const token = req.cookies['BibliotecaMLC'];
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.is2FAAuthenticated) {
            req.user = decoded;
            return next();
        } else {
            return res.status(403).json({ success: false, message: "Se requiere autenticación de doble factor" });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token inválido" });
    }
};
