import express from "express";
import http from "http";
import cors from "cors";
import { WebSocket, WebSocketServer } from "ws";
import userRoutes from "./routes/userRoutes";
import { ENV } from "./config/env";

const app = express();
const server = http.createServer(app);

let corsOrigin: string | RegExp | boolean = true;
if (ENV.CORS_ORIGIN) {
  if (ENV.CORS_ORIGIN.includes('*')) {
    corsOrigin = /^http:\/\/localhost:\d+$/;
  } else if (ENV.CORS_ORIGIN.includes('localhost')) {
    corsOrigin = /^http:\/\/localhost:\d+$/;
  } else {
    corsOrigin = ENV.CORS_ORIGIN;
  }
}

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/api/hello", (_req: express.Request, res: express.Response) => {
    res.json({ message: "Hello from server!" });
});

app.get("/api/health", (_req: express.Request, res: express.Response) => {
    res.json({ status: "ok" });
});

export const wssChat = new WebSocketServer({ noServer: true });
export const wssNotification = new WebSocketServer({ noServer: true });

wssChat.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[Chat] Client connected: ${clientIp}`);

    ws.on("message", (message: Buffer) => {
        const text = message.toString();
        wssChat.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(text);
            }
        });
    });

    ws.on("close", () => console.log(`[Chat] Client disconnected: ${clientIp}`));
    ws.on("error", (err) => console.error(`[Chat] Error: ${err.message}`));
});

wssNotification.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[Notification] Client connected: ${clientIp}`);

    ws.on("message", (message: Buffer) => {
        const text = message.toString();
        wssNotification.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(text);
            }
        });
    });

    ws.on("close", () => console.log(`[Notification] Client disconnected: ${clientIp}`));
    ws.on("error", (err) => console.error(`[Notification] Error: ${err.message}`));
});

server.on("upgrade", (req: http.IncomingMessage, socket, head) => {
    const { pathname } = new URL(req.url ?? "/", `http://${req.headers.host}`);

    if (pathname === "/chat") {
        wssChat.handleUpgrade(req, socket, head, (ws) => {
            wssChat.emit("connection", ws, req);
        });
        return;
    }

    if (pathname === "/notifications") {
        wssNotification.handleUpgrade(req, socket, head, (ws) => {
            wssNotification.emit("connection", ws, req);
        });
        return;
    }

    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    socket.destroy();
});

server.listen(ENV.API_PORT, () => {
    console.log(`HTTP  -> ${ENV.API_PORT}`);
    console.log(`Chat  -> ws://...:${ENV.API_PORT}/chat`);
    console.log(`Notif -> ws://...:${ENV.API_PORT}/notifications`);
});
