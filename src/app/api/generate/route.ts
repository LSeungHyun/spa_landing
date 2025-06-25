import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini-service';
import { getClientIP, getProductionSafeIP, logIPExtraction } from '@/lib/utils/ip-utils';
import { usageLimitService } from '@/lib/services/usage-limit-service';
import type { UsageLimitError } from '@/types/usage-limit';

interface GenerateRequest {
    idea: string;
    persona?: string;
}

interface GenerateResponse {
    content: string;
    usageInfo: {
        usageCount: number;
        remainingCount: number;
        maxUsageCount: number;
        resetTime: string;
    };
}

interface GenerateErrorResponse {
    error: string;
    usageInfo?: {
        usageCount: number;
        remainingCount: number;
        maxUsageCount: number;
        resetTime: string;
    };
}

// 에러 응답 생성 헬퍼
function createErrorResponse(
    error: string,
    status: number,
    usageInfo?: GenerateResponse['usageInfo']
): NextResponse<GenerateErrorResponse> {
    const response: GenerateErrorResponse = { error };
    if (usageInfo) {
        response.usageInfo = usageInfo;
    }
    return NextResponse.json(response, { status });
}

// 성공 응답 생성 헬퍼
function createSuccessResponse(
    content: string,
    usageInfo: GenerateResponse['usageInfo']
): NextResponse<GenerateResponse> {
    const response: GenerateResponse = {
        content,
        usageInfo,
    };
    return NextResponse.json(response);
}

// CORS 처리를 위한 OPTIONS 메서드
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

export async function POST(req: NextRequest): Promise<NextResponse<GenerateResponse | GenerateErrorResponse>> {
    let clientIP: string | null = null;
    let usageIncremented = false;

    try {
        // 1. 클라이언트 IP 추출 (개선된 로직)
        const ipInfo = getClientIP(req);
        clientIP = getProductionSafeIP(ipInfo);
        
        // IP 추출 결과 로깅 (개발 환경)
        logIPExtraction(ipInfo, 'generate-api');
        
        if (!clientIP) {
            console.error('Failed to extract client IP');
            return createErrorResponse(
                'IP 주소를 확인할 수 없습니다. 다시 시도해주세요.',
                400
            );
        }

        // 2. 요청 데이터 검증
        const { idea, persona }: GenerateRequest = await req.json();

        if (!idea || typeof idea !== 'string') {
            return createErrorResponse(
                '아이디어를 입력해주세요',
                400
            );
        }

        if (idea.trim().length === 0) {
            return createErrorResponse(
                '빈 아이디어는 처리할 수 없습니다',
                400
            );
        }

        if (idea.length > 1000) {
            return createErrorResponse(
                '아이디어가 너무 깁니다. 1000자 이하로 입력해주세요.',
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
            const usageInfo = {
                remainingCount: limitCheck.remainingCount,
                usageCount: limitCheck.usageCount,
                resetTime: limitCheck.resetTime.toISOString(),
                maxUsageCount: 3,
            };

            return createErrorResponse(
                `일일 사용 한도(3회)를 초과했습니다. ${limitCheck.resetTime.toLocaleDateString('ko-KR')} ${limitCheck.resetTime.toLocaleTimeString('ko-KR')}에 초기화됩니다.`,
                429,
                usageInfo
            );
        }

        // 5. 사용 횟수 증가 (API 호출 전)
        const incrementResult = await usageLimitService.incrementUsage(clientIP);

        if (!incrementResult.success) {
            console.error('Failed to increment usage:', incrementResult.error);

            // 사용 제한 초과인 경우
            if (incrementResult.error?.code === 'USAGE_LIMIT_EXCEEDED') {
                const usageInfo = {
                    remainingCount: incrementResult.remainingCount,
                    usageCount: incrementResult.usageCount,
                    resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    maxUsageCount: 3,
                };

                return createErrorResponse(
                    '사용 한도를 초과했습니다. 내일 다시 시도해주세요.',
                    429,
                    usageInfo
                );
            }

            // 기타 오류인 경우 fallback으로 진행
            console.warn('Usage increment failed, proceeding without increment');
        } else {
            usageIncremented = true;
        }

        // 6. Gemini API 호출
        const geminiService = GeminiService.getInstance();
        let content: string;

        try {
            content = await geminiService.generatePrompt(idea, persona);
        } catch (geminiError) {
            console.error('Gemini API Error:', geminiError);

            // 7. API 실패 시 사용 횟수 롤백
            if (usageIncremented && clientIP) {
                try {
                    const rollbackResult = await usageLimitService.rollbackUsage(clientIP);
                    if (!rollbackResult.success) {
                        console.error('Failed to rollback usage:', rollbackResult.error);
                    }
                } catch (rollbackError) {
                    console.error('Rollback error:', rollbackError);
                }
            }

            // Gemini API 에러 처리
            if (geminiError instanceof Error) {
                if (geminiError.message.includes('Google Gemini API key not configured')) {
                    return createErrorResponse(
                        'Gemini API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.',
                        500
                    );
                }

                if (geminiError.message.includes('quota')) {
                    return createErrorResponse(
                        'API 할당량을 초과했습니다. 잠시 후 다시 시도해주세요.',
                        429
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
                '프롬프트 생성에 실패했습니다. 다시 시도해주세요.',
                500
            );
        }

        // 8. 성공 응답 생성
        const usageInfo = {
            remainingCount: incrementResult.success ? incrementResult.remainingCount : limitCheck.remainingCount - 1,
            usageCount: incrementResult.success ? incrementResult.usageCount : limitCheck.usageCount + 1,
            resetTime: incrementResult.success && incrementResult.resetTime
                ? incrementResult.resetTime.toISOString()
                : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            maxUsageCount: 3,
        };

        return createSuccessResponse(content, usageInfo);

    } catch (error) {
        console.error('Unexpected API Error:', error);

        // 예상치 못한 오류 시 사용 횟수 롤백
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