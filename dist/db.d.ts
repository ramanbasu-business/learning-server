import { QueryResult, QueryResultRow } from 'pg';
declare function executeQuery<T extends QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>>;
export default executeQuery;
//# sourceMappingURL=db.d.ts.map