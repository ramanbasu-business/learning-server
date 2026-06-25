"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wssNotification = exports.wssChat = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
let corsOrigin = true;
if (env_1.ENV.CORS_ORIGIN) {
    if (env_1.ENV.CORS_ORIGIN.includes('*')) {
        corsOrigin = /^http:\/\/localhost:\d+$/;
    }
    else if (env_1.ENV.CORS_ORIGIN.includes('localhost')) {
        corsOrigin = /^http:\/\/localhost:\d+$/;
    }
    else {
        corsOrigin = env_1.ENV.CORS_ORIGIN;
    }
}
app.use((0, cors_1.default)({ origin: corsOrigin, credentials: true }));
app.use(express_1.default.json());
app.use("/api/users", userRoutes_1.default);
app.get("/api/hello", (_req, res) => {
    res.json({ message: "Hello from server!" });
});
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
exports.wssChat = new ws_1.WebSocketServer({ noServer: true });
exports.wssNotification = new ws_1.WebSocketServer({ noServer: true });
exports.wssChat.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[Chat] Client connected: ${clientIp}`);
    ws.on("message", (message) => {
        const text = message.toString();
        exports.wssChat.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(text);
            }
        });
    });
    ws.on("close", () => console.log(`[Chat] Client disconnected: ${clientIp}`));
    ws.on("error", (err) => console.error(`[Chat] Error: ${err.message}`));
});
exports.wssNotification.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[Notification] Client connected: ${clientIp}`);
    ws.on("message", (message) => {
        const text = message.toString();
        exports.wssNotification.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(text);
            }
        });
    });
    ws.on("close", () => console.log(`[Notification] Client disconnected: ${clientIp}`));
    ws.on("error", (err) => console.error(`[Notification] Error: ${err.message}`));
});
server.on("upgrade", (req, socket, head) => {
    const { pathname } = new URL(req.url ?? "/", `http://${req.headers.host}`);
    if (pathname === "/chat") {
        exports.wssChat.handleUpgrade(req, socket, head, (ws) => {
            exports.wssChat.emit("connection", ws, req);
        });
        return;
    }
    if (pathname === "/notifications") {
        exports.wssNotification.handleUpgrade(req, socket, head, (ws) => {
            exports.wssNotification.emit("connection", ws, req);
        });
        return;
    }
    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    socket.destroy();
});
server.listen(env_1.ENV.API_PORT, () => {
    console.log(`HTTP  -> ${env_1.ENV.API_PORT}`);
    console.log(`Chat  -> ws://...:${env_1.ENV.API_PORT}/chat`);
    console.log(`Notif -> ws://...:${env_1.ENV.API_PORT}/notifications`);
});
//# sourceMappingURL=index.js.map