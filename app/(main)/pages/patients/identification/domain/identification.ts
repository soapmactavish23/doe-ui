export enum IdentificationStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface IdentificationRequest {
    file: File;
    pushToken?: string | null;
}

export interface IdentificationResponse {
    id: string;
    status: IdentificationStatus;
}

export interface IdentificationResultResponse {
    id: string;
    status: IdentificationStatus;
    result: Record<string, unknown> | null;
}
