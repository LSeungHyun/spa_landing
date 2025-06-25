/**
 * IP 추출 및 검증 미들웨어
 * 
 * @description
 * - IP 주소 추출 및 검증
 * - IP 화이트리스트/블랙리스트 지원
 * - CIDR 표기법 지원
 * - 접근 제어 기능
 * - 요청 로깅 기능
 * - 개발/프로덕션 환경별 처리
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClientIP, isValidIPv4, getProductionSafeIP, isValidIPv6 } from '@/lib/utils/ip-utils'
import { createApiError, createErrorResponse, generateRequestId, ERROR_CODES, ErrorCategory, ErrorSeverity } from '@/types/api-errors'

// ============================================================================
// 타입 정의
// ============================================================================

/**
 * IP 접근 제어 설정
 */
export interface IPAccessControlConfig {
    enabled: boolean
    whitelist: string[]
    blacklist: string[]
    allowLocalhost: boolean
    allowPrivateNetworks: boolean
    logAccess: boolean
    logBlocked: boolean
}

/**
 * CIDR 네트워크 정보
 */
interface CIDRNetwork {
    network: string
    prefixLength: number
    startIP: number
    endIP: number
}

/**
 * IP 추출 결과
 */
export interface IPExtractionResult {
    success: boolean
    ip: string | null
    normalizedIP: string | null
    isValid: boolean
    source: 'x-forwarded-for' | 'x-real-ip' | 'x-vercel-forwarded-for' | 'request-ip' | 'fallback' | 'cf-connecting-ip' | 'x-client-ip' | 'socket' | 'unknown'
    originalHeaders: Record<string, string>
    error?: string
    requestId: string
}

/**
 * IP 접근 제어 결과
 */
export interface IPAccessResult {
    allowed: boolean
    reason: string
    ip: string
    matchedRule?: {
        type: 'whitelist' | 'blacklist'
        pattern: string
        isExact: boolean
    }
    requestId: string
}

/**
 * 미들웨어 옵션
 */
export interface IPExtractorOptions {
    accessControl?: Partial<IPAccessControlConfig>
    extractionOptions?: {
        trustProxy: boolean
        preferCloudflare: boolean
        allowFallback: boolean
    }
    logging?: {
        enabled: boolean
        logLevel: 'debug' | 'info' | 'warn' | 'error'
        includeHeaders: boolean
    }
}

// ============================================================================
// 기본 설정
// ============================================================================

/**
 * 기본 IP 접근 제어 설정
 */
const DEFAULT_ACCESS_CONTROL: IPAccessControlConfig = {
    enabled: process.env.NODE_ENV === 'production',
    whitelist: [],
    blacklist: [
        // 알려진 악성 IP 대역 (예시)
        '192.0.2.0/24',    // TEST-NET-1
        '198.51.100.0/24', // TEST-NET-2
        '203.0.113.0/24',  // TEST-NET-3
    ],
    allowLocalhost: process.env.NODE_ENV === 'development',
    allowPrivateNetworks: process.env.NODE_ENV === 'development',
    logAccess: true,
    logBlocked: true,
}

/**
 * 기본 미들웨어 옵션
 */
const DEFAULT_OPTIONS: Required<IPExtractorOptions> = {
    accessControl: DEFAULT_ACCESS_CONTROL,
    extractionOptions: {
        trustProxy: true,
        preferCloudflare: true,
        allowFallback: true,
    },
    logging: {
        enabled: true,
        logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
        includeHeaders: process.env.NODE_ENV === 'development',
    },
}

// ============================================================================
// CIDR 유틸리티 함수들
// ============================================================================

/**
 * IPv4 주소를 숫자로 변환
 */
function ipToNumber(ip: string): number {
    const parts = ip.split('.').map(Number)
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
}

/**
 * CIDR 표기법 파싱
 */
