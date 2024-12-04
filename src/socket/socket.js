import { Server as SocketServer } from "socket.io";

let io;

const initSocket = (server) => {
  io = new SocketServer(server, {
    cors: {
      origin: "*", // Cambia esto según el dominio de tu frontend
      methods: ["GET", "POST"],
    },
  });

};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO no ha sido inicializado. Llama initSocket primero.");
  }
  return io;
};

export { initSocket, getIO };
