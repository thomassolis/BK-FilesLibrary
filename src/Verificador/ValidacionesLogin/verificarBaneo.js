import { UserBannedError } from "../../errors/UserBannedError.js";


export const verificarBaneo = (user) => {
    const ahora = new Date();
    const ahoraUTC5 = new Date(ahora.getTime() - (5 * 60 * 60 * 1000));
    const fechaBaneo = new Date(user.fecha_baneo);
    const TIEMPO_BANEO_MINUTOS = 15;

    const tiempoDesban = new Date(fechaBaneo);
    tiempoDesban.setMinutes(tiempoDesban.getMinutes() + TIEMPO_BANEO_MINUTOS);

    if (user.isBaned && ahoraUTC5 < tiempoDesban) {
        const diferenciaEnMilisegundos = tiempoDesban - ahoraUTC5;
        const minutosRestantes = Math.ceil(diferenciaEnMilisegundos / (1000 * 60));
        throw new UserBannedError(minutosRestantes);
    }
};