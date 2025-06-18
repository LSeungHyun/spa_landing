'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Copy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BeforeAfterDemo } from '@/components/demo/before-after-demo';
import TwelveScenariosDemo from '@/components/demo/twelve-scenarios-demo';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import FeaturesSection from '@/components/sections/features-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { PricingSection } from '@/components/sections/pricing-section';
import { pricingPlans } from '@/components/data/pricing-data';
import { Persona, personas } from '@/components/data/landing-data';
import ProcessingSteps from '@/components/shared/processing-steps';

export default function HomePage() {
    const [selectedPersona, setSelectedPersona] = useState<Persona>('pm-developer');
    const [userInput, setUserInput] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const handleTransform = async () => {
        if (!userInput.trim()) {
            toast.error('아이디어를 입력해주세요');
            return;
        }

        setIsLoading(true);
        setCurrentStep(0);
        setGeneratedPrompt('');

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
            setCurrentStep(0);
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
        <div className="min-h-screen bg-brand-dark-primary text-brand-text-primary">
            {/* Header */}
            <header className="border-b border-brand-border-primary bg-brand-dark-primary/90 backdrop-blur fixed top-0 w-full z-50">
                <Container>
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AI</span>
                            </div>
                            <span className="font-bold text-lg">Smart Prompt</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-brand-text-secondary hover:text-white transition-colors">
                                기능
                            </a>
                            <a href="#how" className="text-brand-text-secondary hover:text-white transition-colors">
                                작동원리
                            </a>
                            <a href="#pricing" className="text-brand-text-secondary hover:text-white transition-colors">
                                요금제
                            </a>
                            <Button
                                onClick={() => setShowModal(true)}
                                variant="outline"
                                className="border-brand-border-primary text-brand-text-primary hover:bg-brand-surface-primary"
                            >
                                사전등록
                            </Button>
                        </nav>
                    </div>
                </Container>
            </header>

            {/* Hero Section */}
            <HeroSection />

            {/* Before/After Demo Section */}
            <section className="py-20 bg-brand-surface-primary">
                <BeforeAfterDemo />
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* 12 Scenarios Demo Section */}
            <section id="scenarios" className="py-20 bg-brand-surface-primary">
                <TwelveScenariosDemo />
            </section>

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Pricing Section */}
            <PricingSection plans={pricingPlans} />

            {/* Final CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
                            지금 바로 시작해보세요
                        </h2>
                        <p className="text-lg text-brand-text-secondary mb-8">
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
                    <div className="bg-brand-surface-primary border border-brand-border-primary rounded-2xl p-8 w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4 text-center">사전등록</h3>
                        <p className="text-brand-text-secondary mb-6 text-center">
                            출시 소식을 가장 먼저 받아보세요
                        </p>

                        {!isRegistered ? (
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="이메일 주소를 입력하세요"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-brand-dark-primary border-brand-border-primary text-brand-text-primary"
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    사전등록하기
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold mb-2">등록 완료!</h4>
                                <p className="text-brand-text-secondary mb-4">
                                    출시 소식을 이메일로 보내드릴게요
                                </p>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            onClick={() => setShowModal(false)}
                            className="w-full mt-4 text-brand-text-secondary hover:text-brand-text-primary"
                        >
                            닫기
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
} 