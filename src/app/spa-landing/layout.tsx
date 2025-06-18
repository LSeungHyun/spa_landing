import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Smart Prompt Assistant - AI 기반 프롬프트 최적화 도구',
    description: 'AI가 당신의 프롬프트를 더 효과적으로 만들어 드립니다. PM, 크리에이터, 창업자를 위한 맞춤형 AI 어시스턴트.',
    keywords: 'AI, 프롬프트, 최적화, 생산성, PM, 크리에이터, 창업자',
    openGraph: {
        title: 'Smart Prompt Assistant',
        description: 'AI 기반 프롬프트 최적화 도구',
        type: 'website',
        locale: 'ko_KR',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Smart Prompt Assistant',
        description: 'AI 기반 프롬프트 최적화 도구',
    },
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
};

export default function SPALandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-background-primary via-brand-background-secondary to-brand-background-primary">
            {children}
        </div>
    );
} 