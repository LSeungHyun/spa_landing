import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
    // Google Analytics 4로 전송
    if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_label: metric.id,
            non_interaction: true,
        })
    }

    // Vercel Analytics로 전송
    if (typeof window !== 'undefined' && (window as any).va) {
        ; (window as any).va('track', 'Web Vitals', {
            metric: metric.name,
            value: metric.value,
            id: metric.id,
        })
    }

    // 콘솔에 로그 출력 (개발 환경)
    if (process.env.NODE_ENV === 'development') {
        console.log('Web Vitals:', metric)
    }
}

export function reportWebVitals() {
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
} 