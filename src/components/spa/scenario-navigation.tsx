'use client';

import { StaticScenario } from '@/types/spa-landing';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from './ui/button';

interface ScenarioNavigationProps {
    scenarios: StaticScenario[];
    currentIndex: number;
    onScenarioChange: (index: number) => void;
    onPlayDemo?: () => void;
    isPlaying?: boolean;
}

export function ScenarioNavigation({
    scenarios,
    currentIndex,
    onScenarioChange,
    onPlayDemo,
    isPlaying = false
}: ScenarioNavigationProps) {
    const currentScenario = scenarios[currentIndex];

    const handlePrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : scenarios.length - 1;
        onScenarioChange(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentIndex < scenarios.length - 1 ? currentIndex + 1 : 0;
        onScenarioChange(newIndex);
    };

    return (
        <div className="bg-brand-surface-primary/80 backdrop-blur-xl rounded-xl p-6 border border-brand-surface-secondary/20">
            {/* 시나리오 정보 */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-brand-text-primary">
                        시나리오 {currentIndex + 1}
                    </h3>
                    <div className="text-sm text-brand-text-secondary">
                        {currentIndex + 1} / {scenarios.length}
                    </div>
                </div>

                <p className="text-brand-text-secondary leading-relaxed mb-4">
                    AI가 어떻게 프롬프트를 개선하는지 확인해보세요
                </p>

                <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-brand-accent-blue/20 text-brand-accent-blue rounded-full">
                        개선 예시
                    </span>
                    <span className="text-brand-text-secondary">
                        실시간 처리
                    </span>
                </div>
            </div>

            {/* 네비게이션 컨트롤 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                        className="p-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        className="p-2"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    <span className="text-sm text-brand-text-secondary ml-2">
                        시나리오 탐색
                    </span>
                </div>

                {onPlayDemo && (
                    <Button
                        variant="primary"
                        onClick={onPlayDemo}
                        disabled={isPlaying}
                        className="flex items-center gap-2"
                    >
                        <Play className="w-4 h-4" />
                        {isPlaying ? '데모 실행 중...' : '데모 실행'}
                    </Button>
                )}
            </div>

            {/* 시나리오 인디케이터 */}
            <div className="flex items-center justify-center gap-2 mt-6">
                {scenarios.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => onScenarioChange(index)}
                        className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === currentIndex
                                ? 'bg-brand-accent-blue w-6'
                                : 'bg-brand-surface-secondary hover:bg-brand-accent-blue/50'
                            }
            `}
                    />
                ))}
            </div>
        </div>
    );
} 