function parseCIDR(cidr: string): CIDRNetwork | null {
    const [network, prefix] = cidr.split('/')

    if (!network || !prefix) {
        return null
    }

    if (!isValidIPv4(network)) {
        return null
    }

    const prefixLength = parseInt(prefix, 10)
    if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
        return null
    }

    const networkNumber = ipToNumber(network)
    const mask = (0xFFFFFFFF << (32 - prefixLength)) >>> 0
    const startIP = (networkNumber & mask) >>> 0
    const endIP = (startIP | (0xFFFFFFFF >>> prefixLength)) >>> 0

    return {
        network,
        prefixLength,
        startIP,
        endIP,
    }
}

/**
 * IP가 CIDR 범위에 포함되는지 확인
 */
function isIPInCIDR(ip: string, cidr: string): boolean {
    if (!isValidIPv4(ip)) {
        return false
    }

    const cidrInfo = parseCIDR(cidr)
    if (!cidrInfo) {
        return false
    }

    const ipNumber = ipToNumber(ip)
    return ipNumber >= cidrInfo.startIP && ipNumber <= cidrInfo.endIP
}

/**
 * IP가 사설 네트워크인지 확인
 */
function isPrivateIP(ip: string): boolean {
    if (!isValidIPv4(ip)) {
        return false
    }

    const privateRanges = [
        '10.0.0.0/8',      // Class A private
        '172.16.0.0/12',   // Class B private
        '192.168.0.0/16',  // Class C private
        '127.0.0.0/8',     // Loopback
        '169.254.0.0/16',  // Link-local
    ]

    return privateRanges.some(range => isIPInCIDR(ip, range))
}

// ============================================================================
// 로깅 유틸리티
// ============================================================================

/**
 * 구조화된 로그 출력
 */
function logRequest(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    data: Record<string, unknown>,
    options: IPExtractorOptions['logging']
) {
    if (!options?.enabled) {
        return
    }

    const logData = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...data,
    }

    switch (level) {
        case 'debug':
            if (options.logLevel === 'debug') {
                console.debug(JSON.stringify(logData))
            }
            break
        case 'info':
            if (['debug', 'info'].includes(options.logLevel)) {
                console.info(JSON.stringify(logData))
            }
            break
        case 'warn':
            if (['debug', 'info', 'warn'].includes(options.logLevel)) {
                console.warn(JSON.stringify(logData))
            }
            break
        case 'error':
            console.error(JSON.stringify(logData))
            break
    }
}

// ============================================================================
// 핵심 미들웨어 함수들
// ============================================================================

/**
 * 요청에서 IP 주소 추출
 */
export function extractIPFromRequest(
    request: NextRequest,
    options: IPExtractorOptions = {}
): IPExtractionResult {
    const requestId = generateRequestId()
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

    try {
        // 원본 헤더 정보 수집
        const originalHeaders: Record<string, string> = {}

        const headerNames = [
            'x-forwarded-for',
            'x-real-ip',
            'cf-connecting-ip',
            'x-client-ip',
            'x-cluster-client-ip',
            'x-forwarded',
            'forwarded-for',
            'forwarded',
        ]

        headerNames.forEach(name => {
            const value = request.headers.get(name)
            if (value) {
                originalHeaders[name] = value
            }
        })

        // IP 추출 시도
        const ipInfo = getClientIP(request)

        if (!ipInfo || !ipInfo.address) {
            logRequest('warn', 'IP extraction failed', {
                requestId,
                url: request.url,
                method: request.method,
                headers: mergedOptions.logging.includeHeaders ? originalHeaders : undefined,
            }, mergedOptions.logging)

            return {
                success: false,
                ip: null,
                normalizedIP: null,
                isValid: false,
                source: 'unknown',
                originalHeaders,
                error: 'Failed to extract IP address from request',
                requestId,
            }
        }

        // IP 정규화 및 검증
        const normalizedIP = ipInfo.address.trim()
        const isValid = isValidIPv4(normalizedIP) || isValidIPv6(normalizedIP)

        // IP 소스 확인
        let source: IPExtractionResult['source'] = ipInfo.source

        logRequest('debug', 'IP extraction successful', {
            requestId,
            extractedIP: ipInfo.address,
            normalizedIP,
            isValid,
            source,
            url: request.url,
            method: request.method,
        }, mergedOptions.logging)

        return {
            success: true,
            ip: ipInfo.address,
            normalizedIP,
            isValid,
            source,
            originalHeaders,
            requestId,
        }

    } catch (error) {
        logRequest('error', 'IP extraction error', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            url: request.url,
            method: request.method,
        }, mergedOptions.logging)

        return {
            success: false,
            ip: null,
            normalizedIP: null,
            isValid: false,
            source: 'unknown',
            originalHeaders: {},
            error: error instanceof Error ? error.message : 'Unknown error',
            requestId,
        }
    }
}

