import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const hasGeminiKey = !!process.env.GEMINI_API_KEY;
        const geminiKeyLength = process.env.GEMINI_API_KEY?.length || 0;

        return NextResponse.json({
            success: true,
            environment: process.env.NODE_ENV,
            hasGeminiKey,
            geminiKeyLength,
            geminiKeyPrefix: process.env.GEMINI_API_KEY?.substring(0, 10) + '...',
            allEnvKeys: Object.keys(process.env).filter(key =>
                key.includes('GEMINI') || key.includes('SUPABASE')
            )
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 