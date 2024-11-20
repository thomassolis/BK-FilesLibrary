import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const emailSender = process.env.email_sender;
const emailPassword = process.env.password;
const emailSmtp = process.env.smtp;
const emailPort = parseInt(process.env.puerto, 10);

const transporter = nodemailer.createTransport({
    host: emailSmtp,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
        user: emailSender,
        pass: emailPassword,
    },
});