/**
 * IP 기반 사용 제한 시스템 타입 정의
 * 
 * 이 파일은 IP 기반 사용 제한 기능에 필요한 모든 TypeScript 타입을 정의합니다.
 * 데이터베이스 엔티티, API 요청/응답, 서비스 함수 매개변수 등을 포함합니다.
 */

// ===== 데이터베이스 엔티티 타입 =====

/**
 * IP 사용 제한 데이터베이스 테이블 스키마
 */
export interface IPUsageRecord {
    /** 고유 식별자 */
    id: string
    /** IP 주소 (정규화된 형태) */
    ip_address: string
    /** 현재 사용 횟수 */
    usage_count: number
    /** 마지막 사용 시간 */
    last_used_at: string
    /** 레코드 생성 시간 */
    created_at: string
    /** 레코드 업데이트 시간 */
    updated_at: string
}

/**
 * IP 사용 제한 테이블 삽입용 타입
 */
export interface IPUsageRecordInsert {
    ip_address: string
    usage_count?: number
    last_used_at?: string
}

/**
 * IP 사용 제한 테이블 업데이트용 타입
 */
export interface IPUsageRecordUpdate {
    usage_count?: number
    last_used_at?: string
    updated_at?: string
}

// ===== API 요청/응답 타입 =====

/**
 * 사용 제한 확인 응답
 */
export interface UsageLimitCheckResponse {
    /** 사용 가능 여부 */
    canUse: boolean
    /** 현재 사용 횟수 */
    usageCount: number
    /** 남은 사용 횟수 */
    remainingCount: number
    /** 리셋 시간 */
    resetTime: Date
    /** 캐시에서 조회되었는지 여부 */
    isFromCache?: boolean
    /** 에러 정보 (있는 경우) */
    error?: UsageLimitError
}

/**
 * 사용 횟수 증가 응답
 */
export interface UsageIncrementResponse {
    /** 성공 여부 */
    success: boolean
    /** 현재 사용 횟수 */
    usageCount: number
    /** 남은 사용 횟수 */
    remainingCount: number
    /** 리셋 시간 */
    resetTime?: Date
    /** 에러 정보 (실패 시) */
    error?: UsageLimitError
}

/**
 * 사용 횟수 롤백 응답
 */
export interface UsageRollbackResponse {
    /** 성공 여부 */
    success: boolean
    /** 롤백 후 사용 횟수 */
    usageCount: number
    /** 남은 사용 횟수 */
    remainingCount: number
    /** 성공 메시지 (성공 시) */
    message?: string
    /** 에러 정보 (실패 시) */
    error?: UsageLimitError
}

// ===== 에러 타입 =====

/**
 * 사용 제한 관련 에러 코드
 */
export enum UsageLimitErrorCode {
    /** 사용 횟수 초과 */
    USAGE_LIMIT_EXCEEDED = 'USAGE_LIMIT_EXCEEDED',
    /** 잘못된 IP 주소 */
    INVALID_IP_ADDRESS = 'INVALID_IP_ADDRESS',
    /** 데이터베이스 연결 오류 */
    DATABASE_ERROR = 'DATABASE_ERROR',
    /** 캐시 오류 */
    CACHE_ERROR = 'CACHE_ERROR',
    /** 내부 서버 오류 */
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    /** 네트워크 오류 */
    NETWORK_ERROR = 'NETWORK_ERROR',
    /** 동시성 오류 */
    CONCURRENCY_ERROR = 'CONCURRENCY_ERROR'
}

/**
 * 사용 제한 에러
 */
export interface UsageLimitError {
    /** 에러 코드 */
    code: UsageLimitErrorCode
    /** 에러 메시지 */
    message: string
    /** 상세 정보 */
    details?: Record<string, unknown>
    /** 재시도 가능 여부 */
    retryable?: boolean
    /** 재시도 권장 시간 (초) */
    retryAfter?: number
}

// ===== 서비스 함수 매개변수 타입 =====

/**
 * IP 주소 추출 옵션
 */
export interface IPExtractionOptions {
    /** 프록시 헤더 신뢰 여부 */
    trustProxy?: boolean
    /** 로컬호스트 허용 여부 */
    allowLocalhost?: boolean
    /** IPv6를 IPv4로 매핑 여부 */
    mapIPv6ToIPv4?: boolean
}

/**
 * 사용 제한 확인 옵션
 */
export interface UsageLimitCheckOptions {
    /** 캐시 사용 여부 */
    useCache?: boolean
    /** 캐시 TTL (초) */
    cacheTTL?: number
    /** 강제 새로고침 여부 */
    forceRefresh?: boolean
}

/**
 * 사용 횟수 증가 옵션
 */
