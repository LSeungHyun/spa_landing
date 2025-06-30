import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini-service';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return NextResponse.json(
                { error: '프롬프트를 입력해주세요' },
                { status: 400 }
            );
        }

        console.log('=== Test Improve Prompt API called ===');
        console.log('Prompt length:', prompt.length);

        // Gemini 2.0 Flash (FREE) 서비스 인스턴스 가져오기
        const geminiService = GeminiService.getInstance();
        
        // 테스트용 프롬프트 개선 (Gemini 2.0 Flash 무료 모델 사용)
        const improvedPrompt = await geminiService.improvePrompt(prompt, true);

        console.log('Test improvement completed successfully');
        console.log('Improved prompt length:', improvedPrompt.length);

        return NextResponse.json({
            improvedPrompt,
            model: 'gemini-2.0-flash',
            type: 'test',
            message: '테스트 개선이 완료되었습니다 (무료 모델)'
        });

    } catch (error) {
        console.error('Test Improve Prompt API Error:', error);
        
        // 에러 타입별 처리
        if (error instanceof Error) {
            if (error.message.includes('API key not valid')) {
                return NextResponse.json(
                    { 
                        error: '🔑 Gemini API 키가 유효하지 않습니다',
                        details: 'Google AI Studio에서 새로운 키를 발급받아주세요'
                    },
                    { status: 401 }
                );
            } else if (error.message.includes('API key not configured')) {
                return NextResponse.json(
                    { 
                        error: '🔑 Gemini API 키가 설정되지 않았습니다',
                        details: '.env.local 파일에 GEMINI_API_KEY를 추가해주세요'
                    },
                    { status: 503 }
                );
            } else if (error.message.includes('quota exceeded')) {
                return NextResponse.json(
                    { 
                        error: '⏰ API 사용량이 일시적으로 초과되었습니다',
                        details: '잠시 후 다시 시도해주세요'
                    },
                    { status: 429 }
                );
            }
        }

        return NextResponse.json(
            { 
                error: '테스트 개선에 실패했습니다. 다시 시도해주세요.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 