"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const config_1 = __importDefault(require("./src/configs/config"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_service_1 = __importDefault(require("./src/services/socket.service"));
const authSocket_middleware_1 = __importDefault(require("./src/middlewares/authSocket.middleware"));
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
});
global._io = io;
global._io.use(authSocket_middleware_1.default);
global._io.on("connection", (socket) => {
    socket.on("join room", (roomId) => {
        socket.join(roomId);
    });
    console.log("a user connected is id", socket.id);
    socket_service_1.default.connection(socket);
});
const port = config_1.default.port;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
