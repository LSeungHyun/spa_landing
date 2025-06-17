'use client';

import { useState, useEffect } from 'react';

export interface ProcessStep {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    status: 'pending' | 'processing' | 'completed' | 'warning';
    progress: number;
    details: string[];
    improvements: string[];
    timeEstimate: number; // 초 단위
}

export interface ProcessState {
    currentStep: number;
    isRunning: boolean;
    isPaused: boolean;
    overallProgress: number;
    startTime: number | null;
    elapsedTime: number;
}

export const initialSteps: ProcessStep[] = [
    {
        id: 'analysis',
        title: '프롬프트 분석',
        description: '입력된 요청을 AI가 심층 분석하여 의도를 파악합니다.',
        icon: () => null, // 아이콘은 컴포넌트에서 주입
        status: 'pending',
        progress: 0,
        details: [
            '핵심 키워드 추출 중...',
            '문맥 및 의도 분석 중...',
            '요구사항 구조화 중...'
        ],
        improvements: [
            '모호한 표현 명확화',
            '누락된 정보 식별',
            '우선순위 설정'
        ],
        timeEstimate: 3
    },
    {
        id: 'enhancement',
        title: '프롬프트 개선',
        description: 'AI가 프롬프트를 최적화하여 더 정확한 결과를 도출합니다.',
        icon: () => null,
        status: 'pending',
        progress: 0,
        details: [
            '구조적 프레임워크 적용 중...',
            '전문 용어 정제 중...',
            '논리적 흐름 최적화 중...'
        ],
        improvements: [
            '논리적 구조 강화',
            '전문성 향상',
            '명확성 증대'
        ],
        timeEstimate: 4
    },
    {
        id: 'generation',
        title: '콘텐츠 생성',
        description: '최적화된 프롬프트로 고품질 콘텐츠를 생성합니다.',
        icon: () => null,
        status: 'pending',
        progress: 0,
        details: [
            '섹션별 내용 생성 중...',
            '논리적 연결성 확인 중...',
            '품질 검증 중...'
        ],
        improvements: [
            '일관성 있는 톤앤매너',
            '논리적 구성',
            '전문적 표현'
        ],
        timeEstimate: 5
    },
    {
        id: 'refinement',
        title: '결과 정제',
        description: '생성된 콘텐츠를 검토하고 최종 품질을 보장합니다.',
        icon: () => null,
        status: 'pending',
        progress: 0,
        details: [
            '내용 일관성 점검 중...',
            '형식 최적화 중...',
            '최종 검토 중...'
        ],
        improvements: [
            '오류 제거',
            '가독성 향상',
            '완성도 증대'
        ],
        timeEstimate: 2
    }
];

export function useProcessState() {
    const [steps, setSteps] = useState<ProcessStep[]>(initialSteps);
    const [processState, setProcessState] = useState<ProcessState>({
        currentStep: -1,
        isRunning: false,
        isPaused: false,
        overallProgress: 0,
        startTime: null,
        elapsedTime: 0
    });

    // 타이머 및 진행률 관리
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (processState.isRunning && !processState.isPaused) {
            interval = setInterval(() => {
                setProcessState(prev => {
                    const newElapsedTime = prev.startTime ? Date.now() - prev.startTime : 0;
                    return { ...prev, elapsedTime: newElapsedTime };
                });

                setSteps(prevSteps => {
                    const currentStep = processState.currentStep;
                    if (currentStep >= 0 && currentStep < prevSteps.length) {
                        const newSteps = [...prevSteps];
                        const step = newSteps[currentStep];

                        if (step.status === 'processing') {
                            const progressIncrement = 100 / (step.timeEstimate * 10); // 0.1초당 증가량
                            step.progress = Math.min(100, step.progress + progressIncrement);

                            if (step.progress >= 100) {
                                step.status = 'completed';

                                // 다음 단계로 이동
                                if (currentStep + 1 < prevSteps.length) {
                                    setProcessState(prev => ({
                                        ...prev,
                                        currentStep: prev.currentStep + 1
                                    }));
                                    newSteps[currentStep + 1].status = 'processing';
                                } else {
                                    // 모든 단계 완료
                                    setProcessState(prev => ({
                                        ...prev,
                                        isRunning: false,
                                        overallProgress: 100
                                    }));
                                }
                            }
                        }

                        return newSteps;
                    }
                    return prevSteps;
                });
            }, 100);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [processState.isRunning, processState.isPaused, processState.currentStep]);

    const startProcess = () => {
        setProcessState({
            currentStep: 0,
            isRunning: true,
            isPaused: false,
            overallProgress: 0,
            startTime: Date.now(),
            elapsedTime: 0
        });

        const newSteps = initialSteps.map((step, index) => ({
            ...step,
            status: index === 0 ? 'processing' as const : 'pending' as const,
            progress: 0
        }));
        setSteps(newSteps);
    };

    const pauseProcess = () => {
        setProcessState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    };

    const resetProcess = () => {
        setProcessState({
            currentStep: -1,
            isRunning: false,
            isPaused: false,
            overallProgress: 0,
            startTime: null,
            elapsedTime: 0
        });
        setSteps(initialSteps);
    };

    const formatTime = (milliseconds: number) => {
        const seconds = Math.floor(milliseconds / 1000);
        return `${seconds}초`;
    };

    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const overallProgress = (completedSteps / steps.length) * 100;

    return {
        steps,
        processState,
        startProcess,
        pauseProcess,
        resetProcess,
        formatTime,
        overallProgress
    };
} 