import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// 클라이언트용 Supabase 인스턴스
export const supabaseClient = createClient(
    env.client.NEXT_PUBLIC_SUPABASE_URL,
    env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 서버용 Supabase 인스턴스 (Service Role Key 사용)
export const supabaseAdmin = env.server.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        env.client.NEXT_PUBLIC_SUPABASE_URL,
        env.server.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
    : null;

// 기본 export (기존 supabase.ts와의 호환성을 위해)
export default supabaseClient; 