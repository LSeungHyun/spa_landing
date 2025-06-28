'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Target, Zap, CheckCircle, AlertCircle, Users, TrendingUp } from 'lucide-react';

interface ComparisonScenario {
    title: string;
    category: string;
    before: {
        title: string;
        description: string;
        problems: string[];
        time: string;
        success: string;
    };
    after: {
        title: string;
        description: string;
        benefits: string[];
        time: string;
        success: string;
    };
}

const scenarios: ComparisonScenario[] = [
    {
        title: "이커머스 앱 개발",
        category: "개발/기획",
        before: {
            title: "막연한 아이디어",
            description: "온라인 쇼핑몰 앱을 만들고 싶어요.",
            problems: [
                "기능 정의 부족",
                "기술 선택 어려움",
                "일정 산정 불가"
            ],
            time: "3주 소요",
            success: "30% 성공률"
        },
        after: {
            title: "완성된 기획서",
            description: "상품 검색, 장바구니, 결제, 리뷰 시스템이 포함된 완전한 앱 기획서",
            benefits: [
                "상세 기능 명세서 생성",
                "최적 기술 스택 추천",
                "단계별 개발 계획"
            ],
            time: "2분 완성",
            success: "95% 성공률"
        }
    },
    {
        title: "유튜브 채널 기획",
        category: "콘텐츠",
        before: {
            title: "모호한 콘셉트",
            description: "IT 유튜브 채널을 시작하고 싶어요.",
            problems: [
                "타겟 오디언스 불분명",
                "콘텐츠 방향성 부재",
                "차별화 포인트 없음"
            ],
            time: "2개월 소요",
            success: "20% 성공률"
        },
        after: {
            title: "완성된 채널 전략",
            description: "초보 개발자 대상 'Web 개발 입문' 채널, 주 2회 튜토리얼 콘텐츠",
            benefits: [
                "명확한 타겟 정의",
                "콘텐츠 캘린더 생성",
                "수익화 로드맵 제시"
            ],
            time: "3분 완성",
            success: "90% 성공률"
        }
    },
    {
        title: "마케팅 캠페인",
        category: "마케팅",
        before: {
            title: "단순한 광고 아이디어",
            description: "신제품 소셜미디어 광고를 하고 싶어요.",
            problems: [
                "타겟 고객 불분명",
                "채널별 전략 없음",
                "성과 측정 기준 모호"
            ],
            time: "1주일 소요",
            success: "40% 성공률"
        },
        after: {
            title: "데이터 기반 캠페인",
            description: "25-35세 직장인 대상 인스타그램/페이스북 복합 캠페인",
            benefits: [
                "세밀한 타겟팅 전략",
                "채널별 최적화 크리에이티브",
                "명확한 KPI 측정 체계"
            ],
            time: "5분 완성",
            success: "85% 성공률"
        }
    }
];

export function BeforeAfterDemo() {
    const [selectedScenario, setSelectedScenario] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleScenarioChange = (index: number) => {
        if (index === selectedScenario) return;

        setIsAnimating(true);
        setTimeout(() => {
            setSelectedScenario(index);
            setIsAnimating(false);
        }, 300);
    };

    const currentScenario = scenarios[selectedScenario];

    return (
        <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background">
            <Container>
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                            SPA 효과 비교
                        </Badge>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                막연한 아이디어 → 전문가 결과
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            막연한 아이디어를 전문가 수준의 완성된 결과물로 변화시킵니다
                        </p>
                    </motion.div>
                </div>

                {/* 시나리오 선택 탭 */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {scenarios.map((scenario, index) => (
                        <Button
                            key={index}
                            variant={selectedScenario === index ? "default" : "outline"}
                            size="lg"
                            onClick={() => handleScenarioChange(index)}
                            className={`transition-all duration-300 ${selectedScenario === index
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'hover:bg-muted'
                                }`}
                        >
                            {scenario.title}
                            <Badge variant="secondary" className="ml-2 text-xs">
                                {scenario.category}
                            </Badge>
                        </Button>
                    ))}
                </div>

                {/* Before/After 비교 */}
                <motion.div
                    key={selectedScenario}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? 20 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid lg:grid-cols-2 gap-8 items-center"
                >
                    {/* Before 카드 */}
                    <Card className="p-8 border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                            <Badge variant="destructive" className="bg-red-500">
                                SPA 없이
                            </Badge>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="text-red-500" size={24} />
                                <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">
                                    {currentScenario.before.title}
                                </h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                &quot;{currentScenario.before.description}&quot;
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <h4 className="font-semibold text-red-700 dark:text-red-300 flex items-center gap-2 text-sm">
                                <AlertCircle size={14} />
                                문제점
                            </h4>
                            <ul className="space-y-2">
                                {currentScenario.before.problems.map((problem, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                        <span>{problem}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                <Clock size={16} />
                                <span>{currentScenario.before.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                <Target size={16} />
                                <span>{currentScenario.before.success}</span>
                            </div>
                        </div>
                    </Card>

                    {/* 화살표 */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                            <ArrowRight size={24} />
                        </div>
                    </div>

                    {/* After 카드 */}
                    <Card className="p-8 border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 relative overflow-hidden lg:col-start-2">
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-green-500 text-white">
                                SPA 활용
                            </Badge>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="text-green-500" size={24} />
                                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {currentScenario.after.title}
                                </h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {currentScenario.after.description}
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <h4 className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2 text-sm">
                                <CheckCircle size={14} />
                                개선사항
                            </h4>
                            <ul className="space-y-2">
                                {currentScenario.after.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <Zap size={16} />
                                <span>{currentScenario.after.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <TrendingUp size={16} />
                                <span>{currentScenario.after.success}</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* 핵심 메시지 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-16"
                >
                    <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                이제 모든 아이디어가 전문가 수준이 됩니다
                            </span>
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            막연한 아이디어를 실행 가능한 전문가 수준의 결과물로 변환합니다.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="text-blue-500" size={16} />
                                <span>평균 <strong>90% 시간 단축</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="text-green-500" size={16} />
                                <span>성공률 <strong>3배 증가</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="text-purple-500" size={16} />
                                <span><strong>10,000+</strong> 사용자 만족</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
} 