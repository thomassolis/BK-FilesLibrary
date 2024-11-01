import { Router } from 'express';
import { controladorRutaLoginPost, controladorRutaAuthenticationPost, ctrFilesByUser, filesData, adminFiles, historialData, getHistorial2, getHistorialAdmin} from '../controllers/RouteLogin/route.login.js';

import verificarToken from '../controllers/jwt/loginToken.js'



const router = Router();


// ya me logie

//



router.post('/login', controladorRutaLoginPost);
router.post('/authentication',  verificarToken, controladorRutaAuthenticationPost);

router.get('/get/files/:fileName', /* aqui va el midleware*/ ctrFilesByUser);
// router.get('/get/files/:fileName', (req,res)=>{
//     console.log("dame el archivo:",req.params)
//     res.send(`Pediste el archivo ${req.params.fileName}`);
// });


router.post('/send/files/data', filesData);




router.get('/solicitar/files/:carpeta/:FileName', (req,res)=>{
    // console.log("dame el archivo:",req.params)
    res.send(`Pediste el archivo ${req.params.FileName} que esta en la carpeta ${req.params.carpeta}`)
});

router.post('/admin/files', adminFiles);


router.post('/admin/files', adminFiles);


// router.get('/get/historial', getHistorial);
router.get('/get/historial', getHistorialAdmin);



router.post ('/post/historialdata', getHistorial2);

// router.post ('/post/managerApproval', getManagerApproval); // RUTA EN DONDE EL OPERADOR ENVÍA LOS DATOS DEL ARCHIVO AL GERENTE


export { router as authroute };
