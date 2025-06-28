import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                status: 'missing',
                message: 'GEMINI_API_KEY가 설정되지 않았습니다.',
                instructions: {
                    step1: '1. Google AI Studio (https://aistudio.google.com) 방문',
                    step2: '2. "Get API Key" 버튼 클릭하여 새 API 키 생성',
                    step3: '3. 프로젝트 루트의 .env.local 파일 편집',
                    step4: '4. GEMINI_API_KEY=your_api_key_here 형태로 추가',
                    step5: '5. 개발 서버 재시작 (npm run dev)',
                    note: '💡 API 키는 AIzaSy로 시작하는 39자리 문자열입니다.'
                },
                fallbackMode: true
            }, { status: 200 });
        }

        if (apiKey.length < 30) {
            return NextResponse.json({
                status: 'invalid',
                message: 'GEMINI_API_KEY가 올바르지 않습니다.',
                details: {
                    currentLength: apiKey.length,
                    expectedLength: '39자리',
                    prefix: apiKey.substring(0, 6) + '...',
                    expectedPrefix: 'AIzaSy...'
                },
                instructions: {
                    step1: '1. Google AI Studio에서 새로운 API 키 생성',
                    step2: '2. .env.local 파일의 기존 키를 새 키로 교체',
                    step3: '3. 개발 서버 재시작'
                }
            }, { status: 400 });
        }

        // API 키가 있는 경우 간단한 테스트
        return NextResponse.json({
            status: 'configured',
            message: 'GEMINI_API_KEY가 올바르게 설정되었습니다.',
            details: {
                keyLength: apiKey.length,
                prefix: apiKey.substring(0, 10) + '...',
                isValidFormat: apiKey.startsWith('AIzaSy')
            },
            fallbackMode: false
        }, { status: 200 });

    } catch (error) {
        console.error('API key test error:', error);
        return NextResponse.json({
            status: 'error',
            message: '환경변수 확인 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 