/**
 * IP 접근 제어 확인
 */
export function checkIPAccess(
    ip: string,
    config: IPAccessControlConfig,
    requestId: string
): IPAccessResult {
    // 접근 제어가 비활성화된 경우
    if (!config.enabled) {
        return {
            allowed: true,
            reason: 'Access control disabled',
            ip,
            requestId,
        }
    }

    // IP 유효성 검사
    if (!isValidIPv4(ip)) {
        return {
            allowed: false,
            reason: 'Invalid IP address',
            ip,
            requestId,
        }
    }

    const normalizedIP = ip.trim()

    // 로컬호스트 확인
    if (normalizedIP === '127.0.0.1' || normalizedIP === '::1') {
        if (config.allowLocalhost) {
            return {
                allowed: true,
                reason: 'Localhost allowed',
                ip: normalizedIP,
                requestId,
            }
        } else {
            return {
                allowed: false,
                reason: 'Localhost not allowed',
                ip: normalizedIP,
                requestId,
            }
        }
    }

    // 사설 네트워크 확인
    if (isPrivateIP(normalizedIP)) {
        if (config.allowPrivateNetworks) {
            return {
                allowed: true,
                reason: 'Private network allowed',
                ip: normalizedIP,
                requestId,
            }
        } else {
            return {
                allowed: false,
                reason: 'Private network not allowed',
                ip: normalizedIP,
                requestId,
            }
        }
    }

    // 화이트리스트 확인
    if (config.whitelist.length > 0) {
        for (const pattern of config.whitelist) {
            // 정확한 IP 매치
            if (pattern === normalizedIP) {
                return {
                    allowed: true,
                    reason: 'IP in whitelist (exact match)',
                    ip: normalizedIP,
                    matchedRule: {
                        type: 'whitelist',
                        pattern,
                        isExact: true,
                    },
                    requestId,
                }
            }

            // CIDR 범위 매치
            if (pattern.includes('/') && isIPInCIDR(normalizedIP, pattern)) {
                return {
                    allowed: true,
                    reason: 'IP in whitelist (CIDR match)',
                    ip: normalizedIP,
                    matchedRule: {
                        type: 'whitelist',
                        pattern,
                        isExact: false,
                    },
                    requestId,
                }
            }
        }

        // 화이트리스트가 있지만 매치되지 않음
        return {
            allowed: false,
            reason: 'IP not in whitelist',
            ip: normalizedIP,
            requestId,
        }
    }

    // 블랙리스트 확인
    for (const pattern of config.blacklist) {
        // 정확한 IP 매치
        if (pattern === normalizedIP) {
            return {
                allowed: false,
                reason: 'IP in blacklist (exact match)',
                ip: normalizedIP,
                matchedRule: {
                    type: 'blacklist',
                    pattern,
                    isExact: true,
                },
                requestId,
            }
        }

        // CIDR 범위 매치
        if (pattern.includes('/') && isIPInCIDR(normalizedIP, pattern)) {
            return {
                allowed: false,
                reason: 'IP in blacklist (CIDR match)',
                ip: normalizedIP,
                matchedRule: {
                    type: 'blacklist',
                    pattern,
                    isExact: false,
                },
                requestId,
            }
        }
    }

    // 기본적으로 허용
    return {
        allowed: true,
        reason: 'No matching rules, default allow',
        ip: normalizedIP,
        requestId,
    }
}

/**
 * IP 추출 및 접근 제어 미들웨어
 */
