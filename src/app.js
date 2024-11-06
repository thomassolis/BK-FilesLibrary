import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { authroute } from './routes/auth.route.js';
import {filesroute} from './routes/files.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();
app.use(express.json()); // Este middleware permite que Express procese JSON en req.body

// para session
app.use(session({ 
    secret: process.env.clave_CS, 
    resave: false, 
    saveUninitialized: false, // Asegúrate de no guardar sesiones vacías
}));

app.use(cookieParser())

// cors
const corsOptions = {
    origin: 'https://localhost:5173', // Cambia esto a la URL de tu frontend
    credentials: true, // Permite cookies y credenciales
};

app.use(cors(corsOptions));

// Define tus rutas aquí
app.use('/api/auth', authroute);

app.use('/api/files', filesroute);


export default app;
