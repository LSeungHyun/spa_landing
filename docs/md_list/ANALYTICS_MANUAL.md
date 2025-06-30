# 📊 Smart Prompt Assistant - 애널리틱스 데이터 확인 메뉴얼

## 🎯 개요

Smart Prompt Assistant 랜딩 페이지의 사용자 행동 데이터와 전환율 지표를 확인하는 방법을 안내합니다.

---

## 📋 목차

1. [애널리틱스 시스템 구조](#애널리틱스-시스템-구조)
2. [관리자 대시보드 접근](#관리자-대시보드-접근)
3. [주요 지표 확인 방법](#주요-지표-확인-방법)
4. [실시간 데이터 모니터링](#실시간-데이터-모니터링)
5. [데이터베이스 직접 조회](#데이터베이스-직접-조회)
6. [API 엔드포인트 활용](#api-엔드포인트-활용)
7. [트러블슈팅](#트러블슈팅)

---

## 🏗️ 애널리틱스 시스템 구조

### 데이터 수집 흐름
```
사용자 행동 → 클라이언트 추적 → API 전송 → Supabase 저장 → 대시보드 표시
```

### 주요 컴포넌트
- **클라이언트 추적**: `src/lib/analytics.ts`
- **API 엔드포인트**: `/api/analytics/track`
- **데이터베이스**: Supabase `user_analytics` 테이블
- **대시보드**: `/admin/dashboard`
- **분석 로직**: `src/lib/analytics-dashboard.ts`

---

## 🔐 관리자 대시보드 접근

### 1. URL 접근
```
https://your-domain.vercel.app/admin/dashboard
```

### 2. 대시보드 주요 섹션
- **📊 핵심 지표 카드**: 실시간 주요 KPI
- **📈 차트 영역**: 시간대별/일별 트렌드
- **👥 페르소나 분석**: 사용자 유형별 성과
- **🛣️ 사용자 여정**: 전환 경로 분석
- **🔬 A/B 테스트**: 실험 결과

### 3. 필터 옵션
- **기간 선택**: 1일, 7일, 30일
- **날짜 범위**: 커스텀 시작/종료일
- **자동 새로고침**: 30초 간격

---

## 📊 주요 지표 확인 방법

### 1. 핵심 KPI 지표

#### 🔢 기본 지표
```typescript
// 확인 가능한 기본 지표
{
  total_visitors: number;        // 총 방문자 수
  total_page_views: number;      // 총 페이지뷰
  demo_starts: number;           // 데모 시작 수
  demo_completions: number;      // 데모 완료 수
  pre_registrations: number;     // 사전 등록 수
}
```

#### 📈 전환율 지표
```typescript
// 전환율 계산 공식
{
  demo_start_rate: (demo_starts / total_visitors) * 100;
  demo_completion_rate: (demo_completions / demo_starts) * 100;
  registration_rate: (pre_registrations / demo_completions) * 100;
  overall_conversion_rate: (pre_registrations / total_visitors) * 100;
}
```

### 2. 시간대별 분석

#### 📅 일별 트렌드 확인
- **차트 위치**: 대시보드 중앙 "일별 방문자 및 전환율" 섹션
- **데이터 포함**: 방문자, 페이지뷰, 데모 시작/완료, 등록 수
- **기간**: 선택한 날짜 범위 내 일별 데이터

#### ⏰ 시간대별 패턴
- **차트 위치**: "시간대별 활동" 섹션
- **분석 포인트**: 
  - 피크 시간대 식별
  - 전환율이 높은 시간대
  - 사용자 활동 패턴

### 3. 페르소나별 성과

#### 👤 사용자 유형 분류
```typescript
type Persona = 'pm' | 'creator' | 'startup' | 'unknown';
```

#### 📊 페르소나별 지표
- **방문자 수**: 각 페르소나별 방문자
- **전환율**: 페르소나별 전환 성과
- **개선 비율**: 프롬프트 개선 효과 (해당 시)

---

## ⚡ 실시간 데이터 모니터링

### 1. 실시간 지표 확인

#### 🔴 라이브 메트릭
```typescript
// 실시간으로 확인 가능한 지표
{
  active_users: number;              // 현재 활성 사용자
  current_hour_visitors: number;     // 현재 시간 방문자
  current_hour_conversions: number;  // 현재 시간 전환 수
  live_conversion_rate: number;      // 실시간 전환율
}
```

#### 📈 트렌딩 이벤트
- **이벤트 타입별 증가율**: 전 시간 대비 성장률
- **인기 행동 패턴**: 사용자들이 가장 많이 하는 행동
- **실시간 알림**: 급격한 변화 감지

### 2. 자동 새로고침 설정
- **기본 주기**: 30초
- **수동 새로고침**: 새로고침 버튼 클릭
- **실시간 스트림**: SSE(Server-Sent Events) 활용

---

## 🗄️ 데이터베이스 직접 조회

### 1. Supabase 대시보드 접근
```
https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]
```

### 2. 주요 테이블 구조

#### `user_analytics` 테이블
```sql
-- 기본 구조
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 주요 이벤트 타입
```sql
-- 추적되는 이벤트들
'page_view'              -- 페이지 조회
'demo_start'             -- 데모 시작
'demo_complete'          -- 데모 완료
'pre_register_start'     -- 사전등록 시작
'pre_register_complete'  -- 사전등록 완료
'prompt_improve'         -- 프롬프트 개선
'scroll_depth'           -- 스크롤 깊이
'exit_intent'            -- 이탈 의도
```

### 3. 유용한 SQL 쿼리

#### 📊 기본 통계 조회
```sql
-- 일별 방문자 수
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as visitors,
  COUNT(*) as events
FROM user_analytics 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### 🔄 전환 깔때기 분석
```sql
-- 전환 단계별 사용자 수
WITH conversion_funnel AS (
  SELECT 
    session_id,
    MAX(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) as viewed,
    MAX(CASE WHEN event_type = 'demo_start' THEN 1 ELSE 0 END) as demo_started,
    MAX(CASE WHEN event_type = 'demo_complete' THEN 1 ELSE 0 END) as demo_completed,
    MAX(CASE WHEN event_type = 'pre_register_complete' THEN 1 ELSE 0 END) as registered
  FROM user_analytics
  WHERE created_at >= NOW() - INTERVAL '7 days'
  GROUP BY session_id
)
SELECT 
  SUM(viewed) as total_visitors,
  SUM(demo_started) as demo_starts,
  SUM(demo_completed) as demo_completions,
  SUM(registered) as registrations,
  ROUND(SUM(demo_started)::numeric / SUM(viewed) * 100, 2) as demo_start_rate,
  ROUND(SUM(registered)::numeric / SUM(viewed) * 100, 2) as overall_conversion_rate
FROM conversion_funnel;
```

#### 👥 페르소나별 성과
```sql
-- 페르소나별 전환율
SELECT 
  event_data->>'persona' as persona,
  COUNT(DISTINCT session_id) as visitors,
  SUM(CASE WHEN event_type = 'pre_register_complete' THEN 1 ELSE 0 END) as conversions,
  ROUND(
    SUM(CASE WHEN event_type = 'pre_register_complete' THEN 1 ELSE 0 END)::numeric / 
    COUNT(DISTINCT session_id) * 100, 2
  ) as conversion_rate
FROM user_analytics
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND event_data->>'persona' IS NOT NULL
GROUP BY event_data->>'persona'
ORDER BY conversion_rate DESC;
```

---

## 🔌 API 엔드포인트 활용

### 1. 대시보드 메트릭 API

#### 📊 기본 사용법
```javascript
// GET 요청
const response = await fetch('/api/dashboard/metrics?range=7d');
const data = await response.json();

console.log(data.data); // 대시보드 메트릭 데이터
```

#### 🔧 쿼리 파라미터
```typescript
interface QueryParams {
  range?: '1d' | '7d' | '30d';     // 기간 선택
  start_date?: string;              // 시작일 (ISO 8601)
  end_date?: string;                // 종료일 (ISO 8601)
}
```

#### 📝 응답 구조
```typescript
interface APIResponse {
  success: boolean;
  data: DashboardMetrics;
  meta: {
    range: string;
    start_date: string;
    end_date: string;
    generated_at: string;
    cache_duration: number;
  };
}
```

### 2. 실시간 메트릭 API

#### ⚡ 실시간 데이터 조회
```javascript
// 실시간 메트릭 조회
const response = await fetch('/api/dashboard/realtime');
const data = await response.json();

console.log(data.data.active_users); // 현재 활성 사용자
```

#### 📡 Server-Sent Events 구독
```javascript
// 실시간 스트림 구독
const eventSource = new EventSource('/api/dashboard/realtime');

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.type === 'metrics_update') {
    // 실시간 메트릭 업데이트 처리
    updateDashboard(data.data);
  }
};
```

### 3. 분석 이벤트 추적 API

#### 📤 이벤트 전송
```javascript
// 커스텀 이벤트 추적
await fetch('/api/analytics/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    event_type: 'custom_action',
    event_data: {
      action: 'button_click',
      button_id: 'cta-main',
      persona: 'pm'
    }
  })
});
```

---

## 🛠️ 트러블슈팅

### 1. 대시보드 접근 불가

#### 🚫 문제: 404 에러
```
해결방법:
1. URL 확인: /admin/dashboard 경로가 정확한지 확인
2. 빌드 상태: Next.js 빌드가 완료되었는지 확인
3. 라우팅: app/admin/dashboard/page.tsx 파일 존재 확인
```

#### 🔄 문제: 로딩 무한 대기
```
해결방법:
1. 네트워크 탭에서 API 요청 상태 확인
2. Supabase 연결 상태 확인
3. 환경 변수 설정 확인 (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
```

### 2. 데이터 표시 오류

#### 📊 문제: 차트가 표시되지 않음
```
해결방법:
1. recharts 라이브러리 설치 확인: npm install recharts
2. 브라우저 콘솔에서 JavaScript 에러 확인
3. 데이터 구조가 차트 컴포넌트와 일치하는지 확인
```

#### 🔢 문제: 잘못된 수치 표시
```
해결방법:
1. 데이터베이스 쿼리 로직 검토
2. 날짜 필터링 조건 확인
3. 중복 데이터 제거 로직 점검
```

### 3. 성능 이슈

#### 🐌 문제: 대시보드 로딩 속도 저하
```
해결방법:
1. 데이터베이스 인덱스 최적화
2. API 응답 캐싱 활용 (5분 캐시 설정됨)
3. 쿼리 최적화 및 불필요한 데이터 제거
```

#### 📈 문제: 실시간 업데이트 지연
```
해결방법:
1. 자동 새로고침 간격 조정 (기본 30초)
2. Server-Sent Events 연결 상태 확인
3. 네트워크 연결 상태 점검
```

### 4. 데이터 정확성 검증

#### ✅ 데이터 검증 체크리스트
```
1. 세션 ID 중복 제거 확인
2. 이벤트 타입 분류 정확성
3. 시간대 설정 (UTC vs 로컬 시간)
4. 전환율 계산 공식 검토
5. 페르소나 분류 로직 점검
```

---

## 📚 추가 리소스

### 🔗 관련 파일
- **대시보드 컴포넌트**: `src/app/admin/dashboard/page.tsx`
- **분석 로직**: `src/lib/analytics-dashboard.ts`
- **클라이언트 추적**: `src/lib/analytics.ts`
- **API 라우트**: `src/app/api/dashboard/`

### 📖 참고 문서
- [Supabase 대시보드](https://supabase.com/dashboard)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Recharts 문서](https://recharts.org/)
- [Vercel Analytics](https://vercel.com/analytics)

### 🆘 지원 요청
문제가 지속될 경우:
1. 브라우저 개발자 도구에서 에러 로그 수집
2. 네트워크 탭에서 실패한 API 요청 확인
3. Supabase 대시보드에서 데이터베이스 상태 점검
4. 해당 정보와 함께 기술 지원 요청

---

*분석 시스템 구축 완료*
*작성자: SPA Landing 개발팀* 