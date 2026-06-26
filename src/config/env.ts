import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const ENV = {
    API_PORT: Number(process.env.PORT ?? process.env.API_PORT ?? 5001),
    CORS_ORIGIN: String(process.env.CORS_ORIGIN),
    CORE_API_URL: String(process.env.CORE_API_URL ?? 'http://localhost:5002')
};
