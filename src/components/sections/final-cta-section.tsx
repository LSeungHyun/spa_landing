'use client';

import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FinalCTASectionProps {
    onPreRegisterClick: () => void;
}

export default function FinalCTASection({ onPreRegisterClick }: FinalCTASectionProps) {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <Container>
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
                        지금 바로 시작해보세요
                    </h2>
                    <p className="text-lg text-brand-text-secondary mb-8">
                        더 이상 빈 문서 앞에서 고민하지 마세요. AI가 여러분의 아이디어를 전문적인 프롬프트로 변환해드립니다.
                    </p>
                    <Button
                        size="lg"
                        onClick={onPreRegisterClick}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                    >
                        무료 체험 시작하기
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </Container>
        </section>
    );
} 