import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

export const generateQRCode = async (secret) => {
    const otpauth_url = speakeasy.otpauthURL({ 
        secret: secret.base32, 
        label: 'BibliotecaMLC', 
        issuer: 'BibliotecaMLC' 
    });

    const qrCodeDataURL = await qrcode.toDataURL(otpauth_url);
    return qrCodeDataURL;
};
