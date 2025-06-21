-- SPA Landing Page를 위한 Supabase 테이블 구조

-- 요청된 사양에 맞는 사전 등록 테이블
CREATE TABLE IF NOT EXISTS pre_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name_or_nickname TEXT,
    expected_feature TEXT NOT NULL CHECK (
        expected_feature IN ('AI 논문 요약', 'ChatGPT 플러그인 추천', '템플릿 자동 생성')
    ),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_pre_registrations_email ON pre_registrations(email);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_registered_at ON pre_registrations(registered_at);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE pre_registrations ENABLE ROW LEVEL SECURITY;

-- 익명 사용자도 삽입 가능하도록 정책 설정
CREATE POLICY "Anyone can insert pre_registrations" ON pre_registrations 
FOR INSERT WITH CHECK (true);

-- 인증된 사용자만 조회 가능
CREATE POLICY "Authenticated users can view pre_registrations" ON pre_registrations 
FOR SELECT USING (auth.role() = 'authenticated');

-- 사용자 피드백 테이블
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    feedback_type VARCHAR(50) NOT NULL CHECK (
        feedback_type IN (
            'feature_request',
            'bug_report',
            'general',
            'improvement_suggestion'
        )
    ),
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 데모 사용 통계 테이블
CREATE TABLE IF NOT EXISTS demo_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    email VARCHAR(255), -- 사전 등록한 경우
    prompt_input TEXT NOT NULL,
    prompt_improved TEXT,
    improvement_count INTEGER DEFAULT 1,
    persona_used VARCHAR(50),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    converted_to_registration BOOLEAN DEFAULT false,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이벤트 추적 테이블
CREATE TABLE IF NOT EXISTS user_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    email VARCHAR(255), -- 사전 등록한 경우
    event_type VARCHAR(50) NOT NULL CHECK (
        event_type IN (
            'page_view', 'demo_start', 'demo_complete', 'pre_register_start', 
            'pre_register_complete', 'email_click', 'cta_click', 'scroll_depth'
        )
    ),
    event_data JSONB, -- 이벤트 관련 추가 데이터
    page_url TEXT,
    referrer TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_email ON user_feedback(email);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);

CREATE INDEX IF NOT EXISTS idx_demo_usage_session_id ON demo_usage(session_id);
CREATE INDEX IF NOT EXISTS idx_demo_usage_email ON demo_usage(email);
CREATE INDEX IF NOT EXISTS idx_demo_usage_created_at ON demo_usage(created_at);

CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_email ON user_events(email);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- 피드백 테이블 정책
CREATE POLICY "Anyone can insert feedback" ON user_feedback 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own feedback" ON user_feedback 
FOR SELECT USING (
    auth.uid() = user_id OR 
    email = auth.jwt() ->> 'email' OR
    auth.role() = 'authenticated'
);

-- 데모 사용 통계 정책
CREATE POLICY "Anyone can insert demo_usage" ON demo_usage 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view demo_usage" ON demo_usage 
FOR SELECT USING (auth.role() = 'authenticated');

-- 이벤트 추적 정책
CREATE POLICY "Anyone can insert user_events" ON user_events 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view user_events" ON user_events 
FOR SELECT USING (auth.role() = 'authenticated');

-- 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 분석을 위한 뷰 생성
CREATE OR REPLACE VIEW registration_analytics AS
SELECT 
    DATE_TRUNC('day', registered_at) as date,
    expected_feature,
    COUNT(*) as registrations
FROM pre_registrations 
GROUP BY DATE_TRUNC('day', registered_at), expected_feature
ORDER BY date DESC;

-- 실시간 구독을 위한 publication 생성 (선택사항)
-- CREATE PUBLICATION spa_realtime FOR TABLE pre_registrations, user_feedback, demo_usage, user_events;