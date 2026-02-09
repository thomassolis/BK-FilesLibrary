import { Router } from 'express';
import verificarToken from '../controllers/jwt/loginToken.js'
import { is2FAuthenticate } from '../controllers/2FA/verificar2FA.js';

import { ctr_AgregarNuevaSolicitud, ctr_AprovacionesAdministradorSolicitudes, ctr_AprovacionesGerenteSolicitudes, ctr_ObtenerHistorialAdministrador, ctr_VerSolicitudesPendientesAdministrador, ctr_VerSolicitudesPendientesGerencia } from '../controllers/Solicitudes/Ctr_Solicitudes.js';

const router = Router();

// agrega una nueva, tanto como operador como Gerente
router.post('/agregar/nueva', verificarToken, /*is2FAuthenticate,*/ ctr_AgregarNuevaSolicitud); 

//permite ver el Historial de solicitudes pendientes del Gerente
router.get('/ver/pendientes/gerencia', verificarToken, /*is2FAuthenticate,*/ ctr_VerSolicitudesPendientesGerencia); 

// maneja las aprovaciones de solicitudes que llegan a los gerentes
router.post('/aprobacion/solicitud/gerente', verificarToken, /*is2FAuthenticate,*/ ctr_AprovacionesGerenteSolicitudes)


/****************************          ADMINISTRADOR               ************************************************** */
router.get('/ver/pendientes/administrador', verificarToken, /*is2FAuthenticate,*/ ctr_VerSolicitudesPendientesAdministrador); 

router.post('/aprobacion/solicitud/administrador', verificarToken, /*is2FAuthenticate,*/ ctr_AprovacionesAdministradorSolicitudes)

router.get('/ver/historial/solicitudes/administrador', verificarToken, /*is2FAuthenticate,*/ ctr_ObtenerHistorialAdministrador)


export { router as solicitudesRoutes };