export function createIPExtractorMiddleware(options: IPExtractorOptions = {}) {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
    const accessControlConfig = { ...DEFAULT_ACCESS_CONTROL, ...mergedOptions.accessControl }

    return async function ipExtractorMiddleware(
        request: NextRequest
    ): Promise<{
        result: IPExtractionResult
        accessResult: IPAccessResult | null
        response: NextResponse | null
    }> {
        // IP 추출
        const result = extractIPFromRequest(request, mergedOptions)

        // IP 추출 실패 시 에러 응답
        if (!result.success || !result.normalizedIP) {
            const error = createApiError(
                ERROR_CODES.IP_EXTRACTION_FAILED,
                400,
                ErrorCategory.CLIENT_ERROR,
                ErrorSeverity.MEDIUM,
                {
                    message: 'Failed to extract client IP address',
                    userMessage: 'IP 주소를 확인할 수 없습니다. 네트워크 연결을 확인해주세요.',
                    requestId: result.requestId,
                    details: {
                        originalHeaders: result.originalHeaders,
                        error: result.error,
                    },
                }
            )

            logRequest('error', 'IP extraction failed', {
                requestId: result.requestId,
                error: result.error,
                url: request.url,
                method: request.method,
            }, mergedOptions.logging)

            return {
                result,
                accessResult: null,
                response: new NextResponse(JSON.stringify({ error }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }),
            }
        }

        // 접근 제어 확인
        const accessResult = checkIPAccess(
            result.normalizedIP,
            accessControlConfig,
            result.requestId
        )

        // 접근 허용 로깅
        if (accessResult.allowed && accessControlConfig.logAccess) {
            logRequest('info', 'IP access allowed', {
                requestId: result.requestId,
                ip: accessResult.ip,
                reason: accessResult.reason,
                matchedRule: accessResult.matchedRule,
                url: request.url,
                method: request.method,
                userAgent: request.headers.get('user-agent'),
            }, mergedOptions.logging)
        }

        // 접근 차단 시 에러 응답
        if (!accessResult.allowed) {
            const error = createApiError(
                ERROR_CODES.IP_BLOCKED,
                403,
                ErrorCategory.AUTHORIZATION_ERROR,
                ErrorSeverity.HIGH,
                {
                    message: `IP access denied: ${accessResult.reason}`,
                    userMessage: '접근이 차단된 IP 주소입니다.',
                    requestId: result.requestId,
                    details: {
                        ip: accessResult.ip,
                        reason: accessResult.reason,
                        matchedRule: accessResult.matchedRule,
                    },
                }
            )

            if (accessControlConfig.logBlocked) {
                logRequest('warn', 'IP access blocked', {
                    requestId: result.requestId,
                    ip: accessResult.ip,
                    reason: accessResult.reason,
                    matchedRule: accessResult.matchedRule,
                    url: request.url,
                    method: request.method,
                    userAgent: request.headers.get('user-agent'),
                }, mergedOptions.logging)
            }

            return {
                result,
                accessResult,
                response: new NextResponse(JSON.stringify({ error }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }),
            }
        }

        // 성공적으로 통과
        return {
            result,
            accessResult,
            response: null,
        }
    }
}

// ============================================================================
// 환경변수 기반 설정 로더
// ============================================================================

/**
 * 환경변수에서 IP 접근 제어 설정 로드
 */
export function loadIPAccessControlFromEnv(): Partial<IPAccessControlConfig> {
    return {
        enabled: process.env.IP_ACCESS_CONTROL_ENABLED === 'true',
        whitelist: process.env.IP_WHITELIST?.split(',').map(ip => ip.trim()).filter(Boolean) || [],
        blacklist: process.env.IP_BLACKLIST?.split(',').map(ip => ip.trim()).filter(Boolean) || [],
        allowLocalhost: process.env.IP_ALLOW_LOCALHOST !== 'false',
        allowPrivateNetworks: process.env.IP_ALLOW_PRIVATE !== 'false',
        logAccess: process.env.IP_LOG_ACCESS !== 'false',
        logBlocked: process.env.IP_LOG_BLOCKED !== 'false',
    }
}

/**
 * 환경변수 기반 미들웨어 옵션 로드
 */
