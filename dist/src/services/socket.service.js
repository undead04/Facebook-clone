"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketService {
    // connection socket
    connection(socket) {
        socket.on("disconnect", () => {
            console.log(`Client disconnected id is ${socket.id}`);
        });
        // event on here
        socket.on("chat message", (msg) => {
            console.log(`Message: ${msg}`);
        });
    }
}
exports.default = new SocketService();
