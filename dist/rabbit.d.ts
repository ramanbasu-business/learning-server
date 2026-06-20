import { ReportRequestPayload } from '@learning/shared';
export declare function publishReportRequest(payload: ReportRequestPayload): Promise<void>;
export declare function consumeReportRequests(handler: (payload: ReportRequestPayload) => Promise<void>): Promise<void>;
//# sourceMappingURL=rabbit.d.ts.map