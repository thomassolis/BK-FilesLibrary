import CustomError from "./CustomErros.js";

export class InternalServerError extends CustomError {
    constructor() {
        super(`Ocurrió un error inesperado al momento de autenticar el usuario. Por favor, inténtelo de nuevo.`, 500);
    }
}

