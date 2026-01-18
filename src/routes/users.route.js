import { Router } from 'express';
import verificarToken from '../controllers/jwt/loginToken.js'
import { is2FAuthenticate } from '../controllers/2FA/verificar2FA.js';
import { controladorcreateNewUser } from '../controllers/Users/ctr_users.js';
const router = Router();

router.post('/create/newUser', /*verificarToken, is2FAuthenticate,*/ controladorcreateNewUser)

export { router as usersRoutes };