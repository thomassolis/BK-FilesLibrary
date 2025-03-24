
export const verificarBaneo2FA = async (user) => {
    if (user.isBaned_2fa && user.fecha_baneo_2fa) {
        const tiempoTranscurrido = Date.now() - new Date(user.fecha_baneo_2fa).getTime();
        if (tiempoTranscurrido < BAN_DURATION_2FA) {
            throw new Error("Usuario baneado temporalmente de la 2FA");
        } else {
            await resetearBaneo2FA(user.id_usuario);
        }
    }
};

const resetearBaneo2FA = async (userId) => {
    try {
        await pool.request()
        .input("userId", sql.Int, userId)
        .query(`UPDATE [BibliotecaMLC].[dbo].[Usuarios]
                SET 
                    num_intentos_2fa = 0,
                    isBaned_2fa = 0,
                    fecha_baneo_2fa = NULL
                WHERE id_usuario = @userId`);
    } catch (error) {
        console.error(`Error al resetaer le baneo 2FA, ${error.message}`);
        throw new Error('Error al resetaer le baneo 2FA');        
    }    
};