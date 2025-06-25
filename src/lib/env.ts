// 환경 변수 타입 정의 및 관리
interface ClientEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

interface ServerEnv {
    SUPABASE_SERVICE_ROLE_KEY?: string;
}

// 클라이언트 환경 변수 (브라우저에서 접근 가능)
export const client: ClientEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtowbsogtkpxvysnbdau.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b3dic29ndGtweHZ5c25iZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDgxODQsImV4cCI6MjA2NTgyNDE4NH0.pLu1dN6nMzEfm-zrHjPn4natPoN5sARvvKzsNXnIh_I',
};

// 서버 환경 변수 (서버에서만 접근 가능)
export const server: ServerEnv = {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// 환경 체크
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// 통합 env 객체
export const env = {
    client,
    server,
    isDevelopment,
    isProduction,
}; 