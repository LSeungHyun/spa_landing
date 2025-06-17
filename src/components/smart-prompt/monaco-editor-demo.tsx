'use client';

import React, { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    FileText,
    Download,
    Copy,
    Eye,
    Edit3,
    Sparkles,
    CheckCircle2,
    Clock,
    BarChart3,
    Wand2,
    RefreshCw,
    Zap
} from 'lucide-react';

interface ResultMetrics {
    wordCount: number;
    readingTime: number;
    qualityScore: number;
    coherenceScore: number;
    originalityScore: number;
}

interface EditorTab {
    id: string;
    title: string;
    content: string;
    type: 'abstract' | 'introduction' | 'full-document';
    metrics: ResultMetrics;
}

const sampleResults: EditorTab[] = [
    {
        id: 'abstract',
        title: '논문 초록',
        type: 'abstract',
        content: `# 인공지능 기반 스마트 프롬프트 시스템의 학술 문서 생성 효율성 연구

## 초록

본 연구는 인공지능 기반 스마트 프롬프트 시스템이 학술 문서 생성 과정에서 보이는 효율성과 품질 향상 효과를 분석한다. 기존의 학술 문서 작성 과정이 가진 한계점들, 특히 '백지의 압박(blank page syndrome)'과 구조화의 어려움을 해결하기 위해 개발된 이 시스템은 사용자의 초기 아이디어를 체계적으로 분석하고, 전문적인 학술 문서 구조로 자동 변환하는 기능을 제공한다.

연구 방법론으로는 100명의 대학원생과 연구자를 대상으로 한 비교 실험을 실시했으며, 기존 방식과 스마트 프롬프트 시스템을 활용한 방식의 문서 생성 시간, 품질, 그리고 사용자 만족도를 측정했다. 

실험 결과, 스마트 프롬프트 시스템을 사용한 그룹에서 평균 87%의 시간 단축 효과가 나타났으며, 문서의 논리적 구조화 점수는 23% 향상되었다. 또한 초기 작성 단계에서의 스트레스 지수가 현저히 감소했음을 확인할 수 있었다.

본 연구의 주요 기여는 다음과 같다: (1) AI 기반 문서 생성 시스템의 학술적 효용성 검증, (2) 글쓰기 과정에서의 인지적 부담 감소 메커니즘 분석, (3) 향후 학술 문서 작성 도구 개발을 위한 가이드라인 제시.

**키워드**: 인공지능, 스마트 프롬프트, 학술 문서, 자동화, 효율성`,
        metrics: {
            wordCount: 342,
            readingTime: 2,
            qualityScore: 94,
            coherenceScore: 92,
            originalityScore: 88
        }
    },
    {
        id: 'introduction',
        title: '서론',
        type: 'introduction',
        content: `# 1. 서론

## 1.1 연구 배경

현대 학술 환경에서 연구자들은 점점 더 많은 문서 작성 업무에 직면하고 있다. 연구 제안서, 논문, 보고서 등 다양한 형태의 학술 문서는 연구 활동의 핵심 요소이지만, 동시에 많은 연구자들에게 상당한 부담으로 작용하고 있다. 특히 초기 아이디어를 체계적인 문서 구조로 변환하는 과정에서 많은 시간과 노력이 소요되며, 이는 실제 연구 활동에 투입할 수 있는 시간을 제약하는 요인으로 작용한다.

Smith et al. (2023)의 연구에 따르면, 박사과정 학생들의 약 73%가 논문 작성 과정에서 '백지의 압박(blank page syndrome)'을 경험한다고 보고했으며, 이는 연구 진행에 상당한 지연을 야기하는 것으로 나타났다. 또한 Johnson & Lee (2022)는 연구자들이 문서 작성에 소요하는 시간이 전체 연구 시간의 평균 34%에 달한다고 분석했다.

## 1.2 문제 정의

기존 학술 문서 작성 과정의 주요 문제점들은 다음과 같다:

### 1.2.1 구조화의 어려움
초기 아이디어나 연구 내용을 논리적이고 체계적인 문서 구조로 변환하는 것은 높은 수준의 전문성과 경험을 요구한다. 특히 신진 연구자들의 경우, 적절한 문서 구조를 설계하는 데 상당한 시간을 소요하게 된다.

### 1.2.2 백지 상태에서의 시작
빈 문서에서부터 시작하는 것은 심리적 부담을 가중시키며, 창작 과정의 초기 진입 장벽을 높인다. 이는 procrastination과 writing anxiety를 유발하는 주요 원인으로 작용한다.

### 1.2.3 일관성 유지의 어려움
긴 문서를 작성하는 과정에서 전체적인 논조와 스타일의 일관성을 유지하는 것은 지속적인 주의와 검토를 필요로 한다.

## 1.3 연구 목적

본 연구는 인공지능 기반 스마트 프롬프트 시스템을 통해 위와 같은 문제점들을 해결하고, 학술 문서 작성 과정의 효율성을 향상시키는 방안을 제시하고자 한다. 구체적인 연구 목적은 다음과 같다:

1. 스마트 프롬프트 시스템의 문서 생성 품질 및 효율성 평가
2. 기존 작성 방식 대비 시간 단축 효과 측정
3. 사용자의 인지적 부담 감소 효과 분석
4. 향후 AI 기반 문서 작성 도구 개발을 위한 가이드라인 도출

## 1.4 연구의 의의

이 연구는 학술 문서 작성 과정에서 AI 기술의 실용적 활용 가능성을 실증적으로 검증한다는 점에서 의의가 있다. 또한 연구자들의 생산성 향상과 연구 활동의 효율화에 기여할 수 있는 구체적인 솔루션을 제시한다는 점에서 실용적 가치를 가진다.`,
        metrics: {
            wordCount: 687,
            readingTime: 4,
            qualityScore: 96,
            coherenceScore: 94,
            originalityScore: 91
        }
    },
    {
        id: 'full-document',
        title: '전체 문서',
        type: 'full-document',
        content: `# 인공지능 기반 스마트 프롬프트 시스템의 학술 문서 생성 효율성 연구

## 초록

본 연구는 인공지능 기반 스마트 프롬프트 시스템이 학술 문서 생성 과정에서 보이는 효율성과 품질 향상 효과를 분석한다. 기존의 학술 문서 작성 과정이 가진 한계점들, 특히 '백지의 압박(blank page syndrome)'과 구조화의 어려움을 해결하기 위해 개발된 이 시스템은 사용자의 초기 아이디어를 체계적으로 분석하고, 전문적인 학술 문서 구조로 자동 변환하는 기능을 제공한다...

## 1. 서론

### 1.1 연구 배경
현대 학술 환경에서 연구자들은 점점 더 많은 문서 작성 업무에 직면하고 있다...

### 1.2 문제 정의
기존 학술 문서 작성 과정의 주요 문제점들은 다음과 같다...

## 2. 문헌 검토

### 2.1 AI 기반 문서 생성 시스템
인공지능을 활용한 문서 생성 기술은 지난 몇 년간 급속도로 발전해왔다...

### 2.2 학술 글쓰기 과정의 인지적 측면
학술 글쓰기는 복잡한 인지적 과정을 수반한다...

## 3. 연구 방법론

### 3.1 연구 설계
본 연구는 비교 실험 설계(comparative experimental design)를 채택했다...

### 3.2 참가자 및 표본
연구 참가자는 국내 주요 대학의 대학원생과 연구자 100명으로 구성되었다...

## 4. 결과 및 분석

### 4.1 문서 생성 시간 분석
스마트 프롬프트 시스템을 사용한 그룹에서 평균 87%의 시간 단축 효과가 나타났다...

### 4.2 문서 품질 평가
독립적인 전문가 평가단에 의한 품질 평가 결과...

## 5. 결론 및 제언

### 5.1 연구 결과 요약
본 연구를 통해 스마트 프롬프트 시스템의 효과성이 실증적으로 검증되었다...

### 5.2 연구의 한계 및 향후 연구 방향
본 연구는 몇 가지 한계점을 가지고 있다...

## 참고문헌

Johnson, A., & Lee, B. (2022). Time allocation in academic research: A comprehensive analysis. Journal of Research Productivity, 15(3), 45-62.

Smith, C., Davis, E., & Wilson, F. (2023). Writing anxiety in graduate students: Prevalence and impact. Academic Writing Quarterly, 28(2), 112-128.`,
        metrics: {
            wordCount: 1247,
            readingTime: 7,
            qualityScore: 95,
            coherenceScore: 93,
            originalityScore: 89
        }
    }
];

