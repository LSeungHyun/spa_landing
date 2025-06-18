'use client';

import { PersonaType } from '@/types/spa-landing';
import { Button } from './ui/button';
import { CheckCircle2 } from 'lucide-react';

interface PersonaCardProps {
    persona: PersonaType;
    isSelected: boolean;
    onSelect: (persona: PersonaType) => void;
}

export function PersonaCard({ persona, isSelected, onSelect }: PersonaCardProps) {
    return (
        <div
            className={`
        relative p-6 rounded-xl border transition-all duration-300 cursor-pointer
        ${isSelected
                    ? 'border-brand-accent-blue bg-brand-accent-blue/10 shadow-lg'
                    : 'border-brand-surface-secondary hover:border-brand-accent-blue/50 bg-brand-surface-primary/50'
                }
      `}
            onClick={() => onSelect(persona)}
        >
            {isSelected && (
                <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-5 h-5 text-brand-accent-blue" />
                </div>
            )}

            <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{persona.icon}</div>
                <div>
                    <h3 className="text-lg font-semibold text-brand-text-primary">
                        {persona.title}
                    </h3>
                    <p className="text-sm text-brand-text-secondary">
                        {persona.subtitle}
                    </p>
                </div>
            </div>

            <p className="text-brand-text-secondary mb-4 leading-relaxed">
                {persona.description}
            </p>

            <div className="space-y-2">
                <h4 className="text-sm font-medium text-brand-text-primary">
                    주요 활용 시나리오:
                </h4>
                <div className="text-sm text-brand-text-secondary">
                    {persona.id === 'pm' && '제품 전략, 사용자 리서치, 데이터 분석'}
                    {persona.id === 'creator' && '콘텐츠 기획, 브랜드 협업, 성장 전략'}
                    {persona.id === 'startup' && '사용자 확보, 투자 유치, 비즈니스 모델'}
                </div>
            </div>

            <Button
                variant={isSelected ? "primary" : "outline"}
                className="w-full mt-4"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(persona);
                }}
            >
                {isSelected ? '선택됨' : '선택하기'}
            </Button>
        </div>
    );
} 