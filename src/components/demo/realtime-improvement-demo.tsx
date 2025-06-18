'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Brain,
    Zap,
    CheckCircle,
    Clock,
    TrendingUp,
    Target,
    Search,
    Lightbulb,
    FileText,
    Sparkles,
    ArrowRight,
    RefreshCw
} from 'lucide-react';

interface ImprovementStep {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    status: 'waiting' | 'processing' | 'completed';
    duration: number;
    insights: string[];
}

interface ProcessPhase {
    id: string;
    title: string;
    description: string;
    steps: ImprovementStep[];
    color: string;
}

const RealtimeImprovementDemo: React.FC = () => {
    const [currentPhase, setCurrentPhase] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPhases, setCompletedPhases] = useState<number[]>([]);

    const phases: ProcessPhase[] = [
        {
            id: 'analysis',
            title: '입력 분석',
            description: '사용자 요구사항을 깊이 있게 분석합니다',
            color: 'bg-blue-500',
            steps: [
                {
                    id: 'content-analysis',
                    title: '내용 분석',
                    description: '핵심 키워드와 목적을 파악합니다',
                    icon: Search,
                    status: 'waiting',
                    duration: 1.5,
                    insights: ['핵심 키워드 7개 추출', '문서 목적: 연구 제안서', '대상 독자: 학술 심사위원']
                },
                {
                    id: 'context-understanding',
                    title: '맥락 이해',
                    description: '학술적 맥락과 요구사항을 이해합니다',
                    icon: Brain,
                    status: 'waiting',
                    duration: 2,
                    insights: ['연구 분야: 인공지능/머신러닝', '학술 수준: 대학원 이상', '예상 분량: 15-20페이지']
                },
                {
                    id: 'structure-planning',
                    title: '구조 설계',
                    description: '최적의 문서 구조를 설계합니다',
                    icon: Target,
                    status: 'waiting',
                    duration: 1.8,
                    insights: ['6개 주요 섹션 구성', '논리적 흐름 설계', '인용 구조 최적화']
                }
            ]
        },
        {
            id: 'generation',
            title: '콘텐츠 생성',
            description: '고품질 콘텐츠를 자동으로 생성합니다',
            color: 'bg-green-500',
            steps: [
                {
                    id: 'intro-generation',
                    title: '서론 생성',
                    description: '매력적이고 논리적인 서론을 작성합니다',
                    icon: FileText,
                    status: 'waiting',
                    duration: 2.2,
                    insights: ['연구 배경 3개 문단', '문제 정의 명확화', '연구 목적 구체화']
                },
                {
                    id: 'main-content',
                    title: '본문 작성',
                    description: '체계적이고 전문적인 본문을 구성합니다',
                    icon: Lightbulb,
                    status: 'waiting',
                    duration: 3.5,
                    insights: ['이론적 배경 상세 설명', '연구 방법론 제시', '예상 결과 및 기여도']
                },
                {
                    id: 'refinement',
                    title: '내용 정제',
                    description: '문체와 논리성을 최적화합니다',
                    icon: Sparkles,
                    status: 'waiting',
                    duration: 1.8,
                    insights: ['학술적 문체 적용', '논리적 연결성 강화', '전문 용어 정확성 검증']
                }
            ]
        },
        {
            id: 'optimization',
            title: '최적화',
            description: '최종 품질을 극대화합니다',
            color: 'bg-purple-500',
            steps: [
                {
                    id: 'quality-check',
                    title: '품질 검증',
                    description: '내용의 정확성과 완성도를 검증합니다',
                    icon: CheckCircle,
                    status: 'waiting',
                    duration: 1.5,
                    insights: ['문법 정확도 99.8%', '논리성 점수 95/100', '가독성 최적화 완료']
                },
                {
                    id: 'enhancement',
                    title: '향상 적용',
                    description: '추가적인 개선사항을 적용합니다',
                    icon: TrendingUp,
                    status: 'waiting',
                    duration: 1.2,
                    insights: ['인용 형식 표준화', '표현력 20% 향상', '전문성 지수 증가']
                }
            ]
        }
    ];

    const resetDemo = () => {
        setCurrentPhase(0);
        setCurrentStep(0);
        setIsRunning(false);
        setCompletedPhases([]);

        phases.forEach(phase => {
            phase.steps.forEach(step => {
                step.status = 'waiting';
            });
        });
    };

    const runDemo = () => {
        if (isRunning) return;

        resetDemo();
        setIsRunning(true);

        let phaseIndex = 0;
        let stepIndex = 0;

        const processStep = () => {
            if (phaseIndex >= phases.length) {
                setIsRunning(false);
                return;
            }

            const currentPhaseData = phases[phaseIndex];
            const currentStepData = currentPhaseData.steps[stepIndex];

            setCurrentPhase(phaseIndex);
            setCurrentStep(stepIndex);

            // 단계 시작
            currentStepData.status = 'processing';

            setTimeout(() => {
                // 단계 완료
                currentStepData.status = 'completed';

                // 다음 단계로
                stepIndex++;

                if (stepIndex >= currentPhaseData.steps.length) {
                    // 현재 단계 완료, 다음 단계로
                    setCompletedPhases(prev => [...prev, phaseIndex]);
                    phaseIndex++;
                    stepIndex = 0;
                }

                setTimeout(processStep, 500);
            }, currentStepData.duration * 1000);
        };

        processStep();
    };

    const getStepStatusColor = (status: string) => {
        switch (status) {
            case 'waiting': return 'bg-gray-600';
            case 'processing': return 'bg-yellow-500';
            case 'completed': return 'bg-green-500';
            default: return 'bg-gray-600';
        }
    };

    const getStepStatusIcon = (status: string) => {
        switch (status) {
            case 'waiting': return Clock;
            case 'processing': return RefreshCw;
            case 'completed': return CheckCircle;
            default: return Clock;
        }
    };

    return (
        <div className="w-full bg-gray-900 text-white py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-purple-600 hover:bg-purple-700">
                        실시간 프로세스
                    </Badge>
                    <h2 className="text-4xl font-bold mb-4">
                        AI가 <span className="text-purple-400">실시간으로 개선</span>하는 과정
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        입력한 내용이 어떻게 전문적인 문서로 변화하는지 실시간으로 확인해보세요
                    </p>
                    <Button
                        onClick={runDemo}
                        disabled={isRunning}
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isRunning ? (
                            <>
                                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                처리 중...
                            </>
                        ) : (
                            <>
                                <Zap className="mr-2 h-5 w-5" />
                                실시간 데모 시작
                            </>
                        )}
                    </Button>
                </div>

                {/* 진행 상황 개요 */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        {phases.map((phase, index) => (
                            <div key={phase.id} className="flex items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${completedPhases.includes(index) ? 'bg-green-500' :
                                            currentPhase === index ? phase.color : 'bg-gray-600'
                                        }`}
                                >
                                    {completedPhases.includes(index) ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                {index < phases.length - 1 && (
                                    <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                        {phases.map((phase) => (
                            <div key={phase.id} className="text-center">
                                <div className="font-semibold">{phase.title}</div>
                                <div>{phase.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 상세 단계 진행 */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {phases.map((phase, phaseIndex) => (
                        <Card key={phase.id} className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full ${completedPhases.includes(phaseIndex) ? 'bg-green-500' :
                                            currentPhase === phaseIndex ? phase.color : 'bg-gray-600'
                                        }`} />
                                    <span className="text-white">{phase.title}</span>
                                    {completedPhases.includes(phaseIndex) && (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {phase.steps.map((step, stepIndex) => {
                                    const StepIcon = step.icon;
                                    const StatusIcon = getStepStatusIcon(step.status);
                                    const isCurrentStep = currentPhase === phaseIndex && currentStep === stepIndex;

                                    return (
                                        <div
                                            key={step.id}
                                            className={`p-4 rounded-lg border transition-all duration-300 ${isCurrentStep ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600 bg-gray-700/50'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepStatusColor(step.status)
                                                    }`}>
                                                    {step.status === 'processing' ? (
                                                        <StatusIcon className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <StatusIcon className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <StepIcon className="w-4 h-4 text-purple-400" />
                                                        <h4 className="font-semibold text-white">{step.title}</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-300 mb-2">{step.description}</p>

                                                    {step.status === 'completed' && (
                                                        <div className="space-y-1">
                                                            {step.insights.map((insight, index) => (
                                                                <div key={index} className="text-xs text-green-400 flex items-center space-x-1">
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    <span>{insight}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {step.status === 'processing' && (
                                                        <div className="text-xs text-yellow-400 animate-pulse">
                                                            처리 중... (예상 {step.duration}초)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* 실시간 통계 */}
                {isRunning && (
                    <Card className="mt-12 bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                <span>실시간 개선 지표</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-400">98.5%</div>
                                    <div className="text-sm text-gray-400">정확도</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">15.2초</div>
                                    <div className="text-sm text-gray-400">평균 처리 시간</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">92점</div>
                                    <div className="text-sm text-gray-400">품질 점수</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-400">3.2배</div>
                                    <div className="text-sm text-gray-400">효율성 증가</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default RealtimeImprovementDemo; 