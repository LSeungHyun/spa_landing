import { NextRequest, NextResponse } from 'next/server'
import { usageLimitService } from '@/lib/services/usage-limit-service'

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

export async function POST(request: NextRequest) {
    try {
        const clientIP = getClientIP(request)

        console.log(`Resetting usage limit for IP: ${clientIP}`)

        const result = await usageLimitService.resetUsage(clientIP)

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Usage limit reset successfully',
                ipAddress: clientIP
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