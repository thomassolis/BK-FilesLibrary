import { Router } from 'express';
import verificarToken from '../controllers/jwt/loginToken.js'
import { is2FAuthenticate } from '../controllers/2FA/verificar2FA.js';

import { ctr_AgregarNuevaSolicitud, ctr_VerSolicitudesPendientesGerencia } from '../controllers/Solicitudes/Ctr_Solicitudes.js';

const router = Router();

router.post('/agregar/nueva', verificarToken, is2FAuthenticate, ctr_AgregarNuevaSolicitud); 

router.get('/ver/pendientes/gerencia', verificarToken, is2FAuthenticate, ctr_VerSolicitudesPendientesGerencia); 



export { router as solicitudesRoutes };