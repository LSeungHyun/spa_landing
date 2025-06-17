import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface PromptComparisonProps {
    originalPrompt: string;
    improvedPrompt: string;
    improvements: string[];
    isVisible: boolean;
}

export function PromptComparison({
    originalPrompt,
    improvedPrompt,
    improvements,
    isVisible
}: PromptComparisonProps) {
    if (!isVisible) return null;

    return (
        <div className="mt-8">
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
                <Card className="border-green-200 bg-green-50/50 lg:col-start-2">
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