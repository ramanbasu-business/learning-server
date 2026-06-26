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
    API_PORT: Number(process.env.PORT ?? process.env.API_PORT ?? 5001),
    CORS_ORIGIN: String(process.env.CORS_ORIGIN),
    CORE_API_URL: String(process.env.CORE_API_URL ?? 'http://localhost:5002')
};
//# sourceMappingURL=env.js.map