import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'SPA - Smart Prompt Assistant | 백지의 압박 해결사',
  description: 'AI가 당신의 프롬프트를 10배 향상시킵니다. 블랭크 페이지 신드롬을 즉시 해결하고 창의적인 아이디어를 얻으세요.',
  keywords: 'AI, 프롬프트, 생산성, 창의성, 백지의 압박, 블랭크 페이지',
  authors: [{ name: 'SPA Team' }],
  creator: 'SPA - Smart Prompt Assistant',
  publisher: 'SPA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://spa-landing.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SPA - Smart Prompt Assistant | 백지의 압박 해결사',
    description: 'AI가 당신의 프롬프트를 10배 향상시킵니다. 블랭크 페이지 신드롬을 즉시 해결하고 창의적인 아이디어를 얻으세요.',
    url: 'https://spa-landing.vercel.app',
    siteName: 'SPA - Smart Prompt Assistant',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SPA - Smart Prompt Assistant | 백지의 압박 해결사',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPA - Smart Prompt Assistant | 백지의 압박 해결사',
    description: 'AI가 당신의 프롬프트를 10배 향상시킵니다.',
    images: ['/og-image.jpg'],
    creator: '@spa_assistant',
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
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SPA - Smart Prompt Assistant",
              "description": "AI가 당신의 프롬프트를 10배 향상시킵니다. 블랭크 페이지 신드롬을 즉시 해결하고 창의적인 아이디어를 얻으세요.",
              "url": "https://spa-landing.vercel.app",
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
                "name": "SPA Team"
              }
            })
          }}
        />
        
        {/* 추가 메타 태그 */}
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
        {/* Skip Link for Accessibility */}
        <a 
          href="#main-content" 
          className="skip-link"
          aria-label="메인 콘텐츠로 건너뛰기"
        >
          메인 콘텐츠로 건너뛰기
        </a>
        
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <main id="main-content" role="main" tabIndex={-1}>
              {children}
            </main>
          </div>
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
