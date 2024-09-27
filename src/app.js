import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { authroute } from './routes/auth.route.js';
import cors from 'cors'
dotenv.config();
const app = express();
app.use(express.json()); // Este middleware permite que Express procese JSON en req.body

app.use(session({ secret: process.env.clave_CS, resave: false}));

const corsOptions = {
    origin: 'https://localhost:5173', // Cambia esto a la URL de tu frontend
    credentials: true, // Esto permite que las cookies y credenciales se envíen en las solicitudes
};

app.use(cors(corsOptions));

app.use('/api/api/auth', authroute);

export default app;
