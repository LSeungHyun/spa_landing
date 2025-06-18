'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Zap, Target, TrendingUp, Users } from 'lucide-react';
import { DemoScenario } from '@/components/data/demo-scenarios';

interface ScenarioCardProps {
    scenario: DemoScenario;
    isSelected: boolean;
    onSelect: () => void;
    isProcessing: boolean;
    onStartDemo: () => void;
    progress: number;
    result: string;
}

export function ScenarioCard({
    scenario,
    isSelected,
    onSelect,
    isProcessing,
    onStartDemo,
    progress,
    result
}: ScenarioCardProps) {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <Card
            className={`cursor-pointer transition-all duration-300 ${isSelected
                    ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]'
                    : 'hover:shadow-md hover:scale-[1.01]'
                }`}
            onClick={onSelect}
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{scenario.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        {scenario.type}
                    </Badge>
                </div>
                <p className="text-sm text-gray-600">{scenario.description}</p>
            </CardHeader>

            {isSelected && (
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">개요</TabsTrigger>
                            <TabsTrigger value="input">입력</TabsTrigger>
                            <TabsTrigger value="process">처리</TabsTrigger>
                            <TabsTrigger value="result">결과</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Target className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm">목표: {scenario.goal}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">예상 시간: {scenario.expectedTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm">품질 향상: {scenario.qualityImprovement}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm">대상: {scenario.targetAudience}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">주요 기능:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                    {scenario.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>

                        <TabsContent value="input" className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">입력 프롬프트</label>
                                <Textarea
                                    value={scenario.input}
                                    readOnly
                                    className="min-h-[100px] bg-gray-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium">복잡도:</span>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Progress value={scenario.complexity * 20} className="flex-1" />
                                        <span className="text-sm">{scenario.complexity}/5</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">우선순위:</span>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Progress value={scenario.priority * 20} className="flex-1" />
                                        <span className="text-sm">{scenario.priority}/5</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="process" className="space-y-4">
                            {!isProcessing && !result && (
                                <div className="text-center">
                                    <Button onClick={onStartDemo} className="w-full">
                                        <Zap className="w-4 h-4 mr-2" />
                                        AI 처리 시작
                                    </Button>
                                </div>
                            )}

                            {isProcessing && (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="inline-flex items-center space-x-2 text-blue-600">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            <span>AI가 처리 중입니다...</span>
                                        </div>
                                    </div>
                                    <Progress value={progress} className="w-full" />
                                    <p className="text-sm text-center text-gray-600">
                                        {progress < 30 && "텍스트 분석 중..."}
                                        {progress >= 30 && progress < 60 && "구조 최적화 중..."}
                                        {progress >= 60 && progress < 90 && "품질 검증 중..."}
                                        {progress >= 90 && "최종 검토 중..."}
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="result" className="space-y-4">
                            {result ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">처리 완료</span>
                                    </div>
                                    <Textarea
                                        value={result}
                                        readOnly
                                        className="min-h-[200px] bg-green-50 border-green-200"
                                    />
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {scenario.metrics.timeReduction}
                                            </div>
                                            <div className="text-sm text-gray-600">시간 단축</div>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">
                                                {scenario.metrics.qualityScore}
                                            </div>
                                            <div className="text-sm text-gray-600">품질 점수</div>
                                        </div>
                                        <div className="bg-purple-50 p-3 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {scenario.metrics.satisfaction}
                                            </div>
                                            <div className="text-sm text-gray-600">만족도</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>AI 처리를 시작하면 결과가 표시됩니다.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            )}
        </Card>
    );
} 