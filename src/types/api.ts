// API related types and interfaces

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
    stack?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface RequestConfig {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    headers?: Record<string, string>;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiEndpoint {
    method: HttpMethod;
    path: string;
    config?: RequestConfig;
}

// Pre-registration related types
export interface PreRegistrationData {
    email: string;
    name_or_nickname?: string;
    expected_feature?: string;
    registered_at?: string; // 자동 생성되는 필드
}

export interface PreRegistrationRequest {
    email: string;
    name_or_nickname?: string;
    expected_feature?: string;
    additional_info?: Record<string, any>; // 클라이언트에서 추가 정보 전송용
}

export interface PreRegistrationResponse extends ApiResponse<PreRegistrationData> {
    message: string;
} 