import { UserEventRecord } from '@/types/spa-landing'
import React from 'react'

// Google Analytics 4 통합 및 이벤트 트래킹 시스템
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// GA4 이벤트 타입 정의
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// 사용자 행동 이벤트 타입
export interface UserBehaviorEvent {
  event_name: 'page_view' | 'demo_start' | 'demo_complete' | 'pre_register_start' | 
              'pre_register_complete' | 'cta_click' | 'scroll_depth' | 'exit_intent' |
              'persona_select' | 'prompt_input' | 'prompt_improve' | 'email_submit' |
              'form_error' | 'session_start' | 'session_end';
  event_category: 'engagement' | 'conversion' | 'interaction' | 'error';
  event_action: 'view' | 'click' | 'submit' | 'select' | 'scroll' | 'input' | 'complete';
  event_label?: string;
  value?: number;
  session_id: string;
  timestamp: string;
  custom_parameters?: Record<string, any>;
}

// 전환 이벤트 타입
export interface ConversionEvent {
  event_name: 'demo_conversion' | 'registration_conversion' | 'email_conversion';
  conversion_value: number;
  conversion_currency: 'KRW';
  user_properties?: Record<string, any>;
}

// 성능 이벤트 타입
export interface PerformanceEvent {
  event_name: 'page_load' | 'api_response' | 'component_render';
  performance_metric: string;
  duration: number;
  page_url: string;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private sessionId: string;
  private userId?: string;
  private isInitialized: boolean = false;
  private supabaseBackup: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeGA4();
    this.setupSupabaseBackup();
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  // GA4 초기화
  private initializeGA4(): void {
    if (typeof window === 'undefined') return;

    // GA4 측정 ID 설정 (환경변수에서 가져오기)
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    
    if (!GA_MEASUREMENT_ID) {
      console.warn('GA4 Measurement ID not found. Analytics will use development mode.');
      this.isInitialized = false;
      return;
    }

    // gtag 스크립트 로드
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };

