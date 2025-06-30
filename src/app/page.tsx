'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Send, Wand2, Loader2, Sparkles, Users, Star, ArrowRight, CheckCircle, Menu, X, Mail, Gift, Zap, Clock, Copy, Check, Crown, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileNavBar } from '@/components/layout/mobile-nav-bar';
import { EnhancedPreRegistrationForm } from '@/components/shared/enhanced-pre-registration-form';
import { TypingAnimation } from '@/components/shared/typing-animation';
import { EnhanceInterceptModal } from '@/components/shared/enhance-intercept-modal';
import { RegistrationBanner } from '@/components/shared/registration-banner';
import { BeforeAfterHeroSection } from '@/components/sections/before-after-hero-section';
import { FeaturesSection } from '@/components/sections/features-section'
import { EarlyBirdSection } from '@/components/sections/early-bird-section'
import { PreRegistrationForm } from '@/components/spa/pre-registration-form'
import FinalCTASection from '@/components/sections/final-cta-section'
import { useAPIMonitoring } from '@/hooks/use-api-monitoring';


interface ChatMessage {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
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
    const { trackAPICall, trackTestImprovement } = useAPIMonitoring();
    
    const [inputText, setInputText] = useState('');
    const [isTestLoading, setIsTestLoading] = useState(false);
    const [isImproveLoading, setIsImproveLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showPreRegistration, setShowPreRegistration] = useState(false);
    const [email, setEmail] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [hasTriedDemo, setHasTriedDemo] = useState(false);
    const [improveCount, setImproveCount] = useState(0);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [hasUsedImproveButton, setHasUsedImproveButton] = useState(false);
    const [hasShownImproveSuggestion, setHasShownImproveSuggestion] = useState(false);
    
    // 새로운 상태들
    const [showInterceptModal, setShowInterceptModal] = useState(false);
    const [showRegistrationBanner, setShowRegistrationBanner] = useState(false);
    const [bannerDismissed, setBannerDismissed] = useState(false);

    

    const demoRef = useRef<HTMLDivElement>(null);
    const preRegRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const lastScrollTopRef = useRef<number>(0);

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

