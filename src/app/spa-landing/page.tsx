'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle, Star, Users, Zap, Target, Lightbulb, BarChart3 } from 'lucide-react';

// Components
import { Section } from '@/components/spa/ui/section';
import { Button } from '@/components/spa/ui/button';
import { PersonaCard } from '@/components/spa/persona-card';
import { PromptCard } from '@/components/spa/prompt-card';
import { ScenarioNavigation } from '@/components/spa/scenario-navigation';
import { SmartTextarea } from '@/components/spa/smart-textarea';
import { PreRegistrationForm } from '@/components/spa/pre-registration-form';

// Data and Types
import { PERSONAS as personas, STATIC_SCENARIOS as staticScenarios } from '@/data/spa-scenarios';
import { PersonaType, SPALandingState } from '@/types/spa-landing';

// Supabase
import { database } from '@/lib/supabase';

export default function SPALandingPage() {
    const [state, setState] = useState<SPALandingState>({
        selectedPersona: personas[0],
        currentScenarioIndex: 0,
        userInput: '',
        enhancedOutput: '',
        isEnhancing: false,
        isPreRegistrationOpen: false,
        isProcessing: false,
        result: null,
        showEmailModal: false,
    });

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // 페르소나 선택 핸들러
    const handlePersonaSelect = (persona: PersonaType) => {
        setState(prev => ({
            ...prev,
            selectedPersona: persona,
            currentScenarioIndex: 0,
            userInput: '',
            enhancedOutput: '',
        }));
    };

    // 시나리오 변경 핸들러
    const handleScenarioChange = (index: number) => {
        const currentScenarios = staticScenarios[state.selectedPersona.id];
        if (currentScenarios && currentScenarios[index]) {
            setState(prev => ({
                ...prev,
                currentScenarioIndex: index,
                userInput: currentScenarios[index].inputExample,
                enhancedOutput: currentScenarios[index].enhanced,
            }));
        }
    };

    // AI 프롬프트 개선 핸들러
    const handleEnhancePrompt = async (text: string): Promise<string> => {
        setState(prev => ({ ...prev, isEnhancing: true }));

        try {
            // 실제 AI API 호출 대신 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 2000));

            const enhanced = `[개선된 프롬프트]
      
역할: ${state.selectedPersona.title}
맥락: ${text}

구체적인 요구사항:
- 명확한 목표 설정
- 구체적인 예시 포함
- 단계별 접근 방식
- 예상 결과물 명시

최적화된 프롬프트:
${text}를 바탕으로 다음과 같이 개선하겠습니다...`;

            setState(prev => ({ ...prev, enhancedOutput: enhanced }));
            return enhanced;
        } catch (error) {
            console.error('Enhancement failed:', error);
            throw error;
        } finally {
            setState(prev => ({ ...prev, isEnhancing: false }));
        }
    };



    // 현재 선택된 페르소나의 시나리오 목록 가져오기
    const currentScenarios = staticScenarios[state.selectedPersona.id] || [];
    const currentScenario = currentScenarios[state.currentScenarioIndex];

    return (
        <div className="relative">
            {/* Hero Section */}
            <Section background="gradient" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent-blue/10 via-transparent to-brand-accent-purple/10" />
                <div className="relative z-10 container mx-auto px-4 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent-blue/20 rounded-full text-brand-accent-blue text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            AI 기반 프롬프트 최적화
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-brand-text-primary mb-6">
                            Smart Prompt
                            <br />
                            <span className="bg-gradient-to-r from-brand-accent-blue to-brand-accent-purple bg-clip-text text-transparent">
                                Assistant
                            </span>
                        </h1>

                        <p className="text-xl text-brand-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                            AI가 당신의 프롬프트를 더 효과적으로 만들어 드립니다.
                            <br />
                            PM, 크리에이터, 창업자를 위한 맞춤형 AI 어시스턴트
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => setState(prev => ({ ...prev, isPreRegistrationOpen: true }))}
                                className="flex items-center gap-2"
                            >
                                사전 등록하기
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="lg">
                                데모 체험하기
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* 페르소나 선택 섹션 */}
            <Section background="default" className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-brand-text-primary mb-4">
                            당신의 역할을 선택하세요
                        </h2>
                        <p className="text-xl text-brand-text-secondary max-w-2xl mx-auto">
                            각 역할에 맞춤화된 AI 어시스턴트가 최적의 프롬프트를 제안합니다
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {personas.map((persona, index) => (
                            <motion.div
                                key={persona.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <PersonaCard
                                    persona={persona}
                                    isSelected={state.selectedPersona.id === persona.id}
                                    onSelect={handlePersonaSelect}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Before/After 데모 섹션 */}
            <Section background="dark" className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            프롬프트 개선 사례
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            AI가 어떻게 프롬프트를 개선하는지 실제 사례를 확인해보세요
                        </p>
                    </motion.div>

                    <div className="max-w-6xl mx-auto">
                        {currentScenarios.length > 0 && (
                            <>
                                <div className="mb-8">
                                    <ScenarioNavigation
                                        scenarios={currentScenarios}
                                        currentIndex={state.currentScenarioIndex}
                                        onScenarioChange={handleScenarioChange}
                                    />
                                </div>

                                {currentScenario && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <PromptCard
                                                title="개선 전"
                                                content={currentScenario.original}
                                                type="before"
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                        >
                                            <PromptCard
                                                title="개선 후"
                                                content={currentScenario.enhanced}
                                                type="after"
                                                highlights={currentScenario.highlights?.map(h => ({
                                                    type: h.type === 'add' ? 'added' as const :
                                                        h.type === 'structure' ? 'added' as const :
                                                            h.type === 'improve' ? 'added' as const : 'added' as const,
                                                    text: h.content
                                                }))}
                                            />
                                        </motion.div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Section>

            {/* 인터랙티브 체험 섹션 */}
            <Section background="default" className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-brand-text-primary mb-4">
                            직접 체험해보세요
                        </h2>
                        <p className="text-xl text-brand-text-secondary max-w-2xl mx-auto">
                            당신의 프롬프트를 입력하고 AI가 어떻게 개선하는지 확인해보세요
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-brand-surface-primary/80 backdrop-blur-xl rounded-2xl p-8 border border-brand-surface-secondary/20">
                            <div className="mb-6">
                                <label className="block text-lg font-semibold text-brand-text-primary mb-3">
                                    프롬프트 입력
                                </label>
                                <SmartTextarea
                                    value={state.userInput}
                                    onChange={(value) => setState(prev => ({ ...prev, userInput: value }))}
                                    onEnhance={handleEnhancePrompt}
                                    isEnhancing={state.isEnhancing}
                                    placeholder={`${state.selectedPersona.title}로서 사용할 프롬프트를 입력해주세요...`}
                                />
                            </div>

                            {state.enhancedOutput && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="mt-6"
                                >
                                    <label className="block text-lg font-semibold text-brand-text-primary mb-3">
                                        AI 개선 결과
                                    </label>
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                        <div className="text-sm text-gray-800 whitespace-pre-wrap">
                                            {state.enhancedOutput}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </Section>

            {/* 주요 기능 섹션 */}
            <Section background="gradient" className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-brand-text-primary mb-4">
                            주요 기능
                        </h2>
                        <p className="text-xl text-brand-text-secondary max-w-2xl mx-auto">
                            Smart Prompt Assistant의 강력한 기능들을 만나보세요
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Target,
                                title: '맞춤형 최적화',
                                description: '역할별 특성을 고려한 개인화된 프롬프트 개선'
                            },
                            {
                                icon: Zap,
                                title: '실시간 피드백',
                                description: '즉시 개선 결과를 확인하고 반복 학습'
                            },
                            {
                                icon: Lightbulb,
                                title: '창의적 제안',
                                description: 'AI가 제안하는 새로운 관점과 아이디어'
                            },
                            {
                                icon: BarChart3,
                                title: '성능 분석',
                                description: '프롬프트 효과성 측정 및 개선 추천'
                            },
                            {
                                icon: Users,
                                title: '협업 지원',
                                description: '팀 단위 프롬프트 공유 및 관리'
                            },
                            {
                                icon: Star,
                                title: '품질 보장',
                                description: '검증된 프롬프트 패턴 기반 개선'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-brand-surface-primary/80 backdrop-blur-xl rounded-xl p-6 border border-brand-surface-secondary/20"
                            >
                                <feature.icon className="w-12 h-12 text-brand-accent-blue mb-4" />
                                <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-brand-text-secondary">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* CTA 섹션 */}
            <Section background="dark" className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            지금 시작하세요
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Smart Prompt Assistant와 함께 더 효과적인 AI 활용을 경험해보세요
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => setState(prev => ({ ...prev, isPreRegistrationOpen: true }))}
                                className="flex items-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                사전 등록하기
                            </Button>
                            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-gray-900">
                                더 알아보기
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* 사전 등록 모달 */}
            <PreRegistrationForm
                isOpen={state.isPreRegistrationOpen}
                onClose={() => setState(prev => ({ ...prev, isPreRegistrationOpen: false }))}
                selectedPersona={state.selectedPersona.id}
            />
        </div>
    );
} 