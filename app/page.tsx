'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, MessageSquarePlus, Lightbulb, Target, Zap, Clock, CheckCircle, Star } from 'lucide-react';

// Import separated components
import { PersonaSelector } from '@/components/smart-prompt/persona-selector';
import { AIDemo } from '@/components/demo/ai-demo';
import PreRegisterModal from '@/components/marketing/pre-register-modal';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { PricingSection } from '@/components/sections/pricing-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import FinalCTASection from '@/components/sections/final-cta-section';

export default function HomePage() {
    const [isPreRegisterOpen, setIsPreRegisterOpen] = useState(false);

    const handlePreRegisterClick = () => {
        setIsPreRegisterOpen(true);
    };

    const handleClosePreRegister = () => {
        setIsPreRegisterOpen(false);
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Hero Section */}
            <HeroSection onPreRegisterClick={handlePreRegisterClick} />

            {/* Features Section */}
            <FeaturesSection />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* AI Demo Section */}
            <section className="py-20 bg-gradient-to-b from-gray-900/50 to-black">
                <Container>
                    <div className="mb-16 text-center">
                        <Badge variant="outline" className="mb-4 border-blue-500/20 text-blue-400">
                            라이브 데모
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                            AI가 어떻게 작동하는지 직접 확인해보세요
                        </h2>
                        <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
                            다양한 직업군의 실제 사용 사례를 통해 Smart Prompt의 강력한 기능을 체험해보세요.
                        </p>
                    </div>
                    <AIDemo />
                </Container>
            </section>

            {/* Persona Selector Section */}
            <section className="py-20 bg-gradient-to-b from-gray-900/30 to-gray-800/30">
                <Container>
                    <div className="mb-16 text-center">
                        <Badge variant="outline" className="mb-4 border-purple-500/20 text-purple-400">
                            맞춤형 솔루션
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                            당신의 직업에 특화된 AI 프롬프트
                        </h2>
                        <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
                            각 직업군의 특성을 이해하고 최적화된 프롬프트를 제공합니다.
                        </p>
                    </div>
                    <PersonaSelector />
                </Container>
            </section>

            {/* Pricing Section */}
            <PricingSection onPreRegisterClick={handlePreRegisterClick} />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Final CTA Section */}
            <FinalCTASection onPreRegisterClick={handlePreRegisterClick} />

            {/* Pre-register Modal */}
            <PreRegisterModal
                isOpen={isPreRegisterOpen}
                onClose={handleClosePreRegister}
            />
        </div>
    );
} 