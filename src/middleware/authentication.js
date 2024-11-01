// // Archivo: /src/middleware/authentication.js
// import jwt from 'jsonwebtoken';
// import express from 'express';
// import cookieParser from 'cookie-parser'

// const app = express();
// app.use(cookieParser());

// function verificarToken(req, res, next) {
//     console.log('cookie recibida: ', req.headers.cookie);
//     const cookies = req.headers.cookie;
//     const match = cookies.match(/BibliotecaMLC=([^;]+)/);
//     const token = match ? match[1] : null; // Extraer el valor de la cookie si existe
//     console.log('token: ', token)
//     console.log('Clave secreta usada: ', process.env.JWT_SECRET);
//     if (!token) {
//         return res.status(403).send({ auth: false, message: 'No se proporcionó token.' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.error('Error al verificar el token:', err.message); // Imprimir el mensaje de error
//             return res.status(401).send({ auth: false, message: 'Token no válido.' });            
//         }

//         req.user = decoded;
//         next();
//     });
// }

// export default verificarToken;
