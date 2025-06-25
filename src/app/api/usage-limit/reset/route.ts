import { NextRequest, NextResponse } from 'next/server'
import { usageLimitService } from '@/lib/services/usage-limit-service'
import { getClientIP, getProductionSafeIP, logIPExtraction } from '@/lib/utils/ip-utils'

export async function POST(request: NextRequest) {
    try {
        // 개선된 IP 추출 로직 사용
        const ipInfo = getClientIP(request)
        const clientIP = getProductionSafeIP(ipInfo)
        
        // IP 추출 결과 로깅 (개발 환경)
        logIPExtraction(ipInfo, 'usage-limit-reset')

        console.log(`Resetting usage limit for IP: ${clientIP}`)

        const result = await usageLimitService.resetUsage(clientIP)

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Usage limit reset successfully',
                ipAddress: clientIP,
                // 디버깅 정보 (개발 환경에서만)
                ipInfo: process.env.NODE_ENV === 'development' ? {
                    originalIP: ipInfo.address,
                    productionSafeIP: clientIP,
                    source: ipInfo.source,
                    isLocal: ipInfo.isLocal
                } : undefined
            })
        } else {
            return NextResponse.json({
                success: false,
                error: result.error?.message || 'Failed to reset usage limit'
            }, { status: 500 })
        }

    } catch (error) {
        console.error('Error in usage limit reset:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to reset usage limit',
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    })
} 