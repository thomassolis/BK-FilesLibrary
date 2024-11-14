import speakeasy from 'speakeasy';

export const generateSecretSpeakeasy = async () => {
    const secret = speakeasy.generateSecret(
    {
        name: "BibliotecaMLC",
        length: 20,
        encoding: 'ascii' 
    });
    return secret
};
