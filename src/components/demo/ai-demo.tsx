"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Copy, CheckCircle } from "lucide-react";
import { Persona } from "@/components/data/persona-types";
import ProcessingSteps from '@/components/shared/processing-steps';
import { toast } from 'sonner';
import { useUsageLimitSync } from '@/hooks/use-usage-limit-sync';

interface AIDemoProps {
    persona: Persona;
    onTextGenerated: (original: string, improved: string) => void;
}

// API 응답 타입 정의
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

export function AIDemo({ persona, onTextGenerated }: AIDemoProps) {
    const [input, setInput] = useState("");
    const [optimizedPrompt, setOptimizedPrompt] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [copied, setCopied] = useState(false);

    // 사용 제한 동기화 훅
    const usageSync = useUsageLimitSync();

    const examples: Record<string, { placeholder: string; samples: string[] }> = {
        'pm-developer': {
            placeholder: "예: 사용자 인증 시스템 개발 계획서 작성해줘",
            samples: [
                "API 문서 작성해줘",
                "데이터베이스 설계 도와줘",
                "프로젝트 일정 관리 방법 알려줘"
            ]
        },
        'content-creator': {
            placeholder: "예: 블로그 포스트 제목 추천해줘",
            samples: [
                "인스타그램 캡션 작성해줘",
                "유튜브 썸네일 아이디어 제안해줘",
                "마케팅 이메일 문구 만들어줘"
            ]
        },
        'startup-founder': {
            placeholder: "예: 투자 제안서 작성해줘",
            samples: [
                "사업계획서 구조 도움 필요",
                "투자자 피치덱 작성법",
                "경쟁사 분석 보고서 작성"
            ]
        },
        'marketer': {
            placeholder: "예: 마케팅 캠페인 기획서 작성해줘",
            samples: [
                "타겟 고객 분석 도움",
                "광고 카피 작성해줘",
                "브랜딩 전략 수립"
            ]
        },
        'consultant': {
            placeholder: "예: 비즈니스 분석 보고서 작성해줘",
            samples: [
                "문제 분석 프레임워크 도움",
                "솔루션 제안서 작성",
                "프로젝트 계획 수립"
            ]
        },
        'freelancer': {
            placeholder: "예: 프로젝트 제안서 작성해줘",
            samples: [
                "클라이언트 제안서 템플릿",
                "프로젝트 견적서 작성",
                "포트폴리오 설명 작성"
            ]
        },
        'ux-designer': {
            placeholder: "예: 사용자 리서치 보고서 작성해줘",
            samples: [
                "디자인 가이드라인 작성",
                "사용자 인터뷰 분석",
                "와이어프레임 설명서"
            ]
        },
        'educator': {
            placeholder: "예: 강의 자료 작성해줘",
            samples: [
                "교육 프로그램 설계",
                "학습 가이드 작성",
                "강의 계획서 구성"
            ]
        },
        'researcher': {
            placeholder: "예: 연구 논문 초안 작성해줘",
            samples: [
                "연구 방법론 설계",
                "문헌 검토 정리",
                "데이터 분석 보고서"
            ]
        }
    };

    const currentExample = examples[persona.id] || examples['pm-developer'];

    const handleOptimize = async () => {
        if (!input.trim()) {
            toast.error('아이디어를 입력해주세요');
            return;
        }

        // 사용 제한 확인
        if (!usageSync.canUse) {
            toast.error('일일 사용 한도를 초과했습니다. 내일 다시 시도해주세요.');
            return;
        }

        setIsProcessing(true);
        setCurrentStep(0);
        setOptimizedPrompt("");

        try {
            // Step progression simulation
            const stepDurations = [1000, 2000, 1500]; // 더 빠른 단계 진행

            for (let i = 0; i < stepDurations.length; i++) {
                setCurrentStep(i);
                await new Promise(resolve => setTimeout(resolve, stepDurations[i]));
            }

            // 실제 API 호출
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idea: input,
                    persona: persona.id,
                }),
            });

            const data: GenerateResponse | GenerateErrorResponse = await response.json();

            if (!response.ok) {
                // 에러 응답 처리
                const errorData = data as GenerateErrorResponse;

                if (response.status === 429) {
                    // 사용 제한 초과 (실제 사용자 한도)
                    toast.error(errorData.error || '일일 사용 한도(3회)를 초과했습니다.');
                } else if (response.status === 503) {
                    // Gemini API 할당량 초과 (서비스 문제)
                    toast.warning('AI 서비스가 일시적으로 사용량이 많습니다. 잠시 후 다시 시도해주세요.', {
                        description: '이는 사용자의 일일 한도와는 별개의 문제입니다.'
                    });
                } else {
                    toast.error(errorData.error || '프롬프트 생성에 실패했습니다');
                }

                // 서버에서 사용 정보가 온 경우 동기화
                if (errorData.usageInfo) {
                    usageSync.updateFromServerResponse({
                        usageCount: errorData.usageInfo.usageCount,
                        remainingCount: errorData.usageInfo.remainingCount,
                        maxUsageCount: errorData.usageInfo.maxUsageCount,
                        resetTime: errorData.usageInfo.resetTime,
                    });
                }
                return;
            }

            // 성공 응답 처리
            const successData = data as GenerateResponse;
            setOptimizedPrompt(successData.content);
            onTextGenerated(input, successData.content);

            // 서버에서 사용 정보가 온 경우 동기화
            if (successData.usageInfo) {
                usageSync.updateFromServerResponse({
                    usageCount: successData.usageInfo.usageCount,
                    remainingCount: successData.usageInfo.remainingCount,
                    maxUsageCount: successData.usageInfo.maxUsageCount,
                    resetTime: successData.usageInfo.resetTime,
                });
            }

            toast.success('프롬프트가 생성되었습니다!');

        } catch (error) {
            console.error('Generate Error:', error);
            toast.error('프롬프트 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsProcessing(false);
            setCurrentStep(0);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(optimizedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSampleClick = (sample: string) => {
        setInput(sample);
    };

    return (
        <section className="py-16 bg-slate-50">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <Badge className="mb-4" variant="secondary">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI 프롬프트 생성 데모
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                            AI 프롬프트 생성 체험하기
                        </h2>
                        <p className="text-lg text-slate-600">
                            간단한 아이디어를 입력하면 AI가 전문적인 프롬프트로 변환해드립니다
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* 입력 섹션 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                            1
                                        </span>
                                        아이디어 입력
                                    </CardTitle>
                                    <CardDescription>
                                        {persona.title}를 위한 프롬프트를 생성합니다
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={currentExample.placeholder}
                                        className="min-h-[120px] resize-none"
                                        disabled={isProcessing}
                                    />

                                    {/* 샘플 프롬프트 */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800 mb-2">
                                            빠른 시작 예제
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {currentExample.samples.map((sample, index) => (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSampleClick(sample)}
                                                    className="text-xs"
                                                    disabled={isProcessing}
                                                >
                                                    {sample}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleOptimize}
                                        disabled={!input.trim() || isProcessing || !usageSync.canUse}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                AI 생성 중...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                AI 프롬프트 생성
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </Button>

                                    {/* 사용 제한 정보 */}
                                    {!usageSync.canUse && (
                                        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                                            일일 사용 한도를 초과했습니다. 내일 다시 시도해주세요.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* 결과 섹션 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                                            2
                                        </span>
                                        생성된 프롬프트
                                    </CardTitle>
                                    <CardDescription>
                                        AI가 최적화한 전문 프롬프트
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center min-h-[200px]">
                                            <ProcessingSteps
                                                isProcessing={isProcessing}
                                                currentStep={currentStep}
                                            />
                                        </div>
                                    ) : optimizedPrompt ? (
                                        <div className="space-y-4">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                                                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                                                    {optimizedPrompt}
                                                </pre>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    생성 완료! 전문가 수준의 프롬프트가 생성되었습니다.
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleCopy}
                                                    className="flex items-center gap-2"
                                                >
                                                    {copied ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            복사됨
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4" />
                                                            복사
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center min-h-[200px] text-gray-500">
                                            생성된 프롬프트가 여기에 표시됩니다
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </section>
    );
} 