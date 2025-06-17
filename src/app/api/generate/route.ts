import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini-service';

export async function POST(req: NextRequest) {
    try {
        const { idea, persona } = await req.json();

        if (!idea || typeof idea !== 'string') {
            return NextResponse.json(
                { error: '아이디어를 입력해주세요' },
                { status: 400 }
            );
        }

        const geminiService = GeminiService.getInstance();
        const content = await geminiService.generatePrompt(idea, persona);

        return NextResponse.json({ content });
    } catch (error) {
        console.error('API Error:', error);

        if (error instanceof Error && error.message.includes('Google Gemini API key not configured')) {
            return NextResponse.json(
                { error: 'Gemini API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: '논문 생성에 실패했습니다. 다시 시도해주세요.' },
            { status: 500 }
        );
    }
} 