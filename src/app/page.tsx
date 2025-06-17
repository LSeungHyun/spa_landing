'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/ui/container';
import { Copy, ArrowRight, CheckCircle, Sparkles, Zap, Target, Users, MessageSquare, TrendingUp, Lock, Cog } from 'lucide-react';
import { motion } from 'framer-motion';
import { GeminiService } from '@/lib/gemini-service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FeaturesSection } from '@/components/marketing/features-section';
import { HowItWorksSection } from '@/components/marketing/how-it-works-section';
import { PricingSection } from '@/components/marketing/pricing-section';
import { Footer } from '@/components/layout/footer';
import { BeforeAfterDemo } from '@/components/smart-prompt/before-after-demo';
import TwelveScenariosDemo from '@/components/smart-prompt/twelve-scenarios-demo';
import ProcessingSteps from '@/components/smart-prompt/processing-steps';

export type Persona = 'pm-developer' | 'content-creator' | 'startup-founder' | 'marketer' | 'consultant' | 'freelancer';

interface PersonaData {
    title: string;
    subtitle: string;
    description: string;
    placeholder: string;
    heroText: string;
    problemStatement: string;
    solution: string;
    examples: string[];
}

const personas: Record<Persona, PersonaData> = {
    'pm-developer': {
        title: 'IT 스타트업 PM/개발자',
        subtitle: '기획서 작성부터 기술 문서까지',
        description: '전문적인 프로덕트 기획서와 기술 문서를 AI가 도와드립니다',
        placeholder: '예: 구독 결제 기능을 추가하고 싶어요',
        heroText: '복잡한 기술 요구사항을 명확한 기획서로 변환',
        problemStatement: '아이디어만 있으면 충분합니다.',
        solution: '초보 입력, 전문가 결과.',
        examples: [
            '사용자 인증 시스템 구현',
            '실시간 알림 기능 추가',
            '데이터 분석 대시보드 설계'
        ]
    },
    'content-creator': {
        title: '디지털 콘텐츠 크리에이터',
        subtitle: '유튜브부터 블로그까지',
        description: '매력적인 콘텐츠 기획안을 AI가 완성해드립니다',
        placeholder: '예: 유튜브 채널 기획안을 만들고 싶어요',
        heroText: '막연한 콘텐츠 아이디어를 완성된 기획안으로 변환',
        problemStatement: '아이디어만 있으면 충분합니다.',
        solution: '초보 입력, 전문가 결과.',
        examples: [
            '유튜브 채널 컨셉 기획',
            '블로그 포스팅 시리즈',
            '인스타그램 브랜딩 전략'
        ]
    },
    'startup-founder': {
        title: '스타트업 창업자',
        subtitle: '사업계획서부터 투자유치까지',
        description: '창업 아이디어를 구체적인 사업 계획서로 변환합니다',
        placeholder: '예: 배달음식 플랫폼 사업을 시작하고 싶어요',
        heroText: '모호한 창업 아이디어를 체계적인 사업계획서로 변환',
        problemStatement: '창업 아이디어만 있으면 충분합니다.',
        solution: '아이디어 → 전문 사업계획서',
        examples: [
            'AI 기반 헬스케어 서비스',
            '친환경 배달 플랫폼',
            'B2B SaaS 솔루션 기획'
        ]
    },
    'marketer': {
        title: '디지털 마케터',
        subtitle: '캠페인 기획부터 전략 수립까지',
        description: '효과적인 마케팅 캠페인과 전략을 AI가 설계해드립니다',
        placeholder: '예: 신제품 론칭 마케팅 캠페인을 기획하고 싶어요',
        heroText: '마케팅 아이디어를 데이터 기반 전략으로 변환',
        problemStatement: '마케팅 목표만 있으면 충분합니다.',
        solution: '목표 → 전문 마케팅 전략',
        examples: [
            'SNS 바이럴 캠페인 기획',
            '브랜드 인지도 향상 전략',
            'ROI 최적화 광고 전략'
        ]
    },
    'consultant': {
        title: '비즈니스 컨설턴트',
        subtitle: '전략수립부터 프로세스 개선까지',
        description: '복잡한 비즈니스 문제를 체계적인 해결책으로 변환합니다',
        placeholder: '예: 조직 효율성을 개선하는 방안을 찾고 싶어요',
        heroText: '비즈니스 과제를 전문 컨설팅 보고서로 변환',
        problemStatement: '문제 상황만 있으면 충분합니다.',
        solution: '문제 → 전문 솔루션',
        examples: [
            '디지털 전환 전략 수립',
            '조직문화 개선 방안',
            '비용 최적화 프로젝트'
        ]
    },
    'freelancer': {
        title: '프리랜서',
        subtitle: '제안서부터 포트폴리오까지',
        description: '전문적인 제안서와 포트폴리오를 AI가 완성해드립니다',
        placeholder: '예: 웹사이트 리뉴얼 제안서를 작성하고 싶어요',
        heroText: '프리랜서 아이디어를 전문 제안서로 변환',
        problemStatement: '서비스 아이디어만 있으면 충분합니다.',
        solution: '아이디어 → 전문 제안서',
        examples: [
            '웹개발 프로젝트 제안서',
            '브랜딩 디자인 포트폴리오',
            '컨설팅 서비스 소개서'
        ]
    }
};

