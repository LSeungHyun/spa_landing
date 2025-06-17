'use client';

import { motion } from 'framer-motion';
import { Cpu, Globe, Shield, Zap, Code, Brain, Gauge, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TechnicalShowcase = () => {
    const techSpecs = [
        {
            icon: Brain,
            title: "온디바이스 AI",
            description: "클라이언트 사이드에서 직접 실행되는 AI 모델",
            specs: ["TensorFlow.js", "WebGL 가속", "프라이버시 보장"],
            performance: "< 2초 응답시간"
        },
        {
            icon: Gauge,
            title: "고성능 최적화",
            description: "Core Web Vitals 최상위 성능 달성",
            specs: ["LCP < 2.5s", "FID < 100ms", "CLS < 0.1"],
            performance: "99점 Lighthouse"
        },
        {
            icon: Shield,
            title: "보안 & 프라이버시",
            description: "사용자 데이터 완전 보호",
            specs: ["로컬 처리", "데이터 전송 없음", "GDPR 준수"],
            performance: "100% 프라이버시"
        },
        {
            icon: Globe,
            title: "크로스 플랫폼",
            description: "모든 디바이스에서 완벽 동작",
            specs: ["PWA 지원", "반응형 디자인", "오프라인 모드"],
            performance: "98% 호환성"
        }
    ];

    const architectureSteps = [
        {
            step: "01",
            title: "텍스트 입력",
            description: "사용자가 개선할 텍스트를 입력합니다",
            icon: Code,
            color: "from-blue-500 to-cyan-500"
        },
        {
            step: "02",
            title: "AI 분석",
            description: "온디바이스 AI가 실시간으로 텍스트를 분석합니다",
            icon: Brain,
            color: "from-purple-500 to-pink-500"
        },
        {
            step: "03",
            title: "스마트 개선",
            description: "컨텍스트와 페르소나에 맞게 텍스트를 개선합니다",
            icon: Zap,
            color: "from-green-500 to-emerald-500"
        },
        {
            step: "04",
            title: "실시간 비교",
            description: "원본과 개선된 버전을 diff로 비교 제공합니다",
            icon: Gauge,
            color: "from-orange-500 to-red-500"
        }
    ];

    const benchmarks = [
        { metric: "응답 시간", value: "1.8초", improvement: "+40% 빠름" },
        { metric: "정확도", value: "96.8%", improvement: "+15% 향상" },
        { metric: "사용자 만족도", value: "4.9/5", improvement: "+25% 증가" },
        { metric: "처리 용량", value: "10K+ 문자", improvement: "무제한" }
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
                <div className="absolute top-0 left-0 w-full h-full opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* 헤더 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <Badge variant="outline" className="mb-4 border-blue-400/50 text-blue-300">
                        기술적 우수성
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        차세대 AI 기술로
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> 구현</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        최첨단 온디바이스 AI와 고성능 웹 기술을 결합하여
                        빠르고 안전하며 정확한 텍스트 개선 경험을 제공합니다
                    </p>
                </motion.div>

                {/* 기술 스펙 그리드 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {techSpecs.map((spec, index) => (
                        <motion.div
                            key={spec.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                                        <spec.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{spec.title}</h3>
                                        <Badge variant="secondary" className="text-xs mt-1">
                                            {spec.performance}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm mb-4">{spec.description}</p>
                                <div className="space-y-2">
                                    {spec.specs.map((item, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-gray-400">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* 아키텍처 플로우 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">AI 처리 아키텍처</h3>
                        <p className="text-gray-300">4단계 스마트 프로세싱으로 완벽한 텍스트 개선</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {architectureSteps.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative"
                            >
                                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 text-center h-full">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4`}>
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-2">{step.step}</div>
                                    <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                                    <p className="text-sm text-gray-300">{step.description}</p>
                                </Card>

                                {/* 연결선 */}
                                {index < architectureSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform -translate-y-1/2" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 성능 벤치마크 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">성능 벤치마크</h3>
                        <p className="text-gray-300">업계 최고 수준의 성능 지표를 달성했습니다</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {benchmarks.map((benchmark, index) => (
                            <motion.div
                                key={benchmark.metric}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 text-center">
                                    <div className="text-3xl font-bold text-white mb-2">{benchmark.value}</div>
                                    <div className="text-sm text-gray-300 mb-2">{benchmark.metric}</div>
                                    <Badge variant="outline" className="border-green-400/50 text-green-300 text-xs">
                                        {benchmark.improvement}
                                    </Badge>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA 섹션 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <Card className="p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-white/10">
                        <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-4">
                            차세대 AI 기술을 지금 경험해보세요
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            복잡한 설치나 설정 없이, 브라우저에서 바로 시작할 수 있습니다.
                            여러분의 텍스트가 어떻게 전문적으로 변화하는지 확인해보세요.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                무료로 체험하기
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                기술 문서 보기
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

export default TechnicalShowcase; 