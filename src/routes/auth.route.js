import { Router } from 'express';
import { controladorRutaLoginPost } from '../controllers/RouteLogin/route.login.js';

const router = Router();

router.post('/login', controladorRutaLoginPost);

export { router as authroute };
