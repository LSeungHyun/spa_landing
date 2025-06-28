'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
    Send, 
    Sparkles, 
    User, 
    Bot, 
    RefreshCw, 
    Lightbulb,
    ArrowUp,
    Copy,
    ThumbsUp,
    ThumbsDown,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
    id: string;
    type: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
    isImproved?: boolean;
}

interface ExamplePrompt {
    category: string;
    prompts: string[];
}

interface ChatGPTStyleDemoProps {
    className?: string;
}

export function ChatGPTStyleDemo({ className }: ChatGPTStyleDemoProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            type: 'system',
            content: '안녕하세요! Smart Prompt Assistant입니다. 어떤 도움이 필요하신가요?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showExamples, setShowExamples] = useState(true);
    const [currentExample, setCurrentExample] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const examplePrompts: ExamplePrompt[] = [
        {
            category: '📝 문서 작성',
            prompts: [
                '사업계획서 작성을 도와주세요',
                '기술 문서 템플릿을 만들어주세요',
                '프로젝트 제안서를 작성하고 싶어요'
            ]
        },
        {
            category: '💼 업무 효율',
            prompts: [
                '회의록 작성 방법을 알려주세요',
                '이메일 템플릿을 만들어주세요',
                '업무 프로세스를 개선하고 싶어요'
            ]
        },
        {
            category: '🎯 마케팅',
            prompts: [
                'SNS 콘텐츠 아이디어를 제안해주세요',
                '브랜드 스토리를 만들어주세요',
                '광고 카피를 작성하고 싶어요'
            ]
        }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content?: string) => {
        const messageContent = content || inputValue.trim();
        if (!messageContent) return;

        setShowExamples(false);
        setInputValue('');

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: messageContent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Simulate AI response with typing effect
        setTimeout(() => {
            const responses = [
                {
                    original: '네, 도움을 드리겠습니다. 어떤 종류의 문서를 작성하시나요?',
                    improved: `# 📋 문서 작성 전문 가이드

안녕하세요! Smart Prompt Assistant가 도와드리겠습니다.

## 🎯 맞춤형 문서 작성 지원

귀하의 요청을 정확히 이해하기 위해 몇 가지 질문을 드릴게요:

### 📝 문서 유형 확인
- **비즈니스 문서**: 사업계획서, 제안서, 보고서
- **기술 문서**: API 문서, 사용자 가이드, 매뉴얼
- **마케팅 자료**: 브로슈어, 콘텐츠, 카피라이팅
- **학술 자료**: 논문, 연구 보고서, 발표 자료

### 🎯 세부 요구사항
1. **목적**: 어떤 목적으로 사용하실 건가요?
2. **대상**: 누가 읽을 문서인가요?
3. **분량**: 대략적인 길이는 어느 정도인가요?
4. **마감일**: 언제까지 완성이 필요한가요?

더 구체적인 정보를 알려주시면, 맞춤형 템플릿과 가이드라인을 제공해드리겠습니다! 🚀`
                },
                {
                    original: '좋은 아이디어네요! 더 자세히 설명해주세요.',
                    improved: `# 💡 탁월한 아이디어입니다!

## 🌟 아이디어 발전 로드맵

귀하의 아이디어를 체계적으로 발전시켜보겠습니다:

### 1️⃣ 현재 아이디어 분석
- **핵심 가치**: 어떤 문제를 해결하나요?
- **차별화 요소**: 기존 솔루션과 다른 점은?
- **타겟 고객**: 누를 위한 솔루션인가요?

### 2️⃣ 구체화 방향성
#### 📊 시장 분석
- 경쟁사 현황 파악
- 시장 규모 및 성장 가능성
- 고객 니즈 검증

#### 🛠️ 실행 계획
- MVP(최소 실행 가능 제품) 정의
- 개발 우선순위 설정
- 리소스 및 예산 계획

### 3️⃣ 다음 단계 제안
1. **아이디어 상세 설명서** 작성
2. **시장 조사 보고서** 준비
3. **비즈니스 모델** 설계
4. **프로토타입** 개발 계획

어떤 부분부터 시작하고 싶으신가요? 단계별로 자세히 도와드리겠습니다! 🎯`
                }
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            // Show original response first
            const originalMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: randomResponse.original,
                timestamp: new Date(),
                isTyping: true
            };

            setMessages(prev => [...prev, originalMessage]);

            // After a delay, show improved version
            setTimeout(() => {
                setMessages(prev => prev.map(msg => 
                    msg.id === originalMessage.id 
                        ? { ...msg, isTyping: false }
                        : msg
                ));

                // Add Smart Prompt improvement
                setTimeout(() => {
                    const improvedMessage: ChatMessage = {
                        id: (Date.now() + 2).toString(),
                        type: 'assistant',
                        content: randomResponse.improved,
                        timestamp: new Date(),
                        isImproved: true
                    };

                    setMessages(prev => [...prev, improvedMessage]);
                    setIsTyping(false);
                }, 1000);
            }, 2000);
        }, 1000);
    };

    const handleExampleClick = (prompt: string) => {
        setInputValue(prompt);
        textareaRef.current?.focus();
    };

    const resetDemo = () => {
        setMessages([
            {
                id: '1',
                type: 'system',
                content: '안녕하세요! Smart Prompt Assistant입니다. 어떤 도움이 필요하신가요?',
                timestamp: new Date()
            }
        ]);
        setInputValue('');
        setIsTyping(false);
        setShowExamples(true);
    };

    const TypingIndicator = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-1 text-gray-500"
        >
            <div className="flex space-x-1">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                />
            </div>
            <span className="text-sm">응답 중...</span>
        </motion.div>
    );

    return (
        <div className={cn("w-full max-w-4xl mx-auto", className)}>
            <Card className="h-[600px] flex flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">ChatGPT</h3>
                            <p className="text-xs text-gray-500">with Smart Prompt Assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Enhanced
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetDemo}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-0">
                    <div className="space-y-4 p-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={cn(
                                        "flex items-start space-x-3",
                                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                    )}
                                >
                                    {/* Avatar */}
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                        message.type === 'user' 
                                            ? 'bg-blue-600' 
                                            : message.isImproved
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                                : 'bg-gradient-to-r from-green-400 to-blue-500'
                                    )}>
                                        {message.type === 'user' ? (
                                            <User className="w-5 h-5 text-white" />
                                        ) : message.isImproved ? (
                                            <Sparkles className="w-5 h-5 text-white" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-white" />
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className={cn(
                                        "flex-1 max-w-[80%]",
                                        message.type === 'user' ? 'text-right' : 'text-left'
                                    )}>
                                        {message.isImproved && (
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    Smart Prompt Enhanced
                                                </Badge>
                                            </div>
                                        )}
                                        
                                        <div className={cn(
                                            "rounded-lg p-3 prose prose-sm max-w-none",
                                            message.type === 'user'
                                                ? 'bg-blue-600 text-white ml-auto'
                                                : message.isImproved
                                                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
                                                    : 'bg-gray-100 text-gray-900'
                                        )}>
                                            {message.isTyping ? (
                                                <TypingIndicator />
                                            ) : (
                                                <div className={cn(
                                                    message.type === 'user' ? 'text-white' : 'text-gray-900',
                                                    message.isImproved ? 'prose-purple' : ''
                                                )}>
                                                    {message.content.includes('#') ? (
                                                        <div dangerouslySetInnerHTML={{
                                                            __html: message.content
                                                                .replace(/\n/g, '<br/>')
                                                                .replace(/#{1,6}\s(.+)/g, '<h3 class="font-bold text-lg mb-2">$1</h3>')
                                                                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                                                .replace(/- (.+)/g, '<li>$1</li>')
                                                        }} />
                                                    ) : (
                                                        message.content
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Actions */}
                                        {!message.isTyping && message.type === 'assistant' && (
                                            <div className="flex items-center space-x-2 mt-2 text-gray-500">
                                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                    <Copy className="w-3 h-3 mr-1" />
                                                    복사
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                    <ThumbsUp className="w-3 h-3" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                    <ThumbsDown className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start space-x-3"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <TypingIndicator />
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </CardContent>

                {/* Example Prompts */}
                {showExamples && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 border-t bg-gray-50/50"
                    >
                        <div className="flex items-center space-x-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">예시 프롬프트</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {examplePrompts.map((category, categoryIndex) => (
                                <div key={categoryIndex}>
                                    <h4 className="text-xs font-medium text-gray-600 mb-2">{category.category}</h4>
                                    <div className="space-y-1">
                                        {category.prompts.map((prompt, promptIndex) => (
                                            <button
                                                key={promptIndex}
                                                onClick={() => handleExampleClick(prompt)}
                                                className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t">
                    <div className="flex items-end space-x-3">
                        <div className="flex-1 relative">
                            <Textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="메시지를 입력하세요..."
                                className="min-h-[44px] max-h-32 resize-none pr-12 border-gray-300 focus:border-blue-500"
                                disabled={isTyping}
                            />
                            <Button
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim() || isTyping}
                                size="sm"
                                className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>Shift + Enter로 줄바꿈</span>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendMessage('💬 예시 불러오기')}
                                className="h-6 px-2 text-xs"
                            >
                                💬 예시 불러오기
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendMessage('🎯 개선 전/후 보기')}
                                className="h-6 px-2 text-xs"
                            >
                                🎯 개선 전/후 보기
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
} 