'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Brain, Cog, CheckCircle } from 'lucide-react';

interface ProcessingStep {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    duration: number; // in seconds
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
    React.useEffect(() => {
        if (isProcessing && currentStep >= processingSteps.length - 1) {
            const timer = setTimeout(() => {
                onComplete?.();
            }, processingSteps[currentStep]?.duration * 1000 || 1000);

            return () => clearTimeout(timer);
        }
    }, [isProcessing, currentStep, onComplete]);

    if (!isProcessing) {
        return null;
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="space-y-4">
                {processingSteps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                            opacity: index <= currentStep ? 1 : 0.3,
                            x: 0,
                            scale: index === currentStep ? 1.02 : 1
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`
              flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-300
              ${index === currentStep
                                ? 'border-blue-500 bg-blue-50'
                                : index < currentStep
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-gray-50'
                            }
            `}
                    >
                        <div className={`
              flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
              ${index === currentStep
                                ? 'bg-blue-500 text-white'
                                : index < currentStep
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-300 text-gray-600'
                            }
            `}>
                            {index < currentStep ? (
                                <CheckCircle className="w-6 h-6" />
                            ) : index === currentStep ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    {step.icon}
                                </motion.div>
                            ) : (
                                step.icon
                            )}
                        </div>

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