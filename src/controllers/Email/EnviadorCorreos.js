import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { CreacionHtml } from './creacionHTML.js';

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


export const enviarCorreo = async ({ subject, to, bcc, fileAttached, ComentarioAdmin }) => {
    try {
        let attachments = [];
        if (fileAttached) {
            const filePath = path.resolve(fileAttached);
            if (fs.existsSync(filePath)) {
                attachments.push({
                    filename: path.basename(filePath),
                    path: filePath,
                });
            } else {
                console.warn(`Archivo no encontrado: ${filePath}`);
            }
        }

        // Genera el contenido HTML con el comentario del administrador
        const ContentHtml = CreacionHtml(ComentarioAdmin);

        const mailOptions = {
            from: emailSender,
            to,
            bcc,
            subject,
            text: `Este es un correo automático con el asunto: ${subject}`, // Texto alternativo
            html: ContentHtml, 
            attachments, 
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
        return { success: false, error: error.message };
    }
};