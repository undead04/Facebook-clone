import app from "./app";
import config from "./configs/config";
import http from "http";
import { Server as SocketServer, Socket } from "socket.io";
import SocketService from "./services/socket.service";
import authSocketMiddleware from "./middlewares/authSocket.middleware";
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

(global as any)._io = io;
(global as any)._io.use(authSocketMiddleware);
(global as any)._io.on("connection", (socket: Socket) => {
  socket.on("join room", (roomId: string) => {
    socket.join(roomId);
  });
  console.log("a user connected is id", socket.id);
  SocketService.connection(socket);
});

const port = config.port;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