    // GA4 설정
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
      session_id: this.sessionId,
      custom_map: {
        custom_parameter_1: 'session_id',
        custom_parameter_2: 'user_persona',
        custom_parameter_3: 'conversion_value'
      }
    });

    this.isInitialized = true;

    // 개발 환경에서 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log('GA4 Analytics initialized with session ID:', this.sessionId);
    }
  }

  // Supabase 백업 설정
  private setupSupabaseBackup(): void {
    // 프로덕션 환경에서만 Supabase 백업 활성화
    this.supabaseBackup = process.env.NODE_ENV === 'production' && 
                          !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (this.supabaseBackup && process.env.NODE_ENV === 'development') {
      console.log('Supabase backup enabled for analytics data');
    }
  }

  // 세션 ID 생성
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 사용자 ID 설정
  public setUserId(userId: string): void {
    this.userId = userId;
    if (this.isInitialized && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        user_id: userId
      });
    }
  }

  // 페이지뷰 추적
  public trackPageView(page_path: string, page_title?: string): void {
    const event: UserBehaviorEvent = {
      event_name: 'page_view',
      event_category: 'engagement',
      event_action: 'view',
      event_label: page_path,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      custom_parameters: {
        page_path,
        page_title: page_title || document.title,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      }
    };

    this.sendEvent(event);
    this.backupToSupabase('page_view', event.custom_parameters);
  }

  // 데모 시작 추적
  public trackDemoStart(persona?: string, input_length?: number): void {
    const event: UserBehaviorEvent = {
      event_name: 'demo_start',
      event_category: 'engagement',
      event_action: 'click',
      event_label: persona || 'unknown',
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      custom_parameters: {
        persona,
        input_length,
        page_section: 'hero'
      }
    };

    this.sendEvent(event);
    this.backupToSupabase('demo_start', event.custom_parameters);
  }

  // 데모 완료 추적 (전환 이벤트)
  public trackDemoComplete(persona?: string, input_length?: number, output_length?: number, improvement_ratio?: number): void {
    const event: UserBehaviorEvent = {
      event_name: 'demo_complete',
      event_category: 'conversion',
      event_action: 'complete',
      event_label: persona || 'unknown',
      value: 10, // 데모 완료 가치 (10원)
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      custom_parameters: {
        persona,
        input_length,
        output_length,
        improvement_ratio,
        conversion_type: 'demo_completion'
      }
    };

    // 전환 이벤트로도 전송
    const conversionEvent: ConversionEvent = {
      event_name: 'demo_conversion',
      conversion_value: 10,
      conversion_currency: 'KRW',
      user_properties: {
        persona,
        demo_completion_count: 1
      }
    };

    this.sendEvent(event);
    this.sendConversionEvent(conversionEvent);
    this.backupToSupabase('demo_complete', event.custom_parameters);
  }

  // 사전 등록 추적 (고가치 전환 이벤트)
  public trackPreRegistration(email: string, persona?: string, source?: string): void {
    const event: UserBehaviorEvent = {
      event_name: 'pre_register_complete',
      event_category: 'conversion',
      event_action: 'submit',
      event_label: persona || 'unknown',
      value: 100, // 사전 등록 가치 (100원)
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      custom_parameters: {
        persona,
        source,
        conversion_type: 'pre_registration',
        email_domain: email.split('@')[1]
      }
    };

    // 고가치 전환 이벤트로 전송
    const conversionEvent: ConversionEvent = {
      event_name: 'registration_conversion',
      conversion_value: 100,
      conversion_currency: 'KRW',
      user_properties: {
        persona,
        registration_source: source,
        email_domain: email.split('@')[1]
      }
    };

    this.sendEvent(event);
    this.sendConversionEvent(conversionEvent);
    this.backupToSupabase('pre_register_complete', { 
      ...event.custom_parameters, 
      email_masked: this.maskEmail(email) 
    });
  }

  // 페르소나 선택 추적
  public trackPersonaSelect(persona: string, previous_persona?: string): void {
    const event: UserBehaviorEvent = {
      event_name: 'persona_select',
      event_category: 'interaction',
      event_action: 'select',
      event_label: persona,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      custom_parameters: {
        selected_persona: persona,
        previous_persona,
        page_section: 'persona_selector'
      }
    };

    this.sendEvent(event);
    this.backupToSupabase('persona_select', event.custom_parameters);
  }

  // CTA 클릭 추적
  public trackCTAClick(cta_text: string, cta_location: string, page_section?: string): void {
    const event: UserBehaviorEvent = {
      event_name: 'cta_click',
      event_category: 'engagement',
      event_action: 'click',
      event_label: cta_text,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      custom_parameters: {
        cta_text,
        cta_location,
        page_section
      }
    };

    this.sendEvent(event);
    this.backupToSupabase('cta_click', event.custom_parameters);
  }

  // 스크롤 깊이 추적
  public trackScrollDepth(scroll_percentage: number, page_section?: string): void {
    // 25%, 50%, 75%, 100% 마일스톤에서만 추적
    const milestones = [25, 50, 75, 100];
    const milestone = milestones.find(m => 
      scroll_percentage >= m && scroll_percentage < m + 5
    );

    if (milestone) {
      const event: UserBehaviorEvent = {
        event_name: 'scroll_depth',
        event_category: 'engagement',
        event_action: 'scroll',
        value: milestone,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        custom_parameters: {
          scroll_percentage: milestone,
          page_section
        }
      };

      this.sendEvent(event);
      this.backupToSupabase('scroll_depth', event.custom_parameters);
    }
  }

  // Exit Intent 추적
  public trackExitIntent(page_section?: string, time_on_page?: number): void {
    const event: UserBehaviorEvent = {
      event_name: 'exit_intent',
      event_category: 'engagement',
      event_action: 'exit',
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      custom_parameters: {
        page_section,
        time_on_page,
        exit_type: 'mouse_leave'
      }
    };

    this.sendEvent(event);
    this.backupToSupabase('exit_intent', event.custom_parameters);
  }

  // 폼 에러 추적
  public trackFormError(form_name: string, field_name: string, error_message: string): void {
    const event: UserBehaviorEvent = {
      event_name: 'form_error',
      event_category: 'error',
      event_action: 'submit',
      event_label: `${form_name}_${field_name}`,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      custom_parameters: {
        form_name,
        field_name,
        error_message,
        error_type: 'validation'
      }
    };

    this.sendEvent(event);
    this.backupToSupabase('form_error', event.custom_parameters);
  }

  // 성능 메트릭 추적
  public trackPerformance(metric_name: string, duration: number, page_url?: string): void {
    const event: PerformanceEvent = {
      event_name: 'page_load',
      performance_metric: metric_name,
      duration,
      page_url: page_url || window.location.pathname
    };

    if (this.isInitialized && window.gtag) {
      window.gtag('event', 'page_timing', {
        event_category: 'Performance',
        event_label: metric_name,
        value: Math.round(duration),
        custom_parameters: {
          metric_name,
          duration,
          page_url: event.page_url
        }
      });
    }
  }

  // A/B 테스트 변형 추적
  public trackABTestVariant(test_name: string, variant: string, user_group?: string): void {
    const event: UserBehaviorEvent = {
      event_name: 'page_view',
      event_category: 'engagement',
      event_action: 'view',
      event_label: `ab_test_${test_name}`,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      custom_parameters: {
        ab_test_name: test_name,
        ab_test_variant: variant,
        user_group,
        test_type: 'ab_test'
      }
    };

    this.sendEvent(event);
    this.backupToSupabase('ab_test_view', event.custom_parameters);
  }

  // GA4로 이벤트 전송
  private sendEvent(event: UserBehaviorEvent): void {
    if (this.isInitialized && window.gtag) {
      window.gtag('event', event.event_name, {
        event_category: event.event_category,
        event_label: event.event_label,
        value: event.value,
        session_id: this.sessionId,
        user_id: this.userId,
        custom_parameters: event.custom_parameters
      });
    }

    // 개발 환경에서 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  }

  // GA4로 전환 이벤트 전송
  private sendConversionEvent(event: ConversionEvent): void {
    if (this.isInitialized && window.gtag) {
      window.gtag('event', event.event_name, {
        event_category: 'conversion',
        value: event.conversion_value,
        currency: event.conversion_currency,
        session_id: this.sessionId,
        user_id: this.userId,
        user_properties: event.user_properties
      });
    }
  }

  // Supabase에 백업 저장 (선택적)
  private async backupToSupabase(event_type: string, event_data: any): Promise<void> {
    if (!this.supabaseBackup) return;

    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          event_type,
          event_data,
          page_url: window.location.pathname,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to backup analytics data to Supabase');
      }
    } catch (error) {
      console.warn('Error backing up analytics data:', error);
    }
  }

  // 이메일 마스킹 (개인정보 보호)
  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    const maskedLocal = local.length > 2 
      ? local.substring(0, 2) + '*'.repeat(local.length - 2)
      : local;
    return `${maskedLocal}@${domain}`;
  }

  // 세션 정보 가져오기
  public getSessionInfo(): { sessionId: string; userId?: string; isInitialized: boolean } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      isInitialized: this.isInitialized
    };
  }
}

