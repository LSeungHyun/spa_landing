/**
 * 사용 제한 확인 API 라우트
 * 
 * 클라이언트에서 현재 IP의 사용 제한 상태를 확인할 수 있는 엔드포인트입니다.
 * 동기화 목적으로 사용됩니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { extractClientIP } from '@/lib/utils/ip-utils'
import { usageLimitService } from '@/lib/services/usage-limit-service'

// API 응답 타입 정의
interface UsageLimitCheckAPIResponse {
    usageCount: number
    remainingCount: number
    maxUsageCount: number
    resetTime: string
    canUse: boolean
    ipAddress?: string
    error?: string
}

// 에러 응답 생성 헬퍼
function createErrorResponse(
    error: string,
    status: number
): NextResponse<UsageLimitCheckAPIResponse> {
    return NextResponse.json({
        error,
        usageCount: 0,
        remainingCount: 3,
        maxUsageCount: 3,
        resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        canUse: false
    }, { status })
}

// 성공 응답 생성 헬퍼
function createSuccessResponse(
    data: Omit<UsageLimitCheckAPIResponse, 'error'>
): NextResponse<UsageLimitCheckAPIResponse> {
    return NextResponse.json(data)
}

// CORS 헤더 설정
function setCORSHeaders(response: NextResponse): NextResponse {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
    return response
}

export async function GET(req: NextRequest) {
    try {
        // 1. 클라이언트 IP 추출
        const clientIP = extractClientIP(req)
        if (!clientIP) {
            console.error('Failed to extract client IP')
            const response = createErrorResponse(
                'IP 주소를 확인할 수 없습니다.',
                400
            )
            return setCORSHeaders(response)
        }

        console.log(`Usage limit check request from IP: ${clientIP}`)

        // 2. 사용 제한 상태 확인
        const limitCheck = await usageLimitService.checkUsageLimit(clientIP)

        if (limitCheck.error) {
            console.error('Usage limit check failed:', limitCheck.error)

            // 데이터베이스 오류인 경우 기본값 반환
            if (limitCheck.error.code === 'DATABASE_ERROR') {
                console.warn('Database error, returning default values')
                const response = createSuccessResponse({
                    usageCount: 0,
                    remainingCount: 3,
                    maxUsageCount: 3,
                    resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    canUse: true,
                    ipAddress: clientIP
                })
                return setCORSHeaders(response)
            }

            const response = createErrorResponse(
                '사용 제한 확인 중 오류가 발생했습니다.',
                500
            )
            return setCORSHeaders(response)
        }

        // 3. 성공 응답 생성
        const response = createSuccessResponse({
            usageCount: limitCheck.usageCount,
            remainingCount: limitCheck.remainingCount,
            maxUsageCount: 3, // 하드코딩된 최대 사용 횟수
            resetTime: limitCheck.resetTime.toISOString(),
            canUse: limitCheck.canUse,
            ipAddress: process.env.NODE_ENV === 'development' ? clientIP : undefined
        })

        return setCORSHeaders(response)

    } catch (error) {
        console.error('Unexpected error in usage limit check:', error)

        const response = createErrorResponse(
            '서버 내부 오류가 발생했습니다.',
            500
        )
        return setCORSHeaders(response)
    }
}

// CORS preflight 요청 처리
export async function OPTIONS(request: NextRequest) {
    const response = new NextResponse(null, { status: 200 })
    return setCORSHeaders(response)
} 