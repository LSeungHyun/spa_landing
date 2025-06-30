'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Wand2, 
    X, 
    CheckCircle2, 
    Clock, 
    TrendingUp,
    FileText,
    Shield,
    Calendar,
    Zap,
    Chrome,
    Sparkles,
    ArrowRight,
    Download,
    Eye,
    ClipboardList,
    Lightbulb,
    Code
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BeforeAfterHeroSectionProps {
    className?: string;
    showMetrics?: boolean;
    onTransformClick?: () => void;
    onPreRegisterClick?: () => void;
}

export function BeforeAfterHeroSection({ 
    className, 
    showMetrics = true,
    onTransformClick,
    onPreRegisterClick
}: BeforeAfterHeroSectionProps) {
    const handleDemoScroll = () => {
        if (onTransformClick) {
            onTransformClick();
        } else {
            // 데모 섹션으로 부드럽게 스크롤
            const demoSection = document.getElementById('demo-section');
            if (demoSection) {
                demoSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const handlePreRegisterScroll = () => {
        if (onPreRegisterClick) {
            onPreRegisterClick();
        }
        // 사전등록 섹션으로 자동 스크롤
        setTimeout(() => {
            const preRegSection = document.querySelector('[data-section="pre-registration"]');
            if (preRegSection) {
                preRegSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const scaleOnHover = {
        scale: 1.1,
        transition: { duration: 0.2, ease: 'easeOut' }
    };

    return (
        <section className={cn(
            'pt-20 pb-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
            className
        )}>
            <Container>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        {/* Chrome Extension Badge - 다크 테마 */}
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-full text-blue-300 font-medium mb-6 border border-blue-700/50 backdrop-blur-sm">
                            <Chrome className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-semibold">Chrome 확장 프로그램</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full border border-green-700/50">곧 출시</span>
                        </div>

                        {/* Main Headlines - 자연스러운 줄바꿈 최적화 */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                            🧠
                            {/* 모바일 전용 2줄 */}
                            <div className="sm:hidden">
                                <div>ChatGPT가 더</div>
                                <div>똑똑해지는 마법</div>
                            </div>

                            {/* PC 전용 2줄 */}
                            <div className="hidden sm:block">
                                <div>ChatGPT가 더 똑똑해지는</div>
                                <div>마법</div>
                            </div>
                        </h1>

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-200 mb-6 leading-relaxed max-w-3xl mx-auto">
                            📌 브라우저에서 즉시&nbsp;작동하는 크롬&nbsp;확장&nbsp;프로그램
                        </h2>

                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed max-w-4xl mx-auto">
                            <strong className="text-blue-300">ChatGPT 옆에 딱&nbsp;붙어</strong> 막연한 아이디어를 <strong className="text-purple-300">1분&nbsp;안에</strong> 완성된&nbsp;결과물로
                        </p>

                        <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
                            보이지 않는 강화&nbsp;엔진이 당신의 창작과&nbsp;기획을 10배&nbsp;빠르게 만듭니다
                        </p>
                    </motion.div>

                    {/* Enhanced CTA Buttons - 모바일 최적화 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col gap-4 justify-center mb-12 px-4 sm:px-0"
                    >
                        <Button
                            size="lg"
                            className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold"
                            onClick={handlePreRegisterScroll}
                        >
                            <Download className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Chrome 확장 프로그램 출시 알림 받기</span>
                            <span className="sm:hidden">출시 알림 받기</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200 hover:text-white shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                            onClick={handleDemoScroll}
                        >
                            <Eye className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">👇 지금 바로 체험해보세요</span>
                            <span className="sm:hidden">👇 1분 체험</span>
                        </Button>
                    </motion.div>

                    {/* Enhanced Before & After Demo - 다크 테마 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative mb-12"
                    >
                        <div className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50 backdrop-blur-sm">
                            {/* Browser Window Frame - 다크 테마 */}
                            <div className="bg-gray-900/80 rounded-t-lg p-3 mb-6 border-b border-gray-600/50">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 bg-gray-800 rounded px-3 py-1 mx-2 sm:mx-4 text-xs text-gray-400 border border-gray-600/50">
                                        chat.openai.com
                                    </div>
                                    <div className="flex items-center gap-1 bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs border border-blue-700/50">
                                        <Chrome className="w-3 h-3" />
                                        <span className="hidden sm:inline">Smart Prompt</span>
                                        <span className="sm:hidden">SPA</span>
                                    </div>
                                </div>
                            </div>

                            {/* Before & After 비교 */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
                                {/* Before Panel */}
                                <div className="lg:col-span-1 text-left">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        <h3 className="text-base sm:text-lg font-semibold text-red-400">
                                            기본 아이디어
                                        </h3>
                                    </div>
                                    <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 text-sm">
                                        <div className="mb-2 text-xs text-red-400">사용자 입력</div>
                                        <div className="text-gray-300 mb-3 font-mono text-sm bg-gray-900/50 p-2 rounded">
                                            "구독 결제 시스템 만들어줘"
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-red-300">
                                                <X className="w-4 h-4 mr-2" />
                                                <span className="text-xs">막연한 기능 목록</span>
                                            </div>
                                            <div className="flex items-center text-red-300">
                                                <X className="w-4 h-4 mr-2" />
                                                <span className="text-xs">구현 세부사항 없음</span>
                                            </div>
                                            <div className="flex items-center text-red-300">
                                                <X className="w-4 h-4 mr-2" />
                                                <span className="text-xs">불분명한 실행 계획</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transform Icon */}
                                <div className="lg:col-span-1 flex justify-center">
                                    <motion.button
                                        onClick={handleDemoScroll}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-blue-400/50"
                                        aria-label="변환 과정 체험하기"
                                    >
                                        <Wand2 className="w-8 h-8" />
                                    </motion.button>
                                </div>

                                {/* After Panel */}
                                <div className="lg:col-span-1 text-left">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        <h3 className="text-base sm:text-lg font-semibold text-green-400">
                                            전문적인 결과물
                                        </h3>
                                    </div>
                                    <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 text-sm">
                                        <div className="mb-2 text-xs text-green-400">SPA 개선 결과</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-green-300">
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                <span className="text-xs">상세 기능명세서 (12p)</span>
                                            </div>
                                            <div className="flex items-center text-green-300">
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                <span className="text-xs">Stripe API 연동 가이드</span>
                                            </div>
                                            <div className="flex items-center text-green-300">
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                <span className="text-xs">보안 체크리스트</span>
                                            </div>
                                            <div className="flex items-center text-green-300">
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                <span className="text-xs">4주 개발 로드맵</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 핵심 가치 제안 */}
                            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700/50 mt-8">
                                <div className="text-center">
                                    <h4 className="text-lg font-semibold text-purple-300 mb-3">
                                        💡 핵심 차이점
                                    </h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Smart Prompt Assistant는 <strong className="text-blue-300">같은 ChatGPT</strong>를 사용하되,<br/>
                                        <strong className="text-purple-300">더 구체적이고 맥락이 풍부한 프롬프트</strong>로 변환하여<br/>
                                        <strong className="text-green-300">실무에 바로 적용 가능한 결과물</strong>을 얻어냅니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* User Benefits Cards - 다크 테마 */}
                    {showMetrics && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                        >
                            <div className="bg-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-700/50 backdrop-blur-sm">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-900/50 rounded-lg mb-4 mx-auto border border-blue-700/50">
                                    <ClipboardList className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="text-xl font-bold text-white mb-2">기획자 & PM을 위해</div>
                                <div className="text-sm text-gray-400">명확한 요구사항 정의서(PRD)와 기술 스펙 문서를 순식간에 확보하여, 개발팀과의 소통 비용을 제로로 만드세요.</div>
                            </div>

                            <div className="bg-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-700/50 backdrop-blur-sm">
                                <div className="flex items-center justify-center w-12 h-12 bg-purple-900/50 rounded-lg mb-4 mx-auto border border-purple-700/50">
                                    <Lightbulb className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="text-xl font-bold text-white mb-2">1인 창업가를 위해</div>
                                <div className="text-sm text-gray-400">머릿속 아이디어를 즉시 투자 제안서와 초기 사업 계획서의 형태로 구체화하여, 실행력을 극대화하세요.</div>
                            </div>

                            <div className="bg-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-700/50 backdrop-blur-sm">
                                <div className="flex items-center justify-center w-12 h-12 bg-green-900/50 rounded-lg mb-4 mx-auto border border-green-700/50">
                                    <Code className="w-6 h-6 text-green-400" />
                                </div>
                                <div className="text-xl font-bold text-white mb-2">개발자를 위해</div>
                                <div className="text-sm text-gray-400">모호한 기획 대신, 체계적인 API 명세와 로드맵을 기반으로 프로젝트를 시작하여 재작업과 기술 부채를 방지하세요.</div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </Container>
        </section>
    );
}

export default BeforeAfterHeroSection; 