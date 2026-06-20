import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
dotenv.config();   // ✅ guarantees .env is loaded before pool connects


const pool = new Pool({
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
async function executeQuery<T extends QueryResultRow>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> {
    try {
        const res: QueryResult<T> = await pool.query<T>(text, params);
        return res; // full QueryResult<T>, includes rows, fields, rowCount, etc.
    }
    catch (ex) {
        throw ex;
    }
}

//module.exports = { query };
export default executeQuery;
