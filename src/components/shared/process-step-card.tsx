'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, Circle, AlertCircle, Play, AlertTriangle } from 'lucide-react';
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
        if (step.status === 'processing') {
            return <Play className="w-5 h-5 text-blue-500 animate-pulse" />;
        }
        if (step.status === 'warning') {
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        }
        return <Clock className="w-5 h-5 text-gray-400" />;
    };

    const getCardStyle = () => {
        if (step.status === 'completed') return 'border-green-200 bg-green-50';
        if (step.status === 'processing') return 'border-blue-200 bg-blue-50';
        if (step.status === 'warning') return 'border-yellow-200 bg-yellow-50';
        return 'border-gray-200 bg-gray-50';
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className={`transition-all duration-300 ${getCardStyle()}`}>
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                        {getStatusIcon()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {step.title}
                            </h3>
                            {step.status === 'processing' && (
                                <div className="text-sm text-blue-600 font-medium">
                                    {Math.round(step.progress)}%
                                </div>
                            )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4">
                            {step.description}
                        </p>

                        {/* Progress Bar */}
                        {step.status === 'processing' && (
                            <div className="mb-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${step.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        <div className="space-y-2">
                            {step.details.map((detail, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                                    <span>{detail}</span>
                                </div>
                            ))}
                        </div>

                        {/* Improvements */}
                        {step.improvements.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">주요 개선사항</h4>
                                <div className="space-y-1">
                                    {step.improvements.map((improvement, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-sm text-green-600">
                                            <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                            <span>{improvement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Warning Message */}
                        {step.status === 'warning' && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-yellow-800">
                                        이 단계에서 주의가 필요한 사항이 있습니다.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 