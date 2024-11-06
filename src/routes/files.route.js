import { Router } from 'express';
import { getManagerApproval } from '../controllers/RouteFiles/route.files.js';
import verificarToken from '../controllers/jwt/loginToken.js'
import { getHistorial, oficialHistory } from '../controllers/RouteFiles/route.files.js';

const router = Router();

router.post ('/post/managerApproval', verificarToken, getManagerApproval); // RUTA EN DONDE EL OPERADOR ENVÍA LOS DATOS DEL ARCHIVO QUE QUIERE AL GERENTE

router.get('/get/historial', verificarToken,getHistorial);// RUTA EN DONDE EL GERENTE PODRÁ VER LAS SOLICITUDES EN EL PEQUEÑO HISTORIAL

router.get('/get/oficialHistory', oficialHistory);//  RUTA GENERAL DEL ADMIN
export { router as filesroute };