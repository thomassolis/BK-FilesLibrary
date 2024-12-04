import https from "https";
import fs from "fs";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de HTTPS
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "../ssl", "localhost.key")),
  cert: fs.readFileSync(path.join(__dirname, "../ssl", "localhost.crt")),
};

const server = https.createServer(sslOptions, app);

// Inicializa Socket.IO
initSocket(server);

// Ejecuta el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en https://localhost:${PORT}`);
});
