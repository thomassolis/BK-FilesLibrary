import { Router } from 'express';
import { controladorRutaLoginPost } from '../controllers/RouteLogin/route.login.js';
import { authenticateJWT } from '../controllers/jwt/loginToken.js';
const router = Router();

router.get('/login', controladorRutaLoginPost);

router.get('')

export { router as authroute };
