import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../src/app/globals.css';
import Providers from '../src/app/providers';
import { MobileNavBar } from '@/components/layout/mobile-nav-bar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Smart Prompt Assistant - AI로 더 나은 프롬프트를',
    description: '프롬프트 작성의 새로운 기준. AI가 당신의 요구사항을 정확히 이해하고 최적화된 프롬프트를 제안합니다.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <main className="pb-14 lg:pb-0">
                        {children}
                    </main>
                    <MobileNavBar />
                </Providers>
            </body>
        </html>
    );
} 