// 스마트 프롬프트 특성에 맞는 기능 데이터
const features = [
    {
        title: "AI 프롬프트 자동 생성",
        description: "간단한 아이디어만 입력하면 전문적인 프롬프트가 즉시 생성됩니다",
        icon: Sparkles,
        size: "large" as const,
        image: "https://picsum.photos/seed/ai-prompt/400/300"
    },
    {
        title: "12가지 시나리오 지원",
        description: "개발, 콘텐츠, 마케팅 등 다양한 업무 시나리오를 지원합니다",
        icon: Target,
        size: "small" as const,
        image: "https://picsum.photos/seed/scenarios/300/200"
    },
    {
        title: "실시간 결과 확인",
        description: "생성된 프롬프트의 품질을 즉시 확인하고 개선할 수 있습니다",
        icon: Zap,
        size: "small" as const,
        image: "https://picsum.photos/seed/realtime/300/200"
    },
    {
        title: "페르소나 맞춤 최적화",
        description: "PM/개발자, 콘텐츠 크리에이터 등 역할별 최적화된 프롬프트를 제공합니다",
        icon: Users,
        size: "small" as const,
        image: "https://picsum.photos/seed/persona/300/200"
    },
    {
        title: "간편한 복사 및 공유",
        description: "생성된 프롬프트를 클릭 한 번으로 복사하여 바로 사용할 수 있습니다",
        icon: MessageSquare,
        size: "small" as const,
        image: "https://picsum.photos/seed/copy/300/200"
    }
];

// 작동원리 단계
const howItWorksSteps = [
    {
        number: "01",
        title: "페르소나 선택",
        description: "본인의 역할에 맞는 페르소나를 선택하세요",
        image: "https://picsum.photos/seed/step1/200/150"
    },
    {
        number: "02",
        title: "아이디어 입력",
        description: "간단한 아이디어나 요구사항을 자연어로 입력하세요",
        image: "https://picsum.photos/seed/step2/200/150"
    },
    {
        number: "03",
        title: "프롬프트 생성",
        description: "AI가 전문적인 프롬프트를 자동으로 생성해드립니다",
        image: "https://picsum.photos/seed/step3/200/150"
    }
];

// 가격정책 데이터
const pricingPlans = [
    {
        name: "무료 체험",
        description: "스마트 프롬프트를 경험해보세요",
        price: "₩0",
        features: [
            { text: "월 10회 프롬프트 생성", included: true },
            { text: "2가지 페르소나 지원", included: true },
            { text: "기본 시나리오 지원", included: true },
            { text: "이메일 지원", included: true },
            { text: "고급 기능", included: false },
            { text: "우선 지원", included: false }
        ]
    },
    {
        name: "프로",
        description: "전문가를 위한 완전한 기능",
        price: "₩29,000",
        popular: true,
        features: [
            { text: "무제한 프롬프트 생성", included: true },
            { text: "모든 페르소나 지원", included: true },
            { text: "12가지 시나리오 지원", included: true },
            { text: "고급 최적화 기능", included: true },
            { text: "우선 이메일 지원", included: true },
            { text: "API 액세스", included: true }
        ]
    },
    {
        name: "팀",
        description: "팀과 함께 더 효율적으로",
        price: "₩99,000",
        features: [
            { text: "프로 플랜 모든 기능", included: true },
            { text: "팀 워크스페이스", included: true },
            { text: "프롬프트 라이브러리 공유", included: true },
            { text: "팀 분석 대시보드", included: true },
            { text: "전담 고객 지원", included: true },
            { text: "사용자 정의 페르소나", included: true }
        ]
    }
];

