# SPA Landing Pages

Smart Prompt Assistant의 다양한 기능을 소개하는 랜딩페이지 모음입니다.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📋 PRD 문서

프로젝트의 기획 문서들은 `docs/` 디렉토리에서 확인할 수 있습니다:

- [스마트 프롬프트 어시스턴트 인터랙티브 랜딩페이지 PRD](./docs/prd-final-smart-prompt-landing.md)
- [사용 제한 구현 가이드](./docs/usage-limit-implementation-todo.md)

## 🚀 주요 기능

### IP 기반 사용 제한 시스템
- **3회/일 사용 제한**: 각 IP 주소당 하루 3회까지 AI 프롬프트 생성 가능
- **서버-클라이언트 동기화**: 실시간 사용 현황 동기화 및 불일치 감지
- **자동 롤백**: API 실패 시 사용 횟수 자동 복구
- **Redis 캐싱**: 성능 최적화를 위한 캐시 시스템 (선택사항)

### AI 프롬프트 생성
- **Gemini AI 통합**: Google Gemini API를 통한 고품질 프롬프트 생성
- **페르소나 기반**: 9가지 직업군별 맞춤형 프롬프트 최적화
- **실시간 처리**: 단계별 진행 상황 표시

## ⚙️ 환경 설정

### 필수 환경변수

다음 환경변수들을 `.env.local` 파일에 설정해주세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://mtowbsogtkpxvysnbdau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b3dic29ndGtweHZ5c25iZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDgxODQsImV4cCI6MjA2NTgyNDE4NH0.pLu1dN6nMzEfm-zrHjPn4natPoN5sARvvKzsNXnIh_I
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Gemini AI API 설정
GEMINI_API_KEY=your_gemini_api_key_here
```

### 선택적 환경변수 (성능 최적화)

```bash
# Redis/Upstash 설정 (캐싱을 통한 성능 향상)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here
```

### API 키 발급 방법

1. **Gemini API 키**: [Google AI Studio](https://aistudio.google.com/app/apikey)에서 발급
2. **Supabase Service Role Key**: Supabase 프로젝트 설정 > API > service_role 키 복사
3. **Upstash Redis** (선택사항): [Upstash Console](https://console.upstash.com/)에서 Redis 데이터베이스 생성

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 위의 환경변수들을 설정합니다.

### 3. 개발 서버 실행

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

## 📊 데이터베이스 스키마

### ip_usage_limits 테이블

```sql
CREATE TABLE ip_usage_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ip_address TEXT NOT NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE UNIQUE INDEX idx_ip_usage_limits_ip ON ip_usage_limits(ip_address);
CREATE INDEX idx_ip_usage_limits_last_used ON ip_usage_limits(last_used_at);
```

### PostgreSQL 함수들

- `check_ip_usage_limit(ip_address TEXT)`: 사용 제한 확인
- `increment_ip_usage(ip_address TEXT)`: 사용 횟수 증가
- `rollback_ip_usage(ip_address TEXT)`: 사용 횟수 롤백
- `cleanup_old_ip_usage_records()`: 만료된 레코드 정리

## 🔧 주요 컴포넌트

### 사용 제한 관련
- `useUsageLimitSync`: 서버-클라이언트 동기화 훅
- `UsageIndicator`: 사용 현황 표시 컴포넌트
- `usageLimitService`: 사용 제한 서비스 함수들

### API 라우트
- `/api/generate`: AI 프롬프트 생성
- `/api/improve-prompt`: 프롬프트 개선
- `/api/usage-limit/check`: 사용 제한 상태 확인

## 🚀 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경변수 설정 (Dashboard > Settings > Environment Variables)
3. 자동 배포 완료

### 환경변수 설정 확인

배포 전 다음 사항들을 확인해주세요:

- [ ] GEMINI_API_KEY 설정됨
- [ ] SUPABASE_SERVICE_ROLE_KEY 설정됨
- [ ] Supabase 데이터베이스 마이그레이션 완료
- [ ] RLS 정책 활성화됨

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.
