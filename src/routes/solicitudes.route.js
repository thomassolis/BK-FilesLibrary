import { Router } from 'express';
import verificarToken from '../controllers/jwt/loginToken.js'
import { is2FAuthenticate } from '../controllers/2FA/verificar2FA.js';

import { ctr_AgregarNuevaSolicitud } from '../controllers/Solicitudes/Ctr_Solicitudes.js';

const router = Router();

router.post('/agregar/nueva', verificarToken, is2FAuthenticate, ctr_AgregarNuevaSolicitud); 



export { router as solicitudesRoutes };