export interface UsageIncrementOptions {
    /** 증가량 (기본값: 1) */
    increment?: number
    /** 트랜잭션 사용 여부 */
    useTransaction?: boolean
    /** 캐시 업데이트 여부 */
    updateCache?: boolean
}

/**
 * 사용 횟수 롤백 옵션
 */
export interface UsageRollbackOptions {
    /** 롤백할 횟수 (기본값: 1) */
    rollbackCount?: number
    /** 트랜잭션 사용 여부 */
    useTransaction?: boolean
    /** 캐시 업데이트 여부 */
    updateCache?: boolean
}

// ===== 캐시 관련 타입 =====

/**
 * 캐시 키 타입
 */
export type CacheKey = `usage_limit:${string}`

/**
 * 캐시된 사용 제한 데이터
 */
export interface CachedUsageData {
    /** 사용 횟수 */
    usageCount: number
    /** 마지막 사용 시간 */
    lastUsedAt: string
    /** 캐시 생성 시간 */
    cachedAt: string
    /** TTL (초) */
    ttl: number
}

// ===== 유틸리티 타입 =====

/**
 * IP 주소 유형
 */
export enum IPAddressType {
    /** IPv4 */
    IPV4 = 'ipv4',
    /** IPv6 */
    IPV6 = 'ipv6',
    /** 로컬호스트 */
    LOCALHOST = 'localhost',
    /** 알 수 없음 */
    UNKNOWN = 'unknown'
}

/**
 * IP 주소 정보
 */
export interface IPAddressInfo {
    /** 원본 IP 주소 */
    original: string
    /** 정규화된 IP 주소 */
    normalized: string
    /** IP 주소 유형 */
    type: IPAddressType
    /** 유효성 여부 */
    isValid: boolean
    /** 프록시 경유 여부 */
    isProxy?: boolean
    /** 지역 정보 (선택사항) */
    region?: string
}

/**
 * 사용 제한 설정
 */
export interface UsageLimitConfig {
    /** 최대 사용 횟수 */
    maxUsage: number
    /** 리셋 주기 (시간, 기본값: 24) */
    resetPeriodHours: number
    /** 캐시 TTL (초, 기본값: 3600) */
    cacheTTL: number
    /** 동시성 제어 여부 */
    enableConcurrencyControl: boolean
    /** Rate Limiting 설정 */
    rateLimitConfig?: {
        /** 시간 창 (초) */
        windowSeconds: number
        /** 최대 요청 수 */
        maxRequests: number
    }
}

/**
 * 사용 통계
 */
export interface UsageStatistics {
    /** 총 사용자 수 */
    totalUsers: number
    /** 오늘 사용자 수 */
    todayUsers: number
    /** 제한 도달 사용자 수 */
    limitReachedUsers: number
    /** 평균 사용 횟수 */
    averageUsage: number
    /** 최대 사용 횟수 */
    maxUsageReached: number
}

// ===== 함수 시그니처 타입 =====

/**
 * IP 주소 추출 함수 타입
 */
export type IPExtractorFunction = (
    request: Request,
    options?: IPExtractionOptions
) => Promise<IPAddressInfo>

/**
 * 사용 제한 확인 함수 타입
 */
export type UsageLimitChecker = (
    ipAddress: string,
    options?: UsageLimitCheckOptions
) => Promise<UsageLimitCheckResponse>

/**
 * 사용 횟수 증가 함수 타입
 */
export type UsageIncrementer = (
    ipAddress: string,
    options?: UsageIncrementOptions
) => Promise<UsageIncrementResponse>

/**
 * 사용 횟수 롤백 함수 타입
 */
export type UsageRollbacker = (
    ipAddress: string,
    options?: UsageRollbackOptions
) => Promise<UsageRollbackResponse>

// ===== 기본 설정 상수 =====

/**
 * 기본 사용 제한 설정
 */
export const DEFAULT_USAGE_LIMIT_CONFIG: UsageLimitConfig = {
    maxUsage: 3,
    resetPeriodHours: 24,
    cacheTTL: 3600,
    enableConcurrencyControl: true,
    rateLimitConfig: {
        windowSeconds: 60,
        maxRequests: 10
    }
}

/**
 * 기본 IP 추출 옵션
 */
export const DEFAULT_IP_EXTRACTION_OPTIONS: IPExtractionOptions = {
    trustProxy: true,
    allowLocalhost: true,
    mapIPv6ToIPv4: true
}

/**
 * 기본 캐시 TTL (1시간)
 */
export const DEFAULT_CACHE_TTL = 3600

/**
 * 최대 사용 횟수
 */
export const MAX_USAGE_COUNT = 3

/**
 * IP 주소 정규식
 */
export const IP_ADDRESS_REGEX = {
    IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    IPV6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
} 