export default function MonacoEditorDemo() {
    const [activeTab, setActiveTab] = useState<string>('abstract');
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(sampleResults[0].content);
    const editorRef = useRef(null);

    const currentResult = sampleResults.find(result => result.id === activeTab) || sampleResults[0];

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setContent(value);
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const newResult = sampleResults.find(result => result.id === tabId);
        if (newResult) {
            setContent(newResult.content);
        }
    };

    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(content);
            // Here you would typically show a toast notification
        } catch (err) {
            console.error('Failed to copy content:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentResult.title}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImprove = () => {
        // 여기에 AI 개선 로직을 추가할 수 있습니다
        // 실제로는 API 호출을 통해 콘텐츠를 개선하겠지만,
        // 데모 목적으로 간단한 메시지를 표시합니다
        alert('AI 개선 기능이 실행됩니다. 잠시 후 개선된 내용으로 업데이트됩니다.');
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white">
                    전문 에디터에서 결과 확인
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    생성된 문서를 Monaco Editor에서 확인하고, 실시간으로 편집하며 품질을 더욱 향상시켜보세요.
                </p>
            </div>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-white">문서 결과</CardTitle>
                            <CardDescription>
                                생성된 문서를 전문 에디터에서 확인하고 편집할 수 있습니다
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyContent}
                                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                복사
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                다운로드
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleImprove}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Wand2 className="w-4 h-4 mr-2" />
                                AI 개선
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                        {sampleResults.map((result) => (
                            <button
                                key={result.id}
                                onClick={() => handleTabChange(result.id)}
                                className={`flex-1 px-3 py-2 text-sm rounded-md transition-all ${activeTab === result.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                            >
                                {result.title}
                            </button>
                        ))}
                    </div>

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 bg-gray-800 rounded-lg">
                        <div className="text-center">
                            <div className="text-xl font-bold text-white">{currentResult.metrics.wordCount}</div>
                            <div className="text-xs text-gray-400">단어 수</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-white">{currentResult.metrics.readingTime}분</div>
                            <div className="text-xs text-gray-400">읽기 시간</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-green-400">{currentResult.metrics.qualityScore}%</div>
                            <div className="text-xs text-gray-400">품질 점수</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-blue-400">{currentResult.metrics.coherenceScore}%</div>
                            <div className="text-xs text-gray-400">일관성</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-purple-400">{currentResult.metrics.originalityScore}%</div>
                            <div className="text-xs text-gray-400">독창성</div>
                        </div>
                    </div>

                    {/* Editor Controls */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                <FileText className="w-3 h-3 mr-1" />
                                Markdown 형식
                            </Badge>
                            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                {isEditing ? (
                                    <>
                                        <Edit3 className="w-3 h-3 mr-1" />
                                        편집 모드
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3 h-3 mr-1" />
                                        읽기 전용
                                    </>
                                )}
                            </Badge>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                            {isEditing ? (
                                <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    읽기 모드
                                </>
                            ) : (
                                <>
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    편집 모드
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Monaco Editor */}
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <Editor
                            height="600px"
                            defaultLanguage="markdown"
                            value={content}
                            onChange={handleEditorChange}
                            options={{
                                theme: 'vs-dark',
                                fontSize: 14,
                                lineNumbers: 'on',
                                minimap: { enabled: true },
                                wordWrap: 'on',
                                readOnly: !isEditing,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                formatOnPaste: true,
                                formatOnType: true,
                            }}
                            onMount={(editor, monaco) => {
                                editorRef.current = editor;
                            }}
                        />
                    </div>

                    {/* Real-time Insights */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                실시간 인사이트
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        강점
                                    </h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• 논리적 구조가 명확함</li>
                                        <li>• 학술적 문체가 일관됨</li>
                                        <li>• 핵심 키워드가 적절히 분포됨</li>
                                        <li>• 인용 형식이 올바름</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-blue-400" />
                                        개선 제안
                                    </h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• 표와 그래프 추가 권장</li>
                                        <li>• 최신 연구 동향 보강</li>
                                        <li>• 결론 부분 강화 필요</li>
                                        <li>• 국제적 관점 추가</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            문서 완료
                        </Button>
                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            새로 생성
                        </Button>
                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            상세 분석
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 