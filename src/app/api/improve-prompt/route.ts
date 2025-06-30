import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini-service';
import { getClientIP, getProductionSafeIP, logIPExtraction } from '@/lib/utils/ip-utils';
import { usageLimitService } from '@/lib/services/usage-limit-service';
import type { UsageLimitError } from '@/types/usage-limit';

// API 응답 타입 정의
interface ImprovePromptResponse {
    improvedPrompt?: string;
    error?: string;
    usageInfo?: {
        remainingCount: number;
        usageCount: number;
        resetTime: string;
        maxUsageCount: number;
    };
}

// 에러 응답 생성 헬퍼
function createErrorResponse(
    error: string,
    status: number,
    usageInfo?: ImprovePromptResponse['usageInfo']
): NextResponse {
    const response: ImprovePromptResponse = { error };
    if (usageInfo) {
        response.usageInfo = usageInfo;
    }
    return NextResponse.json(response, { status });
}

// 성공 응답 생성 헬퍼
function createSuccessResponse(
    improvedPrompt: string,
    usageInfo: ImprovePromptResponse['usageInfo']
): NextResponse {
    const response: ImprovePromptResponse = {
        improvedPrompt,
        usageInfo,
    };
    return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
    let clientIP: string | null = null;
    let usageIncremented = false;

    try {
        // 1. 클라이언트 IP 추출 (개선된 로직)
        const ipInfo = getClientIP(req);
        clientIP = getProductionSafeIP(ipInfo);
        
        // IP 추출 결과 로깅 (개발 환경)
        logIPExtraction(ipInfo, 'improve-prompt-api');
        
        if (!clientIP) {
            console.error('Failed to extract client IP');
            return createErrorResponse(
                'IP 주소를 확인할 수 없습니다. 다시 시도해주세요.',
                400
            );
        }

        // 2. 요청 데이터 검증
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return createErrorResponse(
                '프롬프트를 입력해주세요',
                400
            );
        }

        if (prompt.trim().length === 0) {
            return createErrorResponse(
                '빈 프롬프트는 처리할 수 없습니다',
                400
            );
        }

        if (prompt.length > 5000) {
            return createErrorResponse(
                '프롬프트가 너무 깁니다. 5000자 이하로 입력해주세요.',
                400
            );
        }

        // 3. 사용 제한 확인
        const limitCheck = await usageLimitService.checkUsageLimit(clientIP);

        if (limitCheck.error) {
            console.error('Usage limit check failed:', limitCheck.error);

            // 데이터베이스 오류인 경우 제한 없이 진행 (fallback)
            if (limitCheck.error.code === 'DATABASE_ERROR') {
                console.warn('Database error, proceeding without usage limit check');
            } else {
                return createErrorResponse(
                    '사용 제한 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                    500
                );
            }
        }

        // 4. 사용 제한 초과 확인
        if (!limitCheck.canUse) {
            // resetTime이 유효한 Date 객체인지 확인하고 안전하게 처리
            const safeResetTime = limitCheck.resetTime && limitCheck.resetTime instanceof Date && !isNaN(limitCheck.resetTime.getTime())
                ? limitCheck.resetTime
                : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간 후로 fallback

            const usageInfo = {
                remainingCount: limitCheck.remainingCount,
                usageCount: limitCheck.usageCount,
                resetTime: safeResetTime.toISOString(),
                maxUsageCount: 3,
            };

            return createErrorResponse(
                `일일 사용 한도(3회)를 초과했습니다. ${safeResetTime.toLocaleDateString('ko-KR')} ${safeResetTime.toLocaleTimeString('ko-KR')}에 초기화됩니다.`,
                429,
                usageInfo
            );
        }

        // 5. 사용 횟수는 API 호출 성공 후에만 증가시킴 (미리 증가시키지 않음)
        // usageIncremented는 나중에 API 성공 시 설정됨

        // 6. Gemini API 호출
        console.log('=== Starting Gemini API call ===');
        console.log('Prompt length:', prompt.length);
        console.log('Client IP:', clientIP);

        const geminiService = GeminiService.getInstance();
        let improvedPrompt: string;

        try {
            console.log('Calling geminiService.improvePrompt...');
            // 실제 개선 모드 (Gemini 2.5 Pro 사용)
            improvedPrompt = await geminiService.improvePrompt(prompt, false);
            console.log('Gemini API call successful, response length:', improvedPrompt.length);

            // API 호출 성공 시에만 사용 횟수 증가
            const incrementResult = await usageLimitService.incrementUsage(clientIP);
            if (incrementResult.success) {
                usageIncremented = true;
                console.log('Usage count incremented successfully');
            } else {
                console.warn('Failed to increment usage after successful API call:', incrementResult.error);
            }
        } catch (geminiError) {
            console.error('=== Gemini API Error Details ===');
            console.error('Error type:', typeof geminiError);
            console.error('Error message:', geminiError instanceof Error ? geminiError.message : geminiError);
            console.error('Error stack:', geminiError instanceof Error ? geminiError.stack : 'No stack');
            console.error('Full error object:', geminiError);

            // API 실패 시에는 사용 횟수가 증가되지 않았으므로 롤백 불필요

            // Gemini API 에러 처리
            if (geminiError instanceof Error) {
                if (geminiError.message.includes('Google Gemini API key not configured') || 
                    geminiError.message.includes('Gemini API is not properly configured')) {
                    return createErrorResponse(
                        '🔑 Gemini API 키가 설정되지 않았습니다.\n\n📋 설정 방법:\n1. Google AI Studio (https://aistudio.google.com) 방문\n2. API 키 생성\n3. .env.local 파일에 GEMINI_API_KEY=your_key 추가\n4. 서버 재시작',
                        503  // Service Unavailable - 설정 문제
                    );
                }

                if (geminiError.message.includes('API key not valid')) {
                    return createErrorResponse(
                        '❌ Gemini API 키가 유효하지 않습니다.\n\nGoogle AI Studio에서 새로운 키를 발급받아 .env.local 파일을 업데이트해주세요.',
                        401
                    );
                }

                if (geminiError.message.includes('quota') || geminiError.message.includes('Too Many Requests')) {
                    return createErrorResponse(
                        'Gemini API 무료 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요. (이는 사용자의 일일 한도와는 별개입니다)',
                        503 // Service Unavailable - 일시적인 서비스 문제
                    );
                }

                if (geminiError.message.includes('rate limit')) {
                    return createErrorResponse(
                        '요청이 너무 빈번합니다. 잠시 후 다시 시도해주세요.',
                        429
                    );
                }
            }

            return createErrorResponse(
                '프롬프트 향상에 실패했습니다. 다시 시도해주세요.',
                500
            );
        }

        // 8. 성공 응답 생성
        // 사용 횟수 증가 후 최신 상태 조회
        const finalLimitCheck = await usageLimitService.checkUsageLimit(clientIP);

        // resetTime 안전 처리
        let safeResetTime: Date;
        if (finalLimitCheck.resetTime && finalLimitCheck.resetTime instanceof Date && !isNaN(finalLimitCheck.resetTime.getTime())) {
            safeResetTime = finalLimitCheck.resetTime;
        } else {
            safeResetTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간 후로 fallback
        }

        const usageInfo = {
            remainingCount: finalLimitCheck.remainingCount,
            usageCount: finalLimitCheck.usageCount,
            resetTime: safeResetTime.toISOString(),
            maxUsageCount: 3,
        };

        return createSuccessResponse(improvedPrompt, usageInfo);

    } catch (error) {
        console.error('Unexpected API Error:', error);

        // 예상치 못한 오류 시 사용 횟수 롤백 (API 성공 후에만 증가되었으므로)
        if (usageIncremented && clientIP) {
            try {
                const rollbackResult = await usageLimitService.rollbackUsage(clientIP);
                if (!rollbackResult.success) {
                    console.error('Failed to rollback usage after unexpected error:', rollbackResult.error);
                }
            } catch (rollbackError) {
                console.error('Rollback error after unexpected error:', rollbackError);
            }
        }

        return createErrorResponse(
            '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            500
        );
    }
}

// OPTIONS 메서드 처리 (CORS)
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
} 