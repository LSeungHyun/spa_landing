'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Wand2, Loader2, Sparkles, Users, Star, ArrowRight, CheckCircle, Menu, X, Mail, Gift, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileNavBar } from '@/components/layout/mobile-nav-bar';
import { EnhancedPreRegistrationForm } from '@/components/shared/enhanced-pre-registration-form';

interface ChatMessage {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
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
            // 실제적인 프롬프트 개선 로직
            await new Promise(resolve => setTimeout(resolve, 1500)); // 리얼한 로딩 시간

            const improvedPrompt = `${inputText}

[개선된 프롬프트]
위 요청을 다음과 같이 구체화하여 작성해주세요:

1. 목적: ${inputText.includes('이메일') ? '고객 관계 강화 및 제품 가치 전달' : '명확한 목표 달성'}
2. 대상: ${inputText.includes('고객') ? '기존 고객 및 잠재 고객' : '관련 이해관계자'}
3. 톤앤매너: 전문적이면서 친근한 어조
4. 구조: 도입 - 핵심 내용 - 행동 유도 순서
5. 길이: ${inputText.includes('이메일') ? '200-300단어' : '적절한 분량'}
6. 포함 요소: 구체적인 예시와 실행 가능한 액션 아이템

이 가이드라인을 바탕으로 ${inputText}를 작성해주세요.`;

            setInputText(improvedPrompt);
            setImproveCount(prev => prev + 1);
            
            // 개선 횟수에 따른 차별화된 메시지
            if (improveCount === 0) {
                toast.success('🎉 프롬프트가 10배 더 구체해졌어요!');
            } else if (improveCount === 1) {
                toast.success('🔥 또 다른 프롬프트도 개선해보세요!');
            } else {
                toast.success('✨ 완벽해요! 이제 무제한 사용해보세요!');
            }

        } catch (error) {
            toast.error('프롬프트 향상에 실패했습니다. 다시 시도해주세요.');
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
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-bold text-xl text-white">Smart Prompt Assistant</span>
                                <div className="text-xs text-blue-300">AI로 더 스마트한 프롬프트를</div>
                            </div>
                            <div className="sm:hidden">
                                <span className="font-bold text-lg text-white">SPA</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <button 
                                onClick={scrollToDemo}
                                className="text-blue-200 hover:text-white transition-colors text-sm font-medium"
                            >
                                체험하기
                            </button>
                            <button 
                                onClick={scrollToPreRegistration}
                                className="text-blue-200 hover:text-white transition-colors text-sm font-medium"
                            >
                                사전등록
                            </button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                            >
                                로그인
                            </Button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="메뉴 열기"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                                    className="text-blue-200 hover:text-white transition-colors text-sm font-medium text-left"
                                >
                                    체험하기
                                </button>
                                <button 
                                    onClick={() => {
                                        scrollToPreRegistration();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-blue-200 hover:text-white transition-colors text-sm font-medium text-left"
                                >
                                    사전등록
                                </button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white w-fit"
                                >
                                    로그인
                                </Button>
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
                                    <Zap className="w-4 h-4" />
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
                                    <Wand2 className="w-5 h-5 mr-2" />
                                    지금 바로 체험하기
                                </Button>
                                <Button 
                                    onClick={scrollToPreRegistration}
                                    variant="outline" 
                                    size="lg" 
                                    className="w-full sm:w-auto border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200"
                                >
                                    <Gift className="w-5 h-5 mr-2" />
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
                                    <div className="relative bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 chat-input-container">
                                        <textarea
                                            id="prompt-input"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="개선하고 싶은 프롬프트를 입력하세요..."
                                            className={cn(
                                                "w-full min-h-[120px] sm:min-h-[140px] p-4 pr-16 bg-transparent border-none",
                                                "text-gray-900 placeholder:text-gray-500",
                                                "focus:outline-none focus:ring-0",
                                                "resize-none transition-all duration-200 mobile-readable",
                                                "leading-relaxed"
                                            )}
                                            disabled={isLoading}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                    e.preventDefault();
                                                    handleImprovePrompt();
                                                }
                                            }}
                                        />

                                        {/* 마법의 지팡이 버튼 - 개선된 스타일 */}
                                        <button
                                            onClick={handleImprovePrompt}
                                            disabled={isLoading || !inputText.trim()}
                                            className={cn(
                                                "absolute right-3 bottom-3 px-4 py-2.5 rounded-lg transition-all duration-200",
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

                                    {/* 키보드 단축키 힌트 */}
                                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span>💡 샘플을 클릭하여 빠르게 시작해보세요</span>
                                        </div>
                                        <div className="hidden sm:flex items-center space-x-1">
                                            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl</kbd>
                                            <span>+</span>
                                            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Enter</kbd>
                                            <span>로 실행</span>
                                        </div>
                                    </div>
                                </div>

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
                                            <span className="font-medium">체험 완료!</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {improveCount < 2 
                                                ? `${2 - improveCount}번 더 체험하시면 무제한 이용 혜택을 받을 수 있어요! 🎉`
                                                : '🎉 축하합니다! 이제 무제한으로 이용하실 수 있습니다!'
                                            }
                                        </p>
                                        {improveCount >= 2 && (
                                            <div className="mt-2 text-xs text-green-600">
                                                ✨ 사전 등록하시면 더 많은 혜택을 받으실 수 있어요!
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
                                    사전 등록하시면 <strong className="text-yellow-300">평생 무료</strong> + <strong className="text-yellow-300">프리미엄 기능</strong>을 먼저 경험하실 수 있어요!
                                </p>
                            </div>

                            {/* 혜택 리스트 */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                                    <div className="text-2xl mb-2">🚀</div>
                                    <h3 className="font-semibold text-white mb-1">우선 액세스</h3>
                                    <p className="text-sm text-blue-200">정식 출시 전 우선 액세스 기회</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                                    <div className="text-2xl mb-2">👑</div>
                                    <h3 className="font-semibold text-white mb-1">프리미엄 체험</h3>
                                    <p className="text-sm text-blue-200">프리미엄 기능 1개월 무료 체험</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                                    <div className="text-2xl mb-2">🏆</div>
                                    <h3 className="font-semibold text-white mb-1">창립 멤버 뱃지</h3>
                                    <p className="text-sm text-blue-200">등록자 전용 창립 멤버 뱃지</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                                    <div className="text-2xl mb-2">💡</div>
                                    <h3 className="font-semibold text-white mb-1">기능 제안 크레딧</h3>
                                    <p className="text-sm text-blue-200">채택 시 기능 제안 크레딧 및 우선순위 부여</p>
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