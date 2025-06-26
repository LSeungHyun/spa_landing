'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Wand2, Loader2, Sparkles, Users, Star, ArrowRight, CheckCircle, Menu, X, Mail, Gift, Zap, Clock, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileNavBar } from '@/components/layout/mobile-nav-bar';
import { EnhancedPreRegistrationForm } from '@/components/shared/enhanced-pre-registration-form';

interface ChatMessage {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

// API 응답 타입 정의
interface ImprovePromptResponse {
    improvedPrompt?: string;
    error?: string;
    usageInfo?: {
        remainingCount: number;
        usageCount: number;
        resetTime: string;
        maxUsageCount: number;
    };
}

export default function HomePage() {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showPreRegistration, setShowPreRegistration] = useState(false);
    const [email, setEmail] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [hasTriedDemo, setHasTriedDemo] = useState(false);
    const [improveCount, setImproveCount] = useState(0);
    const demoRef = useRef<HTMLDivElement>(null);
    const preRegRef = useRef<HTMLDivElement>(null);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            type: 'ai',
            content: '안녕하세요! 저는 SPA(Smart Prompt Assistant)입니다. 아래 샘플을 클릭하거나 직접 입력해서 프롬프트 개선 효과를 바로 체험해보세요! 🚀',
            timestamp: new Date()
        }
    ]);

    // Hydration 안전성을 위한 useEffect
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 3회 체험 후 자동으로 사전 등록 유도
    useEffect(() => {
        if (improveCount >= 2 && !showPreRegistration) {
            setTimeout(() => {
                setShowPreRegistration(true);
                preRegRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        }
    }, [improveCount, showPreRegistration]);

    // 샘플 프롬프트 - 즉시 체험 유도
    const samplePrompts = [
        "고객에게 제품 소개 이메일을 작성해주세요",
        "마케팅 캠페인 아이디어를 브레인스토밍해주세요",
        "회의록을 정리하고 액션 아이템을 추출해주세요",
        "블로그 포스트 개요를 작성해주세요"
    ];

    const handleSampleClick = (sample: string) => {
        setInputText(sample);
        // 샘플 클릭 시 자동으로 데모 섹션으로 스크롤
        setTimeout(() => {
            demoRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleImprovePrompt = async () => {
        if (!inputText.trim()) {
            toast.error('프롬프트를 입력해주세요');
            return;
        }

        setIsLoading(true);
        setHasTriedDemo(true);

        try {
            // 실제 Gemini API를 사용한 프롬프트 개선
            const response = await fetch('/api/improve-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: inputText }),
            });

            const data: ImprovePromptResponse = await response.json();

            if (!response.ok) {
                // 에러 상태 코드별 처리
                if (response.status === 429) {
                    // 사용 제한 초과 (실제 사용자 한도)
                    toast.error(data.error || '일일 사용 한도(3회)를 초과했습니다.');
                    // 사전 등록 유도
                    setTimeout(() => {
                        scrollToPreRegistration();
                    }, 2000);
                } else if (response.status === 503) {
                    // Gemini API 할당량 초과 (서비스 문제)
                    toast.warning('AI 서비스가 일시적으로 사용량이 많습니다. 잠시 후 다시 시도해주세요.', {
                        description: '이는 사용자의 일일 한도와는 별개의 문제입니다.'
                    });
                } else {
                    toast.error(data.error || '프롬프트 향상에 실패했습니다');
                }
                return;
            }

            // 성공 응답 처리
            if (data.improvedPrompt) {
                setInputText(data.improvedPrompt);
                setImproveCount(prev => prev + 1);

                // 토스트 알림 제거 - UI에서 "프롬프트 개선 완료!" 메시지가 이미 표시되므로 중복 방지
                // 기존 토스트 알림 코드 주석 처리:
                // if (improveCount === 0) {
                //     toast.success('🚀 AI가 프롬프트를 10배 향상시켰습니다!');
                // } else if (improveCount === 1) {
                //     toast.success('⚡ AI 프롬프트 성능이 극적으로 개선되었습니다!');
                // } else {
                //     toast.success('🎯 AI가 완벽한 프롬프트로 변환했습니다!');
                // }
            }

        } catch (error) {
            toast.error('프롬프트 향상에 실패했습니다. 다시 시도해주세요.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // 테스트용 개선 함수 (API 호출 없이 임시 개선안 제공)
    const handleTestImprovePrompt = async () => {
        if (!inputText.trim()) {
            toast.error('프롬프트를 입력해주세요');
            return;
        }

        setIsLoading(true);
        setHasTriedDemo(true);

        // 로딩 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // 임시 개선안 생성 로직
            const generateTestImprovement = (original: string): string => {
                // 다양한 개선 패턴들
                const wordImprovements = [
                    { pattern: /이메일/gi, replacement: '전문적이고 매력적인 이메일' },
                    { pattern: /작성/gi, replacement: '세심하게 작성' },
                    { pattern: /소개/gi, replacement: '상세하고 매력적인 소개' },
                    { pattern: /글/gi, replacement: '고품질 콘텐츠' },
                    { pattern: /만들어/gi, replacement: '전문적으로 제작해' },
                    { pattern: /설명/gi, replacement: '구체적으로 설명' },
                    { pattern: /도움/gi, replacement: '전문적인 도움' },
                    { pattern: /내용/gi, replacement: '핵심 내용' },
                    { pattern: /방법/gi, replacement: '효과적인 방법' },
                    { pattern: /계획/gi, replacement: '체계적인 계획' }
                ];

                let improved = original;
                
                // 기본 단어 개선사항 적용
                wordImprovements.forEach(({ pattern, replacement }) => {
                    improved = improved.replace(pattern, replacement);
                });

                // 문장 구조 개선
                if (improved.length > 20) {
                    // 더 구체적인 맥락 추가
                    const contextEnhancements = [
                        '\n\n구체적인 요구사항:',
                        '- 타겟 오디언스: [구체적인 대상 독자 명시]',
                        '- 목적: [달성하고자 하는 명확한 목표]',
                        '- 톤앤매너: [전문적/친근한/공식적 등 적절한 톤 선택]',
                        '- 길이: [적절한 분량 가이드라인]',
                        '- 핵심 메시지: [전달하고자 하는 주요 포인트]'
                    ];

                    // 원문 길이에 따른 차별화
                    if (original.length < 50) {
                        improved += contextEnhancements.join('\n');
                        improved += '\n\n참고: 위 요구사항을 모두 반영하여 완성도 높은 결과물을 만들어주세요.';
                    } else if (original.length < 100) {
                        improved += contextEnhancements.slice(0, 4).join('\n');
                        improved += '\n\n[위 내용을 바탕으로 더욱 구체적이고 전문적으로 작성해주세요]';
                    } else {
                        improved += '\n\n추가 개선사항: 위 내용을 더욱 구체적이고 체계적으로 구성하되, 핵심 메시지가 명확히 전달되도록 작성해주세요.';
                    }
                } else {
                    // 매우 짧은 프롬프트의 경우 기본 구조 제공
                    improved += '\n\n[이 요청을 더 구체적으로 설명해주세요. 예: 목적, 대상, 원하는 결과 등]';
                }

                // 랜덤 개선 요소 추가 (실제 AI처럼 다양성 제공)
                const randomEnhancements = [
                    '\n\n💡 추천: 예시나 구체적인 사례를 포함하여 요청하면 더 좋은 결과를 얻을 수 있습니다.',
                    '\n\n🎯 팁: 원하는 결과물의 형식(예: 불렛 포인트, 단락 형태 등)을 명시해주세요.',
                    '\n\n📝 가이드: 특정 키워드나 피해야 할 표현이 있다면 함께 알려주세요.',
                    '\n\n⚡ 개선: 분량 제한이나 특별한 요구사항이 있다면 명시해주세요.'
                ];

                // 30% 확률로 랜덤 팁 추가
                if (Math.random() < 0.3) {
                    const randomTip = randomEnhancements[Math.floor(Math.random() * randomEnhancements.length)];
                    improved += randomTip;
                }

                return improved;
            };

            const improvedPrompt = generateTestImprovement(inputText);
            setInputText(improvedPrompt);
            setImproveCount(prev => prev + 1);

            // 토스트 알림 제거 - UI에서 "프롬프트 개선 완료!" 메시지가 이미 표시되므로 중복 방지
            // 기존 토스트 알림 코드 주석 처리:
            // if (improveCount === 0) {
            //     toast.success('🧪 테스트: AI가 프롬프트를 10배 향상시켰습니다!');
            // } else if (improveCount === 1) {
            //     toast.success('🧪 테스트: AI 프롬프트 성능이 극적으로 개선되었습니다!');
            // } else {
            //     toast.success('🧪 테스트: AI가 완벽한 프롬프트로 변환했습니다!');
            // }

        } catch (error) {
            toast.error('테스트 개선에 실패했습니다. 다시 시도해주세요.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputText,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);

        // AI 응답 시뮬레이션
        setTimeout(() => {
            const responses = [
                '네, 이해했습니다. 더 구체적인 요구사항이 있으시면 말씀해주세요!',
                '좋은 프롬프트네요! 이런 식으로 작성하면 AI가 더 정확한 답변을 드릴 수 있어요.',
                '프롬프트가 훨씬 명확해졌어요. 실제로 사용해보시면 차이를 느끼실 거예요!'
            ];

            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, aiMessage]);
        }, 1000);

        setInputText('');
    };

    // 실제 API를 사용하는 사전 등록 함수
    const handlePreRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('이메일을 입력해주세요');
            return;
        }

        setIsRegistering(true);

        try {
            const response = await fetch('/api/pre-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('🎉 사전 등록 완료! 출시 알림을 받으실 거예요.');
                setEmail('');

                // 성공 후 감사 메시지
                setTimeout(() => {
                    toast.success('🎁 얼리버드 혜택이 적용되었습니다!');
                }, 1500);
            } else if (response.status === 409) {
                toast.error(data.error || '이미 등록된 이메일입니다');
            } else {
                toast.error(data.error || '등록에 실패했습니다. 다시 시도해주세요.');
            }

        } catch (error) {
            console.error('Registration error:', error);
            toast.error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleEnhancedRegistrationSuccess = (data: any) => {
        setShowPreRegistration(false);
        toast.success('🎉 사전 등록이 성공적으로 완료되었습니다!');
    };

    const scrollToDemo = () => {
        demoRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 사전 등록 섹션으로 스크롤하는 함수
    const scrollToPreRegistration = () => {
        if (!showPreRegistration) {
            setShowPreRegistration(true);
        }
        setTimeout(() => {
            preRegRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 smooth-scroll">
            {/* Header */}
            <header className="border-b border-white/10 bg-slate-900/90 backdrop-blur-xl fixed top-0 w-full z-50">
                <Container>
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white">
                                    <Sparkles size={24} />
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-bold text-xl text-white">Smart Prompt Assistant</span>
                                <div className="text-xs text-blue-300 font-medium">백지의 압박 해결사</div>
                            </div>
                            <div className="sm:hidden">
                                <span className="font-bold text-lg text-white">SPA</span>
                                <div className="text-xs text-blue-300">백지의 압박 해결사</div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <button
                                onClick={scrollToDemo}
                                className="text-blue-200 hover:text-white transition-colors text-sm font-medium hover:underline underline-offset-4"
                            >
                                ⚡ 1분 체험
                            </button>
                            <button
                                onClick={scrollToPreRegistration}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                            >
                                <Sparkles size={16} />
                                무료 사전등록
                            </button>

                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="메뉴 열기"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-white/10 py-4 animate-slide-down">
                            <nav className="flex flex-col space-y-4">
                                <button
                                    onClick={() => {
                                        scrollToDemo();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-blue-200 hover:text-white transition-colors text-sm font-medium text-left px-4 py-2 rounded-lg hover:bg-white/10"
                                >
                                    ⚡ 1분 체험하기
                                </button>
                                <button
                                    onClick={() => {
                                        scrollToPreRegistration();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left"
                                >
                                    🎁 무료 사전등록 (얼리버드 혜택)
                                </button>

                            </nav>
                        </div>
                    )}
                </Container>
            </header>

            {/* Hero Section */}
            <section data-section="hero" className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-8">
                            {/* 메인 헤드라인 */}
                            <div className="space-y-4 animate-fade-in">
                                <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                                    <Zap size={16} />
                                    <span>AI 프롬프트 최적화 도구</span>
                                </div>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                                    프롬프트를 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">10배 더 스마트</span>하게
                                </h1>
                                <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                                    AI와 대화할 때 더 정확하고 유용한 답변을 얻는 비밀,
                                    <strong className="text-white"> 바로 프롬프트 작성법</strong>입니다.
                                </p>
                            </div>

                            {/* CTA 버튼들 */}
                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
                                <Button
                                    onClick={scrollToDemo}
                                    size="lg"
                                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200 focus-visible-enhanced"
                                >
                                    <span className="mr-2"><Wand2 size={20} /></span>
                                    지금 바로 체험하기
                                </Button>
                                <Button
                                    onClick={scrollToPreRegistration}
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200"
                                >
                                    <span className="mr-2"><Gift size={20} /></span>
                                    무료 사전 등록
                                </Button>
                            </div>

                            {/* 사회적 증거 */}
                            <div className="flex items-center justify-center space-x-8 text-blue-200 text-sm animate-fade-in-delayed">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4" />
                                    <span>1,247명 사전 등록</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>4.9/5 만족도</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Demo Section */}
            <section ref={demoRef} data-section="demo" className="py-16 px-4 sm:px-6 lg:px-8">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        {/* 섹션 헤더 */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                3초만에 프롬프트 개선 체험 🚀
                            </h2>
                            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                                샘플을 클릭하거나 직접 입력해서 AI가 어떻게 프롬프트를 개선하는지 확인해보세요
                            </p>
                        </div>

                        {/* 입력 섹션 - ChatGPT 스타일 */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 animate-slide-up overflow-hidden">
                            {/* 입력 영역 헤더 */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-b border-gray-200/50">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">프롬프트 입력</h4>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Wand2 className="w-4 h-4" />
                                        <span>AI 개선 준비됨</span>
                                    </div>
                                </div>
                            </div>

                            {/* 입력 필드 */}
                            <div className="p-6">
                                <div className="relative">
                                    <label htmlFor="prompt-input" className="sr-only">
                                        프롬프트 입력
                                    </label>
                                    <div className={cn(
                                        "relative rounded-xl border transition-all duration-300 transform",
                                        "bg-gradient-to-br from-blue-50/50 to-purple-50/50",
                                        inputText.length > 0 
                                            ? "border-blue-400 ring-4 ring-blue-500/20 scale-[1.02] shadow-lg" 
                                            : "border-gray-200 hover:border-blue-300",
                                        "focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20",
                                        "focus-within:scale-[1.02] focus-within:shadow-lg"
                                    )}>
                                        <textarea
                                            id="prompt-input"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="예: 고객에게 제품 소개 이메일을 작성해주세요..."
                                            className={cn(
                                                "w-full min-h-[160px] sm:min-h-[180px] p-4 pr-16 bg-transparent border-none",
                                                "text-gray-900 placeholder:text-gray-500",
                                                "focus:outline-none focus:ring-0",
                                                "resize-none transition-all duration-200",
                                                "leading-relaxed text-base"
                                            )}
                                            disabled={isLoading}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                    e.preventDefault();
                                                    if (e.shiftKey) {
                                                        handleTestImprovePrompt();
                                                    } else {
                                                        handleImprovePrompt();
                                                    }
                                                }
                                            }}
                                        />

                                        {/* 버튼 그룹 */}
                                        <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                                            {/* 테스트 개선 버튼 */}
                                            <button
                                                onClick={handleTestImprovePrompt}
                                                disabled={isLoading || !inputText.trim() || inputText.length < 10 || inputText.length > 500}
                                                className={cn(
                                                    "px-3 py-2.5 rounded-lg transition-all duration-200",
                                                    "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
                                                    "text-white font-medium text-sm",
                                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                                    "flex items-center space-x-1.5 shadow-lg touch-friendly",
                                                    "hover:scale-105 transform hover:shadow-xl",
                                                    "focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2"
                                                )}
                                                title="API 비용 없이 테스트해보기 (Shift+Ctrl+Enter)"
                                                aria-label="테스트 개선하기"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span className="hidden sm:inline text-xs">테스트 중</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-xs">🧪</span>
                                                        <span className="hidden sm:inline text-xs">테스트</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* 실제 개선 버튼 */}
                                            <button
                                                onClick={handleImprovePrompt}
                                                disabled={isLoading || !inputText.trim() || inputText.length < 10 || inputText.length > 500}
                                                className={cn(
                                                    "px-4 py-2.5 rounded-lg transition-all duration-200",
                                                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                                                    "text-white font-medium text-sm",
                                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                                    "flex items-center space-x-2 shadow-lg touch-friendly",
                                                    "hover:scale-105 transform hover:shadow-xl",
                                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                                                )}
                                                title="Ctrl/Cmd + Enter로도 실행 가능"
                                                aria-label="프롬프트 개선하기"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span className="hidden sm:inline">개선 중</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Wand2 className="w-4 h-4" />
                                                        <span className="hidden sm:inline">개선하기</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* 문자 수 카운터 및 입력 가이드 */}
                                    <div className="flex items-center justify-between mt-3 text-xs">
                                                                            <div className="flex items-center space-x-4">
                                        <span className="text-gray-500">💡 샘플을 클릭하여 빠르게 시작해보세요</span>
                                        <span className="text-gray-400 text-xs">🧪 테스트 버튼: API 비용 없이 체험</span>
                                    </div>
                                        <div className="flex items-center space-x-3">
                                            {/* 문자 수 카운터 */}
                                            <div className={cn(
                                                "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                                                inputText.length < 10 
                                                    ? "bg-red-100 text-red-600" 
                                                    : inputText.length > 500 
                                                    ? "bg-red-100 text-red-600"
                                                    : inputText.length > 400
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-green-100 text-green-600"
                                            )}>
                                                <span>{inputText.length}</span>
                                                <span>/</span>
                                                <span>500</span>
                                            </div>
                                            {/* 키보드 단축키 힌트 */}
                                            <div className="hidden sm:flex flex-col items-end space-y-1 text-gray-500 text-xs">
                                                <div className="flex items-center space-x-1">
                                                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl</kbd>
                                                    <span>+</span>
                                                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Enter</kbd>
                                                    <span>실제 개선</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <kbd className="px-1.5 py-1 bg-gray-200 rounded text-xs font-mono">Shift</kbd>
                                                    <span>+</span>
                                                    <kbd className="px-1.5 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl</kbd>
                                                    <span>+</span>
                                                    <kbd className="px-1.5 py-1 bg-gray-200 rounded text-xs font-mono">Enter</kbd>
                                                    <span>테스트</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* 입력 검증 메시지 */}
                                    {inputText.length > 0 && (
                                        <div className={cn(
                                            "mt-2 text-xs flex items-center space-x-1",
                                            inputText.length < 10 
                                                ? "text-red-600" 
                                                : inputText.length > 500 
                                                ? "text-red-600"
                                                : "text-green-600"
                                        )}>
                                            {inputText.length < 10 ? (
                                                <>
                                                    <span>⚠️</span>
                                                    <span>프롬프트가 너무 짧습니다. 최소 10자 이상 입력해주세요.</span>
                                                </>
                                            ) : inputText.length > 500 ? (
                                                <>
                                                    <span>⚠️</span>
                                                    <span>프롬프트가 너무 깁니다. 500자 이하로 줄여주세요.</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>✅</span>
                                                    <span>좋은 길이의 프롬프트입니다!</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* 작성 팁 섹션 */}
                                {inputText.length === 0 && (
                                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                                        <h5 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                                            <span className="mr-2">💡</span>
                                            효과적인 프롬프트 작성 팁
                                        </h5>
                                        <div className="grid sm:grid-cols-2 gap-3 text-xs text-blue-700">
                                            <div className="flex items-start space-x-2">
                                                <span className="text-blue-500 font-bold">1.</span>
                                                <span>구체적인 목적과 상황을 명시하세요</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <span className="text-blue-500 font-bold">2.</span>
                                                <span>원하는 결과물의 형식을 설명하세요</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <span className="text-blue-500 font-bold">3.</span>
                                                <span>대상 독자나 사용자를 고려하세요</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <span className="text-blue-500 font-bold">4.</span>
                                                <span>톤앤매너나 스타일을 지정하세요</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 샘플 프롬프트 섹션 - 개선된 스타일 */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-sm font-medium text-gray-700">빠른 시작 샘플</h5>
                                        <span className="text-xs text-gray-500">클릭하여 사용</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {samplePrompts.map((prompt, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSampleClick(prompt)}
                                                className="text-left p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl border border-blue-200/50 hover:border-blue-300/50 transition-all duration-200 text-sm text-gray-700 hover:text-gray-900 touch-friendly group shadow-sm hover:shadow-md sample-prompt-card"
                                                aria-label={`샘플 프롬프트: ${prompt}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="leading-relaxed">{prompt}</span>
                                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 flex-shrink-0 ml-2" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 체험 후 혜택 안내 - 개선된 스타일 */}
                                {hasTriedDemo && (
                                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200/50 animate-fade-in">
                                        <div className="flex items-center space-x-2 text-green-700 mb-2">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="font-medium">프롬프트 개선 완료!</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {improveCount < 2
                                                ? `🚀 프롬프트가 ${(improveCount + 1) * 10}배 향상되었습니다! ${2 - improveCount}번 더 체험해보세요.`
                                                : '⚡ 프롬프트 성능이 극적으로 개선되었습니다!'
                                            }
                                        </p>
                                        {improveCount >= 2 && (
                                            <div className="mt-2 text-xs text-green-600">
                                                🎯 사전 등록하고 더 강력한 AI 기능을 경험해보세요!
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Pre-Registration Section - 개선된 폼 */}
            {(showPreRegistration || improveCount >= 2) && (
                <section ref={preRegRef} data-section="pre-registration" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 animate-fade-in">
                    <Container>
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center space-x-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                    <Gift className="w-4 h-4" />
                                    <span>얼리버드 특별 혜택</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    체험이 마음에 드셨나요? 🚀
                                </h2>
                                <p className="text-xl text-blue-100 mb-6">
                                    사전 등록하고 특별한 혜택을 받아보세요!
                                </p>
                            </div>

                            {/* 혜택 리스트 */}
                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🚀</div>
                                    <h3 className="font-bold text-white mb-2 text-lg">우선 액세스</h3>
                                    <p className="text-sm text-blue-200 mb-3">정식 출시 전 7일 먼저 체험</p>
                                    <div className="text-xs text-yellow-300 font-medium bg-yellow-500/20 px-2 py-1 rounded-full inline-block">
                                        ₩49,000 상당 가치
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">💎</div>
                                    <h3 className="font-bold text-white mb-2 text-lg">프리미엄 무료</h3>
                                    <p className="text-sm text-blue-200 mb-3">프리미엄 기능 3개월 무료 + 무제한 프롬프트</p>
                                    <div className="text-xs text-yellow-300 font-medium bg-yellow-500/20 px-2 py-1 rounded-full inline-block">
                                        ₩87,000 상당 가치
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🏆</div>
                                    <h3 className="font-bold text-white mb-2 text-lg">창립 멤버 특전</h3>
                                    <p className="text-sm text-blue-200 mb-3">평생 50% 할인 + 전용 뱃지 + VIP 지원</p>
                                    <div className="text-xs text-yellow-300 font-medium bg-yellow-500/20 px-2 py-1 rounded-full inline-block">
                                        ₩500,000+ 평생 가치
                                    </div>
                                </div>
                            </div>

                            {/* 추가 혜택 및 긴급감 조성 */}
                            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 mb-8 border border-yellow-400/30">
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-2 mb-3">
                                        <span className="text-2xl">⏰</span>
                                        <span className="text-yellow-300 font-bold text-lg">한정 혜택</span>
                                    </div>
                                    <p className="text-white font-semibold mb-2">
                                        첫 100명만! 총 ₩636,000 상당 혜택
                                    </p>
                                    <div className="flex items-center justify-center space-x-4 text-sm text-yellow-200">
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>현재 73명 등록</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>27자리 남음</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 사전 등록 폼 */}
                            <div className="bg-white rounded-2xl p-4">
                                <EnhancedPreRegistrationForm
                                    onSuccess={handleEnhancedRegistrationSuccess}
                                />
                            </div>

                            {/* 사회적 증거 */}
                            <div className="mt-8 text-center">
                                <div className="flex items-center justify-center space-x-6 text-blue-200 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <Users className="w-4 h-4" />
                                        <span>1,247명 사전 등록</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        <span>4.9/5 만족도</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>
            )}

            {/* 간단한 푸터 */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <Container>
                    <div className="text-center text-blue-200 text-sm">
                        <p>© 2024 Smart Prompt Assistant. 더 스마트한 AI 활용의 시작.</p>
                    </div>
                </Container>
            </footer>

            {/* 모바일 네비게이션 바 */}
            <MobileNavBar
                hasTriedDemo={hasTriedDemo}
                improveCount={improveCount}
                showPreRegistration={showPreRegistration}
                onNavigate={(section) => {
                    // 네비게이션 이벤트 처리
                    if (section === 'demo') {
                        scrollToDemo();
                    } else if (section === 'pre-registration') {
                        scrollToPreRegistration();
                    }
                }}
            />
        </div>
    );
} 