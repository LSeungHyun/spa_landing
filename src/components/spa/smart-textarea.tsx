'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface SmartTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onEnhance?: (text: string) => Promise<string>;
    isEnhancing?: boolean;
    className?: string;
    minRows?: number;
    maxRows?: number;
}

export function SmartTextarea({
    value,
    onChange,
    placeholder = "프롬프트를 입력하세요...",
    onEnhance,
    isEnhancing = false,
    className = '',
    minRows = 4,
    maxRows = 12
}: SmartTextareaProps) {
    const [originalValue, setOriginalValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 자동 높이 조절
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const lineHeight = 24; // 대략적인 라인 높이
            const minHeight = minRows * lineHeight;
            const maxHeight = maxRows * lineHeight;

            textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
        }
    }, [value, minRows, maxRows]);

    const handleEnhance = async () => {
        if (!onEnhance || !value.trim()) return;

        setOriginalValue(value);
        try {
            const enhanced = await onEnhance(value);
            onChange(enhanced);
        } catch (error) {
            console.error('Enhancement failed:', error);
        }
    };

    const handleRevert = () => {
        if (originalValue) {
            onChange(originalValue);
            setOriginalValue('');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    const charCount = value.length;
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

    return (
        <div className={`relative ${className}`}>
            {/* 메인 텍스트 에어리어 */}
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`
            w-full px-4 py-3 pr-12 
            bg-brand-surface-primary border border-brand-surface-secondary
            rounded-xl resize-none transition-all duration-300
            text-brand-text-primary placeholder-brand-text-secondary
            focus:outline-none focus:ring-2 focus:ring-brand-accent-blue/50 focus:border-brand-accent-blue
            ${isExpanded ? 'rounded-b-none' : ''}
          `}
                    style={{ minHeight: `${minRows * 24}px` }}
                    onFocus={() => setIsExpanded(true)}
                    onBlur={() => setTimeout(() => setIsExpanded(false), 150)}
                />

                {/* 확장 버튼 */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute top-3 right-3 p-1 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                >
                    <Sparkles className="w-4 h-4" />
                </button>
            </div>

            {/* 확장된 컨트롤 패널 */}
            {isExpanded && (
                <div className="absolute left-0 right-0 top-full z-10 bg-brand-surface-primary border border-t-0 border-brand-surface-secondary rounded-b-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
                            <span>{charCount} 글자</span>
                            <span>{wordCount} 단어</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {originalValue && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRevert}
                                    className="flex items-center gap-1"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    되돌리기
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="flex items-center gap-1"
                            >
                                <Copy className="w-3 h-3" />
                                복사
                            </Button>

                            {onEnhance && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleEnhance}
                                    disabled={isEnhancing || !value.trim()}
                                    className="flex items-center gap-1"
                                >
                                    {isEnhancing ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3 h-3" />
                                    )}
                                    {isEnhancing ? '개선 중...' : 'AI 개선'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 프롬프트 팁 */}
                    <div className="text-xs text-brand-text-secondary">
                        💡 <strong>팁:</strong> 구체적인 맥락과 목표를 포함하면 더 나은 결과를 얻을 수 있습니다.
                    </div>
                </div>
            )}
        </div>
    );
} 