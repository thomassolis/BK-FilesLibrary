import https from "https";
import http from "http";
import fs from "fs";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

let server;

if (isProduction) {
  // Producción: HTTP simple (Render provee HTTPS)
  server = http.createServer(app);
} else {
  // Desarrollo: HTTPS local
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "../ssl", "localhost.key")),
    cert: fs.readFileSync(path.join(__dirname, "../ssl", "localhost.crt")),
  };
  server = https.createServer(sslOptions, app);
}

// Inicializa Socket.IO
initSocket(server);

server.listen(PORT, () => {
  const protocol = isProduction ? "http" : "https";
  console.log(`Servidor corriendo en ${protocol}://localhost:${PORT}`);
});
