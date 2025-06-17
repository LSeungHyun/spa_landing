"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Brain,
    Cpu,
    Database,
    Zap,
    Shield,
    Globe,
    Code,
    BarChart3
} from "lucide-react";

export function TechnicalShowcase() {
    const techSpecs = [
        {
            icon: Brain,
            title: "AI 엔진",
            description: "GPT-4 기반 최신 언어 모델",
            details: "99.9% 정확도"
        },
        {
            icon: Zap,
            title: "처리 속도",
            description: "실시간 프롬프트 최적화",
            details: "< 2초 응답"
        },
        {
            icon: Shield,
            title: "보안",
            description: "엔터프라이즈급 데이터 보호",
            details: "ISO 27001 인증"
        },
        {
            icon: Globe,
            title: "다국어 지원",
            description: "15개 언어 실시간 번역",
            details: "한/영/일/중 완벽 지원"
        }
    ];

    const features = [
        {
            category: "프롬프트 분석",
            items: [
                "의도 파악 AI",
                "맥락 이해 엔진",
                "목적 분류 시스템"
            ]
        },
        {
            category: "최적화 알고리즘",
            items: [
                "구조화 템플릿",
                "역할별 맞춤화",
                "품질 보증 체크"
            ]
        },
        {
            category: "결과 검증",
            items: [
                "실시간 품질 평가",
                "개선 제안 시스템",
                "성과 지표 추적"
            ]
        }
    ];

    return (
        <section className="py-16 bg-slate-50">
            <Container>
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4" variant="secondary">
                            <Code className="w-4 h-4 mr-2" />
                            기술적 우수성
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                            최첨단 AI 기술로 구현된
                            <br />
                            <span className="text-blue-600">스마트 프롬프트 시스템</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            업계 최고 수준의 AI 기술과 알고리즘을 통해
                            완벽한 프롬프트 최적화 경험을 제공합니다
                        </p>
                    </motion.div>

                    {/* 기술 사양 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                    >
                        {techSpecs.map((spec, index) => {
                            const Icon = spec.icon;
                            return (
                                <motion.div
                                    key={spec.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                >
                                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                                        <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                            {spec.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-2">
                                            {spec.description}
                                        </p>
                                        <Badge variant="outline" className="text-xs text-blue-600">
                                            {spec.details}
                                        </Badge>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* 시스템 아키텍처 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid lg:grid-cols-3 gap-8 mb-16"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            >
                                <Card className="p-6 h-full">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-4">
                                        {feature.category}
                                    </h3>
                                    <ul className="space-y-3">
                                        {feature.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="text-slate-600">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* 성능 지표 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                            <div className="text-center mb-8">
                                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                    검증된 성능 지표
                                </h3>
                                <p className="text-slate-600">
                                    실제 사용자 데이터를 기반으로 한 성능 측정 결과
                                </p>
                            </div>

                            <div className="grid md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                                    <div className="text-sm text-slate-600">시스템 가동률</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-600 mb-2">2.1초</div>
                                    <div className="text-sm text-slate-600">평균 응답 시간</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                                    <div className="text-sm text-slate-600">사용자 만족도</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-orange-600 mb-2">1M+</div>
                                    <div className="text-sm text-slate-600">월간 처리 요청</div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
} 