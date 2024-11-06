import app from './app.js';
import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import {Server as SocketServer} from 'socket.io'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//https
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, '../ssl', 'localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../ssl', 'localhost.crt'))
};

//ejecuta el https
const server = https.createServer(sslOptions, app);

// moverlo a un archivo socket js
// app.use(socket)
const io = new SocketServer(server);
io.on('connection', socket => {
  // console.log('Client Connected');

  socket.on('message', (data) =>{//RECIBE DATOS DEL FRONT
    socket.broadcast.emit('message', data) //EMITE UN EVENTO A TODOS LOS USUARIOS CONECTADOS DEL FRONT
  })

  socket.on('messageGerencia', (data) =>{
    socket.broadcast.emit('messageGerencia', data)    
  })
})

//ejecuta el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en https://localhost:${PORT}`);
});
