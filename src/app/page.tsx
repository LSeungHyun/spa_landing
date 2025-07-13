'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
    Sparkles, 
    Copy, 
    RotateCcw, 
    Zap,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

import { BeforeAfterHeroSection } from '@/components/sections/before-after-hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { CollaborativeSection } from '@/components/sections/collaborative-section';
import { PricingSection } from '@/components/sections/pricing-section';
import { PreRegistrationSection } from '@/components/sections/pre-registration-section';
import { PromptComparison } from '@/components/shared/prompt-comparison';
import { PromptScoreDisplay } from '@/components/shared/prompt-score-display';
import { PersonaSelector } from '@/components/shared/persona-selector';
import { AIModelSelector } from '@/components/shared/ai-model-selector';
import { ModelComparisonResults } from '@/components/shared/model-comparison-results';
import { getPersonaData, getAllPersonas, type Persona } from '@/components/data/landing-data';
import { PromptImprovementService, DetailedPromptScore } from '@/lib/services/prompt-improvement-service';

// 사용량 정보 인터페이스
interface UsageInfo {
    remainingCount: number;
    usageCount: number;
    resetTime: string;
    maxUsageCount: number;
}

// API 응답 인터페이스
interface ImprovePromptResponse {
    improvedPrompt: string;
    usage: UsageInfo;
    error?: string;
}

