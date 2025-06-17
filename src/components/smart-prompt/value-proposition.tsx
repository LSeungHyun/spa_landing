"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Target,
    TrendingUp,
    Zap,
    Users,
    CheckCircle,
    ArrowRight
} from "lucide-react";

export function ValueProposition() {
    const benefits = [
        {
            icon: Clock,
            title: "시간 절약",
            description: "프롬프트 작성 시간을 80% 단축",
            metric: "80%",
            detail: "평균 30분 → 6분"
        },
        {
            icon: Target,
            title: "정확성 향상",
            description: "AI 응답의 정확도가 3배 향상",
            metric: "3x",
            detail: "더 정확한 결과"
        },
        {
            icon: TrendingUp,
            title: "성과 개선",
            description: "업무 효율성 대폭 증가",
            metric: "200%",
            detail: "생산성 향상"
        }
    ];

    const features = [
        {
            icon: Zap,
            title: "실시간 최적화",
            description: "입력과 동시에 즉시 개선된 프롬프트를 제공합니다"
        },
        {
            icon: Users,
            title: "역할별 맞춤화",
            description: "PM, 개발자, 크리에이터 등 역할에 특화된 템플릿"
        },
        {
            icon: CheckCircle,
            title: "검증된 효과",
            description: "1000+ 사용자가 검증한 프롬프트 개선 알고리즘"
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden relative">
            {/* 배경 장식 */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl" />
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full blur-xl" />
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full blur-xl" />
            </div>

            <Container className="relative z-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-6 bg-white/20 text-white border-white/30">
                            혁신적인 가치 제안
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            더 나은 AI 경험을 위한
                            <br />
                            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                스마트한 선택
                            </span>
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            복잡하고 비효율적인 프롬프트 작성은 이제 그만.
                            AI의 힘을 100% 활용할 수 있는 새로운 방법을 경험해보세요.
                        </p>
                    </motion.div>

                    {/* 핵심 혜택 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid md:grid-cols-3 gap-8 mb-16"
                    >
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                >
                                    <Card className="p-8 bg-white/10 backdrop-blur border-white/20 hover:bg-white/15 transition-all duration-300">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="text-4xl font-bold text-yellow-300 mb-2">
                                                {benefit.metric}
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-blue-100 mb-2">
                                                {benefit.description}
                                            </p>
                                            <div className="text-sm text-blue-200">
                                                {benefit.detail}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* 주요 기능 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mb-16"
                    >
                        <h3 className="text-3xl font-bold text-center mb-12">
                            왜 스마트 프롬프트 어시스턴트인가?
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="w-12 h-12 mx-auto mb-4 bg-yellow-400 rounded-lg flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-blue-800" />
                                        </div>
                                        <h4 className="text-xl font-semibold mb-3">
                                            {feature.title}
                                        </h4>
                                        <p className="text-blue-100">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* CTA 섹션 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-center"
                    >
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 md:p-12 border border-white/20">
                            <h3 className="text-3xl md:text-4xl font-bold mb-6">
                                지금 바로 시작하세요
                            </h3>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                무료로 체험하고 AI 프롬프트의 새로운 가능성을 발견해보세요
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-yellow-400 text-blue-800 hover:bg-yellow-300 text-lg px-8 py-4 font-semibold"
                                >
                                    무료로 시작하기
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                                >
                                    더 알아보기
                                </Button>
                            </div>
                            <p className="text-sm text-blue-200 mt-4">
                                신용카드 불필요 • 언제든 업그레이드 가능
                            </p>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
} 