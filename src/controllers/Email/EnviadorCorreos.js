import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { CreacionHtml, creacionNotificacionGerente, crearNotificacionAdminstrador } from './creacionHTML.js';

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
//listo
export const enviarCorreo = async ({ subject, to, bcc, fileAttached, ComentarioAdmin }) => {
    console.log('enviarCorreoDesdeAdmin')
    console.log('to', to)
    console.log("fileAttached:", fileAttached);
console.log("tipo:", typeof fileAttached);

    try {
        let attachments = [];


        if (fileAttached) {
        // Si viene como objeto, intenta extraer la ruta
        const rawPath =
            typeof fileAttached === "string"
            ? fileAttached
            : (fileAttached.path || fileAttached.filePath || fileAttached.uri);

        if (!rawPath || typeof rawPath !== "string") {
            console.warn("fileAttached no trae ruta válida:", fileAttached);
        } else {
            const filePath = path.resolve(rawPath);

            if (fs.existsSync(filePath)) {
            attachments.push({
                filename: path.basename(filePath),
                path: filePath,
            });
            } else {
            console.warn(`Archivo no encontrado: ${filePath}`);
            }
        }
        }


        // Genera el contenido HTML con el comentario del administrador
        const ContentHtml = CreacionHtml(ComentarioAdmin);

        const mailOptions = {
            from: emailSender,
            to:to,
            bcc:bcc,
            subject: subject,
            text: `Este es un correo automático con el asunto: ${subject}`, // Texto alternativo
            html: ContentHtml, 
            attachments, 
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error al enviar el correo1:', error.message);
        return { success: false, error: error.message };
    }
};

export const enviarNotificacionNueva_Administrador = async (MailMiGerente, UserName, NombreArchivo, CommentarioOperador) => {
    console.log('enviarNotificacionNueva_Administrador')
    console.log('MailMiGerente', MailMiGerente)
    try {
        const htmlToSend = creacionNotificacionGerente(CommentarioOperador, UserName, NombreArchivo);

        const TextSubject =`${UserName} ha solicitado el Archivo ${NombreArchivo}`;

        const mailOptions = {
            from: emailSender,
            to: MailMiGerente,            
            subject: TextSubject, 
            html: htmlToSend,
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error al enviar el correo2:', error);
        return { success: false, error: error.message };
    }
};

//listo
export const enviarNotificacionGerente = async (MailMiGerente, UserName, NombreArchivo, CommentarioOperador, forAdmin, email) => {
    console.log('enviarNotificacionGerente')
    console.log('emailSender: ', emailSender)
    console.log('MailMiGerente', MailMiGerente)
    // const email = req.cookies.userEmail;
    // console.log('email', email)

    // console.log('htmlToSend: ', htmlToSend)

    try {
        const htmlToSend = creacionNotificacionGerente(CommentarioOperador, UserName, NombreArchivo, forAdmin);

        const TextSubject =`${UserName} ha solicitado el Archivo ${NombreArchivo}`;
    console.log('TextSubject: ', TextSubject)
        const mailOptions = {
            from: emailSender,
            to: MailMiGerente,            
            subject: TextSubject, 
            html: htmlToSend,
        };
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error al enviar el correo3:', error);
        return { success: false, error: error.message };
    }
};

export const enviarCorreoAdministrador_aprobacionGerencia = async (EmailTo, data, userName) => {
    console.log('enviarCorreoAdministrador_aprobacionGerencia')
    console.log('EmailTo', EmailTo)
    try {
        const htmlToSend = crearNotificacionAdminstrador(data);

        const TextSubject =`${userName} ha solicitado el Archivo ${data.Nombre_Archivo}`;

        const mailOptions = {
            from: emailSender,
            to: "solisthomas9@gmail.com",
            bcc: 'solisthomas9@gmail.com',
            subject: TextSubject, 
            html: htmlToSend,
        };
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error al enviar el correo4:', error);
        return { success: false, error: error.message };
    }
};