    // 스마트 자동 스크롤 함수
    const scrollToBottom = useCallback((force = false) => {
        if (!chatContainerRef.current) return;
        
        const container = chatContainerRef.current;
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
        
        // 강제 스크롤이거나 사용자가 하단 근처에 있을 때만 자동 스크롤
        if (force || (shouldAutoScroll && (isAtBottom || !isUserScrolling))) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [shouldAutoScroll, isUserScrolling]);

    // 사용자 스크롤 감지
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            const currentScrollTop = container.scrollTop;
            const maxScrollTop = container.scrollHeight - container.clientHeight;
            const isAtBottom = currentScrollTop >= maxScrollTop - 10;

            // 사용자가 위로 스크롤했는지 감지
            if (currentScrollTop < lastScrollTopRef.current && !isAtBottom) {
                setIsUserScrolling(true);
                setShouldAutoScroll(false);
            } else if (isAtBottom) {
                setIsUserScrolling(false);
                setShouldAutoScroll(true);
            }

            lastScrollTopRef.current = currentScrollTop;

            // 스크롤 중 상태 관리
            setIsUserScrolling(true);
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsUserScrolling(false);
            }, 150);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    // 채팅 메시지 변경 시 자동 스크롤
    useEffect(() => {
        if (chatMessages.length > 1) {
            // 새 메시지 추가 시 강제 스크롤
            setTimeout(() => scrollToBottom(true), 100);
        }
    }, [chatMessages, scrollToBottom]);

    // 타이핑 진행 중 점진적 스크롤
    const handleTypingProgress = useCallback((progress: number) => {
        if (progress > 0.1 && shouldAutoScroll) { // 10% 이상 타이핑 진행 시
            setTimeout(() => scrollToBottom(false), 50);
        }
    }, [scrollToBottom, shouldAutoScroll]);

    // 3회 체험 후 자동으로 사전 등록 유도
    useEffect(() => {
        if (improveCount >= 3 && !showPreRegistration) {
            setTimeout(() => {
                setShowPreRegistration(true);
                preRegRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        }
    }, [improveCount, showPreRegistration]);

    // 3회 향상 후 등록 배너 표시
    useEffect(() => {
        if (improveCount >= 3 && !bannerDismissed) {
            setTimeout(() => {
                setShowRegistrationBanner(true);
            }, 2000);
        }
    }, [improveCount, bannerDismissed]);



    // 샘플 프롬프트 - 즉시 체험 유도
    const samplePrompts = [
        "고객에게 제품 소개 이메일을 작성해주세요.",
        "마케팅 캠페인 아이디어를 브레인스토밍해주세요.",
        "회의록을 정리하고 액션 아이템을 추출해주세요.",
        "블로그 포스트 개요를 작성해주세요."
    ];

    const handleSampleClick = (sample: string) => {
        setInputText(sample);
        // 샘플 클릭 시 자동으로 데모 섹션으로 스크롤
        setTimeout(() => {
            demoRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // 텍스트 영역 자동 크기 조절 함수
    const adjustTextareaHeight = useCallback(() => {
        if (textareaRef.current) {
            requestAnimationFrame(() => {
                const textarea = textareaRef.current;
                if (!textarea) return;
                
                textarea.style.height = 'auto';
                const scrollHeight = textarea.scrollHeight;
                const maxHeight = 200; // 최대 높이 200px
                const minHeight = 60; // 최소 높이 60px
                const targetHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
                textarea.style.height = `${targetHeight}px`;
                
                // 최대 높이 도달 시 스크롤 표시
                if (scrollHeight > maxHeight) {
                    textarea.style.overflowY = 'auto';
                } else {
                    textarea.style.overflowY = 'hidden';
                }
            });
        }
    }, []);

    // inputText 변경 시 자동으로 텍스트 영역 크기 조절
    useEffect(() => {
        adjustTextareaHeight();
    }, [inputText, adjustTextareaHeight]);

    const handleImprovePrompt = async () => {
        if (!inputText.trim()) {
            toast.error('프롬프트를 입력해주세요');
            return;
        }

        setIsImproveLoading(true);
        setHasTriedDemo(true);
        setHasUsedImproveButton(true); // 개선하기 버튼 사용 기록

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
                    // 사전 등록 유도 - 제거된 자동 스크롤
                    setTimeout(() => {
                        scrollToPreRegistration();
                    }, 2000);
                } else if (response.status === 503) {
                    // API 키 설정 문제 또는 서비스 문제
                    if (data.error && data.error.includes('API 키가 설정되지 않았습니다')) {
                        toast.error('🔑 Gemini API 키가 설정되지 않았습니다', {
                            description: '.env.local 파일에 GEMINI_API_KEY를 추가해주세요',
                            duration: 5000,
                        });
                    } else {
                        toast.warning('AI 서비스가 일시적으로 사용량이 많습니다. 잠시 후 다시 시도해주세요.', {
                            description: '이는 사용자의 일일 한도와는 별개의 문제입니다.'
                        });
                    }
                } else if (response.status === 401) {
                    // API 키 유효성 문제
                    toast.error('❌ API 키가 유효하지 않습니다', {
                        description: 'Google AI Studio에서 새로운 키를 발급받아주세요',
                        duration: 5000,
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
                // 자동 스크롤 제거 - 프롬프트 개선 후 페이지 이동 없음
            }

        } catch (error) {
            toast.error('프롬프트 향상에 실패했습니다. 다시 시도해주세요.');
            console.error(error);
        } finally {
            setIsImproveLoading(false);
        }
    };

    // 테스트용 개선 함수 (API 호출 없이 고도화된 로컬 개선안 제공)
    const handleTestImprovePrompt = async () => {
        if (!inputText.trim()) {
            toast.error('프롬프트를 입력해주세요');
            return;
        }

        const startTime = Date.now();
        setIsTestLoading(true);
        setHasTriedDemo(true);
        setHasUsedImproveButton(true); // 개선하기 버튼 사용 기록

        // 로딩 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // 고도화된 프롬프트 개선 서비스 사용
            const { PromptImprovementService } = await import('@/lib/services/prompt-improvement-service');
            const improvementService = PromptImprovementService.getInstance();
            
            const originalLength = inputText.length;
            const suggestion = improvementService.suggestImprovements(inputText);
            const improvedLength = suggestion.improvedPrompt.length;
            const processingTime = Date.now() - startTime;
            
            // 개선된 프롬프트 적용
            setInputText(suggestion.improvedPrompt);
            setImproveCount(prev => prev + 1);
            
            // 모니터링 추적
            trackTestImprovement(true, processingTime, originalLength, improvedLength, suggestion.score);
            
            // 개선사항이 있는 경우 사용자에게 알림
            if (suggestion.improvements.length > 0) {
                const improvementMessage = `프롬프트가 개선되었습니다! (점수: ${suggestion.score}/10)\n개선사항: ${suggestion.improvements.join(', ')}`;
                toast.success(improvementMessage);
            }
            
            // 팁이 있는 경우 추가 알림
            if (suggestion.tips.length > 0 && Math.random() < 0.5) {
                setTimeout(() => {
                    toast.info(suggestion.tips[0]);
                }, 2000);
            }

        } catch (error) {
            console.error('Test improvement error:', error);
            
            const processingTime = Date.now() - startTime;
            const originalLength = inputText.length;
            
            // 폴백: 기존 간단한 개선 로직 사용
            const fallbackImprovement = inputText + '\n\n[더 구체적인 요구사항을 추가하면 더 나은 결과를 얻을 수 있습니다]';
            setInputText(fallbackImprovement);
            setImproveCount(prev => prev + 1);
            
            // 에러 모니터링 추적
            trackTestImprovement(false, processingTime, originalLength, fallbackImprovement.length);
            
            toast.success('기본 개선이 적용되었습니다.');
        } finally {
            setIsTestLoading(false);
        }
    };

    // Textarea 높이 리셋 함수
    const resetTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '60px'; // 초기 높이로 리셋
            textareaRef.current.style.overflowY = 'hidden';
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        // 향상 버튼을 사용하지 않은 경우 인터셉트 모달 표시
        if (!hasUsedImproveButton && !hasShownImproveSuggestion) {
            setShowInterceptModal(true);
            return;
        }

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputText,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);

        // 입력 필드 초기화 및 로딩 상태 설정
        const currentMessage = inputText;
        setInputText('');
        resetTextareaHeight();

        try {
            // AI 응답 생성을 위한 API 호출
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: currentMessage }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '응답 생성에 실패했습니다.');
            }

            const data = await response.json();

            // AI 응답을 채팅에 추가 (타이핑 애니메이션 적용)
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: data.response,
                timestamp: new Date(),
                isTyping: true
            };
            setChatMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Chat API Error:', error);
            
            // 에러 발생 시 폴백 응답 제공
            const fallbackMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: '죄송합니다. 일시적으로 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요. 🙏',
                timestamp: new Date(),
                isTyping: true
            };
            setChatMessages(prev => [...prev, fallbackMessage]);
            
            // 사용자에게 에러 알림
            toast.error(error instanceof Error ? error.message : '응답 생성 중 오류가 발생했습니다.');
        }

        // 메시지 전송 후 향상 버튼 사용 상태 리셋
        setHasUsedImproveButton(false);
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

                // 성공 후 감사 메시지 (중복 방지를 위해 제거)
                // setTimeout(() => {
                //     toast.success('🎁 얼리버드 혜택이 적용되었습니다!');
                // }, 1500);
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
        // 토스트는 EnhancedPreRegistrationForm에서 이미 표시하므로 여기서는 제거
        // 추가 혜택 토스트만 1.5초 후에 표시
        setTimeout(() => {
            toast.success('🎁 얼리버드 혜택이 적용되었습니다!');
        }, 1500);
    };

    // 인터셉트 모달 핸들러들
    const handleInterceptEnhance = () => {
        setShowInterceptModal(false);
        setHasShownImproveSuggestion(true);
        handleImprovePrompt();
    };

    const handleInterceptSendAnyway = async () => {
        setShowInterceptModal(false);
        setHasShownImproveSuggestion(true);
        
        // 실제 메시지 전송 로직 실행
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputText,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);

        // 입력 필드 초기화
        const currentMessage = inputText;
        setInputText('');
        resetTextareaHeight();

        try {
            // AI 응답 생성을 위한 API 호출
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: currentMessage }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '응답 생성에 실패했습니다.');
            }

            const data = await response.json();

            // AI 응답을 채팅에 추가 (타이핑 애니메이션 적용)
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: data.response,
                timestamp: new Date(),
                isTyping: true
            };
            setChatMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Chat API Error:', error);
            
            // 에러 발생 시 폴백 응답 제공
            const fallbackMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: '죄송합니다. 일시적으로 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요. 🙏',
                timestamp: new Date(),
                isTyping: true
            };
            setChatMessages(prev => [...prev, fallbackMessage]);
            
            // 사용자에게 에러 알림
            toast.error(error instanceof Error ? error.message : '응답 생성 중 오류가 발생했습니다.');
        }

        // 메시지 전송 후 향상 버튼 사용 상태 리셋
        setHasUsedImproveButton(false);
    };

    // 등록 배너 핸들러들
    const handleBannerJoinBeta = () => {
        setShowRegistrationBanner(false);
        scrollToPreRegistration();
    };

    const handleBannerClose = () => {
        setShowRegistrationBanner(false);
        setBannerDismissed(true);
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

    // 메시지 복사 기능
    const handleCopyMessage = async (messageId: string, content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedMessageId(messageId);
            toast.success('메시지가 복사되었습니다', {
                duration: 2000,
            });
            
            // 2초 후 복사 상태 초기화
            setTimeout(() => {
                setCopiedMessageId(null);
            }, 2000);
        } catch (error) {
            toast.error('복사에 실패했습니다');
            console.error('Copy failed:', error);
        }
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
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                            >
                                <Sparkles size={16} />
                                <span>무료 사전등록</span>
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
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left flex items-center space-x-2"
                                >
                                    <span>🎁</span>
                                    <span>무료 사전등록</span>
                                </button>

                            </nav>
                        </div>
                    )}
                </Container>
            </header>

            {/* Hero Section */}
            <BeforeAfterHeroSection 
                onTransformClick={scrollToDemo}
                onPreRegisterClick={() => setShowPreRegistration(true)}
                showMetrics={true}
                className="pt-16"
            />

            {/* Demo Section */}
            <section id="demo-section" ref={demoRef} data-section="demo" className="py-16 px-4 sm:px-6 lg:px-8">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        {/* 섹션 헤더 */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                클릭 한번에 프롬프트 개선 체험 🚀
                            </h2>
                            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                                프롬프트를 입력한 후, 직접 버튼을 눌러 AI가 어떻게 더 나은 문장으로 다듬는지 확인해보세요.
                            </p>
                        </div>

                        {/* GPT 스타일 입력 섹션 */}
                        <div className="bg-[#212121] rounded-2xl shadow-xl border border-gray-700/50 animate-slide-up overflow-hidden">
                            {/* 헤더 */}
                            <div className="bg-[#171717] px-6 py-3 border-b border-gray-600/50">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">
                                        <span className="text-white">ChatGPT</span>
                                        <span className="text-gray-400 ml-1">(with Smart Prompt Assistant)</span>
                                    </h4>
                                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>온라인</span>
                                    </div>
                                </div>
                            </div>

                            {/* 대화 메시지 영역 */}
                            <div ref={chatContainerRef} className="p-4 space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto scroll-smooth relative">
                                {chatMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex group",
                                            message.type === 'user' ? 'justify-end' : 'justify-start'
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[80%] px-3 pt-2 rounded-2xl text-white relative",
                                                message.type === 'user'
                                                    ? 'bg-[#303030] ml-auto'
                                                    : 'bg-[#171717] mr-auto'
                                            )}
                                        >
                                            <div className="text-sm leading-relaxed whitespace-pre-wrap pr-8">
                                                {message.type === 'ai' && message.isTyping ? (
                                                    <TypingAnimation
                                                        text={message.content}
                                                        speed={30}
                                                        showCursor={true}
                                                        startDelay={500}
                                                        className="text-white"
                                                        onProgress={handleTypingProgress}
                                                    />
                                                ) : (
                                                    message.content
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div className="text-xs text-gray-400">
                                                    {message.timestamp.toLocaleTimeString([], { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </div>
                                                {/* 복사 버튼 - 모바일 최적화 */}
                                                <button
                                                    onClick={() => handleCopyMessage(message.id, message.content)}
                                                    className={cn(
                                                        // 모바일에서는 항상 표시, 데스크톱에서는 호버 시 표시
                                                        "opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200",
                                                        "p-2 md:p-1 rounded hover:bg-gray-600/50 text-gray-400 hover:text-white",
                                                        "focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-500",
                                                        // 터치 타겟 크기 최적화 (44px 최소)
                                                        "min-w-[44px] min-h-[44px] md:min-w-auto md:min-h-auto",
                                                        "flex items-center justify-center"
                                                    )}
                                                    title="메시지 복사"
                                                    aria-label="메시지 복사하기"
                                                >
                                                    {copiedMessageId === message.id ? (
                                                        <Check size={16} className="text-green-400" />
                                                    ) : (
                                                        <Copy size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* 로딩 상태 */}
                                {(isTestLoading || isImproveLoading) && (
                                    <div className="flex justify-start">
                                        <div className="bg-[#171717] px-4 py-3 rounded-2xl">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                                <span className="text-xs text-gray-400">AI가 생각하고 있어요...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* GPT 스타일 입력 영역 */}
                            <div className="p-4 pb-6">
                                <div className="relative">
                                    <textarea
                                        ref={textareaRef}
                                        id="prompt-input"
                                        className="w-full bg-[#2f2f2f] border border-gray-600 rounded-xl px-4 py-3 pr-48 md:pr-40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[60px] transition-all duration-150 ease-out"
                                        value={inputText}
                                        onChange={(e) => {
                                            setInputText(e.target.value);
                                            // adjustTextareaHeight는 useEffect에서 자동으로 호출됨
                                        }}
                                        onInput={(e) => {
                                            // 입력 이벤트 시에도 즉시 크기 조절
                                            adjustTextareaHeight();
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                if (inputText.trim() && inputText.length <= 500) {
                                                    e.preventDefault();
                                                    // 향상 버튼을 사용하지 않았다면 인터셉트 모달 표시
                                                    if (!hasUsedImproveButton && !hasShownImproveSuggestion) {
                                                        setShowInterceptModal(true);
                                                    } else {
                                                        handleSendMessage();
                                                    }
                                                }
                                            }
                                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                e.preventDefault();
                                                handleImprovePrompt();
                                            }
                                            if (e.key === 'Enter' && e.shiftKey && (e.ctrlKey || e.metaKey)) {
                                                e.preventDefault();
                                                handleTestImprovePrompt();
                                            }
                                        }}
                                        placeholder="프롬프트를 입력하세요"
                                        disabled={isTestLoading || isImproveLoading}
                                        maxLength={500}
                                        style={{ 
                                            resize: 'none', 
                                            overflowY: 'hidden',
                                            transition: 'height 0.15s ease-out, border-color 0.2s ease-out'
                                        }}
                                    />
                                    
                                    {/* 입력 필드 내부 버튼 그룹 - 모바일 최적화 */}
                                    <div className="absolute right-6 md:right-6 bottom-3 flex items-center space-x-2 md:space-x-1">
                                        
                                        {/* 테스트 버튼 - 모바일 최적화 */}
                                        <button
                                            type="button"
                                            onClick={handleTestImprovePrompt}
                                            disabled={isTestLoading || isImproveLoading || !inputText.trim() || inputText.length > 500}
                                            className={cn(
                                                "rounded-lg p-2 md:p-2 text-white transition-all duration-200",
                                                "bg-gray-600 hover:bg-gray-500",
                                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                                "flex items-center justify-center",
                                                "focus:outline-none focus:ring-2 focus:ring-gray-400",
                                                // 모바일 터치 타겟 최적화
                                                "min-w-[44px] min-h-[44px] md:min-w-auto md:min-h-auto"
                                            )}
                                            title="테스트 개선 (Shift+Ctrl+Enter)"
                                            aria-label="테스트 개선하기"
                                        >
                                            {isTestLoading ? (
                                                <div className="animate-spin">
                                                    <Loader2 size={16} />
                                                </div>
                                            ) : (
                                                <span className="text-sm">🧪</span>
                                            )}
                                        </button>

                                        {/* 마법봉 버튼 (프롬프트 개선) - 모바일 최적화 */}
                                        <button
                                            type="button"
                                            onClick={handleImprovePrompt}
                                            disabled={isTestLoading || isImproveLoading || !inputText.trim() || inputText.length > 500}
                                            className={cn(
                                                "rounded-lg p-2 md:p-2 text-white transition-all duration-200",
                                                "bg-purple-600 hover:bg-purple-700",
                                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                                "flex items-center justify-center",
                                                "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                                // 모바일 터치 타겟 최적화
                                                "min-w-[44px] min-h-[44px] md:min-w-auto md:min-h-auto"
                                            )}
                                            title="프롬프트 개선 (Ctrl+Enter)"
                                            aria-label="프롬프트 개선하기"
                                        >
                                            {isImproveLoading ? (
                                                <div className="animate-spin">
                                                    <Loader2 size={16} />
                                                </div>
                                            ) : (
                                                <Wand2 size={16} />
                                            )}
                                        </button>

                                        {/* 전송 버튼 - 모바일 최적화 */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // 향상 버튼을 사용하지 않았다면 인터셉트 모달 표시
                                                if (!hasUsedImproveButton && !hasShownImproveSuggestion) {
                                                    setShowInterceptModal(true);
                                                } else {
                                                    handleSendMessage();
                                                }
                                            }}
                                            disabled={isTestLoading || isImproveLoading || !inputText.trim() || inputText.length > 500}
                                            className={cn(
                                                "rounded-lg p-2 md:p-2 text-white transition-all duration-200",
                                                "bg-blue-600 hover:bg-blue-700",
                                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                                "flex items-center justify-center",
                                                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                // 모바일 터치 타겟 최적화
                                                "min-w-[44px] min-h-[44px] md:min-w-auto md:min-h-auto"
                                            )}
                                            title="메시지 전송 (Enter)"
                                            aria-label="메시지 전송하기"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* 문자 수 카운터 - 입력 필드 외부 하단에 배치 */}
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-xs text-gray-400">
                                        {inputText.length}/500
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Enter: 전송 | Ctrl+Enter: 개선 | Shift+Ctrl+Enter: 테스트
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 작성 팁 섹션 - 다크 테마 */}
                        <div className="mt-6">
                                {inputText.length === 0 && (
                                    <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600/50">
                                        <h5 className="text-sm font-semibold text-blue-300 mb-2 flex items-center">
                                            <span className="mr-2">💡</span>
                                            효과적인 프롬프트 작성 팁
                                        </h5>
                                        <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-300">
                                            <div className="flex items-start space-x-2">
                                                <span className="text-blue-400 font-bold">1.</span>
                                                <span>구체적인 목적과 상황을 명시하세요</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <span className="text-blue-400 font-bold">2.</span>
                                                <span>원하는 결과물의 형식을 설명하세요</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <span className="text-blue-400 font-bold">3.</span>
                                                <span>대상 독자나 사용자를 고려하세요</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <span className="text-blue-400 font-bold">4.</span>
                                                <span>톤앤매너나 스타일을 지정하세요</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 샘플 프롬프트 섹션 - 작성 팁과 동일한 색상 테마 */}
                                <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600/50">
                                    <h5 className="text-sm font-semibold text-blue-300 mb-3 flex items-center">
                                        <span className="mr-2">🚀</span>
                                        빠른 시작 샘플
                                    </h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {samplePrompts.map((prompt, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSampleClick(prompt)}
                                                className="text-left p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 text-xs text-gray-300 hover:text-white touch-friendly group"
                                                aria-label={`샘플 프롬프트: ${prompt}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="leading-relaxed">{prompt}</span>
                                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 flex-shrink-0 ml-2"><ArrowRight size={16} /></span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 체험 후 혜택 안내 - 다크 테마 */}
                                {hasTriedDemo && (
                                    <div className={`mt-6 p-4 rounded-xl animate-fade-in ${
                                        improveCount === 1 
                                            ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-blue-600/50'
                                            : improveCount === 2
                                            ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-600/50'
                                            : improveCount === 3
                                            ? 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-600/50'
                                            : 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-600/50'
                                    }`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            {improveCount === 1 && (
                                                <>
                                                    <div className="text-blue-400"><CheckCircle size={20} /></div>
                                                    <span className="font-medium text-blue-400">프롬프트 개선 완료!</span>
                                                </>
                                            )}
                                            {improveCount === 2 && (
                                                <>
                                                    <div className="text-purple-400"><CheckCircle size={20} /></div>
                                                    <span className="font-medium text-purple-400">프롬프트 개선 완료!</span>
                                                </>
                                            )}
                                            {improveCount === 3 && (
                                                <>
                                                    <div className="text-yellow-400"><CheckCircle size={20} /></div>
                                                    <span className="font-medium text-yellow-400">프롬프트 개선 완료!</span>
                                                </>
                                            )}
                                            {improveCount >= 4 && (
                                                <>
                                                    <div className="text-green-400"><CheckCircle size={20} /></div>
                                                    <span className="font-medium text-green-400">프롬프트 개선 완료!</span>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {improveCount === 1 && (
                                                '🚀 프롬프트가 10% 향상되었습니다! 3번 더 체험해보세요.'
                                            )}
                                            {improveCount === 2 && (
                                                '🔥 프롬프트가 25% 향상되었습니다! 2번 더 체험해보세요.'
                                            )}
                                            {improveCount === 3 && (
                                                '✨ 프롬프트가 45% 향상되었습니다! 1번 더 체험해보세요.'
                                            )}
                                            {improveCount >= 4 && (
                                                '⚡ 프롬프트 성능이 극적으로 개선되었습니다!'
                                            )}
                                        </p>
                                        {improveCount >= 3 && (
                                            <div className="mt-2 text-xs text-green-300">
                                                🎯 사전 등록하고 더 강력한 AI 기능을 경험해보세요!
                                            </div>
                                        )}
                                        {improveCount === 1 && (
                                            <div className="mt-2 text-xs text-blue-300">
                                                💡 계속 개선하면 더욱 강력한 프롬프트가 됩니다!
                                            </div>
                                        )}
                                        {improveCount === 2 && (
                                            <div className="mt-2 text-xs text-purple-300">
                                                🔮 이제 절반 이상 개선되었어요! 계속해보세요!
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </Container>
            </section>



            {/* Pre-Registration Section - 기존 폼 (3회 체험 후에만 표시) */}
            {(showPreRegistration || improveCount >= 3) && (
                <section ref={preRegRef} data-section="pre-registration" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 animate-fade-in">
                    <Container>
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                                            <div className="inline-flex items-center space-x-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Crown size={16} />
                                <span>First Mover Club 초대</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                First Mover Club에 초대합니다 🚀
                            </h2>
                            <p className="text-xl text-blue-100 mb-6">
                                당신의 목소리로 제품을 완성해주세요
                            </p>
                            </div>

                            {/* 혜택 리스트 */}
                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">💬</div>
                                    <h3 className="font-bold text-white mb-2 text-lg">실질적인 제품 영향력</h3>
                                    <p className="text-sm text-blue-200 mb-3">비공개 베타 우선 초대, 신기능 투표, 개발자 직접 소통 채널 참여</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🏆</div>
                                    <h3 className="font-bold text-white mb-2 text-lg">영구적인 명예와 인정</h3>
                                    <p className="text-sm text-blue-200 mb-3">'명예의 전당(Hall of Fame)'에 닉네임 등재 및 전용 디지털 뱃지 제공</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🎁</div>
                                    <h3 className="font-bold text-white mb-2 text-lg">감사의 웰컴 리워드</h3>
                                    <p className="text-sm text-blue-200 mb-3">정식 출시 후 첫 결제 시 사용 가능한 ₩10,000 웰컴 크레딧 제공</p>
                                </div>
                            </div>

                            {/* 추가 혜택 및 긴급감 조성 */}
                            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 mb-8 border border-yellow-400/30">
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-2 mb-3">
                                        <span className="text-2xl">👑</span>
                                        <span className="text-yellow-300 font-bold text-lg">VIP 독점 혜택</span>
                                    </div>
                                    <p className="text-white font-semibold mb-2">
                                        First Mover Club 특별 혜택
                                    </p>
                                    <div className="flex items-center justify-center space-x-4 text-sm text-yellow-200">
                                        <div className="flex items-center space-x-1">
                                            <Users size={16} />
                                            <span>현재 87명 참여</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock size={16} />
                                            <span>13자리 남음</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 사전 등록 폼 */}
                            <EnhancedPreRegistrationForm
                                onSuccess={handleEnhancedRegistrationSuccess}
                                className="w-full"
                            />

                            {/* 사회적 증거 */}

                        </div>
                    </Container>
                </section>
            )}

            {/* 간단한 푸터 */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <Container>
                    <div className="text-center text-blue-200 text-sm">
                        <p>© 2025 Smart Prompt Assistant. 더 스마트한 AI 활용의 시작.</p>
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

            {/* Enhance Intercept Modal */}
            <EnhanceInterceptModal
                isOpen={showInterceptModal}
                onClose={() => setShowInterceptModal(false)}
                onEnhanceNow={handleInterceptEnhance}
                onSendAnyway={handleInterceptSendAnyway}
            />

            {/* Registration Banner */}
            <RegistrationBanner
                isVisible={showRegistrationBanner}
                onClose={handleBannerClose}
                onJoinBeta={handleBannerJoinBeta}
            />
        </div>
    );
} 