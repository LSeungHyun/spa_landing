/**
 * API 에러 처리를 위한 포괄적인 타입 시스템
 * 
 * @description
 * - HTTP 상태 코드별 에러 타입 정의
 * - 표준화된 에러 응답 형식
 * - 에러 생성 헬퍼 함수들
 * - 타입 가드 함수들
 * - 한국어 에러 메시지 지원
 */

// ============================================================================
// 기본 에러 타입 정의
// ============================================================================

/**
 * HTTP 상태 코드 타입
 */
export type HttpStatusCode =
    | 200 | 201 | 202 | 204
    | 400 | 401 | 402 | 403 | 404 | 405 | 409 | 422 | 429
    | 500 | 501 | 502 | 503 | 504

/**
 * 에러 카테고리 정의
 */
export enum ErrorCategory {
    CLIENT_ERROR = 'CLIENT_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
    USAGE_LIMIT_ERROR = 'USAGE_LIMIT_ERROR',
    EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    CACHE_ERROR = 'CACHE_ERROR',
}

/**
 * 에러 심각도 레벨
 */
export enum ErrorSeverity {
    LOW = 'LOW',           // 사용자에게 영향 없음
    MEDIUM = 'MEDIUM',     // 사용자 경험에 영향
    HIGH = 'HIGH',         // 기능 사용 불가
    CRITICAL = 'CRITICAL', // 서비스 중단
}

/**
 * 기본 API 에러 인터페이스
 */
export interface BaseApiError {
    code: string
    message: string
    category: ErrorCategory
    severity: ErrorSeverity
    statusCode: HttpStatusCode
    timestamp: string
    requestId?: string
    details?: Record<string, unknown>
    userMessage?: string // 사용자에게 표시할 한국어 메시지
    retryable?: boolean
    retryAfter?: number // 재시도 가능한 시간 (초)
}

/**
 * 검증 에러 상세 정보
 */
export interface ValidationErrorDetail {
    field: string
    value: unknown
    message: string
    code: string
}

/**
 * 검증 에러 인터페이스
 */
export interface ValidationError extends BaseApiError {
    category: ErrorCategory.VALIDATION_ERROR
    details: {
        validationErrors: ValidationErrorDetail[]
        failedFields: string[]
    }
}

/**
 * 사용 제한 에러 인터페이스
 */
export interface UsageLimitError extends BaseApiError {
    category: ErrorCategory.USAGE_LIMIT_ERROR
    details: {
        currentUsage: number
        maxUsage: number
        resetTime: string
        remainingCount: number
        ipAddress?: string
    }
}

/**
 * 외부 API 에러 인터페이스
 */
export interface ExternalApiError extends BaseApiError {
    category: ErrorCategory.EXTERNAL_API_ERROR
    details: {
        service: string
        endpoint?: string
        originalError?: string
        responseStatus?: number
    }
}

/**
 * 데이터베이스 에러 인터페이스
 */
export interface DatabaseError extends BaseApiError {
    category: ErrorCategory.DATABASE_ERROR
    details: {
        operation: string
        table?: string
        query?: string
        originalError?: string
    }
}

/**
 * 통합 API 에러 타입
 */
export type ApiError =
    | BaseApiError
    | ValidationError
    | UsageLimitError
    | ExternalApiError
    | DatabaseError

// ============================================================================
// 에러 코드 정의
// ============================================================================

/**
 * 표준 에러 코드 상수
 */
