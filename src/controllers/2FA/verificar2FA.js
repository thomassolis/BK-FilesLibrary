import  speakeasy from 'speakeasy';
const JWT_SECRET = 'por la causa!';
import jwt from 'jsonwebtoken';

export const verifyTOTP = (secret, token) => {
  const cleanSecret = String(secret ?? "").replace(/\s+/g, "");
  let cleanToken = String(token ?? "")
    .replace(/\s+/g, "")
    .replace(/-/g, "");

  // Por si el token llega como número y pierde ceros
  if (/^\d+$/.test(cleanToken) && cleanToken.length < 6) {
    cleanToken = cleanToken.padStart(6, "0");
  }

  // ✅ intenta base32 y luego ascii (o al revés)
  const okBase32 = speakeasy.totp.verify({
    secret: cleanSecret,
    encoding: "base32",
    token: cleanToken,
    step: 30,
    window: 1,
  });

  if (okBase32) return true;

  const okAscii = speakeasy.totp.verify({
    secret: cleanSecret,
    encoding: "ascii",
    token: cleanToken,
    step: 30,
    window: 1,
  });

  return okAscii;
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