export default function HomePage() {
    const [selectedPersona, setSelectedPersona] = useState<Persona>('pm-developer');
    const [userInput, setUserInput] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleTransform = async () => {
        if (!userInput.trim()) {
            toast.error('아이디어를 입력해주세요');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idea: userInput,
                    persona: selectedPersona
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API 호출에 실패했습니다');
            }

            const data = await response.json();
            setGeneratedPrompt(data.content);
            toast.success(`${personas[selectedPersona]?.title}용 프롬프트가 생성되었습니다!`);
        } catch (error) {
            toast.error('프롬프트 생성에 실패했습니다. 다시 시도해주세요.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            toast.success('클립보드에 복사되었습니다!');
        } catch (error) {
            toast.error('복사에 실패했습니다');
        }
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('이메일을 입력해주세요');
            return;
        }
        setIsRegistered(true);
        toast.success('사전등록이 완료되었습니다!');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#E2E8F0]">
            {/* Header */}
            <header className="border-b border-[#2D2D2D] bg-[#0A0A0A]/90 backdrop-blur fixed top-0 w-full z-50">
                <Container>
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AI</span>
                            </div>
                            <span className="font-bold text-lg">Smart Prompt</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-[#94A3B8] hover:text-white transition-colors">
                                기능
                            </a>
                            <a href="#how" className="text-[#94A3B8] hover:text-white transition-colors">
                                작동원리
                            </a>
                            <a href="#pricing" className="text-[#94A3B8] hover:text-white transition-colors">
                                요금제
                            </a>
                            <Button
                                onClick={() => setShowModal(true)}
                                variant="outline"
                                className="border-[#2D2D2D] text-[#E2E8F0] hover:bg-[#1A1A1A]"
                            >
                                사전등록
                            </Button>
                        </nav>
                    </div>
                </Container>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />

                <Container>
                    <div className="relative z-10 text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            노력 없는 전문성,<br />증폭된 결과물
                        </h1>
                        <p className="text-lg lg:text-xl text-[#94A3B8] mb-8 max-w-2xl mx-auto">
                            {personas[selectedPersona]?.problemStatement}
                            <br />
                            <span className="text-[#E2E8F0] font-medium">
                                {personas[selectedPersona]?.solution}
                            </span>
                        </p>

                        {/* Persona Selector */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            {(Object.keys(personas) as Persona[]).map((persona) => (
                                <Button
                                    key={persona}
                                    onClick={() => setSelectedPersona(persona)}
                                    variant={selectedPersona === persona ? "default" : "outline"}
                                    className={cn(
                                        "px-6 py-3 text-sm font-medium transition-all duration-200",
                                        selectedPersona === persona
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                            : "border-[#2D2D2D] text-[#94A3B8] hover:text-[#E2E8F0] hover:border-[#404040]"
                                    )}
                                >
                                    <div className="text-center">
                                        <div className="font-semibold">{personas[persona].title}</div>
                                        <div className="text-xs opacity-80">{personas[persona].subtitle}</div>
                                    </div>
                                </Button>
                            ))}
                        </div>

                        {/* Hero Demo Preview */}
                        <div className="mb-12">
                            <Card className="bg-[#1A1A1A] border-[#2D2D2D] p-6 lg:p-8 max-w-2xl mx-auto">
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold mb-4 text-center">
                                        {personas[selectedPersona]?.heroText}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <Input
                                                placeholder={personas[selectedPersona]?.placeholder}
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                className="bg-[#0A0A0A] border-[#2D2D2D] text-[#E2E8F0] flex-1"
                                                onKeyDown={(e) => e.key === 'Enter' && handleTransform()}
                                            />
                                            <Button
                                                onClick={handleTransform}
                                                disabled={isLoading}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-4 h-4 mr-2"
                                                        >
                                                            <Cog className="w-4 h-4" />
                                                        </motion.div>
                                                        변환 중...
                                                    </>
                                                ) : (
                                                    '변환'
                                                )}
                                            </Button>
                                        </div>

                                        {generatedPrompt && (
                                            <div className="bg-[#0A0A0A] border border-[#2D2D2D] rounded-lg p-4 max-h-64 overflow-y-auto">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-medium text-[#94A3B8]">생성된 프롬프트:</span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={handleCopy}
                                                        className="h-6 w-6 p-0 text-[#94A3B8] hover:text-[#E2E8F0]"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-[#E2E8F0] whitespace-pre-wrap">
                                                    {generatedPrompt}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-4 p-3 bg-[#0A0A0A] border border-[#2D2D2D] rounded-lg">
                                            <span className="text-xs text-[#94A3B8] font-medium">
                                                {personas[selectedPersona]?.title} 예시:
                                            </span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {personas[selectedPersona]?.examples.map((example, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setUserInput(example)}
                                                        className="text-xs px-2 py-1 bg-[#2D2D2D] hover:bg-[#404040] rounded text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
                                                    >
                                                        {example}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* CTA Section */}
                        <div className="text-center">
                            <Button
                                size="lg"
                                onClick={() => setShowModal(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                            >
                                무료로 시작하기
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <p className="text-sm text-[#94A3B8] mt-3">
                                신용카드 없이 바로 시작 • 언제든 해지 가능
                            </p>

                            {/* 신뢰 요소 메시지 */}
                            <div className="flex items-center justify-center mt-4 text-sm text-[#94A3B8]">
                                <Lock className="w-4 h-4 mr-2 text-green-400" />
                                브라우저에서 안전하게 처리됩니다
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Before/After Demo Section */}
            <section className="py-20 bg-[#111111]">
                <BeforeAfterDemo />
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-[#0A0A0A]">
                <FeaturesSection features={features} />
            </section>

            {/* 12 Scenarios Demo Section */}
            <section id="scenarios" className="py-20 bg-[#111111]">
                <TwelveScenariosDemo />
            </section>

            {/* How It Works Section */}
            <section id="how" className="py-20 bg-[#0A0A0A]">
                <HowItWorksSection
                    title="간단한 3단계로 시작하세요"
                    description="복잡한 설정 없이 바로 전문적인 프롬프트를 생성할 수 있습니다"
                    badge="사용 방법"
                    steps={howItWorksSteps}
                />
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-[#0A0A0A]">
                <PricingSection plans={pricingPlans} />
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
                            지금 바로 시작해보세요
                        </h2>
                        <p className="text-lg text-[#94A3B8] mb-8">
                            더 이상 빈 문서 앞에서 고민하지 마세요. AI가 여러분의 아이디어를 전문적인 프롬프트로 변환해드립니다.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                        >
                            무료 체험 시작하기
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </Container>
            </section>

            {/* Footer */}
            <Footer
                links={[
                    {
                        title: "제품",
                        items: [
                            { label: "기능", href: "#features" },
                            { label: "요금제", href: "#pricing" },
                            { label: "사용 방법", href: "#how" }
                        ]
                    },
                    {
                        title: "지원",
                        items: [
                            { label: "문의하기", href: "/contact" },
                            { label: "가이드", href: "/guide" },
                            { label: "FAQ", href: "/faq" }
                        ]
                    },
                    {
                        title: "회사",
                        items: [
                            { label: "개인정보처리방침", href: "/privacy" },
                            { label: "서비스 약관", href: "/terms" },
                            { label: "보안", href: "/security" }
                        ]
                    }
                ]}
            />

            {/* Email Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="bg-[#1A1A1A] border-[#2D2D2D] max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold mb-2 text-white">사전등록</h3>
                            <p className="text-[#94A3B8]">
                                출시 알림을 받아보세요
                            </p>
                        </div>

                        {!isRegistered ? (
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="이메일 주소를 입력하세요"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-[#0A0A0A] border-[#2D2D2D] text-[#E2E8F0]"
                                    required
                                />
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowModal(false)}
                                        className="border-[#2D2D2D] text-[#94A3B8] hover:text-[#E2E8F0] flex-1"
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1"
                                    >
                                        등록하기
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center space-y-4">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                                <p className="text-white">등록이 완료되었습니다!</p>
                                <p className="text-[#94A3B8] text-sm">
                                    출시 소식을 이메일로 알려드리겠습니다.
                                </p>
                                <Button
                                    onClick={() => {
                                        setShowModal(false);
                                        setIsRegistered(false);
                                        setEmail('');
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
                                >
                                    확인
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
} 