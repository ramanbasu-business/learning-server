"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
exports.ENV = {
    API_PORT: Number(process.env.API_PORT ?? 5000),
    CHAT_PORT: Number(process.env.CHAT_PORT ?? 5000),
    NOTIFICATION_PORT: String(process.env.NOTIFICATION_PORT ?? 5000),
    CORS_ORIGIN: String(process.env.CORS_ORIGIN),
    DATABASE_URL: String(process.env.DATABASE_URL)
};
//# sourceMappingURL=env.js.map