export function loadMiddlewareOptionsFromEnv(): IPExtractorOptions {
    return {
        accessControl: loadIPAccessControlFromEnv(),
        extractionOptions: {
            trustProxy: process.env.IP_TRUST_PROXY !== 'false',
            preferCloudflare: process.env.IP_PREFER_CLOUDFLARE !== 'false',
            allowFallback: process.env.IP_ALLOW_FALLBACK !== 'false',
        },
        logging: {
            enabled: process.env.IP_LOGGING_ENABLED !== 'false',
            logLevel: (process.env.IP_LOG_LEVEL as any) || 'info',
            includeHeaders: process.env.IP_LOG_INCLUDE_HEADERS === 'true',
        },
    }
}

// ============================================================================
// 유틸리티 함수들
// ============================================================================

/**
 * IP 정보 확장 조회
 */
export async function getExtendedIPInfo(ip: string): Promise<{
    ip: string
    normalizedIP: string
    isValid: boolean
    isPrivate: boolean
    isLocalhost: boolean
    geoInfo?: {
        country?: string
        region?: string
        city?: string
        timezone?: string
    }
}> {
    const normalizedIP = ip.trim()
    const isValid = isValidIPv4(normalizedIP) || isValidIPv6(normalizedIP)
    const isPrivate = isPrivateIP(normalizedIP)
    const isLocalhost = normalizedIP === '127.0.0.1' || normalizedIP === '::1'

    let geoInfo
    if (isValid && !isPrivate && !isLocalhost) {
        try {
            // Note: getIPInfo expects NextRequest, not string
            // For now, we'll skip geo info in this context
            // In a real implementation, you'd use a different geo service
            geoInfo = undefined
        } catch (error) {
            console.warn('Failed to get geo info for IP:', normalizedIP, error)
        }
    }

    return {
        ip,
        normalizedIP,
        isValid,
        isPrivate,
        isLocalhost,
        geoInfo,
    }
}

/**
 * CIDR 범위 검증
 */
export function validateCIDRList(cidrList: string[]): {
    valid: string[]
    invalid: string[]
    errors: Array<{ cidr: string; error: string }>
} {
    const valid: string[] = []
    const invalid: string[] = []
    const errors: Array<{ cidr: string; error: string }> = []

    for (const cidr of cidrList) {
        try {
            if (cidr.includes('/')) {
                const parsed = parseCIDR(cidr)
                if (parsed) {
                    valid.push(cidr)
                } else {
                    invalid.push(cidr)
                    errors.push({ cidr, error: 'Invalid CIDR format' })
                }
            } else if (isValidIPv4(cidr)) {
                valid.push(cidr)
            } else {
                invalid.push(cidr)
                errors.push({ cidr, error: 'Invalid IP address' })
            }
        } catch (error) {
            invalid.push(cidr)
            errors.push({
                cidr,
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    return { valid, invalid, errors }
}

/**
 * 미들웨어 설정 검증
 */
export function validateMiddlewareConfig(options: IPExtractorOptions): {
    isValid: boolean
    errors: string[]
    warnings: string[]
} {
    const errors: string[] = []
    const warnings: string[] = []

    if (options.accessControl) {
        const { whitelist = [], blacklist = [] } = options.accessControl

        // 화이트리스트 검증
        if (whitelist.length > 0) {
            const whitelistValidation = validateCIDRList(whitelist)
            if (whitelistValidation.invalid.length > 0) {
                errors.push(`Invalid whitelist entries: ${whitelistValidation.invalid.join(', ')}`)
            }
        }

        // 블랙리스트 검증
        if (blacklist.length > 0) {
            const blacklistValidation = validateCIDRList(blacklist)
            if (blacklistValidation.invalid.length > 0) {
                errors.push(`Invalid blacklist entries: ${blacklistValidation.invalid.join(', ')}`)
            }
        }

        // 설정 충돌 확인
        if (whitelist.length > 0 && blacklist.length > 0) {
            warnings.push('Both whitelist and blacklist are configured. Whitelist takes precedence.')
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    }
} 