export const ERROR_CODES = {
    // 일반 에러 (4xx)
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
    CONFLICT: 'CONFLICT',
    UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

    // 서버 에러 (5xx)
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
    BAD_GATEWAY: 'BAD_GATEWAY',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',

    // 검증 에러
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
    INVALID_FORMAT: 'INVALID_FORMAT',

    // 인증/인가 에러
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

    // 사용 제한 에러
    USAGE_LIMIT_EXCEEDED: 'USAGE_LIMIT_EXCEEDED',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

    // 외부 API 에러
    GEMINI_API_ERROR: 'GEMINI_API_ERROR',
    GEMINI_API_QUOTA_EXCEEDED: 'GEMINI_API_QUOTA_EXCEEDED',
    GEMINI_API_RATE_LIMITED: 'GEMINI_API_RATE_LIMITED',
    GEMINI_API_UNAVAILABLE: 'GEMINI_API_UNAVAILABLE',

    // 데이터베이스 에러
    DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
    DATABASE_QUERY_ERROR: 'DATABASE_QUERY_ERROR',
    DATABASE_CONSTRAINT_ERROR: 'DATABASE_CONSTRAINT_ERROR',

    // 캐시 에러
    CACHE_ERROR: 'CACHE_ERROR',
    CACHE_UNAVAILABLE: 'CACHE_UNAVAILABLE',

    // IP 관련 에러
    IP_EXTRACTION_FAILED: 'IP_EXTRACTION_FAILED',
    IP_BLOCKED: 'IP_BLOCKED',
    IP_VALIDATION_FAILED: 'IP_VALIDATION_FAILED',
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

// ============================================================================
// 에러 메시지 매핑
// ============================================================================

/**
 * 에러 코드별 한국어 메시지 매핑
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    // 일반 에러
    [ERROR_CODES.BAD_REQUEST]: '잘못된 요청입니다.',
    [ERROR_CODES.UNAUTHORIZED]: '인증이 필요합니다.',
    [ERROR_CODES.FORBIDDEN]: '접근 권한이 없습니다.',
    [ERROR_CODES.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
    [ERROR_CODES.METHOD_NOT_ALLOWED]: '허용되지 않은 요청 방식입니다.',
    [ERROR_CODES.CONFLICT]: '리소스 충돌이 발생했습니다.',
    [ERROR_CODES.UNPROCESSABLE_ENTITY]: '요청을 처리할 수 없습니다.',
    [ERROR_CODES.TOO_MANY_REQUESTS]: '요청이 너무 빈번합니다. 잠시 후 다시 시도해주세요.',

    // 서버 에러
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: '서버 내부 오류가 발생했습니다.',
    [ERROR_CODES.NOT_IMPLEMENTED]: '구현되지 않은 기능입니다.',
    [ERROR_CODES.BAD_GATEWAY]: '게이트웨이 오류가 발생했습니다.',
    [ERROR_CODES.SERVICE_UNAVAILABLE]: '서비스를 일시적으로 사용할 수 없습니다.',
    [ERROR_CODES.GATEWAY_TIMEOUT]: '게이트웨이 시간 초과가 발생했습니다.',

    // 검증 에러
    [ERROR_CODES.VALIDATION_FAILED]: '입력 값 검증에 실패했습니다.',
    [ERROR_CODES.INVALID_INPUT]: '입력 값이 올바르지 않습니다.',
    [ERROR_CODES.MISSING_REQUIRED_FIELD]: '필수 필드가 누락되었습니다.',
    [ERROR_CODES.INVALID_FORMAT]: '입력 형식이 올바르지 않습니다.',

    // 인증/인가 에러
    [ERROR_CODES.INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
    [ERROR_CODES.TOKEN_EXPIRED]: '토큰이 만료되었습니다.',
    [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: '권한이 부족합니다.',

    // 사용 제한 에러
    [ERROR_CODES.USAGE_LIMIT_EXCEEDED]: '일일 사용 한도를 초과했습니다.',
    [ERROR_CODES.RATE_LIMIT_EXCEEDED]: '요청 빈도 제한을 초과했습니다.',
    [ERROR_CODES.QUOTA_EXCEEDED]: '할당량을 초과했습니다.',

    // 외부 API 에러
    [ERROR_CODES.GEMINI_API_ERROR]: 'AI 서비스 오류가 발생했습니다.',
    [ERROR_CODES.GEMINI_API_QUOTA_EXCEEDED]: 'AI 서비스 할당량을 초과했습니다.',
    [ERROR_CODES.GEMINI_API_RATE_LIMITED]: 'AI 서비스 요청 한도를 초과했습니다.',
    [ERROR_CODES.GEMINI_API_UNAVAILABLE]: 'AI 서비스를 일시적으로 사용할 수 없습니다.',

    // 데이터베이스 에러
    [ERROR_CODES.DATABASE_CONNECTION_ERROR]: '데이터베이스 연결 오류가 발생했습니다.',
    [ERROR_CODES.DATABASE_QUERY_ERROR]: '데이터베이스 쿼리 오류가 발생했습니다.',
    [ERROR_CODES.DATABASE_CONSTRAINT_ERROR]: '데이터베이스 제약 조건 위반입니다.',

    // 캐시 에러
    [ERROR_CODES.CACHE_ERROR]: '캐시 오류가 발생했습니다.',
    [ERROR_CODES.CACHE_UNAVAILABLE]: '캐시 서비스를 사용할 수 없습니다.',

    // IP 관련 에러
    [ERROR_CODES.IP_EXTRACTION_FAILED]: 'IP 주소를 확인할 수 없습니다.',
    [ERROR_CODES.IP_BLOCKED]: '차단된 IP 주소입니다.',
    [ERROR_CODES.IP_VALIDATION_FAILED]: 'IP 주소 검증에 실패했습니다.',
}

/**
 * HTTP 상태 코드별 에러 코드 매핑
 */
export const STATUS_CODE_MAPPING: Record<HttpStatusCode, ErrorCode[]> = {
    // 성공 응답
    200: [],
    201: [],
    202: [],
    204: [],

    // 클라이언트 에러
    400: [ERROR_CODES.BAD_REQUEST, ERROR_CODES.INVALID_INPUT, ERROR_CODES.VALIDATION_FAILED],
    401: [ERROR_CODES.UNAUTHORIZED, ERROR_CODES.INVALID_TOKEN, ERROR_CODES.TOKEN_EXPIRED],
    402: [ERROR_CODES.QUOTA_EXCEEDED],
    403: [ERROR_CODES.FORBIDDEN, ERROR_CODES.INSUFFICIENT_PERMISSIONS, ERROR_CODES.IP_BLOCKED],
    404: [ERROR_CODES.NOT_FOUND],
    405: [ERROR_CODES.METHOD_NOT_ALLOWED],
    409: [ERROR_CODES.CONFLICT],
    422: [ERROR_CODES.UNPROCESSABLE_ENTITY, ERROR_CODES.MISSING_REQUIRED_FIELD],
    429: [ERROR_CODES.TOO_MANY_REQUESTS, ERROR_CODES.RATE_LIMIT_EXCEEDED, ERROR_CODES.USAGE_LIMIT_EXCEEDED],

    // 서버 에러
    500: [ERROR_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.DATABASE_CONNECTION_ERROR],
    501: [ERROR_CODES.NOT_IMPLEMENTED],
    502: [ERROR_CODES.BAD_GATEWAY, ERROR_CODES.GEMINI_API_UNAVAILABLE],
    503: [ERROR_CODES.SERVICE_UNAVAILABLE, ERROR_CODES.CACHE_UNAVAILABLE],
    504: [ERROR_CODES.GATEWAY_TIMEOUT],
}

// ============================================================================
// 에러 생성 헬퍼 함수들
// ============================================================================

/**
 * 기본 API 에러 생성
 */
export function createApiError(
    code: ErrorCode,
    statusCode: HttpStatusCode,
    category: ErrorCategory,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    options: {
        message?: string
        userMessage?: string
        details?: Record<string, unknown>
        requestId?: string
        retryable?: boolean
        retryAfter?: number
    } = {}
): BaseApiError {
    return {
        code,
        message: options.message || ERROR_MESSAGES[code],
        userMessage: options.userMessage || ERROR_MESSAGES[code],
        category,
        severity,
        statusCode,
        timestamp: new Date().toISOString(),
        requestId: options.requestId,
        details: options.details,
        retryable: options.retryable || false,
        retryAfter: options.retryAfter,
    }
}

/**
 * 검증 에러 생성
 */
export function createValidationError(
    validationErrors: ValidationErrorDetail[],
    options: {
        message?: string
        requestId?: string
    } = {}
): ValidationError {
    return {
        code: ERROR_CODES.VALIDATION_FAILED,
        message: options.message || ERROR_MESSAGES[ERROR_CODES.VALIDATION_FAILED],
        userMessage: ERROR_MESSAGES[ERROR_CODES.VALIDATION_FAILED],
        category: ErrorCategory.VALIDATION_ERROR,
        severity: ErrorSeverity.MEDIUM,
        statusCode: 400,
        timestamp: new Date().toISOString(),
        requestId: options.requestId,
        details: {
            validationErrors,
            failedFields: validationErrors.map(error => error.field),
        },
        retryable: false,
    }
}

/**
 * 사용 제한 에러 생성
 */
export function createUsageLimitError(
    currentUsage: number,
    maxUsage: number,
    resetTime: Date,
    remainingCount: number,
    options: {
        ipAddress?: string
        requestId?: string
        retryAfter?: number
    } = {}
): UsageLimitError {
    return {
        code: ERROR_CODES.USAGE_LIMIT_EXCEEDED,
        message: ERROR_MESSAGES[ERROR_CODES.USAGE_LIMIT_EXCEEDED],
        userMessage: `일일 사용 한도(${maxUsage}회)를 초과했습니다. ${resetTime.toLocaleDateString('ko-KR')} ${resetTime.toLocaleTimeString('ko-KR')}에 초기화됩니다.`,
        category: ErrorCategory.USAGE_LIMIT_ERROR,
        severity: ErrorSeverity.MEDIUM,
        statusCode: 429,
        timestamp: new Date().toISOString(),
        requestId: options.requestId,
        details: {
            currentUsage,
            maxUsage,
            resetTime: resetTime.toISOString(),
            remainingCount,
            ipAddress: options.ipAddress,
        },
        retryable: true,
        retryAfter: options.retryAfter || Math.ceil((resetTime.getTime() - Date.now()) / 1000),
    }
}

/**
 * 외부 API 에러 생성
 */
export function createExternalApiError(
    service: string,
    code: ErrorCode = ERROR_CODES.GEMINI_API_ERROR,
    options: {
        endpoint?: string
        originalError?: string
        responseStatus?: number
        requestId?: string
        retryable?: boolean
        retryAfter?: number
    } = {}
): ExternalApiError {
    return {
        code,
        message: ERROR_MESSAGES[code],
        userMessage: ERROR_MESSAGES[code],
        category: ErrorCategory.EXTERNAL_API_ERROR,
        severity: ErrorSeverity.HIGH,
        statusCode: options.responseStatus === 429 ? 429 : 502,
        timestamp: new Date().toISOString(),
        requestId: options.requestId,
        details: {
            service,
            endpoint: options.endpoint,
            originalError: options.originalError,
            responseStatus: options.responseStatus,
        },
        retryable: options.retryable || false,
        retryAfter: options.retryAfter,
    }
}

/**
 * 데이터베이스 에러 생성
 */
export function createDatabaseError(
    operation: string,
    code: ErrorCode = ERROR_CODES.DATABASE_QUERY_ERROR,
    options: {
        table?: string
        query?: string
        originalError?: string
        requestId?: string
    } = {}
): DatabaseError {
    return {
        code,
        message: ERROR_MESSAGES[code],
        userMessage: ERROR_MESSAGES[code],
        category: ErrorCategory.DATABASE_ERROR,
        severity: ErrorSeverity.HIGH,
        statusCode: 500,
        timestamp: new Date().toISOString(),
        requestId: options.requestId,
        details: {
            operation,
            table: options.table,
            query: options.query,
            originalError: options.originalError,
        },
        retryable: false,
    }
}

// ============================================================================
// 타입 가드 함수들
// ============================================================================

/**
 * 기본 API 에러 타입 가드
 */
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'message' in error &&
        'category' in error &&
        'severity' in error &&
        'statusCode' in error &&
        'timestamp' in error
    )
}

