import CustomError from "./CustomErros.js";

export class NotFoundError extends CustomError {
    constructor(resource) {
        super(`${resource} no encontrado.`, 404);
    }
}
