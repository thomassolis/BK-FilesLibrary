

export const construirFechaUTC5 = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getUTCHours() - 5).padStart(2, '0'); // Ajustar a UTC-5
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');
    const milliseconds = String(fecha.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};
 