import { Router } from 'express';
import { controladorRutaLoginPost } from '../controllers/RouteLogin/route.login.js';

const router = Router();

router.get('/login', controladorRutaLoginPost);

export { router as authroute };
