/**
 * IP 주소 추출 및 정규화 유틸리티
 * 
 * Next.js Request 객체에서 실제 클라이언트 IP 주소를 추출하고
 * IPv4/IPv6 처리, 프록시 헤더 고려, IP 정규화 등을 수행합니다.
 */

import { NextRequest } from 'next/server'
import {
    IPAddressInfo,
    IPAddressType,
    IPExtractionOptions,
    DEFAULT_IP_EXTRACTION_OPTIONS,
    IP_ADDRESS_REGEX
} from '@/types/usage-limit'

/**
 * Next.js Request 객체에서 실제 클라이언트 IP 주소를 추출합니다.
 * 
 * @param request - Next.js Request 객체
 * @param options - IP 추출 옵션
 * @returns IP 주소 정보
 */
export async function extractIPAddress(
    request: NextRequest,
    options: IPExtractionOptions = DEFAULT_IP_EXTRACTION_OPTIONS
): Promise<IPAddressInfo> {
    const { trustProxy, allowLocalhost, mapIPv6ToIPv4 } = {
        ...DEFAULT_IP_EXTRACTION_OPTIONS,
        ...options
    }

    let ipAddress: string | null = null

    try {
        // 1. 프록시 헤더에서 IP 추출 (trustProxy가 true인 경우)
        if (trustProxy) {
            // X-Forwarded-For 헤더 확인 (가장 일반적)
            const xForwardedFor = request.headers.get('x-forwarded-for')
            if (xForwardedFor) {
                // 첫 번째 IP 주소 사용 (원본 클라이언트 IP)
                ipAddress = xForwardedFor.split(',')[0].trim()
            }

            // X-Real-IP 헤더 확인 (Nginx 등에서 사용)
            if (!ipAddress) {
                ipAddress = request.headers.get('x-real-ip')
            }

            // CF-Connecting-IP 헤더 확인 (Cloudflare)
            if (!ipAddress) {
                ipAddress = request.headers.get('cf-connecting-ip')
            }

            // X-Client-IP 헤더 확인
            if (!ipAddress) {
                ipAddress = request.headers.get('x-client-ip')
            }

            // X-Cluster-Client-IP 헤더 확인
            if (!ipAddress) {
                ipAddress = request.headers.get('x-cluster-client-ip')
            }
        }

        // 2. Request 객체의 기본 IP 사용
        if (!ipAddress) {
            ipAddress = request.ip || null
        }

        // 3. 연결 정보에서 IP 추출 (fallback)
        if (!ipAddress) {
            // Next.js의 경우 geo 정보에서 추출 시도
            const geo = request.geo
            if (geo?.city) {
                // geo 정보가 있다면 실제 IP가 처리되었다는 의미
                ipAddress = request.headers.get('x-vercel-forwarded-for') ||
                    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                    null
            }
        }

        // 4. 개발 환경에서의 fallback
        if (!ipAddress && process.env.NODE_ENV === 'development') {
            ipAddress = '127.0.0.1' // 로컬 개발용
        }

        // 5. IP 주소가 여전히 없으면 기본값 사용
        if (!ipAddress) {
            ipAddress = '0.0.0.0'
        }

        // IP 주소 정규화 및 검증
        return normalizeIPAddress(ipAddress, { allowLocalhost, mapIPv6ToIPv4 })

    } catch (error) {
        console.error('IP 주소 추출 중 오류 발생:', error)

        // 오류 발생 시 기본값 반환
        return {
            original: 'unknown',
            normalized: '0.0.0.0',
            type: IPAddressType.UNKNOWN,
            isValid: false,
            isProxy: false
        }
    }
}

/**
 * IP 주소를 정규화하고 유효성을 검증합니다.
 * 
 * @param ipAddress - 원본 IP 주소
 * @param options - 정규화 옵션
 * @returns 정규화된 IP 주소 정보
 */