/**
 * 검증 에러 타입 가드
 */
export function isValidationError(error: unknown): error is ValidationError {
    return (
        isApiError(error) &&
        error.category === ErrorCategory.VALIDATION_ERROR &&
        'details' in error &&
        typeof error.details === 'object' &&
        error.details !== null &&
        'validationErrors' in error.details
    )
}

/**
 * 사용 제한 에러 타입 가드
 */
export function isUsageLimitError(error: unknown): error is UsageLimitError {
    return (
        isApiError(error) &&
        error.category === ErrorCategory.USAGE_LIMIT_ERROR &&
        'details' in error &&
        typeof error.details === 'object' &&
        error.details !== null &&
        'currentUsage' in error.details &&
        'maxUsage' in error.details
    )
}

/**
 * 외부 API 에러 타입 가드
 */
export function isExternalApiError(error: unknown): error is ExternalApiError {
    return (
        isApiError(error) &&
        error.category === ErrorCategory.EXTERNAL_API_ERROR &&
        'details' in error &&
        typeof error.details === 'object' &&
        error.details !== null &&
        'service' in error.details
    )
}

/**
 * 데이터베이스 에러 타입 가드
 */
export function isDatabaseError(error: unknown): error is DatabaseError {
    return (
        isApiError(error) &&
        error.category === ErrorCategory.DATABASE_ERROR &&
        'details' in error &&
        typeof error.details === 'object' &&
        error.details !== null &&
        'operation' in error.details
    )
}

