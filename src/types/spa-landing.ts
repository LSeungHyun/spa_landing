export interface PersonaType {
    id: 'pm' | 'creator' | 'startup';
    title: string;
    description: string;
    icon: string;
}

export interface DiffHighlight {
    type: 'added' | 'removed';
    text: string;
}

export interface ProcessingStep {
    label: string;
    duration: number; // ms
    description: string;
}

export interface StaticScenario {
    inputExample: string;
    original: string;
    enhanced: string;
    highlights: {
        type: 'structure' | 'add' | 'improve';
        content: string;
        explanation: string;
    }[];
}

export interface GeminiAIResult {
    userInput: string;
    personalizedResult: {
        enhanced: string;
        highlights: DiffHighlight[];
        explanation: string;
        confidence: number;
    };
}

export interface SPALandingState {
    selectedPersona: PersonaType;
    currentScenarioIndex: number;
    isEnhancing: boolean;
    enhancedOutput: string;
    isPreRegistrationOpen: boolean;
    userInput: string;
    isProcessing: boolean;
    result: GeminiAIResult | null;
    showEmailModal: boolean;
}

// 개선된 사전 등록 폼 데이터
export interface PreRegistrationFormData {
    email: string;
    name?: string;
    persona: 'pm' | 'creator' | 'startup';
    company?: string;
    company_size?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+' | 'freelancer';
    use_case?: string;
    referral_source?: 'google' | 'social_media' | 'friend' | 'blog' | 'ad' | 'other';
    marketing_consent: boolean;
    newsletter_consent: boolean;
    beta_interest: boolean;
    expected_usage?: 'daily' | 'weekly' | 'monthly' | 'occasionally';
    current_tools?: string[];
    pain_points?: string[];
    platform_preference?: 'web' | 'mobile' | 'both' | 'api';
}

// 데이터베이스 레코드 타입
export interface PreRegistrationRecord extends PreRegistrationFormData {
    id: string;
    status: 'registered' | 'contacted' | 'beta_invited' | 'onboarded';
    notes?: string;
    ip_address?: string;
    user_agent?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    created_at: string;
    updated_at: string;
}

// 데모 사용 통계
export interface DemoUsageRecord {
    id: string;
    session_id: string;
    email?: string;
    prompt_input: string;
    prompt_improved?: string;
    improvement_count: number;
    persona_used?: string;
    satisfaction_rating?: number;
    converted_to_registration: boolean;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

// 사용자 이벤트 추적
export interface UserEventRecord {
    id: string;
    session_id: string;
    email?: string;
    event_type: 'page_view' | 'demo_start' | 'demo_complete' | 'pre_register_start' | 
                'pre_register_complete' | 'email_click' | 'cta_click' | 'scroll_depth';
    event_data?: Record<string, any>;
    page_url?: string;
    referrer?: string;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

// API 응답 타입
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// 레거시 지원을 위한 타입
export interface FormData {
    email: string;
    name?: string;
    organization?: string;
    role?: string;
}

// 사전 등록 응답 타입
export interface PreRegistrationResponse {
    id: string;
    email: string;
    persona: string;
    created_at: string;
} 