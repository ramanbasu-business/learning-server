import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const ENV = {
    API_PORT: Number(process.env.API_PORT ?? 5000),
    CHAT_PORT: Number(process.env.CHAT_PORT ?? 5000),
    NOTIFICATION_PORT: String(process.env.NOTIFICATION_PORT ?? 5000),
    CORS_ORIGIN: String(process.env.CORS_ORIGIN),
    DATABASE_URL: String(process.env.DATABASE_URL)
};