/**
 * 재시도 가능한 에러 확인
 */
export function isRetryableError(error: unknown): boolean {
    return isApiError(error) && (error.retryable === true)
}

/**
 * 심각한 에러 확인
 */
export function isCriticalError(error: unknown): boolean {
    return isApiError(error) && error.severity === ErrorSeverity.CRITICAL
}

// ============================================================================
// 유틸리티 함수들
// ============================================================================

/**
 * 에러에서 사용자 메시지 추출
 */
export function getUserMessage(error: unknown): string {
    if (isApiError(error) && error.userMessage) {
        return error.userMessage
    }

    if (error instanceof Error) {
        return error.message
    }

    return '알 수 없는 오류가 발생했습니다.'
}

/**
 * 에러에서 재시도 시간 추출
 */
export function getRetryAfter(error: unknown): number | null {
    if (isApiError(error) && typeof error.retryAfter === 'number') {
        return error.retryAfter
    }

    return null
}

/**
 * 에러 로깅을 위한 정보 추출
 */
export function getErrorLogInfo(error: unknown): {
    code: string
    message: string
    category: string
    severity: string
    statusCode: number
    details?: Record<string, unknown>
} {
    if (isApiError(error)) {
        return {
            code: error.code,
            message: error.message,
            category: error.category,
            severity: error.severity,
            statusCode: error.statusCode,
            details: error.details,
        }
    }

    if (error instanceof Error) {
        return {
            code: 'UNKNOWN_ERROR',
            message: error.message,
            category: ErrorCategory.SERVER_ERROR,
            severity: ErrorSeverity.MEDIUM,
            statusCode: 500,
            details: {
                stack: error.stack,
            },
        }
    }

    return {
        code: 'UNKNOWN_ERROR',
        message: String(error),
        category: ErrorCategory.SERVER_ERROR,
        severity: ErrorSeverity.MEDIUM,
        statusCode: 500,
    }
}

/**
 * NextResponse 에러 응답 생성
 */
export function createErrorResponse(error: ApiError): Response {
    return new Response(JSON.stringify({
        error: {
            code: error.code,
            message: error.userMessage || error.message,
            timestamp: error.timestamp,
            requestId: error.requestId,
            details: error.details,
        },
    }), {
        status: error.statusCode,
        headers: {
            'Content-Type': 'application/json',
            ...(error.retryAfter && { 'Retry-After': String(error.retryAfter) }),
        },
    })
}

/**
 * 요청 ID 생성
 */
export function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
} 