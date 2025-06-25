/**
 * 사용 제한 확인 API 라우트
 * 
 * 클라이언트에서 현재 IP의 사용 제한 상태를 확인할 수 있는 엔드포인트입니다.
 * 동기화 목적으로 사용됩니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { usageLimitService } from '@/lib/services/usage-limit-service'
import { supabaseAdmin } from '@/lib/supabase-client'
import { getClientIP, getProductionSafeIP, logIPExtraction } from '@/lib/utils/ip-utils'

export async function GET(request: NextRequest) {
    try {
        // 개선된 IP 추출 로직 사용
        const ipInfo = getClientIP(request)
        const clientIP = getProductionSafeIP(ipInfo)
        
        // IP 추출 결과 로깅 (개발 환경)
        logIPExtraction(ipInfo, 'usage-limit-check')

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

            // IP 추출 정보 (디버깅용)
            ipInfo: process.env.NODE_ENV === 'development' ? {
                originalIP: ipInfo.address,
                productionSafeIP: clientIP,
                version: ipInfo.version,
                isLocal: ipInfo.isLocal,
                isPrivate: ipInfo.isPrivate,
                source: ipInfo.source,
                headers: ipInfo.headers
            } : undefined,

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