import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import { MobileNavBar } from '@/components/layout/mobile-nav-bar';

export const metadata: Metadata = {
  title: 'Smart Prompt Assistant - AI로 더 나은 프롬프트를',
  description: '프롬프트 작성의 새로운 기준. AI가 당신의 요구사항을 정확히 이해하고 최적화된 프롬프트를 제안합니다. 3초 만에 전문가 수준의 결과를 얻어보세요.',
  keywords: ['AI', '프롬프트', 'prompt', 'assistant', '인공지능', '프롬프트 최적화', 'ChatGPT', 'AI 도구'],
  authors: [{ name: 'Smart Prompt Assistant Team' }],
  creator: 'Smart Prompt Assistant',
  publisher: 'Smart Prompt Assistant',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smart-prompt-assistant.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Smart Prompt Assistant - AI로 더 나은 프롬프트를',
    description: '프롬프트 작성의 새로운 기준. AI가 당신의 요구사항을 정확히 이해하고 최적화된 프롬프트를 제안합니다.',
    url: 'https://smart-prompt-assistant.com',
    siteName: 'Smart Prompt Assistant',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Prompt Assistant - AI로 더 나은 프롬프트를',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Prompt Assistant - AI로 더 나은 프롬프트를',
    description: '프롬프트 작성의 새로운 기준. AI가 당신의 요구사항을 정확히 이해하고 최적화된 프롬프트를 제안합니다.',
    images: ['/og-image.jpg'],
    creator: '@smartpromptai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google Fonts - SWC 없이 직접 로드 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Smart Prompt Assistant",
              "description": "AI가 당신의 요구사항을 정확히 이해하고 최적화된 프롬프트를 제안하는 도구",
              "url": "https://smart-prompt-assistant.com",
              "applicationCategory": "Productivity",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150",
                "bestRating": "5",
                "worstRating": "1"
              },
              "author": {
                "@type": "Organization",
                "name": "Smart Prompt Assistant Team"
              }
            })
          }}
        />
        
        {/* 추가 메타 태그 */}
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SPA" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* 성능 최적화 */}
        <link rel="dns-prefetch" href="https://api.openai.com" />
        
        {/* 파비콘 */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 매니페스트 */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-inter antialiased">
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
