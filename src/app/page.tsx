'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Wand2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export default function HomePage() {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            type: 'ai',
            content: '안녕하세요! 저는 SPA(Smart Prompt Assistant)입니다. 여러분의 프롬프트를 더 효과적으로 만들어드릴게요. 아래 샘플을 클릭하거나 직접 입력해보세요.',
            timestamp: new Date()
        }
    ]);

    // 샘플 프롬프트
    const samplePrompts = [
        "고객에게 제품 소개 이메일을 작성해야 해요",
        "신제품 런칭 프레젠테이션 개요를 만들어주세요",
        "마케팅 캠페인 아이디어를 브레인스토밍해주세요",
        "회의록을 정리하고 액션 아이템을 추출해주세요"
    ];

    const handleSampleClick = (sample: string) => {
        setInputText(sample);
    };

    const handleImprovePrompt = async () => {
        if (!inputText.trim()) {
            toast.error('프롬프트를 입력해주세요');
            return;
        }

        setIsLoading(true);

        // 사용자 메시지 추가
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputText,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);

        try {
            // 임시 향상된 결과 생성 (실제 API 대신)
            const improvedPrompt = `${inputText}를 더 명확하고 설득력 있게 다듬어서, 구체적인 가이드라인과 예시를 포함하여 전문적으로 작성해주세요. 대상 독자의 관점을 고려하고, 핵심 메시지가 명확히 전달되도록 구성해주세요.`;

            // AI 응답 추가
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: improvedPrompt,
                timestamp: new Date()
            };

            setChatMessages(prev => [...prev, aiMessage]);
            setInputText(''); // 입력 필드 클리어
            toast.success('프롬프트가 향상되었습니다!');

        } catch (error) {
            toast.error('프롬프트 향상에 실패했습니다. 다시 시도해주세요.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        // 사용자 메시지 추가
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputText,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);

        // 간단한 AI 응답 시뮬레이션
        setTimeout(() => {
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: '네, 이해했습니다. 더 구체적인 요구사항이 있으시면 말씀해주세요!',
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, aiMessage]);
        }, 1000);

        setInputText('');
    };

    return (
        <div className="min-h-screen bg-brand-dark-primary text-brand-text-primary">
            {/* Header */}
            <header className="border-b border-brand-border-primary bg-brand-dark-primary/90 backdrop-blur fixed top-0 w-full z-50">
                <Container>
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">SPA</span>
                            </div>
                            <span className="font-bold text-lg">Smart Prompt Assistant</span>
                        </div>
                    </div>
                </Container>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        {/* 채팅창 */}
                        <Card className="bg-brand-surface-primary/80 backdrop-blur-xl border-brand-surface-secondary/20 shadow-2xl mb-6 p-4 sm:p-6 min-h-[300px] sm:min-h-[400px]">
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                                    {chatMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex",
                                                message.type === 'user' ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-lg",
                                                    message.type === 'user'
                                                        ? 'bg-brand-accent-blue text-white'
                                                        : 'bg-brand-surface-secondary text-brand-text-primary'
                                                )}
                                            >
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                <span className="text-xs opacity-70 mt-2 block">
                                                    {message.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* 입력 섹션 */}
                        <Card className="bg-brand-surface-primary/80 backdrop-blur-xl border-brand-surface-secondary/20 shadow-2xl p-4 sm:p-6">
                            {/* 입력 필드 */}
                            <div className="relative mb-6">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="프롬프트를 입력하세요. 예: '고객에게 제품 소개 이메일을 작성해주세요'"
                                    className={cn(
                                        "w-full min-h-[100px] sm:min-h-[120px] p-3 sm:p-4 pr-12 sm:pr-16 bg-brand-dark-primary/50 border border-brand-surface-secondary/30 rounded-xl",
                                        "text-brand-text-primary placeholder:text-brand-text-secondary/60",
                                        "focus:outline-none focus:ring-2 focus:ring-brand-accent-blue/50 focus:border-brand-accent-blue/50",
                                        "resize-none transition-all duration-200 text-sm sm:text-base"
                                    )}
                                    disabled={isLoading}
                                />

                                {/* 전송 버튼 - 입력 필드 내부 우측 */}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !inputText.trim()}
                                    className={cn(
                                        "absolute right-2 sm:right-3 top-2 sm:top-3 p-2 rounded-lg transition-all duration-200",
                                        "bg-brand-accent-blue/20 hover:bg-brand-accent-blue/30",
                                        "text-brand-accent-blue hover:text-brand-accent-blue",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        "flex items-center justify-center"
                                    )}
                                    title="메시지 전송"
                                >
                                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                            {/* 액션 버튼들 */}
                            <div className="flex flex-wrap gap-3 justify-center mb-6">
                                <Button
                                    onClick={handleImprovePrompt}
                                    disabled={isLoading || !inputText.trim()}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 sm:px-6 py-2 text-sm sm:text-base"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            향상 중...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-4 h-4 mr-2" />
                                            프롬프트 향상
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* 샘플 프롬프트 섹션 */}
                            <div>
                                <h3 className="text-sm font-medium text-brand-text-secondary mb-3">
                                    샘플 프롬프트를 클릭해보세요
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {samplePrompts.map((prompt, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSampleClick(prompt)}
                                            className="text-left p-3 bg-brand-dark-primary/30 hover:bg-brand-dark-primary/50 rounded-lg border border-brand-surface-secondary/20 transition-all duration-200 text-sm text-brand-text-secondary hover:text-brand-text-primary"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </Container>
            </main>
        </div>
    );
} 