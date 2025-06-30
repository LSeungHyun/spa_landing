import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini-service';

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    
    try {
        console.log('=== Chat API called ===');
        
        const { message } = await request.json();
        
        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: '메시지가 필요합니다' },
                { status: 400 }
            );
        }

        if (message.trim().length === 0) {
            return NextResponse.json(
                { error: '빈 메시지는 처리할 수 없습니다' },
                { status: 400 }
            );
        }

        if (message.length > 1000) {
            return NextResponse.json(
                { error: '메시지가 너무 깁니다 (최대 1000자)' },
                { status: 400 }
            );
        }

        console.log('Getting Gemini service instance...');
        const geminiService = GeminiService.getInstance();
        
        console.log('Generating chat response...');
        const chatResponse = await geminiService.generateChatResponse(message.trim());
        
        console.log('Chat response generated successfully');
        console.log('Response length:', chatResponse.length);

        const responseTime = Date.now() - startTime;
        console.log(`Chat API response time: ${responseTime}ms`);

        // 성공 메트릭 기록 (서버 사이드에서는 간단히 로깅만)
        console.log(`[METRICS] Chat API: SUCCESS, ${responseTime}ms, message_length: ${message.length}, response_length: ${chatResponse.length}`);

        return NextResponse.json({
            response: chatResponse,
            timestamp: new Date().toISOString(),
            responseTime: responseTime
        });

    } catch (error) {
        const responseTime = Date.now() - startTime;
        console.error('=== Chat API Error ===');
        console.error('Error details:', error);
        console.log(`[METRICS] Chat API: FAILED, ${responseTime}ms`);
        
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }

        // Gemini API 설정 오류인 경우
        if (error instanceof Error && error.message.includes('not properly configured')) {
            return NextResponse.json(
                { 
                    error: 'AI 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.',
                    details: 'API configuration error'
                },
                { status: 503 }
            );
        }

        // Rate limit 오류인 경우
        if (error instanceof Error && error.message.includes('rate limit')) {
            return NextResponse.json(
                { 
                    error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
                    details: 'Rate limit exceeded'
                },
                { status: 429 }
            );
        }

        // 일반적인 서버 오류
        return NextResponse.json(
            { 
                error: '응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 