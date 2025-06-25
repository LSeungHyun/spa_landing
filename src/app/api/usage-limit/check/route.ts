/**
 * 사용 제한 확인 API 라우트
 * 
 * 클라이언트에서 현재 IP의 사용 제한 상태를 확인할 수 있는 엔드포인트입니다.
 * 동기화 목적으로 사용됩니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { usageLimitService } from '@/lib/services/usage-limit-service'
import { supabaseAdmin } from '@/lib/supabase-client'

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const real = request.headers.get('x-real-ip')
    const connection = request.headers.get('x-vercel-forwarded-for')

    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }
    if (real) {
        return real
    }
    if (connection) {
        return connection.split(',')[0].trim()
    }

    return request.ip || '127.0.0.1'
}

export async function GET(request: NextRequest) {
    try {
        const clientIP = getClientIP(request)

        // 1. 서비스 레벨에서 사용 제한 확인
        const limitCheck = await usageLimitService.checkUsageLimit(clientIP)

        // 2. 실제 데이터베이스 기록 조회
        let dbRecord = null
        try {
            const { data, error } = await supabaseAdmin
                .from('ip_usage_limits')
                .select('*')
                .eq('ip_address', clientIP)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (!error && data) {
                dbRecord = data
            }
        } catch (dbError) {
            console.warn('Failed to fetch database record:', dbError)
        }

        return NextResponse.json({
            ipAddress: clientIP,
            maxUsageCount: 3,
            resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),

            // 서비스 레벨 정보
            serviceLevel: {
                canUse: limitCheck.canUse,
                remainingCount: limitCheck.remainingCount,
                usageCount: limitCheck.usageCount,
                isFromCache: limitCheck.isFromCache,
                error: limitCheck.error
            },

            // 실제 데이터베이스 기록
            databaseRecord: dbRecord,

            // 디버그 정보
            debug: {
                hasError: !!limitCheck.error,
                errorCode: limitCheck.error?.code,
                errorMessage: limitCheck.error?.message
            }
        })

    } catch (error) {
        console.error('Error in usage limit check:', error)
        return NextResponse.json(
            {
                error: 'Failed to check usage limit',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    })
} 