import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

export const generateQRCode = async (secret) => {
    const otpauth_url = speakeasy.otpauthURL({
        secret: secret,   // Pasar el secreto en ASCII aquí
        label: 'BibliotecaMLC', 
        issuer: 'BibliotecaMLC',
        encoding: 'ascii'
    });

    const filePath = './qrcode_bibliotecaMLC.png';
    await qrcode.toFile(filePath, otpauth_url);
    return filePath;
};