// React 훅들
export function useScrollTracking() {
  const analytics = AnalyticsManager.getInstance();

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = Math.round((scrollTop / docHeight) * 100);
          
          analytics.trackScrollDepth(scrollPercent);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [analytics]);
}

export function useExitIntentTracking() {
  const analytics = AnalyticsManager.getInstance();

  React.useEffect(() => {
    let startTime = Date.now();
    let hasTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        hasTriggered = true;
        const timeOnPage = Date.now() - startTime;
        analytics.trackExitIntent(undefined, timeOnPage);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [analytics]);
}

// 편의 함수들
const analytics = AnalyticsManager.getInstance();

export const trackPageView = (path: string, title?: string) => 
  analytics.trackPageView(path, title);

export const trackDemoStart = (persona?: string, inputLength?: number) => 
  analytics.trackDemoStart(persona, inputLength);

export const trackDemoComplete = (persona?: string, inputLength?: number, outputLength?: number, improvementRatio?: number) => 
  analytics.trackDemoComplete(persona, inputLength, outputLength, improvementRatio);

export const trackPreRegistration = (email: string, persona?: string, source?: string) => 
  analytics.trackPreRegistration(email, persona, source);

export const trackPersonaSelect = (persona: string, previousPersona?: string) => 
  analytics.trackPersonaSelect(persona, previousPersona);

export const trackCTAClick = (ctaText: string, ctaLocation: string, pageSection?: string) => 
  analytics.trackCTAClick(ctaText, ctaLocation, pageSection);

export const trackFormError = (form: string, field: string, error: string) => 
  analytics.trackFormError(form, field, error);

export const trackPerformance = (metric: string, duration: number, pageUrl?: string) => 
  analytics.trackPerformance(metric, duration, pageUrl);

export const trackABTestVariant = (testName: string, variant: string, userGroup?: string) => 
  analytics.trackABTestVariant(testName, variant, userGroup);

export default AnalyticsManager; 
} 