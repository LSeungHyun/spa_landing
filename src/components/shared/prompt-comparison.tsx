import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";
import { DetailedPromptScore } from "@/lib/services/prompt-improvement-service";
import { cn } from "@/lib/utils";

interface PromptComparisonProps {
    originalPrompt: string;
    improvedPrompt: string;
    improvements: string[];
    isVisible: boolean;
    originalScore?: DetailedPromptScore;
    improvedScore?: DetailedPromptScore;
}

export function PromptComparison({
    originalPrompt,
    improvedPrompt,
    improvements,
    isVisible,
    originalScore,
    improvedScore
}: PromptComparisonProps) {
    if (!isVisible) return null;

    const getScoreColor = (value: number) => {
        if (value >= 80) return 'text-green-600';
        if (value >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return 'bg-green-500';
            case 'B': return 'bg-blue-500';
            case 'C': return 'bg-yellow-500';
            case 'D': return 'bg-orange-500';
            case 'F': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const ScoreCard = ({ score, title, variant }: { 
        score?: DetailedPromptScore; 
        title: string; 
        variant: 'original' | 'improved' 
    }) => {
        if (!score) return null;

        const borderColor = variant === 'original' ? 'border-red-200' : 'border-green-200';
        const bgColor = variant === 'original' ? 'bg-red-50/30' : 'bg-green-50/30';

        return (
            <div className={cn("p-3 rounded-lg border", borderColor, bgColor)}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{title}</span>
                    <div className="flex items-center gap-2">
                        <span className={cn("text-lg font-bold", getScoreColor(score.overall))}>
                            {score.overall}
                        </span>
                        <Badge 
                            className={cn("text-white text-xs", getGradeColor(score.grade))}
                        >
                            {score.grade}
                        </Badge>
                    </div>
                </div>
                
                {/* 간단한 카테고리 점수 */}
                <div className="grid grid-cols-5 gap-1 text-xs">
                    <div className="text-center">
                        <div className={getScoreColor(score.categories.clarity)}>
                            {score.categories.clarity}
                        </div>
                        <div className="text-gray-500">명확성</div>
                    </div>
                    <div className="text-center">
                        <div className={getScoreColor(score.categories.specificity)}>
                            {score.categories.specificity}
                        </div>
                        <div className="text-gray-500">구체성</div>
                    </div>
                    <div className="text-center">
                        <div className={getScoreColor(score.categories.context)}>
                            {score.categories.context}
                        </div>
                        <div className="text-gray-500">맥락</div>
                    </div>
                    <div className="text-center">
                        <div className={getScoreColor(score.categories.structure)}>
                            {score.categories.structure}
                        </div>
                        <div className="text-gray-500">구조</div>
                    </div>
                    <div className="text-center">
                        <div className={getScoreColor(score.categories.completeness)}>
                            {score.categories.completeness}
                        </div>
                        <div className="text-gray-500">완성도</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-8">
            {/* 점수 비교 섹션 (점수가 있는 경우에만) */}
            {(originalScore || improvedScore) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <Card className="border-blue-200 bg-blue-50/30">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                                <TrendingUp className="w-5 h-5" />
                                점수 비교
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid lg:grid-cols-3 gap-4 items-center">
                                {/* 개선 전 점수 */}
                                <div>
                                    {originalScore && (
                                        <ScoreCard 
                                            score={originalScore} 
                                            title="개선 전" 
                                            variant="original" 
                                        />
                                    )}
                                </div>

                                {/* 화살표 및 개선 정도 */}
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <ArrowRight className="h-6 w-6 text-blue-500" />
                                    {originalScore && improvedScore && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-center"
                                        >
                                            <div className="text-sm font-medium text-blue-600">
                                                +{improvedScore.overall - originalScore.overall}점 향상
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {Math.round(((improvedScore.overall - originalScore.overall) / originalScore.overall) * 100)}% 개선
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* 개선 후 점수 */}
                                <div>
                                    {improvedScore && (
                                        <ScoreCard 
                                            score={improvedScore} 
                                            title="개선 후" 
                                            variant="improved" 
                                        />
                                    )}
                                </div>
                            </div>

                            {/* 가장 큰 개선 영역 표시 */}
                            {originalScore && improvedScore && (
                                <div className="mt-4 p-3 bg-white rounded-lg border">
                                    <div className="text-sm font-medium mb-2">주요 개선 영역</div>
                                    <div className="space-y-1">
                                        {Object.entries(improvedScore.categories).map(([category, value]) => {
                                            const originalValue = originalScore.categories[category as keyof typeof originalScore.categories];
                                            const improvement = value - originalValue;
                                            
                                            if (improvement <= 0) return null;
                                            
                                            const categoryNames = {
                                                clarity: '명확성',
                                                specificity: '구체성',
                                                context: '맥락',
                                                structure: '구조',
                                                completeness: '완성도'
                                            };
                                            
                                            return (
                                                <div key={category} className="flex items-center justify-between text-sm">
                                                    <span>{categoryNames[category as keyof typeof categoryNames]}</span>
                                                    <span className="text-green-600 font-medium">
                                                        +{improvement}점
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* 기존 프롬프트 비교 */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Original Prompt */}
                <Card className="border-red-200 bg-red-50/50">
                    <CardHeader>
                        <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                            개선 전 프롬프트
                            <Badge variant="destructive" className="text-xs">
                                기존
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-white p-4 rounded-lg border border-red-200 text-sm text-gray-700">
                            {originalPrompt}
                        </div>
                    </CardContent>
                </Card>

                {/* Arrow */}
                <div className="hidden lg:flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <ArrowRight className="h-8 w-8 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600">AI 개선</span>
                    </div>
                </div>

                {/* Improved Prompt */}
                <Card className="border-green-200 bg-green-50/50">
                    <CardHeader>
                        <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                            개선 후 프롬프트
                            <Badge variant="default" className="bg-green-100 text-green-700 text-xs">
                                최적화
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-white p-4 rounded-lg border border-green-200 text-sm text-gray-700">
                            {improvedPrompt}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Improvements List */}
            <Card className="mt-6 border-blue-200 bg-blue-50/50">
                <CardHeader>
                    <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        주요 개선사항
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {improvements.map((improvement, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-gray-700"
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {improvement}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
} 