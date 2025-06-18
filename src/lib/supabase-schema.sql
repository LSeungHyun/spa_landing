-- SPA Landing Page를 위한 Supabase 테이블 구조

-- 사전 등록 테이블
CREATE TABLE IF NOT EXISTS pre_registrations (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    persona VARCHAR(50) NOT NULL CHECK (
        persona IN ('pm', 'creator', 'startup')
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- 사용자 피드백 테이블
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    email VARCHAR(255),
    feedback_type VARCHAR(50) NOT NULL CHECK (
        feedback_type IN (
            'feature_request',
            'bug_report',
            'general'
        )
    ),
    message TEXT NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_pre_registrations_email ON pre_registrations (email);

CREATE INDEX IF NOT EXISTS idx_pre_registrations_persona ON pre_registrations (persona);

CREATE INDEX IF NOT EXISTS idx_pre_registrations_created_at ON pre_registrations (created_at);

CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback (user_id);

CREATE INDEX IF NOT EXISTS idx_user_feedback_email ON user_feedback (email);

CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback (created_at);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE pre_registrations ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- 사전 등록 테이블 정책
-- 모든 사용자가 자신의 등록 정보를 생성할 수 있음
CREATE POLICY "Anyone can insert pre_registrations" ON pre_registrations FOR
INSERT
WITH
    CHECK (true);

-- 인증된 사용자만 조회 가능 (관리자용)
CREATE POLICY "Authenticated users can view pre_registrations" ON pre_registrations FOR
SELECT USING (
        auth.role () = 'authenticated'
    );

-- 피드백 테이블 정책
-- 모든 사용자가 피드백을 생성할 수 있음
CREATE POLICY "Anyone can insert feedback" ON user_feedback FOR
INSERT
WITH
    CHECK (true);

-- 사용자는 자신의 피드백만 조회 가능
CREATE POLICY "Users can view own feedback" ON user_feedback FOR
SELECT USING (
        auth.uid () = user_id
        OR email = auth.jwt () ->> 'email'
    );

-- 인증된 사용자는 모든 피드백 조회 가능 (관리자용)
CREATE POLICY "Authenticated users can view all feedback" ON user_feedback FOR
SELECT USING (
        auth.role () = 'authenticated'
    );

-- 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 적용
CREATE TRIGGER update_pre_registrations_updated_at 
    BEFORE UPDATE ON pre_registrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 실시간 구독을 위한 publication 생성 (선택사항)
-- CREATE PUBLICATION spa_realtime FOR TABLE pre_registrations, user_feedback;