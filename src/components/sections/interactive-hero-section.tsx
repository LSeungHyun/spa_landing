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
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface InteractiveHeroSectionProps {
    onPreRegisterClick?: () => void;
}

export function InteractiveHeroSection({ onPreRegisterClick }: InteractiveHeroSectionProps) {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

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

        setIsLoading(true);

        try {
            const response = await fetch('/api/improve-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: inputText }),
            });

            if (!response.ok) {
                throw new Error('프롬프트 향상에 실패했습니다');
            }

            const data = await response.json();

            // 타이핑 애니메이션 시작
            setDisplayText(data.improvedPrompt);
            setCurrentIndex(0);
            setIsTyping(true);
            setInputText(''); // 기존 텍스트 클리어

            toast.success('프롬프트가 향상되었습니다!');
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
                    </motion.div>

                    {/* 프롬프트 입력 섹션 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-8"
                    >
                        <Card className="bg-brand-surface-primary/80 backdrop-blur-xl border-brand-surface-secondary/20 shadow-2xl p-6">
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
                                        isTyping && "animate-pulse"
                                    )}
                                    disabled={isLoading || isTyping}
                                />

                                {/* 프롬프트 향상 버튼 - 입력 필드 우측 하단 */}
                                <button
                                    onClick={handleImprovePrompt}
                                    disabled={isLoading || isTyping || !inputText.trim()}
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
                                        onClick={handleCopy}
                                        disabled={!inputText.trim()}
                                        variant="outline"
                                        size="sm"
                                        className="border-brand-surface-secondary/30 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-secondary/20"
                                    >
                                        <Copy className="w-4 h-4 mr-1" />
                                        복사
                                    </Button>
                                </div>

                                <div className="text-sm text-brand-text-secondary">
                                    {isTyping ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            향상된 프롬프트 생성 중...
                                        </span>
                                    ) : (
                                        inputText.length > 0 && `${inputText.length}자`
                                    )}
                                </div>
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
                            💡 샘플 프롬프트를 클릭해보세요
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {samplePrompts.map((prompt, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleSampleClick(prompt)}
                                    className="p-4 bg-brand-surface-secondary/30 hover:bg-brand-surface-secondary/50 border border-brand-surface-secondary/20 rounded-lg text-left transition-all duration-200 group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-brand-accent-blue/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent-blue/30 transition-colors">
                                            <Sparkles className="w-4 h-4 text-brand-accent-blue" />
                                        </div>
                                        <p className="text-sm text-brand-text-secondary group-hover:text-brand-text-primary transition-colors">
                                            {prompt}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* 특징 소개 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-center"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-brand-accent-blue/20 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-brand-accent-blue" />
                                </div>
                                <h4 className="font-semibold text-brand-text-primary">정확한 분석</h4>
                                <p className="text-sm text-brand-text-secondary text-center">
                                    AI가 프롬프트의 의도를 정확히 파악하고 개선점을 찾아냅니다
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-brand-accent-purple/20 rounded-xl flex items-center justify-center">
                                    <Wand2 className="w-6 h-6 text-brand-accent-purple" />
                                </div>
                                <h4 className="font-semibold text-brand-text-primary">스마트 최적화</h4>
                                <p className="text-sm text-brand-text-secondary text-center">
                                    더 구체적이고 효과적인 프롬프트로 자동 변환됩니다
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-brand-accent-cyan/20 rounded-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-brand-accent-cyan" />
                                </div>
                                <h4 className="font-semibold text-brand-text-primary">즉시 적용</h4>
                                <p className="text-sm text-brand-text-secondary text-center">
                                    향상된 프롬프트를 바로 복사해서 사용할 수 있습니다
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
} 