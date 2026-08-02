import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { authroute } from './routes/auth.route.js';
import { filesroute } from './routes/files.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { solicitudesRoutes } from './routes/solicitudes.route.js';
import { usersRoutes } from './routes/users.route.js';
dotenv.config();

const app = express();
app.use(express.json());

app.use(session({
    secret: process.env.clave_CS,
    resave: false,
    saveUninitialized: false,
}));

app.use(cookieParser())

const corsOptions = {
    // origin: 'https://localhost:5173',
    // origin: "https://production.d1zbcfn7l9hhpx.amplifyapp.com",
    origin: 'https://mainproduccion.d1kj3tgpssn5w.amplifyapp.com'
    credentials: true,
};

app.use(cors(corsOptions));

app.use('/api/auth', authroute);
app.use('/api/files', filesroute);
app.use('/api/solicitud', solicitudesRoutes)
app.use('/api/users', usersRoutes);

export default app;
