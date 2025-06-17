'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export function SmartPromptHero() {
    return (
        <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-slate-100">
            <Container>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            AI 기반 프롬프트 최적화
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                            스마트 프롬프트
                            <br />
                            어시스턴트
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
                            당신의 프롬프트를 더 정확하고 효과적으로 만들어주는
                            <br />
                            AI 기반 최적화 도구
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    >
                        <Button size="lg" className="text-lg px-8 py-4">
                            지금 시작하기
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                            <Zap className="mr-2 w-5 h-5" />
                            데모 체험하기
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                                        기존 프롬프트
                                    </h3>
                                    <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                                        &quot;논문 초록을 써줘&quot;
                                    </div>
                                </div>

                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-green-600 mb-4">
                                        최적화된 프롬프트
                                    </h3>
                                    <div className="bg-green-50 rounded-lg p-4 text-sm text-slate-700">
                                        &quot;다음 논문의 핵심 내용을 바탕으로 150-250단어 분량의 학술적 초록을 작성해주세요.
                                        연구 목적, 방법론, 주요 결과, 결론을 포함하여 명확하고 간결하게 작성해주세요.&quot;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
} 