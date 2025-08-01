import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required');
}

if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export interface User {
    id: string;
    email: string;
    user_metadata?: {
        display_name?: string;
        avatar_url?: string;
    };
}

// 개선된 사전 등록 인터페이스
export interface PreRegistration {
    id?: string;
    email: string;
    name?: string;
    persona: 'pm' | 'creator' | 'startup' | 'developer' | 'marketer' | 'other';
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
    ip_address?: string;
    user_agent?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserFeedback {
    id?: string;
    user_id?: string;
    email?: string;
    feedback_type: 'feature_request' | 'bug_report' | 'general';
    message: string;
    created_at?: string;
}

// 인증 관련 함수들
export const auth = {
    // 현재 사용자 가져오기
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error getting current user:', error);
            return null;
        }
        return user;
    },

    // 이메일/비밀번호로 회원가입
    signUp: async (email: string, password: string, metadata?: any) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) {
            console.error('Error signing up:', error);
            return { user: null, error };
        }

        return { user: data.user, error: null };
    },

    // 이메일/비밀번호로 로그인
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Error signing in:', error);
            return { user: null, error };
        }

        return { user: data.user, error: null };
    },

    // 로그아웃
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
            return { error };
        }
        return { error: null };
    },

    // 인증 상태 변경 리스너
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
        return supabase.auth.onAuthStateChange(callback);
    }
};

// 데이터베이스 관련 함수들
export const database = {
    // 사전 등록 추가 - 개선된 버전
    addPreRegistration: async (preRegistration: Omit<PreRegistration, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            // 데이터 검증 및 정리
            const cleanData = {
                email: preRegistration.email.toLowerCase().trim(),
                name: preRegistration.name?.trim() || null,
                persona: preRegistration.persona,
                company: preRegistration.company?.trim() || null,
                company_size: preRegistration.company_size || null,
                use_case: preRegistration.use_case?.trim() || null,
                referral_source: preRegistration.referral_source || null,
                marketing_consent: preRegistration.marketing_consent || false,
                newsletter_consent: preRegistration.newsletter_consent || false,
                beta_interest: preRegistration.beta_interest || true,
                expected_usage: preRegistration.expected_usage || null,
                current_tools: preRegistration.current_tools || [],
                pain_points: preRegistration.pain_points || [],
                platform_preference: preRegistration.platform_preference || null,
                ip_address: preRegistration.ip_address || null,
                user_agent: preRegistration.user_agent || null,
                utm_source: preRegistration.utm_source || null,
                utm_medium: preRegistration.utm_medium || null,
                utm_campaign: preRegistration.utm_campaign || null,
            };

            const { data, error } = await supabase
                .from('pre_registrations')
                .insert([cleanData])
                .select()
                .single();

            if (error) {
                console.error('Error adding pre-registration:', error);
                return { data: null, error };
            }

            return { data, error: null };
        } catch (err) {
            console.error('Unexpected error in addPreRegistration:', err);
            return { data: null, error: err };
        }
    },

    // 사전 등록 조회
    getPreRegistrations: async (email?: string) => {
        let query = supabase.from('pre_registrations').select('*');

        if (email) {
            query = query.eq('email', email.toLowerCase().trim());
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error getting pre-registrations:', error);
            return { data: [], error };
        }

        return { data: data || [], error: null };
    },

    // 피드백 추가
    addFeedback: async (feedback: Omit<UserFeedback, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('user_feedback')
            .insert([feedback])
            .select()
            .single();

        if (error) {
            console.error('Error adding feedback:', error);
            return { data: null, error };
        }

        return { data, error: null };
    },

    // 피드백 조회
    getFeedback: async (userId?: string) => {
        let query = supabase.from('user_feedback').select('*');

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error getting feedback:', error);
            return { data: [], error };
        }

        return { data: data || [], error: null };
    },

    // 이메일 중복 확인
    checkEmailExists: async (email: string) => {
        const { data, error } = await supabase
            .from('pre_registrations')
            .select('email')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error checking email:', error);
            return { exists: false, error };
        }

        return { exists: !!data, error: null };
    },

    // 통계 조회
    getRegistrationStats: async () => {
        try {
            const { data, error } = await supabase
                .from('pre_registrations')
                .select('persona, company_size, referral_source, created_at')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error getting registration stats:', error);
                return { data: null, error };
            }

            // 기본 통계 계산
            const stats = {
                total: data.length,
                byPersona: data.reduce((acc, reg) => {
                    acc[reg.persona] = (acc[reg.persona] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
                byCompanySize: data.reduce((acc, reg) => {
                    if (reg.company_size) {
                        acc[reg.company_size] = (acc[reg.company_size] || 0) + 1;
                    }
                    return acc;
                }, {} as Record<string, number>),
                byReferralSource: data.reduce((acc, reg) => {
                    if (reg.referral_source) {
                        acc[reg.referral_source] = (acc[reg.referral_source] || 0) + 1;
                    }
                    return acc;
                }, {} as Record<string, number>),
                recentRegistrations: data.slice(0, 10),
            };

            return { data: stats, error: null };
        } catch (err) {
            console.error('Unexpected error in getRegistrationStats:', err);
            return { data: null, error: err };
        }
    }
};

// 실시간 구독 관련 함수들
export const realtime = {
    // 사전 등록 실시간 구독
    subscribeToPreRegistrations: (callback: (payload: any) => void) => {
        return supabase
            .channel('pre_registrations')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'pre_registrations'
                },
                callback
            )
            .subscribe();
    },

    // 피드백 실시간 구독
    subscribeToFeedback: (callback: (payload: any) => void) => {
        return supabase
            .channel('user_feedback')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_feedback'
                },
                callback
            )
            .subscribe();
    }
};

// 유틸리티 함수들
export const utils = {
    // 테이블 존재 확인
    checkConnection: async () => {
        try {
            const { data, error } = await supabase.from('pre_registrations').select('count').limit(1);
            return { connected: !error, error };
        } catch (err) {
            return { connected: false, error: err };
        }
    },

    // 환경변수 확인
    checkConfig: () => {
        const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
        const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        return {
            configured: hasUrl && hasKey,
            missing: {
                url: !hasUrl,
                key: !hasKey
            }
        };
    }
};

export default supabase;