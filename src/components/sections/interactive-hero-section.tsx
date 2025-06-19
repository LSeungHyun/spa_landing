'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Loader2,
    Copy,
    CheckCircle2,
    Zap,
    Clock,
    Target,
    Users,
    Code2,
    Briefcase,
    Palette,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// 페르소나 정의
const personas = {
    developer: {
        title: '개발자',
        icon: Code2,
        color: 'blue',
        description: '기술적 구현과 코드 품질에 중점'
    },
    business: {
        title: '기획자',
        icon: Briefcase,
        color: 'green',
        description: '비즈니스 가치와 사용자 경험 중심'
    },
    designer: {
        title: '디자이너',
        icon: Palette,
        color: 'purple',
        description: 'UI/UX와 시각적 완성도 추구'
    }
};

// 샘플 프롬프트
const samplePrompts = [
    {
        id: 1,
        label: '구독 결제 시스템',
        input: '구독 결제 시스템 만들어줘',
        persona: 'developer'
    },
    {
        id: 2,
        label: '회원가입 페이지',
        input: '회원가입 페이지 디자인해줘',
        persona: 'designer'
    },
    {
        id: 3,
        label: '마케팅 전략',
        input: '앱 마케팅 전략 세워줘',
        persona: 'business'
    }
];

interface InteractiveHeroSectionProps {
    onPreRegisterClick?: () => void;
}

