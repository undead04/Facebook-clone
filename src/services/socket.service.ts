import { Socket } from "socket.io";

class SocketService {
  // connection socket
  connection(socket: Socket) {
    socket.on("disconnect", () => {
      console.log(`Client disconnected id is ${socket.id}`);
    });
    // event on here
    socket.on("chat message", (msg) => {
      console.log(`Message: ${msg}`);
    });
  }
}
export default new SocketService();
