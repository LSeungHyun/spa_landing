import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini-service';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { error: '프롬프트를 입력해주세요' },
                { status: 400 }
            );
        }

        const geminiService = GeminiService.getInstance();
        const improvedPrompt = await geminiService.improvePrompt(prompt);

        return NextResponse.json({ improvedPrompt });
    } catch (error) {
        console.error('API Error:', error);

        if (error instanceof Error && error.message.includes('Google Gemini API key not configured')) {
            return NextResponse.json(
                { error: 'Gemini API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: '프롬프트 향상에 실패했습니다. 다시 시도해주세요.' },
            { status: 500 }
        );
    }
} 