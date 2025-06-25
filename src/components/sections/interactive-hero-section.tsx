'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2,
    Loader2,
    Copy,
    CheckCircle2,
    Sparkles,
    Target,
    Zap,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUsageLimitSync } from '@/hooks/use-usage-limit-sync';
import { UsageIndicator } from '@/components/shared/usage-indicator';

interface InteractiveHeroSectionProps {
    onPreRegisterClick?: () => void;
}

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

export function InteractiveHeroSection({ onPreRegisterClick }: InteractiveHeroSectionProps) {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    // 사용 제한 동기화 훅
    const usageSync = useUsageLimitSync();

    // 타이핑 애니메이션 효과
    useEffect(() => {
        if (isTyping && displayText) {
            if (currentIndex < displayText.length) {
                const timeout = setTimeout(() => {
                    setInputText(displayText.slice(0, currentIndex + 1));
                    setCurrentIndex(currentIndex + 1);
                }, 30); // 타이핑 속도 조절
                return () => clearTimeout(timeout);
            } else {
                setIsTyping(false);
                setCurrentIndex(0);
            }
        }
    }, [isTyping, displayText, currentIndex]);

    // 프롬프트 향상 처리
    const handleImprovePrompt = async () => {
        if (!inputText.trim()) {
            toast.error('프롬프트를 입력해주세요');
            return;
        }

        // 사용 제한 확인
        if (!usageSync.canUse) {
            toast.error('일일 사용 한도를 초과했습니다. 내일 다시 시도해주세요.');
            if (onPreRegisterClick) {
                setTimeout(() => {
                    onPreRegisterClick();
                }, 1500);
            }
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/improve-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: inputText }),
            });

            const data: ImprovePromptResponse = await response.json();

            if (!response.ok) {
                // 에러 상태 코드별 처리
                if (response.status === 429) {
                    // 사용 제한 초과 (실제 사용자 한도)
                    toast.error(data.error || '일일 사용 한도(3회)를 초과했습니다.');
                    if (onPreRegisterClick) {
                        setTimeout(() => {
                            onPreRegisterClick();
                        }, 2000);
                    }
                } else if (response.status === 503) {
                    // Gemini API 할당량 초과 (서비스 문제)
                    toast.warning('AI 서비스가 일시적으로 사용량이 많습니다. 잠시 후 다시 시도해주세요.', {
                        description: '이는 사용자의 일일 한도와는 별개의 문제입니다.'
                    });
                } else {
                    toast.error(data.error || '프롬프트 향상에 실패했습니다');
                }

                // 서버에서 사용 정보가 온 경우 동기화
                if (data.usageInfo) {
                    usageSync.updateFromServerResponse({
                        usageCount: data.usageInfo.usageCount,
                        remainingCount: data.usageInfo.remainingCount,
                        maxUsageCount: data.usageInfo.maxUsageCount,
                        resetTime: data.usageInfo.resetTime,
                    });
                }
                return;
            }

            // 성공 응답 처리
            if (data.improvedPrompt) {
                // 타이핑 애니메이션 시작
                setDisplayText(data.improvedPrompt);
                setCurrentIndex(0);
                setIsTyping(true);
                setInputText(''); // 기존 텍스트 클리어

                toast.success('프롬프트가 향상되었습니다!');
            }

            // 서버에서 사용 정보가 온 경우 동기화
            if (data.usageInfo) {
                usageSync.updateFromServerResponse({
                    usageCount: data.usageInfo.usageCount,
                    remainingCount: data.usageInfo.remainingCount,
                    maxUsageCount: data.usageInfo.maxUsageCount,
                    resetTime: data.usageInfo.resetTime,
                });
            }

        } catch (error) {
            toast.error('프롬프트 향상에 실패했습니다. 다시 시도해주세요.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // 복사 기능
    const handleCopy = async () => {
        if (!inputText.trim()) {
            toast.error('복사할 텍스트가 없습니다');
            return;
        }

        try {
            await navigator.clipboard.writeText(inputText);
            toast.success('클립보드에 복사되었습니다!');
        } catch (error) {
            toast.error('복사에 실패했습니다');
        }
    };

    // 샘플 프롬프트
    const samplePrompts = [
        "고객에게 제품 소개 이메일을 작성해야 해요",
        "신제품 런칭 프레젠테이션 개요를 만들어주세요",
        "마케팅 캠페인 아이디어를 브레인스토밍해주세요"
    ];

    const handleSampleClick = (sample: string) => {
        setInputText(sample);
    };

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-brand-dark-primary via-brand-dark-secondary to-brand-dark-tertiary">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 text-6xl">✨</div>
                <div className="absolute top-32 right-20 text-4xl">🎯</div>
                <div className="absolute bottom-40 left-20 text-5xl">💡</div>
                <div className="absolute bottom-20 right-32 text-3xl">🚀</div>
                <div className="absolute top-64 left-1/3 text-4xl">⚡</div>
                <div className="absolute top-80 right-1/4 text-3xl">🎨</div>
            </div>

            <Container className="relative pt-20 pb-16">
                <div className="max-w-4xl mx-auto">
                    {/* 헤더 */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 bg-brand-accent-blue/20 text-brand-accent-blue px-4 py-2 rounded-full text-sm font-medium mb-6"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Wand2 className="w-4 h-4" />
                            AI 기반 프롬프트 최적화
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-brand-text-primary via-brand-accent-blue to-brand-accent-purple bg-clip-text text-transparent leading-tight mb-6">
                            당신의 프롬프트를
                            <br />
                            <span className="text-brand-accent-cyan">완벽하게 만들어드려요</span>
                        </h1>

                        <p className="text-lg md:text-xl text-brand-text-secondary max-w-3xl mx-auto mb-8">
                            AI가 분석하고 개선하는 스마트 프롬프트로 더 정확하고 유용한 답변을 얻어보세요
                        </p>

                        {/* 사용 현황 표시 */}
                        <motion.div
                            className="flex justify-center mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <UsageIndicator
                                variant="compact"
                                className="bg-brand-surface-primary/50 backdrop-blur-sm border-brand-surface-secondary/30"
                            />
                        </motion.div>
                    </motion.div>

                    {/* 프롬프트 입력 섹션 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-8"
                    >
                        <Card className="bg-brand-surface-primary/80 backdrop-blur-xl border-brand-surface-secondary/20 shadow-2xl p-6">
                            {/* 사용 제한 경고 */}
                            {usageSync.isLimitReached && (
                                <motion.div
                                    className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="flex items-center gap-2 text-red-400">
                                        <AlertTriangle className="w-5 h-5" />
                                        <span className="font-medium">일일 사용 한도 초과</span>
                                    </div>
                                    <p className="text-red-300 mt-1 text-sm">
                                        내일 다시 시도하거나 사전 등록을 통해 더 많은 사용 기회를 얻으세요.
                                    </p>
                                </motion.div>
                            )}

                            {/* 입력 필드 */}
                            <div className="relative mb-6">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="프롬프트를 입력하세요. 예: '고객에게 제품 소개 이메일을 작성해주세요'"
                                    className={cn(
                                        "w-full min-h-[120px] p-4 pr-16 bg-brand-dark-primary/50 border border-brand-surface-secondary/30 rounded-xl",
                                        "text-brand-text-primary placeholder:text-brand-text-secondary/60",
                                        "focus:outline-none focus:ring-2 focus:ring-brand-accent-blue/50 focus:border-brand-accent-blue/50",
                                        "resize-none transition-all duration-200",
                                        isTyping && "animate-pulse",
                                        usageSync.isLimitReached && "opacity-50 cursor-not-allowed"
                                    )}
                                    disabled={isLoading || isTyping || usageSync.isLimitReached}
                                />

                                {/* 프롬프트 향상 버튼 - 입력 필드 우측 하단 */}
                                <button
                                    onClick={handleImprovePrompt}
                                    disabled={isLoading || isTyping || !inputText.trim() || usageSync.isLimitReached}
                                    className={cn(
                                        "absolute right-3 bottom-3 p-2 rounded-lg transition-all duration-200",
                                        "bg-yellow-400/80 hover:bg-yellow-400",
                                        "text-black hover:text-black",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        "flex items-center justify-center shadow-lg"
                                    )}
                                    title="프롬프트 향상"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Wand2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {/* 액션 버튼들 */}
                            <div className="flex flex-wrap gap-3 justify-between items-center">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopy}
                                        disabled={!inputText.trim()}
                                        className="border-brand-surface-secondary/30 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-secondary/20"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        복사
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setInputText('')}
                                        disabled={!inputText.trim() || isLoading || isTyping}
                                        className="border-brand-surface-secondary/30 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-secondary/20"
                                    >
                                        초기화
                                    </Button>
                                </div>

                                {/* 사용 제한 초과 시 사전 등록 버튼 */}
                                {usageSync.isLimitReached && onPreRegisterClick && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Button
                                            onClick={onPreRegisterClick}
                                            className="bg-gradient-to-r from-brand-accent-blue to-brand-accent-purple hover:from-brand-accent-blue/90 hover:to-brand-accent-purple/90 text-white"
                                        >
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            사전 등록하고 더 사용하기
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* 샘플 프롬프트 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mb-12"
                    >
                        <h3 className="text-lg font-semibold text-brand-text-primary mb-4 text-center">
                            💡 샘플 프롬프트로 시작해보세요
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {samplePrompts.map((sample, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleSampleClick(sample)}
                                    disabled={usageSync.isLimitReached}
                                    className={cn(
                                        "p-4 text-left bg-brand-surface-primary/40 hover:bg-brand-surface-primary/60 border border-brand-surface-secondary/20 rounded-lg transition-all duration-200",
                                        "text-brand-text-secondary hover:text-brand-text-primary",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-start gap-2">
                                        <Target className="w-4 h-4 mt-0.5 text-brand-accent-blue flex-shrink-0" />
                                        <span className="text-sm">{sample}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* 특징 카드들 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {[
                            {
                                icon: <Sparkles className="w-6 h-6" />,
                                title: "AI 기반 최적화",
                                description: "고급 AI가 당신의 프롬프트를 분석하고 개선합니다"
                            },
                            {
                                icon: <Target className="w-6 h-6" />,
                                title: "정확한 결과",
                                description: "더 구체적이고 명확한 프롬프트로 원하는 답변을 얻으세요"
                            },
                            {
                                icon: <Zap className="w-6 h-6" />,
                                title: "즉시 사용 가능",
                                description: "개선된 프롬프트를 바로 복사해서 사용할 수 있습니다"
                            }
                        ].map((feature, index) => (
                            <Card
                                key={index}
                                className="p-6 bg-brand-surface-primary/40 backdrop-blur-sm border-brand-surface-secondary/20 hover:bg-brand-surface-primary/60 transition-all duration-300"
                            >
                                <div className="text-brand-accent-blue mb-3">
                                    {feature.icon}
                                </div>
                                <h4 className="font-semibold text-brand-text-primary mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-sm text-brand-text-secondary">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </motion.div>
                </div>
            </Container>
        </section>
    );
} 