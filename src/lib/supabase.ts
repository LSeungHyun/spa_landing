import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtowbsogtkpxvysnbdau.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b3dic29ndGtweHZ5c25iZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDgxODQsImV4cCI6MjA2NTgyNDE4NH0.pLu1dN6nMzEfm-zrHjPn4natPoN5sARvvKzsNXnIh_I';

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

export interface PreRegistration {
    id?: string;
    email: string;
    persona: 'pm' | 'creator' | 'startup';
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
    // 사전 등록 추가
    addPreRegistration: async (preRegistration: Omit<PreRegistration, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
            .from('pre_registrations')
            .insert([preRegistration])
            .select()
            .single();

        if (error) {
            console.error('Error adding pre-registration:', error);
            return { data: null, error };
        }

        return { data, error: null };
    },

    // 사전 등록 조회
    getPreRegistrations: async (email?: string) => {
        let query = supabase.from('pre_registrations').select('*');

        if (email) {
            query = query.eq('email', email);
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
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error checking email:', error);
            return { exists: false, error };
        }

        return { exists: !!data, error: null };
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