// 실시간 점수 계산을 위한 debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function HomePage() {
    // 기존 상태들
    const [inputText, setInputText] = useState('');
    const [improvedText, setImprovedText] = useState('');
    const [isImproveLoading, setIsImproveLoading] = useState(false);
    const [isTestLoading, setIsTestLoading] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<Persona>('pm-developer');
    const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);

    // 새로운 점수 시스템 상태들
    const [currentScore, setCurrentScore] = useState<DetailedPromptScore | null>(null);
    const [originalScore, setOriginalScore] = useState<DetailedPromptScore | null>(null);
    const [improvedScore, setImprovedScore] = useState<DetailedPromptScore | null>(null);
    const [showScorePanel, setShowScorePanel] = useState(false);
    const [isScoreCalculating, setIsScoreCalculating] = useState(false);

    // 다중 모델 비교 상태들
    const [selectedModels, setSelectedModels] = useState<string[]>(['gemini-2.5-flash']);
    const [taskType, setTaskType] = useState<'creative' | 'technical' | 'business' | 'educational'>('business');
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonResults, setComparisonResults] = useState<any>(null);
    const [showComparison, setShowComparison] = useState(false);

    // 실시간 점수 계산을 위한 debounced 값
    const debouncedInputText = useDebounce(inputText, 500);

    // 서비스 인스턴스
    const promptService = useRef(PromptImprovementService.getInstance());
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 실시간 점수 계산
    useEffect(() => {
        if (debouncedInputText.trim()) {
            setIsScoreCalculating(true);
            
            // 비동기로 점수 계산 (UI 블로킹 방지)
            setTimeout(() => {
                const score = promptService.current.calculateDetailedScore(debouncedInputText);
                setCurrentScore(score);
                setIsScoreCalculating(false);
                
                // 점수가 계산되면 패널 자동 표시
                if (!showScorePanel && score.overall > 0) {
                    setShowScorePanel(true);
                }
            }, 100);
        } else {
            setCurrentScore(null);
            setIsScoreCalculating(false);
        }
    }, [debouncedInputText, showScorePanel]);

    // 기존 함수들...
    const handleImprovePrompt = async () => {
        if (!inputText.trim()) {
            toast.error('프롬프트를 입력해주세요');
            return;
        }

        // 개선 전 점수 저장
        if (currentScore) {
            setOriginalScore(currentScore);
        }

        setIsImproveLoading(true);

        try {
            const response = await fetch('/api/improve-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: inputText }),
            });

            const data: ImprovePromptResponse = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    const resetDate = data.usage?.resetTime ? new Date(data.usage.resetTime) : new Date();
                    const resetTimeStr = resetDate.toLocaleString('ko-KR');
                    toast.error(`일일 사용 한도에 도달했습니다. ${resetTimeStr}에 초기화됩니다.`);
                } else {
                    toast.error(data.error || '프롬프트 개선에 실패했습니다');
                }
                return;
            }

            if (data.improvedPrompt) {
                setImprovedText(data.improvedPrompt);
                setUsageInfo(data.usage);

                // 개선된 프롬프트의 점수 계산
                const improvedPromptScore = promptService.current.calculateDetailedScore(data.improvedPrompt);
                setImprovedScore(improvedPromptScore);

                toast.success('🎉 프롬프트가 개선되었습니다!');
            }

        } catch (error) {
            console.error('Improve prompt error:', error);
            toast.error('프롬프트 개선 중 오류가 발생했습니다');
        } finally {
            setIsImproveLoading(false);
        }
    };

    // 기존 테스트 개선 함수들...
    const handleTestImprove = async () => {
        if (!inputText.trim()) {
            toast.error('프롬프트를 입력해주세요');
            return;
        }

        // 개선 전 점수 저장
        if (currentScore) {
            setOriginalScore(currentScore);
        }

        setIsTestLoading(true);

        try {
            const response = await fetch('/api/test-improve-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: inputText }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API 호출 실패');
            }

            if (data.improvedPrompt) {
                setInputText(data.improvedPrompt);

                // 개선된 프롬프트의 점수 계산
                const improvedPromptScore = promptService.current.calculateDetailedScore(data.improvedPrompt);
                setImprovedScore(improvedPromptScore);
                
                toast.success('🎉 프롬프트가 개선되었습니다! (Gemini 2.0 Flash - 무료)');
            }

        } catch (error) {
            console.error('Test improvement error:', error);
            
            // 폴백: 로컬 개선 서비스 사용
            try {
                const suggestion = promptService.current.suggestImprovements(inputText);
                setInputText(suggestion.improvedPrompt);
                
                // 개선된 프롬프트의 점수 계산
                const improvedPromptScore = promptService.current.calculateDetailedScore(suggestion.improvedPrompt);
                setImprovedScore(improvedPromptScore);
                
                toast.success('기본 개선이 적용되었습니다 (로컬 서비스)');
            } catch {
                const fallbackImprovement = inputText + '\n\n[더 구체적인 요구사항을 추가하면 더 나은 결과를 얻을 수 있습니다]';
                setInputText(fallbackImprovement);
                toast.success('기본 개선이 적용되었습니다');
            }
        } finally {
            setIsTestLoading(false);
        }
    };

    // 기존 유틸리티 함수들...
    const resetTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '60px';
            textareaRef.current.style.overflowY = 'hidden';
        }
    };

    const handleCopyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('클립보드에 복사되었습니다');
        } catch {
            toast.error('복사에 실패했습니다');
        }
    };

    const handleReset = () => {
        setInputText('');
        setImprovedText('');
        setCurrentScore(null);
        setOriginalScore(null);
        setImprovedScore(null);
        setShowScorePanel(false);
        resetTextareaHeight();
        toast.success('초기화되었습니다');
    };

    const handlePersonaChange = (persona: Persona) => {
        setSelectedPersona(persona);
        const personaData = getPersonaData(persona);
        setInputText(personaData.placeholder);
        
        // 새로운 페르소나 선택 시 점수 초기화
        setCurrentScore(null);
        setOriginalScore(null);
        setImprovedScore(null);
        setShowScorePanel(false);
    };

    const handleCompareModels = async () => {
        if (!inputText.trim() || selectedModels.length < 2) {
            toast.error('프롬프트를 입력하고 최소 2개 모델을 선택해주세요');
            return;
        }

        setIsComparing(true);
        setShowComparison(false);

        try {
            const response = await fetch('/api/ai-models/compare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: inputText,
                    modelIds: selectedModels,
                    taskType: taskType,
                    options: {
                        prioritizeQuality: true,
                        prioritizeSpeed: false,
                        prioritizeCost: true,
                    },
                }),
            });

            const data = await response.json();

            if (data.success) {
                setComparisonResults(data.data);
                setShowComparison(true);
                toast.success(`${selectedModels.length}개 모델 비교 완료!`);
            } else {
                throw new Error(data.error || '모델 비교에 실패했습니다');
            }
        } catch (error) {
            console.error('Model comparison error:', error);
            toast.error('모델 비교 중 오류가 발생했습니다');
        } finally {
            setIsComparing(false);
        }
    };

    const personaData = getPersonaData(selectedPersona);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 smooth-scroll">
            {/* Header */}
            <header className="border-b border-white/10 bg-slate-900/90 backdrop-blur-xl fixed top-0 w-full z-50">
                <div className="container mx-auto px-4">
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
                                onClick={() => {
                                    const demoSection = document.getElementById('demo-section');
                                    if (demoSection) {
                                        demoSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="text-blue-200 hover:text-white transition-colors text-sm font-medium hover:underline underline-offset-4"
                            >
                                ⚡ 1분 체험
                            </button>
                            <button
                                onClick={() => {
                                    const preRegSection = document.getElementById('pre-registration-section');
                                    if (preRegSection) {
                                        preRegSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                            >
                                <Sparkles size={16} />
                                <span>무료 사전등록</span>
                            </button>

                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-white"
                            onClick={() => {
                                const mobileMenu = document.querySelector('.mobile-menu-content');
                                if (mobileMenu) {
                                    mobileMenu.classList.toggle('hidden');
                                }
                            }}
                            aria-label="메뉴 열기"
                        >
                            {/* Mobile menu icon will be added here */}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden border-t border-white/10 py-4 animate-slide-down mobile-menu-content hidden">
                        <nav className="flex flex-col space-y-4">
                            <button
                                onClick={() => {
                                    const demoSection = document.getElementById('demo-section');
                                    if (demoSection) {
                                        demoSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                    document.querySelector('.mobile-menu-content')?.classList.add('hidden');
                                }}
                                className="text-blue-200 hover:text-white transition-colors text-sm font-medium text-left px-4 py-2 rounded-lg hover:bg-white/10"
                            >
                                ⚡ 1분 체험하기
                            </button>
                            <button
                                onClick={() => {
                                    const preRegSection = document.getElementById('pre-registration-section');
                                    if (preRegSection) {
                                        preRegSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                    document.querySelector('.mobile-menu-content')?.classList.add('hidden');
                                }}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left flex items-center space-x-2"
                            >
                                <span>🎁</span>
                                <span>무료 사전등록</span>
                            </button>

                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <BeforeAfterHeroSection 
                onTransformClick={() => {
                    const demoSection = document.getElementById('demo-section');
                    if (demoSection) {
                        demoSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                onPreRegisterClick={() => {
                    const preRegSection = document.getElementById('pre-registration-section');
                    if (preRegSection) {
                        preRegSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                showMetrics={true}
                className="pt-16"
            />

            {/* Demo Section */}
            <section id="demo-section" className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* 섹션 헤더 */}
                        <div className="text-center mb-12">
                            <Badge variant="secondary" className="mb-4">
                                실시간 체험
                            </Badge>
                            <h2 className="text-3xl font-bold mb-4">
                                AI 프롬프트 개선을 직접 체험해보세요
                            </h2>
                            <p className="text-gray-600 text-lg">
                                실시간 점수 확인과 함께 프롬프트가 어떻게 개선되는지 확인해보세요
                            </p>
                        </div>

                        {/* 페르소나 선택 */}
                        <PersonaSelector
                            selectedPersona={selectedPersona}
                            onPersonaChange={handlePersonaChange}
                            personas={getAllPersonas()}
                        />

                        {/* 메인 입력 영역 */}
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* 입력 텍스트 영역과 점수 패널 */}
                                    <div className="grid lg:grid-cols-3 gap-6">
                                        {/* 입력 영역 */}
                                        <div className="lg:col-span-2">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-sm font-medium text-gray-700">
                                                    {personaData.title} 프롬프트 입력
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    {isScoreCalculating && (
                                                        <div className="flex items-center gap-1 text-xs text-blue-600">
                                                            <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                            점수 계산 중
                                                        </div>
                                                    )}
                                                    {currentScore && (
                                                        <Badge 
                                                            variant="secondary" 
                                                            className="text-xs cursor-pointer"
                                                            onClick={() => setShowScorePanel(!showScorePanel)}
                                                        >
                                                            점수: {currentScore.overall}/100
                                                            {showScorePanel ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Textarea
                                                ref={textareaRef}
                                                value={inputText}
                                                onChange={(e) => setInputText(e.target.value)}
                                                placeholder={personaData.placeholder}
                                                className="min-h-[120px] resize-none"
                                                onInput={(e) => {
                                                    const target = e.target as HTMLTextAreaElement;
                                                    target.style.height = 'auto';
                                                    target.style.height = Math.max(120, target.scrollHeight) + 'px';
                                                }}
                                            />
                                        </div>

                                        {/* 실시간 점수 패널 */}
                                        <div className="lg:col-span-1">
                                            <AnimatePresence>
                                                {showScorePanel && currentScore && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <PromptScoreDisplay
                                                            score={currentScore}
                                                            compact={true}
                                                            showAnimation={false}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* 액션 버튼들 */}
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            onClick={handleImprovePrompt}
                                            disabled={isImproveLoading || !inputText.trim()}
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        >
                                            {isImproveLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                    개선 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    프롬프트 개선하기
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            onClick={handleTestImprove}
                                            disabled={isTestLoading || !inputText.trim()}
                                            variant="outline"
                                            className="flex items-center gap-2"
                                        >
                                            {isTestLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
                                                    테스트 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-4 h-4" />
                                                    무료 테스트
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            onClick={handleReset}
                                            variant="outline"
                                            className="flex items-center gap-2"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            초기화
                                        </Button>
                                    </div>

                                    {/* 사용량 정보 */}
                                    {usageInfo && (
                                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            남은 사용량: {usageInfo.remainingCount}/{usageInfo.maxUsageCount}
                                            {usageInfo.remainingCount === 0 && (
                                                <span className="text-red-600 ml-2">
                                                    • 다음 초기화: {new Date(usageInfo.resetTime).toLocaleString('ko-KR')}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 개선 결과 표시 */}
                        {improvedText && (
                            <Card className="mb-6">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-green-700">
                                            ✨ 개선된 프롬프트
                                        </h3>
                                        <Button
                                            onClick={() => handleCopyToClipboard(improvedText)}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Copy className="w-4 h-4" />
                                            복사
                                        </Button>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <p className="text-gray-800 whitespace-pre-wrap">{improvedText}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* 점수 비교 표시 */}
                        {originalScore && improvedScore && (
                            <Card className="mb-6">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">📊 점수 비교</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium mb-2 text-gray-600">개선 전</h4>
                                            <PromptScoreDisplay
                                                score={originalScore}
                                                compact={true}
                                                showAnimation={false}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2 text-green-600">개선 후</h4>
                                            <PromptScoreDisplay
                                                score={improvedScore}
                                                compact={true}
                                                showAnimation={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>점수 향상: +{improvedScore.overall - originalScore.overall}점</strong>
                                            {improvedScore.overall > originalScore.overall && " 🎉"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* 프롬프트 비교 (기존 코드 유지) */}
                        {inputText && improvedText && (
                            <PromptComparison
                                originalPrompt={inputText}
                                improvedPrompt={improvedText}
                                improvements={[
                                    "명확한 목표와 맥락 정보 추가",
                                    "구체적인 요구사항과 제약조건 명시",
                                    "체계적인 구조로 재구성",
                                    "실행 가능한 결과물 형태 제시"
                                ]}
                                isVisible={true}
                                originalScore={originalScore}
                                improvedScore={improvedScore}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* AI Model Comparison Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <AIModelSelector
                            selectedModels={selectedModels}
                            onModelSelectionChange={setSelectedModels}
                            taskType={taskType}
                            onTaskTypeChange={setTaskType}
                            onCompare={handleCompareModels}
                            isComparing={isComparing}
                        />
                        
                        {showComparison && comparisonResults && (
                            <div className="mt-12">
                                <ModelComparisonResults
                                    results={comparisonResults.comparison.map((result: any) => ({
                                        ...result,
                                        modelName: result.modelId === 'gemini-2.5-flash' ? 'Gemini 2.5 Flash' :
                                                  result.modelId === 'gemini-2.0-flash' ? 'Gemini 2.0 Flash' :
                                                  result.modelId === 'gpt-4o' ? 'GPT-4o' :
                                                  result.modelId === 'claude-3.5-sonnet' ? 'Claude 3.5 Sonnet' :
                                                  result.modelId === 'llama-3.3-70b' ? 'Llama 3.3 70B' : result.modelId,
                                        provider: result.modelId.includes('gemini') ? 'Google' :
                                                 result.modelId.includes('gpt') ? 'OpenAI' :
                                                 result.modelId.includes('claude') ? 'Anthropic' :
                                                 result.modelId.includes('llama') ? 'Meta' : 'Unknown'
                                    }))}
                                    recommendation={comparisonResults.recommendation}
                                    originalPrompt={inputText}
                                    taskType={taskType}
                                    isVisible={true}
                                    onCopyPrompt={handleCopyToClipboard}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Collaborative Section */}
            <CollaborativeSection />

            {/* Pricing Section */}
            <PricingSection 
                plans={[
                    {
                        name: "무료",
                        description: "개인 사용자를 위한 기본 플랜",
                        price: "₩0",
                        features: [
                            { text: "일 3회 프롬프트 개선", included: true },
                            { text: "기본 페르소나 템플릿", included: true },
                            { text: "실시간 점수 확인", included: true },
                            { text: "우선 지원", included: false },
                            { text: "무제한 사용", included: false }
                        ]
                    },
                    {
                        name: "프로",
                        description: "전문가를 위한 고급 플랜",
                        price: "₩9,900",
                        popular: true,
                        features: [
                            { text: "무제한 프롬프트 개선", included: true },
                            { text: "모든 페르소나 템플릿", included: true },
                            { text: "고급 점수 분석", included: true },
                            { text: "우선 지원", included: true },
                            { text: "히스토리 저장", included: true }
                        ]
                    },
                    {
                        name: "팀",
                        description: "팀과 기업을 위한 플랜",
                        price: "₩29,900",
                        features: [
                            { text: "팀 공유 기능", included: true },
                            { text: "관리자 대시보드", included: true },
                            { text: "API 액세스", included: true },
                            { text: "24/7 지원", included: true },
                            { text: "커스텀 통합", included: true }
                        ]
                    }
                ]}
            />

            {/* Pre-Registration Section */}
            <PreRegistrationSection />
        </div>
    );
} 