import { Router } from 'express';
import { controladorRutaLoginPost, controladorRutaAuthenticationPost, ctrFilesByUser, filesData, adminFiles, getHistorial, historialData, getHistorial2, getManagerApproval, getHistorialAdmin, oficialHistory} from '../controllers/RouteLogin/route.login.js';
const router = Router();

router.post('/login', controladorRutaLoginPost);

router.post('/authentication', controladorRutaAuthenticationPost);

router.get('/get/files/:fileName', ctrFilesByUser);
// router.get('/get/files/:fileName', (req,res)=>{
//     console.log("dame el archivo:",req.params)
//     res.send(`Pediste el archivo ${req.params.fileName}`);
// });

router.get('/get/oficialHistory', oficialHistory);


router.post('/send/files/data', filesData);




router.get('/solicitar/files/:carpeta/:FileName', (req,res)=>{
    // console.log("dame el archivo:",req.params)
    res.send(`Pediste el archivo ${req.params.FileName} que esta en la carpeta ${req.params.carpeta}`)
});

router.post('/admin/files', adminFiles);


router.post('/admin/files', adminFiles);


router.get('/get/historial', getHistorial);
router.get('/get/historial', getHistorialAdmin);



router.post ('/post/historialdata', getHistorial2);

router.post ('/post/managerApproval', getManagerApproval);


export { router as authroute };
