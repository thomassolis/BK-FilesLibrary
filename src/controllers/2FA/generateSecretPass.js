import speakeasy from 'speakeasy';

export const generateSecretPass = () => {
    const secret = speakeasy.generateSecret({
        name: "BibliotecaMLC",
        length: 20
    });

    return secret;
}