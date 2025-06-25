import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                valid: false,
                error: 'API key not found'
            });
        }

        // API 키 형식 검증
        const isValidFormat = /^AIza[0-9A-Za-z_-]{35}$/.test(apiKey);

        return NextResponse.json({
            valid: isValidFormat,
            length: apiKey.length,
            prefix: apiKey.substring(0, 10) + '...',
            format: isValidFormat ? 'valid' : 'invalid',
            expectedFormat: 'AIza + 35 characters'
        });

    } catch (error) {
        return NextResponse.json({
            valid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 