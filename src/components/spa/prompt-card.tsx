'use client';

import { DiffHighlight } from '@/types/spa-landing';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PromptCardProps {
    title: string;
    content: string;
    type: 'before' | 'after';
    highlights?: DiffHighlight[];
    className?: string;
}

export function PromptCard({
    title,
    content,
    type,
    highlights = [],
    className = ''
}: PromptCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    const renderHighlightedContent = () => {
        if (highlights.length === 0) {
            return content;
        }

        let highlightedContent = content;
        highlights.forEach(highlight => {
            const regex = new RegExp(highlight.text, 'gi');
            highlightedContent = highlightedContent.replace(
                regex,
                `<mark class="${highlight.type === 'added' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}">${highlight.text}</mark>`
            );
        });

        return (
            <div
                dangerouslySetInnerHTML={{ __html: highlightedContent }}
                className="whitespace-pre-wrap"
            />
        );
    };

    return (
        <div className={`
      relative p-6 rounded-xl border transition-all duration-300
      ${type === 'before'
                ? 'border-red-300 bg-red-50/50'
                : 'border-green-300 bg-green-50/50'
            }
      ${className}
    `}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`
            w-3 h-3 rounded-full
            ${type === 'before' ? 'bg-red-400' : 'bg-green-400'}
          `} />
                    <h3 className="font-semibold text-brand-text-primary">
                        {title}
                    </h3>
                </div>

                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-brand-surface-secondary/50 transition-colors"
                    title="복사하기"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                    ) : (
                        <Copy className="w-4 h-4 text-brand-text-secondary" />
                    )}
                </button>
            </div>

            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-800 font-mono leading-relaxed">
                    {renderHighlightedContent()}
                </div>
            </div>

            {type === 'after' && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>AI 최적화 완료</span>
                </div>
            )}
        </div>
    );
} 