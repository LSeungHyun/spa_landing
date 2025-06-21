-- SPA Landing Page를 위한 Supabase 테이블 구조

-- 개선된 사전 등록 테이블
CREATE TABLE IF NOT EXISTS pre_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    persona VARCHAR(50) NOT NULL CHECK (
        persona IN ('pm', 'creator', 'startup', 'developer', 'marketer', 'other')
    ),
    company VARCHAR(100),
    company_size VARCHAR(20) CHECK (
        company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+', 'freelancer')
    ),
    use_case TEXT,
    referral_source VARCHAR(50) CHECK (
        referral_source IN ('google', 'social_media', 'friend', 'blog', 'ad', 'other')
    ),
    marketing_consent BOOLEAN DEFAULT false,
    newsletter_consent BOOLEAN DEFAULT false,
    beta_interest BOOLEAN DEFAULT true,
    expected_usage VARCHAR(20) CHECK (
        expected_usage IN ('daily', 'weekly', 'monthly', 'occasionally')
    ),
    current_tools TEXT[], -- 현재 사용 중인 도구들
    pain_points TEXT[], -- 주요 고민 사항들
    platform_preference VARCHAR(20) CHECK (
        platform_preference IN ('web', 'mobile', 'both', 'api')
    ),
    status VARCHAR(20) DEFAULT 'registered' CHECK (
        status IN ('registered', 'contacted', 'beta_invited', 'onboarded')
    ),
    notes TEXT, -- 관리자 노트
    ip_address INET,
    user_agent TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
CREATE INDEX IF NOT EXISTS idx_pre_registrations_email ON pre_registrations(email);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_persona ON pre_registrations(persona);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_status ON pre_registrations(status);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_created_at ON pre_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_utm_source ON pre_registrations(utm_source);

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
ALTER TABLE pre_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- 사전 등록 테이블 정책
CREATE POLICY "Anyone can insert pre_registrations" ON pre_registrations 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view pre_registrations" ON pre_registrations 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update pre_registrations" ON pre_registrations 
FOR UPDATE USING (auth.role() = 'authenticated');

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

-- 업데이트 트리거 적용
DROP TRIGGER IF EXISTS update_pre_registrations_updated_at ON pre_registrations;
CREATE TRIGGER update_pre_registrations_updated_at 
    BEFORE UPDATE ON pre_registrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 분석을 위한 뷰 생성
CREATE OR REPLACE VIEW registration_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    persona,
    company_size,
    referral_source,
    COUNT(*) as registrations,
    COUNT(CASE WHEN marketing_consent THEN 1 END) as marketing_consents,
    COUNT(CASE WHEN newsletter_consent THEN 1 END) as newsletter_consents
FROM pre_registrations 
GROUP BY DATE_TRUNC('day', created_at), persona, company_size, referral_source
ORDER BY date DESC;

-- 실시간 구독을 위한 publication 생성 (선택사항)
-- CREATE PUBLICATION spa_realtime FOR TABLE pre_registrations, user_feedback, demo_usage, user_events;