import { Router } from 'express';
import verificarToken from '../controllers/jwt/loginToken.js'

import { is2FAuthenticate } from '../controllers/2FA/verificar2FA.js';
import { ctr_Archivos_por_rol, ctr_Archivos_Copia, ctr_Archivo_Drive } from '../controllers/Files/ctr_Files.js';

const router = Router();

router.get ('/get/archivos/byuser', verificarToken, is2FAuthenticate, ctr_Archivos_por_rol); 

router.get ('/get/archivos/copia/byuser/:idDrive', verificarToken, is2FAuthenticate, ctr_Archivos_Copia); 

router.get ('/get/archivos/byrol/:idDrive', verificarToken, is2FAuthenticate, ctr_Archivo_Drive); 


export { router as filesroute };