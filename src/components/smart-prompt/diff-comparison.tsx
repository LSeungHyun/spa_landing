'use client';

import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Copy,
    CheckCircle,
    Sparkles,
    TrendingUp,
    Zap,
    Target,
    AlertCircle
} from "lucide-react";
import { useState, useMemo } from "react";

interface DiffComparisonProps {
    originalText: string;
    improvedText: string;
}

interface DiffResult {
    type: 'added' | 'removed' | 'unchanged';
    text: string;
}

export function DiffComparison({ originalText, improvedText }: DiffComparisonProps) {
    const [copiedState, setCopiedState] = useState<'original' | 'improved' | null>(null);

    // 간단한 diff 알고리즘 (단어 단위)
    const diffResults = useMemo(() => {
        const originalWords = originalText.split(/(\s+)/);
        const improvedWords = improvedText.split(/(\s+)/);

        const results: DiffResult[] = [];
        let i = 0, j = 0;

        while (i < originalWords.length || j < improvedWords.length) {
            if (i >= originalWords.length) {
                // 개선된 텍스트에만 있는 단어들
                results.push({ type: 'added', text: improvedWords[j] });
                j++;
            } else if (j >= improvedWords.length) {
                // 원본에만 있는 단어들
                results.push({ type: 'removed', text: originalWords[i] });
                i++;
            } else if (originalWords[i] === improvedWords[j]) {
                // 동일한 단어
                results.push({ type: 'unchanged', text: originalWords[i] });
                i++;
                j++;
            } else {
                // 다른 단어 - 휴리스틱하게 처리
                const nextOriginalIndex = improvedWords.indexOf(originalWords[i], j);
                const nextImprovedIndex = originalWords.indexOf(improvedWords[j], i);

                if (nextOriginalIndex !== -1 && (nextImprovedIndex === -1 || nextOriginalIndex < nextImprovedIndex)) {
                    // 개선된 텍스트에 추가된 부분
                    results.push({ type: 'added', text: improvedWords[j] });
                    j++;
                } else if (nextImprovedIndex !== -1) {
                    // 원본에서 제거된 부분
                    results.push({ type: 'removed', text: originalWords[i] });
                    i++;
                } else {
                    // 교체된 부분
                    results.push({ type: 'removed', text: originalWords[i] });
                    results.push({ type: 'added', text: improvedWords[j] });
                    i++;
                    j++;
                }
            }
        }

        return results;
    }, [originalText, improvedText]);

    const copyToClipboard = async (text: string, type: 'original' | 'improved') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedState(type);
            setTimeout(() => setCopiedState(null), 2000);
        } catch (error) {
            console.error('복사 실패:', error);
        }
    };

    const improvementStats = useMemo(() => {
        const originalWordCount = originalText.split(/\s+/).filter(word => word.trim()).length;
        const improvedWordCount = improvedText.split(/\s+/).filter(word => word.trim()).length;
        const addedWords = diffResults.filter(r => r.type === 'added').length;
        const removedWords = diffResults.filter(r => r.type === 'removed').length;

        return {
            wordCountChange: improvedWordCount - originalWordCount,
            addedWords,
            removedWords,
            improvementPercentage: Math.round(((addedWords + removedWords) / originalWordCount) * 100)
        };
    }, [originalText, improvedText, diffResults]);

    const improvements = [
        {
            type: "구체성",
            before: "모호한 표현",
            after: "명확한 지시사항",
            icon: CheckCircle,
            color: "text-green-600"
        },
        {
            type: "구조화",
            before: "단일 문장",
            after: "단계별 가이드",
            icon: TrendingUp,
            color: "text-blue-600"
        },
        {
            type: "맥락 제공",
            before: "최소한의 정보",
            after: "풍부한 배경 정보",
            icon: AlertCircle,
            color: "text-purple-600"
        }
    ];

    const metrics = [
        { label: "명확성", before: 3, after: 9 },
        { label: "완성도", before: 4, after: 8 },
        { label: "실행가능성", before: 5, after: 9 }
    ];

    return (
        <Container className="py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <Badge variant="outline" className="mb-4 text-sm font-medium">
                    <Sparkles className="w-4 h-4 mr-2" />
                    실시간 비교 분석
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Before vs After
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    AI가 어떻게 당신의 텍스트를 개선했는지 실시간으로 확인해보세요.
                    변경사항이 시각적으로 하이라이트됩니다.
                </p>
            </motion.div>

            {/* 개선 통계 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <Card className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                        {improvementStats.improvementPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">개선도</div>
                </Card>
                <Card className="p-4 text-center">
                    <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                        +{improvementStats.addedWords}
                    </div>
                    <div className="text-sm text-gray-600">추가된 요소</div>
                </Card>
                <Card className="p-4 text-center">
                    <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                        {Math.abs(improvementStats.wordCountChange)}
                    </div>
                    <div className="text-sm text-gray-600">단어 변화</div>
                </Card>
                <Card className="p-4 text-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                        {improvementStats.removedWords}
                    </div>
                    <div className="text-sm text-gray-600">최적화</div>
                </Card>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* 원본 텍스트 */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="h-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary">원본</Badge>
                                    <span className="text-sm text-gray-500">
                                        {originalText.split(/\s+/).filter(word => word.trim()).length} 단어
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(originalText, 'original')}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {copiedState === 'original' ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                            <div className="prose prose-sm max-w-none">
                                <div className="bg-gray-50 p-4 rounded-lg border min-h-[200px] text-gray-700 leading-relaxed">
                                    {originalText}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* 화살표 */}
                <div className="hidden lg:flex items-center justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white border-2 border-blue-500 rounded-full p-3 shadow-lg"
                    >
                        <ArrowRight className="w-6 h-6 text-blue-500" />
                    </motion.div>
                </div>

                {/* 개선된 텍스트 */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card className="h-full border-green-200 bg-green-50/30">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Badge className="bg-green-600 hover:bg-green-700">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        AI 개선
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        {improvedText.split(/\s+/).filter(word => word.trim()).length} 단어
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(improvedText, 'improved')}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {copiedState === 'improved' ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                            <div className="prose prose-sm max-w-none">
                                <div className="bg-white p-4 rounded-lg border border-green-200 min-h-[200px] text-gray-700 leading-relaxed">
                                    {diffResults.map((result, index) => (
                                        <span
                                            key={index}
                                            className={
                                                result.type === 'added'
                                                    ? 'bg-green-200 text-green-800 px-1 rounded'
                                                    : result.type === 'removed'
                                                        ? 'bg-red-200 text-red-800 line-through px-1 rounded opacity-50'
                                                        : ''
                                            }
                                        >
                                            {result.text}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* 개선 포인트 요약 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12"
            >
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                        주요 개선 포인트
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        {improvements.map((improvement, index) => {
                            const Icon = improvement.icon;
                            return (
                                <div key={improvement.type} className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <div className="font-medium text-gray-900">{improvement.type}</div>
                                        <div className="text-gray-600">
                                            <span className="font-medium">Before:</span> {improvement.before}
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-medium">After:</span> {improvement.after}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </motion.div>

            {/* 품질 지표 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                <Card className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        프롬프트 품질 지표
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {metrics.map((metric, index) => (
                            <div key={metric.label} className="text-center">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                                    {metric.label}
                                </h4>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-500 mb-1">
                                            {metric.before}/10
                                        </div>
                                        <div className="text-xs text-gray-500">이전</div>
                                    </div>
                                    <div className="text-gray-400">→</div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-500 mb-1">
                                            {metric.after}/10
                                        </div>
                                        <div className="text-xs text-gray-500">개선 후</div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: `${metric.before * 10}%` }}
                                            animate={{ width: `${metric.after * 10}%` }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                            className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </Container>
    );
} 