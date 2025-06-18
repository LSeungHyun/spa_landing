"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Copy, CheckCircle } from "lucide-react";
import { Persona } from "@/app/page";
import ProcessingSteps from '@/components/shared/processing-steps';

interface AIDemoProps {
    persona: Persona;
    onTextGenerated: (original: string, improved: string) => void;
}

export function AIDemo({ persona, onTextGenerated }: AIDemoProps) {
    const [input, setInput] = useState("");
    const [optimizedPrompt, setOptimizedPrompt] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [copied, setCopied] = useState(false);

    const examples = {
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
        }
    };

    const currentExample = examples[persona as keyof typeof examples];

    const handleOptimize = async () => {
        if (!input.trim()) return;

        setIsProcessing(true);
        setCurrentStep(0);
        setOptimizedPrompt("");

        try {
            // Step progression simulation
            const stepDurations = [2000, 3000, 2000, 1000]; // matches ProcessingSteps durations

            for (let i = 0; i < stepDurations.length - 1; i++) {
                setCurrentStep(i);
                await new Promise(resolve => setTimeout(resolve, stepDurations[i]));
            }

            setCurrentStep(stepDurations.length - 1);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            let optimized = "";
            if (persona === 'pm-developer') {
                optimized = `[개발자용 최적화 프롬프트]

목표: ${input}

다음 구조로 상세히 작성해주세요:
1. 배경 및 목적
2. 기술적 요구사항
3. 구현 방법론
4. 예상 일정 및 리소스
5. 리스크 및 대응방안

전문적이고 구체적인 용어를 사용하여 개발팀이 바로 실행할 수 있는 수준으로 작성해주세요.`;
            } else {
                optimized = `[콘텐츠 크리에이터용 최적화 프롬프트]

주제: ${input}

다음 요소를 포함하여 작성해주세요:
1. 타겟 오디언스 분석
2. 핵심 메시지 및 가치 제안
3. 감정적 호응을 이끌어낼 스토리텔링 요소
4. SEO 최적화 키워드 포함
5. 행동 유도(CTA) 문구

브랜드 톤앤매너를 고려하고, 플랫폼별 특성에 맞게 조정하여 작성해주세요.`;
            }

            setOptimizedPrompt(optimized);
            onTextGenerated(input, optimized);

            // Complete the process
            setTimeout(() => {
                setIsProcessing(false);
                setCurrentStep(0);
            }, 1000);

        } catch (error) {
            console.error('Error:', error);
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
                            AI 최적화 데모
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                            프롬프트 최적화 체험하기
                        </h2>
                        <p className="text-lg text-slate-600">
                            간단한 요청을 입력하면 AI가 더 효과적인 프롬프트로 변환해드립니다
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        {/* 샘플 프롬프트 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                빠른 시작 예제
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {currentExample.samples.map((sample, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSampleClick(sample)}
                                        className="text-sm"
                                    >
                                        {sample}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* 입력 영역 */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card className="p-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-red-500">Before</span>
                                            <Badge variant="outline" className="text-red-600 border-red-200">
                                                일반적인 입력
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            간단한 아이디어나 요청사항을 입력해보세요
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Textarea
                                            placeholder={currentExample.placeholder}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className="min-h-[200px] resize-none"
                                            disabled={isProcessing}
                                        />
                                        <Button
                                            onClick={handleOptimize}
                                            disabled={!input.trim() || isProcessing}
                                            className="w-full"
                                            size="lg"
                                        >
                                            {isProcessing ? (
                                                <div className="w-full">
                                                    <ProcessingSteps
                                                        isProcessing={isProcessing}
                                                        currentStep={currentStep}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    AI로 전문가 수준으로 최적화
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* 결과 영역 */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card className="p-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-green-500">After</span>
                                            <Badge variant="outline" className="text-green-600 border-green-200">
                                                전문가 수준 결과
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            AI가 생성한 구체적이고 실행 가능한 계획
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
                                                <div className="flex items-center gap-2 text-sm text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    최적화 완료! 전문가 수준의 상세한 계획이 생성되었습니다.
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center min-h-[200px] text-gray-500">
                                                최적화된 결과가 여기에 표시됩니다
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
} 