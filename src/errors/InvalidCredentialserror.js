import CustomError from "./CustomErros.js";

export class InvalidCredentialsError extends CustomError {
    constructor() {
        super('Email o Contraseña Incorrectas', 400);
    }
}
