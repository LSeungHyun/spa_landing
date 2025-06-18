'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lightbulb, Brain, Cog } from 'lucide-react';

interface ProcessingStep {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    duration: number; // seconds
}

interface ProcessingStepsProps {
    isProcessing: boolean;
    currentStep: number;
    onComplete?: () => void;
}

const processingSteps: ProcessingStep[] = [
    {
        id: 'analyzing',
        title: '아이디어 분석 중...',
        description: '입력하신 내용을 이해하고 핵심 요소를 파악하고 있습니다',
        icon: <Lightbulb className="w-6 h-6" />,
        duration: 2
    },
    {
        id: 'applying',
        title: '전문 지식 적용 중...',
        description: '해당 분야의 전문 지식과 베스트 프랙티스를 적용하고 있습니다',
        icon: <Brain className="w-6 h-6" />,
        duration: 3
    },
    {
        id: 'generating',
        title: '결과 생성 중...',
        description: '전문가 수준의 결과물을 구조화하고 정리하고 있습니다',
        icon: <Cog className="w-6 h-6" />,
        duration: 2
    },
    {
        id: 'complete',
        title: '완료!',
        description: '전문가 수준의 결과가 준비되었습니다',
        icon: <CheckCircle className="w-6 h-6" />,
        duration: 1
    }
];

export default function ProcessingSteps({ isProcessing, currentStep, onComplete }: ProcessingStepsProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isProcessing) {
            setProgress(0);
            return;
        }

        if (currentStep >= processingSteps.length) {
            onComplete?.();
            return;
        }

        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev + (100 / (processingSteps[currentStep]?.duration || 1));
                return Math.min(newProgress, 100);
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isProcessing, currentStep, onComplete]);

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <div className="space-y-3">
                {processingSteps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`
                            relative flex items-center gap-3 p-3 rounded-lg border
                            ${index === currentStep
                                ? 'bg-blue-50 border-blue-200'
                                : index < currentStep
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-gray-50 border-gray-200'
                            }
                        `}
                    >
                        {/* 아이콘 */}
                        <div className={`
                            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                            ${index === currentStep
                                ? 'bg-blue-100 text-blue-600'
                                : index < currentStep
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400'
                            }
                        `}>
                            {step.icon}
                        </div>

                        {/* 콘텐츠 */}
                        <div className="flex-1 min-w-0">
                            <div className={`
                                font-semibold text-sm transition-colors duration-300
                                ${index === currentStep
                                    ? 'text-blue-900'
                                    : index < currentStep
                                        ? 'text-green-900'
                                        : 'text-gray-600'
                                }
                            `}>
                                {step.title}
                            </div>
                            <div className={`
                                text-xs mt-1 transition-colors duration-300
                                ${index === currentStep
                                    ? 'text-blue-700'
                                    : index < currentStep
                                        ? 'text-green-700'
                                        : 'text-gray-500'
                                }
                            `}>
                                {step.description}
                            </div>
                        </div>

                        {index === currentStep && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: step.duration, ease: "linear" }}
                                className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full"
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>진행 상황</span>
                    <span>{Math.round(((currentStep + 1) / processingSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
} 