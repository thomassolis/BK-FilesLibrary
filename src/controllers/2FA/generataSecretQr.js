import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

export const generateQRCode = async (nombre, apellido, secret) => {
    // Generar un secret si no se pasa uno como parámetro
    if (!secret) {
        secret = speakeasy.generateSecret().base32;
    }

    // Crear el nombre del archivo dinámicamente
    const nombreArchivoQR = `${nombre}_${apellido}_qr.png`;

    const otpauth_url = speakeasy.otpauthURL({
        secret: secret,
        label: 'BibliotecaMLC',
        issuer: 'BibliotecaMLC',
        encoding: 'ascii'
    });

    // Guardar el QR con un nombre único
    const filePath = `./qrcodes/${nombreArchivoQR}`;
    await qrcode.toFile(filePath, otpauth_url);

    return filePath;
};

