"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Download,
    Copy,
    Play,
    Pause,
    RotateCcw,
    FileText,
    Eye,
    Settings,
    CheckCircle
} from 'lucide-react';

interface DocumentStructure {
    title: string;
    sections: {
        name: string;
        content: string;
        wordCount: number;
        completed: boolean;
    }[];
    totalWords: number;
    estimatedTime: string;
}

interface MonacoResultDisplayProps {
    selectedScenario?: string;
}

const sampleDocuments: Record<string, DocumentStructure> = {
    academic: {
        title: "학술 논문 연구 제안서",
        sections: [
            {
                name: "연구 배경 및 목적",
                content: `# 연구 배경 및 목적

## 연구 배경
최근 인공지능과 머신러닝 기술의 급속한 발전으로 인해 다양한 산업 분야에서 자동화 시스템의 도입이 가속화되고 있습니다. 특히 자연어 처리(NLP) 기술의 발전은 텍스트 분석, 문서 자동 생성, 언어 번역 등의 영역에서 혁신적인 변화를 가져오고 있습니다.

기존의 문서 작성 과정은 많은 시간과 전문적 지식을 요구하며, 특히 학술 연구나 비즈니스 제안서 작성에서는 구조적 일관성과 전문성을 동시에 확보하는 것이 어려운 과제로 인식되어 왔습니다.

## 연구 목적
본 연구의 주요 목적은 다음과 같습니다:

1. **자동화된 문서 생성 시스템 개발**: AI 기반 프롬프트 최적화를 통한 고품질 문서 자동 생성 시스템 구축
2. **사용자 경험 개선**: 복잡한 문서 작성 과정을 단순화하여 누구나 전문적인 문서를 작성할 수 있는 환경 제공
3. **효율성 극대화**: 기존 대비 90% 이상의 시간 단축을 통한 업무 생산성 향상`,
                wordCount: 245,
                completed: true
            },
            {
                name: "선행 연구 분석",
                content: `# 선행 연구 분석

## 국내외 연구 동향

### 국외 연구 현황
OpenAI의 GPT-4와 Google의 Bard, Anthropic의 Claude 등 대규모 언어 모델들이 텍스트 생성 분야에서 혁신적인 성과를 보여주고 있습니다. 

**주요 연구 성과:**
- GPT-4: 창작, 요약, 번역 등 다양한 텍스트 생성 작업에서 인간 수준의 성능 달성
- PaLM 2: 논리적 추론과 코딩 능력이 향상된 차세대 언어 모델
- ChatGPT Enterprise: 기업 환경에 특화된 문서 자동 생성 솔루션

### 국내 연구 현황
국내에서도 네이버의 HyperCLOVA X, 카카오브레인의 KoGPT 등이 한국어 특화 언어 모델로 주목받고 있습니다.

**한계점 분석:**
1. 일반적인 텍스트 생성에 중점을 둔 연구가 대부분
2. 특정 도메인(학술, 비즈니스)에 특화된 구조적 문서 생성 연구 부족
3. 사용자 의도 파악과 프롬프트 최적화에 대한 체계적 접근 미흡`,
                wordCount: 198,
                completed: true
            },
            {
                name: "연구 방법론",
                content: `# 연구 방법론

## 연구 설계
본 연구는 혼합 연구 방법론을 채택하여 정량적 성능 평가와 정성적 사용자 경험 분석을 병행합니다.

### 1단계: 시스템 설계 및 개발
- **프롬프트 엔지니어링**: 도메인별 최적화된 프롬프트 템플릿 개발
- **AI 모델 통합**: 다중 AI 모델 앙상블을 통한 성능 최적화
- **사용자 인터페이스**: 직관적이고 효율적인 웹 기반 인터페이스 구축

### 2단계: 성능 평가
**정량적 지표:**
- 생성 속도: 문서 완성까지 소요 시간 측정
- 품질 점수: BLEU, ROUGE 등 자동 평가 지표 활용
- 사용자 만족도: 5점 척도 설문 조사

**정성적 평가:**
- 전문가 리뷰: 해당 분야 전문가 10명의 품질 평가
- 사용성 테스트: 일반 사용자 30명 대상 사용성 평가

### 3단계: 검증 및 개선
- A/B 테스트를 통한 기능별 효과성 검증
- 사용자 피드백 수집 및 반영
- 지속적인 모델 성능 개선`,
                wordCount: 221,
                completed: false
            }
        ],
        totalWords: 664,
        estimatedTime: "2분 30초"
    },
    business: {
        title: "AI 기반 스마트 프롬프트 서비스 사업 계획서",
        sections: [
            {
                name: "사업 개요",
                content: `# 사업 개요

## 사업 아이템
**AI 기반 스마트 프롬프트 문서 자동 생성 서비스**

## 사업 비전
"모든 사람이 전문가 수준의 문서를 5분 안에 작성할 수 있는 세상을 만든다"

## 핵심 가치 제안
1. **시간 효율성**: 기존 대비 95% 시간 단축
2. **전문성 보장**: AI 기반 구조화된 문서 생성
3. **접근성 향상**: 전문 지식 없이도 고품질 문서 작성 가능

## 타겟 시장
- **1차 타겟**: 스타트업 창업자, 개인 사업자 (B2C)
- **2차 타겟**: 중소기업, 컨설팅 회사 (B2B)
- **3차 타겟**: 대학생, 연구자, 학술 기관 (B2A)

예상 시장 규모: 국내 10억 원, 글로벌 100억 원 (3년 후)`,
                wordCount: 156,
                completed: true
            },
            {
                name: "시장 분석",
                content: `# 시장 분석

## 시장 규모 및 성장성

### 글로벌 시장
- **AI 텍스트 생성 시장**: 2023년 5억 달러 → 2028년 25억 달러 (연평균 성장률 37%)
- **문서 자동화 시장**: 2023년 45억 달러 → 2028년 120억 달러

### 국내 시장
- **AI 서비스 시장**: 2023년 8,000억 원 → 2028년 3조 원
- **비즈니스 솔루션**: 연평균 성장률 25%

## 경쟁사 분석

### 직접 경쟁사
1. **Copy.ai**: 마케팅 중심 AI 라이팅
   - 강점: 브랜드 인지도, 다양한 템플릿
   - 약점: 구조적 문서 생성 부족

2. **Jasper**: 기업용 AI 콘텐츠 플랫폼
   - 강점: 기업 고객 확보
   - 약점: 높은 가격, 복잡한 인터페이스

### 차별화 포인트
- **구조적 접근**: 단순 텍스트 생성을 넘어선 체계적 문서 구조화
- **도메인 특화**: 학술, 비즈니스, 창작 분야별 맞춤형 솔루션
- **사용자 친화적**: 직관적 인터페이스와 가이드 제공`,
                wordCount: 203,
                completed: true
            }
        ],
        totalWords: 359,
        estimatedTime: "1분 45초"
    }
};