export function normalizeIPAddress(
    ipAddress: string,
    options: Pick<IPExtractionOptions, 'allowLocalhost' | 'mapIPv6ToIPv4'> = {}
): IPAddressInfo {
    const { allowLocalhost = true, mapIPv6ToIPv4 = true } = options

    try {
        // 공백 제거 및 소문자 변환
        const cleanIP = ipAddress.trim().toLowerCase()

        // IPv4 주소 처리
        if (IP_ADDRESS_REGEX.IPV4.test(cleanIP)) {
            const isLocalhost = isLocalhostIP(cleanIP)

            return {
                original: ipAddress,
                normalized: cleanIP,
                type: isLocalhost ? IPAddressType.LOCALHOST : IPAddressType.IPV4,
                isValid: allowLocalhost || !isLocalhost,
                isProxy: false
            }
        }

        // IPv6 주소 처리
        if (isIPv6Address(cleanIP)) {
            let normalizedIPv6 = normalizeIPv6(cleanIP)

            // IPv6를 IPv4로 매핑 (옵션이 활성화된 경우)
            if (mapIPv6ToIPv4) {
                const mappedIPv4 = mapIPv6ToIPv4Address(normalizedIPv6)
                if (mappedIPv4) {
                    const isLocalhost = isLocalhostIP(mappedIPv4)

                    return {
                        original: ipAddress,
                        normalized: mappedIPv4,
                        type: isLocalhost ? IPAddressType.LOCALHOST : IPAddressType.IPV4,
                        isValid: allowLocalhost || !isLocalhost,
                        isProxy: false
                    }
                }
            }

            const isLocalhost = isLocalhostIPv6(normalizedIPv6)

            return {
                original: ipAddress,
                normalized: normalizedIPv6,
                type: isLocalhost ? IPAddressType.LOCALHOST : IPAddressType.IPV6,
                isValid: allowLocalhost || !isLocalhost,
                isProxy: false
            }
        }

        // 특수 케이스 처리
        if (cleanIP === 'localhost' || cleanIP === '::1') {
            return {
                original: ipAddress,
                normalized: '127.0.0.1',
                type: IPAddressType.LOCALHOST,
                isValid: allowLocalhost,
                isProxy: false
            }
        }

        // 유효하지 않은 IP 주소
        return {
            original: ipAddress,
            normalized: '0.0.0.0',
            type: IPAddressType.UNKNOWN,
            isValid: false,
            isProxy: false
        }

    } catch (error) {
        console.error('IP 주소 정규화 중 오류 발생:', error)

        return {
            original: ipAddress,
            normalized: '0.0.0.0',
            type: IPAddressType.UNKNOWN,
            isValid: false,
            isProxy: false
        }
    }
}

/**
 * IPv6 주소인지 확인합니다.
 * 
 * @param ip - 확인할 IP 주소
 * @returns IPv6 주소 여부
 */
function isIPv6Address(ip: string): boolean {
    // 기본 IPv6 패턴 확인
    if (IP_ADDRESS_REGEX.IPV6.test(ip)) {
        return true
    }

    // 압축된 IPv6 주소 패턴 확인
    const ipv6CompressedPattern = /^([0-9a-f]{0,4}:){1,7}:([0-9a-f]{0,4}:){0,6}[0-9a-f]{0,4}$/i
    if (ipv6CompressedPattern.test(ip)) {
        return true
    }

    // IPv4-mapped IPv6 주소 확인
    const ipv4MappedPattern = /^::ffff:(\d{1,3}\.){3}\d{1,3}$/i
    if (ipv4MappedPattern.test(ip)) {
        return true
    }

    return false
}

/**
 * IPv6 주소를 정규화합니다.
 * 
 * @param ipv6 - IPv6 주소
 * @returns 정규화된 IPv6 주소
 */
function normalizeIPv6(ipv6: string): string {
    try {
        // 기본적인 정규화 (소문자 변환, 공백 제거)
        let normalized = ipv6.toLowerCase().trim()

        // 압축된 형태를 전체 형태로 확장
        if (normalized.includes('::')) {
            const parts = normalized.split('::')
            const leftParts = parts[0] ? parts[0].split(':') : []
            const rightParts = parts[1] ? parts[1].split(':') : []

            const totalParts = 8
            const missingParts = totalParts - leftParts.length - rightParts.length

            const expandedParts = [
                ...leftParts,
                ...Array(missingParts).fill('0000'),
                ...rightParts
            ]

            normalized = expandedParts
                .map(part => part.padStart(4, '0'))
                .join(':')
        }

        return normalized

    } catch (error) {
        console.error('IPv6 정규화 중 오류 발생:', error)
        return ipv6
    }
}

/**
 * IPv6 주소를 IPv4 주소로 매핑합니다 (가능한 경우).
 * 
 * @param ipv6 - IPv6 주소
 * @returns 매핑된 IPv4 주소 또는 null
 */
function mapIPv6ToIPv4Address(ipv6: string): string | null {
    try {
        // IPv4-mapped IPv6 주소 처리 (::ffff:192.0.2.1)
        const ipv4MappedMatch = ipv6.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i)
        if (ipv4MappedMatch) {
            return ipv4MappedMatch[1]
        }

        // IPv4-compatible IPv6 주소 처리 (::192.0.2.1)
        const ipv4CompatibleMatch = ipv6.match(/^::(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i)
        if (ipv4CompatibleMatch) {
            return ipv4CompatibleMatch[1]
        }

        return null

    } catch (error) {
        console.error('IPv6 to IPv4 매핑 중 오류 발생:', error)
        return null
    }
}

/**
 * IPv4 주소가 로컬호스트인지 확인합니다.
 * 
 * @param ip - IPv4 주소
 * @returns 로컬호스트 여부
 */
function isLocalhostIP(ip: string): boolean {
    return ip === '127.0.0.1' ||
        ip === '0.0.0.0' ||
        ip.startsWith('127.') ||
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        (ip.startsWith('172.') &&
            parseInt(ip.split('.')[1]) >= 16 &&
            parseInt(ip.split('.')[1]) <= 31)
}

