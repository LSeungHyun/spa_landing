'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Clock, Target } from 'lucide-react';

export function SmartPromptHero() {
    return (
        <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <Container>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            노력 없는 전문성, 증폭된 결과물
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                백지의 압박
                            </span>
                            <br />
                            <span className="text-slate-800">
                                이제 그만.
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 mb-4 leading-relaxed">
                            막연한 아이디어를 <strong>1분 안에</strong> 완성된 결과물로
                        </p>

                        <p className="text-lg text-slate-500 mb-8">
                            보이지 않는 강화 엔진이 당신의 창작과 기획을 10배 빠르게 만듭니다
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    >
                        <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            무료 체험 시작하기
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
                            <Zap className="mr-2 w-5 h-5" />
                            1분 데모 보기
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative mb-12"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        <h3 className="text-lg font-semibold text-red-600">
                                            백지의 압박 상황
                                        </h3>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                                        <div className="mb-2 text-xs text-red-500">입력</div>
                                        "구독 결제 시스템 만들어줘"
                                        <div className="mt-3 pt-3 border-t border-red-200">
                                            <div className="text-xs text-red-500 mb-1">결과</div>
                                            막막함... 어디서부터 시작해야 할지 모르겠음 😰
                                        </div>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        <h3 className="text-lg font-semibold text-green-600">
                                            스마트 프롬프트 결과
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            <Clock className="w-3 h-3" />
                                            1분
                                        </div>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                                        <div className="mb-2 text-xs text-green-600">입력</div>
                                        "구독 결제 시스템 만들어줘"
                                        <div className="mt-3 pt-3 border-t border-green-200">
                                            <div className="text-xs text-green-600 mb-1">결과</div>
                                            <div className="font-medium">
                                                ✅ 완전한 기능 명세서<br />
                                                ✅ API 설계 가이드<br />
                                                ✅ 보안 체크리스트<br />
                                                ✅ 개발 일정 계획
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ROI Stats Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">90%</div>
                            <div className="text-sm text-slate-600">기획 시간 단축</div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 mx-auto">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">3.5배</div>
                            <div className="text-sm text-slate-600">결과물 품질 향상</div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 mx-auto">
                                <Sparkles className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">95%</div>
                            <div className="text-sm text-slate-600">사용자 만족도</div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
} 