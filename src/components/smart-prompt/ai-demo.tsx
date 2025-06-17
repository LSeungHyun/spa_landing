"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Copy, Check } from "lucide-react";
import { Persona } from "@/app/page";


interface AIDemoProps {
    persona: Persona;
    onTextGenerated: (original: string, improved: string) => void;
}

export function AIDemo({ persona, onTextGenerated }: AIDemoProps) {
    const [userInput, setUserInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [improvedPrompt, setImprovedPrompt] = useState("");
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
        if (!userInput.trim()) return;

        setIsProcessing(true);

        // AI 최적화 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 2000));

        let optimized = "";
        if (persona === 'pm-developer') {
            optimized = `[개발자용 최적화 프롬프트]

목표: ${userInput}

다음 구조로 상세히 작성해주세요:
1. 배경 및 목적
2. 기술적 요구사항
3. 구현 방법론
4. 예상 일정 및 리소스
5. 리스크 및 대응방안

전문적이고 구체적인 용어를 사용하여 개발팀이 바로 실행할 수 있는 수준으로 작성해주세요.`;
        } else {
            optimized = `[콘텐츠 크리에이터용 최적화 프롬프트]

주제: ${userInput}

다음 요소를 포함하여 작성해주세요:
1. 타겟 오디언스 분석
2. 핵심 메시지 및 가치 제안
3. 감정적 호응을 이끌어낼 스토리텔링 요소
4. SEO 최적화 키워드 포함
5. 행동 유도(CTA) 문구

브랜드 톤앤매너를 고려하고, 플랫폼별 특성에 맞게 조정하여 작성해주세요.`;
        }

        setImprovedPrompt(optimized);
        onTextGenerated(userInput, optimized);
        setIsProcessing(false);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(improvedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSampleClick = (sample: string) => {
        setUserInput(sample);
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
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                                        1. 기본 요청 입력
                                    </h3>
                                    <Textarea
                                        placeholder={currentExample.placeholder}
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        className="min-h-[120px] mb-4"
                                    />
                                    <Button
                                        onClick={handleOptimize}
                                        disabled={!userInput.trim() || isProcessing}
                                        className="w-full"
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center justify-center">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="w-4 h-4 mr-2"
                                                >
                                                    <Sparkles className="w-4 h-4" />
                                                </motion.div>
                                                최적화 중...
                                            </div>
                                        ) : (
                                            <>
                                                최적화하기
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </Card>
                            </motion.div>

                            {/* 결과 영역 */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-green-600">
                                            2. 최적화된 프롬프트
                                        </h3>
                                        {improvedPrompt && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCopy}
                                                className="flex items-center gap-2"
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        복사됨
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        복사
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    <div className="min-h-[120px] p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        {improvedPrompt ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="text-sm text-slate-700 whitespace-pre-wrap"
                                            >
                                                {improvedPrompt}
                                            </motion.div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                최적화된 프롬프트가 여기에 표시됩니다
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
} 