export function InteractiveHeroSection({ onPreRegisterClick }: InteractiveHeroSectionProps) {
    // 상태 관리
    const [originalInput, setOriginalInput] = useState(''); // 사용자 원본 입력 (내부 저장용)
    const [displayedInput, setDisplayedInput] = useState(''); // 화면에 표시되는 입력 (개선된 프롬프트로 치환됨)
    const [selectedPersona, setSelectedPersona] = useState<keyof typeof personas>('developer');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isImproved, setIsImproved] = useState(false); // 개선된 상태인지 추적

    // 프롬프트 개선 처리
    const handleEnhancePrompt = async () => {
        if (!displayedInput.trim()) return;

        setIsEnhancing(true);
        setCurrentStep(0);

        // 원본 입력 저장 (사용자가 실제로 입력한 내용)
        setOriginalInput(displayedInput);

        // 단계별 애니메이션
        const steps = ['프롬프트 분석 중...', '맥락 파악 중...', '구조 최적화 중...', '전문성 강화 중...', '최종 검토 중...'];

        for (let i = 0; i < steps.length; i++) {
            setCurrentStep(i);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // 개선된 프롬프트 생성
        const enhancedPrompt = generateEnhancedPrompt(displayedInput, selectedPersona);

        // 화면의 입력값을 개선된 프롬프트로 치환
        setDisplayedInput(enhancedPrompt);
        setIsImproved(true);
        setIsEnhancing(false);

        toast.success('프롬프트가 개선되었습니다!');
    };

    // 프롬프트 개선 로직
    const generateEnhancedPrompt = (input: string, persona: keyof typeof personas): string => {
        const personaTemplates = {
            developer: {
                prefix: "다음 요구사항에 따라 프로덕션 레벨의 코드를 작성해주세요:\n\n",
                structure: [
                    "🎯 **프로젝트 목표**",
                    "- 핵심 기능: {input}",
                    "- 기술적 요구사항: 확장성, 유지보수성, 성능 최적화",
                    "- 코드 품질: 클린 코드, 테스트 커버리지, 문서화\n",
                    "🏗️ **기술 스택 및 아키텍처**",
                    "- 프론트엔드: Next.js 14, TypeScript, Tailwind CSS",
                    "- 백엔드: Node.js, Express, PostgreSQL",
                    "- 인프라: Docker, AWS, CI/CD 파이프라인\n",
                    "📋 **구현 요구사항**",
                    "1. 모듈화된 컴포넌트 구조로 개발",
                    "2. 에러 핸들링 및 로깅 시스템 구축",
                    "3. 단위 테스트 및 통합 테스트 작성",
                    "4. API 문서화 및 타입 정의",
                    "5. 성능 모니터링 및 최적화\n",
                    "🔒 **보안 및 검증**",
                    "- 입력값 검증 및 SQL 인젝션 방지",
                    "- 인증/인가 시스템 구현",
                    "- HTTPS 및 데이터 암호화",
                    "- 보안 헤더 설정\n",
                    "📊 **성과 지표**",
                    "- 페이지 로딩 속도 < 3초",
                    "- 99.9% 가용성 보장",
                    "- 코드 커버리지 > 80%",
                    "- 사용자 만족도 > 4.5/5"
                ]
            },
            business: {
                prefix: "다음 비즈니스 요구사항에 대한 전략적 솔루션을 제시해주세요:\n\n",
                structure: [
                    "🎯 **비즈니스 목표**",
                    "- 핵심 니즈: {input}",
                    "- 타겟 사용자: 명확한 페르소나 정의",
                    "- 비즈니스 가치: ROI 및 성장 동력 확보\n",
                    "📊 **시장 분석 및 포지셔닝**",
                    "- 시장 규모 및 성장 잠재력 분석",
                    "- 경쟁사 분석 및 차별화 포인트",
                    "- 고객 여정 맵핑 및 터치포인트 최적화\n",
                    "🚀 **실행 전략**",
                    "1. MVP 개발 및 빠른 시장 검증",
                    "2. 데이터 기반 의사결정 체계 구축",
                    "3. 사용자 피드백 수집 및 반영 프로세스",
                    "4. 확장 가능한 비즈니스 모델 설계",
                    "5. 파트너십 및 에코시스템 구축\n",
                    "💰 **수익 모델**",
                    "- 주요 수익원 및 가격 전략",
                    "- 고객 생애 가치(LTV) 최적화",
                    "- 비용 구조 효율화 방안\n",
                    "📈 **성과 측정**",
                    "- 핵심 성과 지표(KPI) 정의",
                    "- 사용자 참여도 및 리텐션 목표",
                    "- 매출 성장률 및 시장 점유율 목표"
                ]
            },
            designer: {
                prefix: "다음 디자인 요구사항에 따라 사용자 중심의 UI/UX를 설계해주세요:\n\n",
                structure: [
                    "🎨 **디자인 목표**",
                    "- 핵심 요구사항: {input}",
                    "- 사용자 경험: 직관적이고 접근성 높은 인터페이스",
                    "- 브랜드 아이덴티티: 일관성 있는 시각적 언어\n",
                    "👥 **사용자 리서치**",
                    "- 타겟 사용자 페르소나 및 사용 시나리오",
                    "- 사용자 니즈 분석 및 페인 포인트 파악",
                    "- 경쟁 제품 UI/UX 벤치마킹\n",
                    "🖼️ **시각적 디자인**",
                    "1. 모던하고 클린한 디자인 시스템 구축",
                    "2. 반응형 레이아웃 및 모바일 최적화",
                    "3. 컬러 팔레트 및 타이포그래피 가이드라인",
                    "4. 아이콘 및 일러스트레이션 스타일 정의",
                    "5. 애니메이션 및 마이크로 인터랙션 설계\n",
                    "🔄 **사용자 플로우**",
                    "- 주요 사용자 여정 및 태스크 플로우",
                    "- 정보 구조(IA) 및 네비게이션 설계",
                    "- 에러 상황 및 엣지 케이스 처리\n",
                    "📱 **접근성 및 사용성**",
                    "- WCAG 2.1 AA 수준 접근성 준수",
                    "- 다양한 디바이스 및 브라우저 호환성",
                    "- 사용성 테스트 및 개선 방안",
                    "- 로딩 상태 및 피드백 시스템"
                ]
            }
        };

        const template = personaTemplates[persona];
        const enhanced = template.prefix + template.structure
            .map(line => line.replace('{input}', input))
            .join('\n');

        return enhanced;
    };

    // 샘플 프롬프트 선택
    const handleSampleSelect = (sample: typeof samplePrompts[0]) => {
        setDisplayedInput(sample.input);
        setSelectedPersona(sample.persona as keyof typeof personas);
        setIsImproved(false);
        setOriginalInput('');
    };

    // 복사 기능
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayedInput);
            setCopied(true);
            toast.success('클립보드에 복사되었습니다!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('복사에 실패했습니다');
        }
    };

    // 초기화 기능
    const handleReset = () => {
        setDisplayedInput('');
        setOriginalInput('');
        setIsImproved(false);
        setSelectedPersona('developer');
    };

    return (
        <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <Container>
                <div className="max-w-6xl mx-auto">
                    {/* 헤더 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Kilo Code 스타일 프롬프트 변환 체험
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                간단한 요청을
                            </span>
                            <br />
                            <span className="text-slate-800">
                                전문가급 프롬프트로
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-4">
                            입력하신 프롬프트가 즉시 전문가급 프롬프트로 변환됩니다
                        </p>
                        <p className="text-lg text-slate-500">
                            AI가 여러분의 아이디어를 구체적이고 실행 가능한 프롬프트로 즉시 대체합니다
                        </p>
                    </motion.div>

                    {/* 메인 인터페이스 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl mx-auto mb-12"
                    >
                        {/* 통합된 입력/출력 섹션 */}
                        <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200">
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    1. 페르소나 선택
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(personas).map(([key, persona]) => {
                                        const Icon = persona.icon;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedPersona(key as keyof typeof personas)}
                                                className={cn(
                                                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-sm font-medium",
                                                    selectedPersona === key
                                                        ? `border-${persona.color}-500 bg-${persona.color}-50 text-${persona.color}-700`
                                                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {persona.title}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-semibold text-slate-700">
                                        2. 프롬프트 {isImproved ? '(AI 개선됨)' : '입력'}
                                    </label>
                                    {isImproved && (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCopy}
                                                className="flex items-center gap-1"
                                            >
                                                {copied ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                                {copied ? '복사됨!' : '복사'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleReset}
                                            >
                                                초기화
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <AnimatePresence mode="wait">
                                    {isEnhancing ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-80 border border-slate-300 rounded-lg flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
                                        >
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                                                </div>
                                                <div className="text-lg font-semibold text-slate-700 mb-2">
                                                    프롬프트를 전문가급으로 변환하고 있습니다
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {['프롬프트 분석 중...', '맥락 파악 중...', '구조 최적화 중...', '전문성 강화 중...', '최종 검토 중...'][currentStep]}
                                                </div>
                                                <div className="w-48 h-2 bg-slate-200 rounded-full mt-4 mx-auto overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                        initial={{ width: '0%' }}
                                                        animate={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.textarea
                                            key="textarea"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            value={displayedInput}
                                            onChange={(e) => {
                                                setDisplayedInput(e.target.value);
                                                setIsImproved(false);
                                            }}
                                            placeholder="간단한 요청을 입력하세요... (예: 구독 결제 시스템 만들어줘)"
                                            className={cn(
                                                "w-full h-80 px-4 py-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900",
                                                isImproved ? "bg-green-50 border-green-300 font-mono text-sm" : "bg-white"
                                            )}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* 샘플 프롬프트 */}
                            {!isImproved && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        또는 샘플 프롬프트 선택
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {samplePrompts.map((sample) => (
                                            <button
                                                key={sample.id}
                                                onClick={() => handleSampleSelect(sample)}
                                                className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-900"
                                            >
                                                {sample.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleEnhancePrompt}
                                    disabled={isEnhancing || !displayedInput.trim() || isImproved}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    size="lg"
                                >
                                    {isEnhancing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            변환 중...
                                        </>
                                    ) : isImproved ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-300" />
                                            변환 완료!
                                        </>
                                    ) : (
                                        <>
                                            <ArrowRight className="w-4 h-4 mr-2" />
                                            ✨ 전문가급 프롬프트로 변환
                                        </>
                                    )}
                                </Button>

                                {isImproved && originalInput && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDisplayedInput(originalInput);
                                            setIsImproved(false);
                                        }}
                                        size="lg"
                                        className="px-6"
                                    >
                                        원본 보기
                                    </Button>
                                )}
                            </div>

                            {isImproved && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg"
                                >
                                    <div className="flex items-center gap-2 text-green-700 text-sm">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="font-medium">프롬프트가 전문가급으로 개선되었습니다!</span>
                                    </div>
                                    <p className="text-green-600 text-xs mt-1">
                                        이제 이 프롬프트를 복사해서 AI 도구에 사용하실 수 있습니다.
                                    </p>
                                </motion.div>
                            )}
                        </Card>
                    </motion.div>

                    {/* 통계 및 CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="text-2xl font-bold text-slate-800 mb-1">10,000+</div>
                                <div className="text-sm text-slate-600">만족한 사용자</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                            <h3 className="text-2xl font-bold mb-4">
                                더 강력한 기능이 궁금하다면?
                            </h3>
                            <p className="text-blue-100 mb-6">
                                Kilo Code의 전체 기능을 미리 체험해보세요
                            </p>
                            <Button
                                onClick={onPreRegisterClick}
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50"
                            >
                                사전 등록하고 얼리 액세스 받기
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
} 