import { controladorRutaLoginPost, controladorRutaAuthenticationPost, controladorRutaLogout} from '../controllers/Login/ctr_login.js';
import { Router } from 'express';
import verificarToken from '../controllers/jwt/loginToken.js'
import { is2FAuthenticate } from '../controllers/2FA/verificar2FA.js';
const router = Router();

router.post('/login', controladorRutaLoginPost);
router.post('/authentication/2fa',  verificarToken, controladorRutaAuthenticationPost);
router.post('/loutgout',verificarToken, is2FAuthenticate, controladorRutaLogout);

export { router as authroute };