export default function MonacoResultDisplay({ selectedScenario = 'academic' }: MonacoResultDisplayProps) {
    const [isTyping, setIsTyping] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const [currentContent, setCurrentContent] = useState('');
    const [typingSpeed, setTypingSpeed] = useState(50); // ms per character
    const [showStructure, setShowStructure] = useState(true);
    const [documentData, setDocumentData] = useState<DocumentStructure>(sampleDocuments[selectedScenario]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const editorRef = useRef<any>(null);

    useEffect(() => {
        setDocumentData(sampleDocuments[selectedScenario] || sampleDocuments.academic);
        handleReset();
    }, [selectedScenario]);

    const handlePlay = () => {
        if (isTyping) return;

        setIsTyping(true);
        const fullContent = documentData.sections
            .map(section => section.content)
            .join('\n\n---\n\n');

        let charIndex = 0;

        intervalRef.current = setInterval(() => {
            if (charIndex <= fullContent.length) {
                setCurrentContent(fullContent.slice(0, charIndex));
                charIndex++;
            } else {
                setIsTyping(false);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            }
        }, typingSpeed);
    };

    const handlePause = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsTyping(false);
    };

    const handleReset = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsTyping(false);
        setCurrentContent('');
        setCurrentSection(0);
    };

    const handleCopy = () => {
        if (currentContent) {
            navigator.clipboard.writeText(currentContent);
        }
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([currentContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${documentData.title}.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;

        // 에디터 설정
        editor.updateOptions({
            fontSize: 14,
            lineHeight: 1.6,
            wordWrap: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
        });
    };

    return (
        <div className="w-full space-y-6">
            {/* 헤더 및 컨트롤 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl text-white">
                                {documentData.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-2">
                                <Badge variant="secondary">
                                    <FileText className="w-3 h-3 mr-1" />
                                    {documentData.totalWords} 단어
                                </Badge>
                                <Badge variant="outline">
                                    예상 생성 시간: {documentData.estimatedTime}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowStructure(!showStructure)}
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                구조 {showStructure ? '숨기기' : '보기'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setTypingSpeed(typingSpeed === 50 ? 20 : 50)}
                            >
                                <Settings className="w-4 h-4 mr-1" />
                                {typingSpeed === 50 ? '고속' : '일반'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 문서 구조 패널 */}
                {showStructure && (
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm text-white">문서 구조</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {documentData.sections.map((section, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${section.completed ? 'bg-green-500' : 'bg-gray-400'
                                            }`} />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-200">
                                                {section.name}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {section.wordCount} 단어
                                            </div>
                                        </div>
                                        {section.completed && (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* 에디터 패널 */}
                <div className={showStructure ? "lg:col-span-3" : "lg:col-span-4"}>
                    <Card className="h-full">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePlay}
                                            disabled={isTyping}
                                        >
                                            <Play className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePause}
                                            disabled={!isTyping}
                                        >
                                            <Pause className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleReset}
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Separator orientation="vertical" className="h-8" />
                                    <div className="text-sm text-gray-400">
                                        {isTyping ? '생성 중...' : '대기 중'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopy}
                                        disabled={!currentContent}
                                    >
                                        <Copy className="w-4 h-4 mr-1" />
                                        복사
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownload}
                                        disabled={!currentContent}
                                    >
                                        <Download className="w-4 h-4 mr-1" />
                                        다운로드
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-96 border-t">
                                <Editor
                                    height="384px"
                                    defaultLanguage="markdown"
                                    value={currentContent}
                                    onMount={handleEditorDidMount}
                                    theme="vs-dark"
                                    options={{
                                        readOnly: true,
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                        wordWrap: 'on',
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 16, bottom: 16 },
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 생성 통계 */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                                {currentContent.length}
                            </div>
                            <div className="text-sm text-gray-400">생성된 글자</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">
                                {Math.floor(currentContent.split(' ').length)}
                            </div>
                            <div className="text-sm text-gray-400">생성된 단어</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                                {Math.floor((currentContent.length / documentData.sections.reduce((acc, section) => acc + section.content.length, 0)) * 100) || 0}%
                            </div>
                            <div className="text-sm text-gray-400">완성도</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400">
                                {isTyping ? `${typingSpeed}ms` : '0ms'}
                            </div>
                            <div className="text-sm text-gray-400">타이핑 속도</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 