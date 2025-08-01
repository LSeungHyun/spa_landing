// 환경 변수 타입 정의 및 관리
interface ClientEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

interface ServerEnv {
    SUPABASE_SERVICE_ROLE_KEY?: string;
    GEMINI_API_KEY?: string;
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
}

// 클라이언트 환경 변수 (브라우저에서 접근 가능)
export const client: ClientEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};

// 클라이언트 환경 변수 검증
if (!client.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required');
}

if (!client.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required');
}

// 서버 환경 변수 (서버에서만 접근 가능)
export const server: ServerEnv = {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
};

// 환경 체크
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Redis 활성화 여부 체크
export const isRedisEnabled = !!(server.UPSTASH_REDIS_REST_URL && server.UPSTASH_REDIS_REST_TOKEN);

// 필수 환경변수 검증
export const validateRequiredEnvVars = () => {
    const missing: string[] = [];

    if (!server.GEMINI_API_KEY) {
        missing.push('GEMINI_API_KEY');
    }

    if (!server.SUPABASE_SERVICE_ROLE_KEY) {
        missing.push('SUPABASE_SERVICE_ROLE_KEY');
    }

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

// 통합 env 객체
export const env = {
    client,
    server,
    isDevelopment,
    isProduction,
    isRedisEnabled,
    validateRequiredEnvVars,
};