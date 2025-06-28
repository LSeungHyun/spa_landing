'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
    Chrome, 
    Minimize2, 
    Maximize2, 
    X, 
    ArrowLeft, 
    ArrowRight, 
    RotateCcw, 
    Home,
    Bookmark,
    MoreHorizontal,
    Shield,
    Wifi,
    Volume2,
    Battery,
    Search,
    Star,
    Download,
    Settings,
    HelpCircle,
    Sparkles,
    Zap,
    Target,
    Play,
    Pause,
    SkipForward,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatGPTStyleDemo } from '@/components/demo/chatgpt-style-demo';

interface DemoStep {
    id: string;
    title: string;
    description: string;
    duration: number;
    isCompleted: boolean;
    isActive: boolean;
}

interface EnhancedDemoInterfaceProps {
    className?: string;
    showBrowserFrame?: boolean;
    showExtensionOverlay?: boolean;
    autoPlay?: boolean;
}

export function EnhancedDemoInterface({ 
    className,
    showBrowserFrame = true,
    showExtensionOverlay = true,
    autoPlay = false
}: EnhancedDemoInterfaceProps) {
    const [isExtensionActive, setIsExtensionActive] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [progress, setProgress] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const demoRef = useRef<HTMLDivElement>(null);

    const demoSteps: DemoStep[] = [
        {
            id: 'visit-chatgpt',
            title: 'ChatGPT 사이트 방문',
            description: 'chat.openai.com에 접속합니다',
            duration: 2000,
            isCompleted: false,
            isActive: true
        },
        {
            id: 'activate-extension',
            title: '확장 프로그램 활성화',
            description: 'Smart Prompt Assistant 버튼을 클릭합니다',
            duration: 1500,
            isCompleted: false,
            isActive: false
        },
        {
            id: 'input-prompt',
            title: '프롬프트 입력',
            description: '원하는 작업을 간단히 입력합니다',
            duration: 3000,
            isCompleted: false,
            isActive: false
        },
        {
            id: 'ai-enhancement',
            title: 'AI 자동 개선',
            description: 'Smart Prompt가 자동으로 프롬프트를 개선합니다',
            duration: 2500,
            isCompleted: false,
            isActive: false
        },
        {
            id: 'get-result',
            title: '향상된 결과 확인',
            description: '전문적으로 개선된 결과를 확인합니다',
            duration: 2000,
            isCompleted: false,
            isActive: false
        }
    ];

    const [steps, setSteps] = useState(demoSteps);

    useEffect(() => {
        if (isPlaying && currentStep < steps.length) {
            const timer = setTimeout(() => {
                setSteps(prev => prev.map((step, index) => ({
                    ...step,
                    isCompleted: index < currentStep,
                    isActive: index === currentStep
                })));

                if (currentStep === 1) {
                    setIsExtensionActive(true);
                    setShowTooltip(true);
                    setTimeout(() => setShowTooltip(false), 3000);
                }

                const progressTimer = setInterval(() => {
                    setProgress(prev => {
                        const newProgress = prev + (100 / (steps[currentStep].duration / 100));
                        if (newProgress >= 100) {
                            clearInterval(progressTimer);
                            setCurrentStep(prev => prev + 1);
                            setProgress(0);
                            return 0;
                        }
                        return newProgress;
                    });
                }, 100);

                return () => clearInterval(progressTimer);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isPlaying, currentStep, steps]);

    const resetDemo = () => {
        setCurrentStep(0);
        setProgress(0);
        setIsPlaying(false);
        setIsExtensionActive(false);
        setShowTooltip(false);
        setSteps(demoSteps.map(step => ({ ...step, isCompleted: false, isActive: false })));
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const skipToStep = (stepIndex: number) => {
        setCurrentStep(stepIndex);
        setProgress(0);
        setSteps(prev => prev.map((step, index) => ({
            ...step,
            isCompleted: index < stepIndex,
            isActive: index === stepIndex
        })));
    };

    const BrowserFrame = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-gray-100 rounded-t-lg border border-gray-300 shadow-2xl">
            {/* Browser Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-200 rounded-t-lg border-b border-gray-300">
                {/* Window Controls */}
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 cursor-pointer"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 cursor-pointer"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 cursor-pointer"></div>
                    </div>
                </div>

                {/* Browser Controls */}
                <div className="flex items-center space-x-2 flex-1 max-w-2xl mx-4">
                    <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                    
                    {/* Address Bar */}
                    <div className="flex-1 flex items-center bg-white rounded-full px-4 py-1.5 border border-gray-300 shadow-sm">
                        <Shield className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm text-gray-700 flex-1">https://chat.openai.com</span>
                        <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer" />
                    </div>
                </div>

                {/* Extension Area */}
                <div className="flex items-center space-x-2">
                    {/* Other Extensions */}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
                        <Bookmark className="w-4 h-4" />
                    </Button>
                    
                    {/* Smart Prompt Assistant Extension */}
                    <TooltipProvider>
                        <Tooltip open={showTooltip}>
                            <TooltipTrigger asChild>
                                <motion.div
                                    animate={isExtensionActive ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Button
                                        variant={isExtensionActive ? "default" : "ghost"}
                                        size="sm"
                                        className={cn(
                                            "h-8 w-8 p-0 relative",
                                            isExtensionActive 
                                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                                                : "text-gray-600 hover:text-purple-600"
                                        )}
                                        onClick={() => setIsExtensionActive(!isExtensionActive)}
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {isExtensionActive && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                            />
                                        )}
                                    </Button>
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-purple-600 text-white">
                                <p className="font-medium">Smart Prompt Assistant</p>
                                <p className="text-xs">ChatGPT 응답을 자동으로 개선합니다</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Browser Content */}
            <div className="relative">
                {children}
                
                {/* Extension Overlay */}
                {showExtensionOverlay && isExtensionActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-4 right-4 z-10"
                    >
                        <Card className="w-80 shadow-xl border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-purple-900">Smart Prompt Assistant</h4>
                                        <p className="text-xs text-purple-600">활성화됨</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 text-sm text-purple-800">
                                    <div className="flex items-center space-x-2">
                                        <Zap className="w-4 h-4 text-purple-600" />
                                        <span>자동 프롬프트 개선 대기 중</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Target className="w-4 h-4 text-purple-600" />
                                        <span>전문적인 결과물 생성 준비</span>
                                    </div>
                                </div>

                                <div className="mt-3 p-2 bg-white rounded-lg border border-purple-200">
                                    <p className="text-xs text-purple-700">
                                        💡 <strong>팁:</strong> 간단한 요청을 입력하면 자동으로 전문적인 프롬프트로 개선됩니다!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );

    const DemoControls = () => (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">데모 진행 상황</h3>
                        <Badge variant="outline" className="text-xs">
                            {currentStep + 1} / {steps.length}
                        </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={togglePlay}
                            disabled={currentStep >= steps.length}
                        >
                            {isPlaying ? (
                                <Pause className="w-4 h-4" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                        </Button>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => skipToStep(Math.min(currentStep + 1, steps.length - 1))}
                            disabled={currentStep >= steps.length - 1}
                        >
                            <SkipForward className="w-4 h-4" />
                        </Button>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetDemo}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHelp(!showHelp)}
                        >
                            <HelpCircle className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Step Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    {steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => skipToStep(index)}
                            className={cn(
                                "p-3 rounded-lg border-2 transition-all duration-200 text-left",
                                step.isCompleted 
                                    ? "border-green-500 bg-green-50" 
                                    : step.isActive
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <div className="flex items-center space-x-2 mb-1">
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                                    step.isCompleted
                                        ? "bg-green-500 text-white"
                                        : step.isActive
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-600"
                                )}>
                                    {step.isCompleted ? '✓' : index + 1}
                                </div>
                                <span className="text-sm font-medium text-gray-900 truncate">
                                    {step.title}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{step.description}</p>
                        </button>
                    ))}
                </div>

                {/* Help Panel */}
                <AnimatePresence>
                    {showHelp && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                            <h4 className="font-semibold text-blue-900 mb-2">💡 데모 사용법</h4>
                            <div className="space-y-2 text-sm text-blue-800">
                                <p>• <strong>재생/일시정지</strong>: 자동 진행을 제어합니다</p>
                                <p>• <strong>단계 건너뛰기</strong>: 원하는 단계로 바로 이동합니다</p>
                                <p>• <strong>초기화</strong>: 데모를 처음부터 다시 시작합니다</p>
                                <p>• <strong>확장 프로그램 버튼</strong>: 브라우저 상단 우측의 ✨ 아이콘을 클릭해보세요</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );

    return (
        <div className={cn("w-full", className)} ref={demoRef}>
            <DemoControls />
            
            {showBrowserFrame ? (
                <BrowserFrame>
                    <ChatGPTStyleDemo />
                </BrowserFrame>
            ) : (
                <ChatGPTStyleDemo />
            )}

            {/* Status Bar */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500 px-2">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <Wifi className="w-3 h-3" />
                        <span>연결됨</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Shield className="w-3 h-3 text-green-600" />
                        <span>보안 연결</span>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <Volume2 className="w-3 h-3" />
                        <span>음소거</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Battery className="w-3 h-3" />
                        <span>85%</span>
                    </div>
                    <span>{new Date().toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}</span>
                </div>
            </div>
        </div>
    );
} 