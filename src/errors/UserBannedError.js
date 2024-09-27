import CustomError from "./CustomErros.js";

export class UserBannedError extends CustomError {
    constructor(seconds) {
        const minutes =Math.floor(seconds / 60);  // Convierte minutos a segundos
        super(`Límite de intentos alcanzado. Puede reintentar después de ${minutes} minutos.`, 429);
        this.segundosBan = { seconds };  // Almacena los segundos en lugar de minutos
        this.isBan =  true ;  // Almacena los segundos en lugar de minutos
    }
}