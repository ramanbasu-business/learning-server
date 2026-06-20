"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ guarantees .env is loaded before pool connects
const pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '111',
    database: process.env.DB_NAME || 'learningdb',
});
// notify pool status
pool.on('connect', () => console.log('[DB] Postgres connected'));
pool.on('error', (err) => console.error('[DB] Pool error:', err.message));
// By adding extends QueryResultRow, you guarantee to TypeScript that whatever model 
// you pass into Query<T> will always be a structured object representing a database row
async function executeQuery(text, params) {
    try {
        const res = await pool.query(text, params);
        return res; // full QueryResult<T>, includes rows, fields, rowCount, etc.
    }
    catch (ex) {
        throw ex;
    }
}
//module.exports = { query };
exports.default = executeQuery;
//# sourceMappingURL=db.js.map