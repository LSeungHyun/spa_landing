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
                    <CardTitle className="text-lg font-semibold">{scenario.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        시나리오
                    </Badge>
                </div>
                <p className="text-sm text-gray-600">AI가 입력을 개선한 결과를 확인해보세요</p>
            </CardHeader>

            {isSelected && (
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="input">입력</TabsTrigger>
                            <TabsTrigger value="process">처리</TabsTrigger>
                            <TabsTrigger value="result">결과</TabsTrigger>
                        </TabsList>

                        <TabsContent value="input" className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">입력 프롬프트</label>
                                <Textarea
                                    value={scenario.input}
                                    readOnly
                                    className="min-h-[100px] bg-gray-50"
                                />
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
                                    <div>
                                        <label className="block text-sm font-medium mb-2">개선된 결과</label>
                                        <Textarea
                                            value={scenario.improved}
                                            readOnly
                                            className="min-h-[200px] bg-green-50 border-green-200"
                                        />
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