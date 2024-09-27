import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { authroute } from './routes/auth.route.js';

dotenv.config();
const app = express();
app.use(express.json()); // Este middleware permite que Express procese JSON en req.body

app.use(session({ secret: process.env.clave_CS, resave: false}));


app.use('/auth', authroute);

export default app;