/**
 * IPv6 주소가 로컬호스트인지 확인합니다.
 * 
 * @param ip - IPv6 주소
 * @returns 로컬호스트 여부
 */
function isLocalhostIPv6(ip: string): boolean {
    return ip === '::1' ||
        ip === '::' ||
        ip.startsWith('fe80:') || // Link-local
        ip.startsWith('fc00:') || // Unique local
        ip.startsWith('fd00:')    // Unique local
}

/**
 * IP 주소가 유효한지 검증합니다.
 * 
 * @param ip - 검증할 IP 주소
 * @returns 유효성 여부
 */
export function isValidIPAddress(ip: string): boolean {
    if (!ip || typeof ip !== 'string') {
        return false
    }

    const cleanIP = ip.trim()

    // IPv4 검증
    if (IP_ADDRESS_REGEX.IPV4.test(cleanIP)) {
        return true
    }

    // IPv6 검증
    if (isIPv6Address(cleanIP)) {
        return true
    }

    return false
}

/**
 * IP 주소를 해시화합니다 (프라이버시 보호용).
 * 
 * @param ip - 해시화할 IP 주소
 * @returns 해시화된 IP 주소
 */
export function hashIPAddress(ip: string): string {
    // 간단한 해시 함수 (실제 운영에서는 더 강력한 해시 사용 권장)
    let hash = 0
    for (let i = 0; i < ip.length; i++) {
        const char = ip.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // 32bit 정수로 변환
    }
    return Math.abs(hash).toString(36)
}

/**
 * 개발 환경용 IP 주소를 생성합니다.
 * 
 * @returns 개발용 IP 주소
 */
export function getDevIPAddress(): string {
    if (process.env.NODE_ENV === 'development') {
        return process.env.DEV_IP_ADDRESS || '127.0.0.1'
    }
    return '127.0.0.1'
}

/**
 * IP 주소 정보를 로그용으로 포맷팅합니다.
 * 
 * @param ipInfo - IP 주소 정보
 * @returns 로그용 문자열
 */
export function formatIPAddressForLog(ipInfo: IPAddressInfo): string {
    return `IP: ${ipInfo.normalized} (${ipInfo.type}, valid: ${ipInfo.isValid})`
}

/**
 * 요청에서 지역 정보를 추출합니다 (Vercel/Cloudflare 등).
 * 
 * @param request - Next.js Request 객체
 * @returns 지역 정보
 */
export function extractRegionInfo(request: NextRequest): string | undefined {
    try {
        // Vercel의 geo 정보 사용
        if (request.geo) {
            return `${request.geo.country}-${request.geo.region}`
        }

        // Cloudflare 헤더 확인
        const cfCountry = request.headers.get('cf-ipcountry')
        if (cfCountry) {
            return cfCountry
        }

        // 기타 지역 정보 헤더 확인
        const geoCountry = request.headers.get('x-geo-country')
        if (geoCountry) {
            return geoCountry
        }

        return undefined

    } catch (error) {
        console.error('지역 정보 추출 중 오류 발생:', error)
        return undefined
    }
}

/**
 * 간단한 클라이언트 IP 추출 함수 (API 라우트에서 사용)
 * 
 * @param request - Next.js Request 객체
 * @returns 클라이언트 IP 주소 (문자열) 또는 null
 */
export function extractClientIP(request: NextRequest): string | null {
    try {
        // 1. X-Forwarded-For 헤더 확인 (가장 일반적)
        const xForwardedFor = request.headers.get('x-forwarded-for')
        if (xForwardedFor) {
            const ip = xForwardedFor.split(',')[0].trim()
            if (isValidIPAddress(ip)) {
                return ip
            }
        }

        // 2. X-Real-IP 헤더 확인 (Nginx 등에서 사용)
        const xRealIP = request.headers.get('x-real-ip')
        if (xRealIP && isValidIPAddress(xRealIP)) {
            return xRealIP
        }

        // 3. CF-Connecting-IP 헤더 확인 (Cloudflare)
        const cfConnectingIP = request.headers.get('cf-connecting-ip')
        if (cfConnectingIP && isValidIPAddress(cfConnectingIP)) {
            return cfConnectingIP
        }

        // 4. Request 객체의 기본 IP 사용
        if (request.ip && isValidIPAddress(request.ip)) {
            return request.ip
        }

        // 5. 개발 환경에서의 fallback
        if (process.env.NODE_ENV === 'development') {
            return '127.0.0.1'
        }

        return null
    } catch (error) {
        console.error('클라이언트 IP 추출 중 오류 발생:', error)
        return null
    }
}

// Alias exports for backward compatibility
export const normalizeIP = normalizeIPAddress
export const isValidIP = isValidIPAddress
export const getIPInfo = extractIPAddress 