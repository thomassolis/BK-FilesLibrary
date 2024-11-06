import { generarHashContraseña } from "../../Verificador/ValidacionesLogin/verificarContraseña.js"; // Asegúrate de ajustar la ruta

// Contraseña estática
const contraseñaEstatica = "Password123";

const generarYMostrarHash = async () => {
    try {
        const hash = await generarHashContraseña(contraseñaEstatica);
        console.log(`Contraseña: ${contraseñaEstatica}`);
        console.log(`Hash generado: ${hash}`);
    } catch (error) {
        console.error('Error al generar el hash de la contraseña:', error.message);
    }
};

// Llamar a la función para generar y mostrar el hash
generarYMostrarHash();
