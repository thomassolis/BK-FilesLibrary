import CustomError from "./CustomErros.js";

export class UserBannedError extends CustomError {
    constructor(minutes) {
        super(`Límite de intentos alcanzado. Puede reintentar después de ${minutes} minutos.`, 429);
    }
}

