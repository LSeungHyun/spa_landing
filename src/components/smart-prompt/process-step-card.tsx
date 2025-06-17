'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, Circle, AlertCircle, Play } from 'lucide-react';
import { ProcessStep } from '@/hooks/use-process-state';

interface ProcessStepCardProps {
    step: ProcessStep;
    isActive: boolean;
    isPending: boolean;
}

export default function ProcessStepCard({ step, isActive, isPending }: ProcessStepCardProps) {
    const getStatusIcon = () => {
        if (step.status === 'completed') {
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        }
        if (step.status === 'running') {
            return <Play className="w-5 h-5 text-blue-500 animate-pulse" />;
        }
        if (step.status === 'error') {
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        }
        if (isPending) {
            return <Clock className="w-5 h-5 text-yellow-500" />;
        }
        return <Circle className="w-5 h-5 text-gray-300" />;
    };

    const getStatusColor = () => {
        if (step.status === 'completed') return 'border-green-200 bg-green-50';
        if (step.status === 'running') return 'border-blue-200 bg-blue-50';
        if (step.status === 'error') return 'border-red-200 bg-red-50';
        if (isPending) return 'border-yellow-200 bg-yellow-50';
        return 'border-gray-200 bg-gray-50';
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className={`p-4 transition-all duration-300 ${getStatusColor()} ${isActive ? 'ring-2 ring-blue-300' : ''}`}>
            <div className="flex items-start gap-3">
                {/* 상태 아이콘 */}
                <div className="flex-shrink-0 mt-1">
                    {getStatusIcon()}
                </div>

                {/* 스텝 내용 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 truncate">{step.title}</h4>
                        <span className="text-xs text-gray-500 ml-2">
                            {formatTime(step.elapsed)} / {formatTime(step.duration)}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                    {/* 진행률 바 */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">진행률</span>
                            <span className="font-medium">{Math.round(step.progress)}%</span>
                        </div>
                        <Progress value={step.progress} className="h-2" />
                    </div>

                    {/* 상세 정보 */}
                    {step.details && step.details.length > 0 && (
                        <div className="mt-3 space-y-1">
                            {step.details.map((detail, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                    <div className={`w-1.5 h-1.5 rounded-full ${detail.completed ? 'bg-green-400' : 'bg-gray-300'
                                        }`} />
                                    <span className={detail.completed ? 'text-green-700' : 'text-gray-500'}>
                                        {detail.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 에러 메시지 */}
                    {step.status === 'error' && step.error && (
                        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                            {step.error}
                        </div>
                    )}

                    {/* 결과 미리보기 */}
                    {step.status === 'completed' && step.result && (
                        <div className="mt-3 p-2 bg-green-100 border border-green-200 rounded text-xs">
                            <div className="font-medium text-green-800 mb-1">결과:</div>
                            <div className="text-green-700 line-clamp-2">{step.result}</div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
} 