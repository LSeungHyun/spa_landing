'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ProcessControlPanelProps {
    selectedSample: string;
    onSampleChange: (value: string) => void;
    isRunning: boolean;
    onStartPause: () => void;
    onReset: () => void;
    totalProgress: number;
    formatTime: (seconds: number) => string;
    currentStepElapsed: number;
    currentStepTotal: number;
}

const samplePrompts = [
    {
        id: 'prompt1',
        title: '논문 초록 생성',
        originalPrompt: '인공지능과 머신러닝 기술의 발전에 대한 논문 초록을 작성해주세요.',
    },
    {
        id: 'prompt2',
        title: '연구 방법론 설명',
        originalPrompt: '정성적 연구 방법론의 특징과 장단점을 설명해주세요.',
    },
    {
        id: 'prompt3',
        title: '문헌 리뷰 요약',
        originalPrompt: '블록체인 기술 관련 최근 연구 동향을 요약해주세요.',
    },
];

export default function ProcessControlPanel({
    selectedSample,
    onSampleChange,
    isRunning,
    onStartPause,
    onReset,
    totalProgress,
    formatTime,
    currentStepElapsed,
    currentStepTotal,
}: ProcessControlPanelProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">프로세스 제어</h3>

            {/* 샘플 프롬프트 선택 */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">샘플 프롬프트 선택</label>
                <Select value={selectedSample} onValueChange={onSampleChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="프롬프트를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                        {samplePrompts.map((prompt) => (
                            <SelectItem key={prompt.id} value={prompt.id}>
                                {prompt.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedSample && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                            {samplePrompts.find(p => p.id === selectedSample)?.originalPrompt}
                        </p>
                    </div>
                )}
            </div>

            {/* 컨트롤 버튼들 */}
            <div className="flex gap-3 mb-6">
                <Button
                    onClick={onStartPause}
                    disabled={!selectedSample}
                    className="flex items-center gap-2"
                >
                    {isRunning ? (
                        <>
                            <Pause className="w-4 h-4" />
                            일시정지
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" />
                            시작
                        </>
                    )}
                </Button>

                <Button
                    onClick={onReset}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    리셋
                </Button>
            </div>

            {/* 전체 진행률 */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">전체 진행률</span>
                    <span className="text-sm text-gray-600">{Math.round(totalProgress)}%</span>
                </div>
                <Progress value={totalProgress} className="w-full" />

                {/* 현재 단계 시간 */}
                <div className="flex justify-between text-xs text-gray-500">
                    <span>현재 단계: {formatTime(currentStepElapsed)} / {formatTime(currentStepTotal)}</span>
                    <span>전체 예상 시간: {formatTime(180)}</span>
                </div>
            </div>
        </div>
    );
} 