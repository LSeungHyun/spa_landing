# 🚀 Smart Prompt Assistant - SPA Landing Page

AI 기반 스마트 프롬프트 어시스턴트의 인터랙티브 랜딩페이지입니다. 사용자의 "빈 페이지 증후군"을 해결하고 AI를 활용한 고품질 프롬프트 생성을 제공합니다.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com/)

## 📋 프로젝트 개요

### 🎯 미션
사용자가 AI와 상호작용할 때 겪는 "빈 페이지 증후군"을 해결하고, 효과적인 프롬프트 작성을 돕는 인터랙티브 랜딩페이지를 제공합니다.

### ✨ 핵심 기능
- **🤖 AI 프롬프트 생성**: Gemini AI 기반 고품질 프롬프트 자동 생성
- **👥 페르소나 기반 최적화**: 9가지 직업군별 맞춤형 프롬프트
- **🔒 IP 기반 사용 제한**: 하루 3회 사용 제한으로 서비스 안정성 보장
- **⚡ 실시간 처리**: 단계별 진행 상황 표시 및 실시간 피드백
- **📱 반응형 디자인**: 모바일 우선 설계로 모든 디바이스 지원

## 🏗️ 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** (Strict Mode)
- **Tailwind CSS** (Design System)
- **Framer Motion** (Animations)
- **shadcn/ui** (UI Components)

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage)
- **Google Gemini API** (AI 프롬프트 생성)
- **Vercel** (Deployment & Edge Functions)
- **Redis/Upstash** (Caching - Optional)

### Development Tools
- **ESLint** + **Prettier** (Code Quality)
- **Jest** (Testing)
- **TypeScript** (Type Safety)

## 🚀 빠른 시작

### 1. 프로젝트 클론
```bash
git clone https://github.com/your-username/spa_landing.git
cd spa_landing
```

### 2. 의존성 설치
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. 환경변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini AI API 설정
GEMINI_API_KEY=your_gemini_api_key

# Redis 설정 (선택사항 - 성능 최적화)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 4. 개발 서버 실행
```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 📊 시스템 아키텍처

### IP 기반 사용 제한 시스템
```
사용자 요청 → IP 추출 → 사용량 확인 → AI 처리 → 응답 반환
     ↓           ↓         ↓        ↓       ↓
  Middleware → Supabase → Cache → Gemini → Client
```

### 데이터베이스 스키마
```sql
-- IP 사용 제한 테이블
CREATE TABLE ip_usage_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ip_address TEXT NOT NULL UNIQUE,
    usage_count INTEGER NOT NULL DEFAULT 0,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📚 프로젝트 문서

### 📋 기획 문서
- **[PRD 문서](./docs/md_list/prd-final-smart-prompt-landing.md)** - 프로젝트 요구사항 정의서
- **[랜딩페이지 종합 가이드](./docs/md_list/landing-page-comprehensive-guide.md)** - 상세 구현 가이드
- **[디자인 가이드](./docs/md_list/design.md)** - UI/UX 설계 문서

### 🔧 기술 문서
- **[빌드 오류 해결 가이드](./docs/md_list/build-error-resolution.md)** - 빌드 이슈 해결 방법
- **[Vercel 배포 가이드](./docs/md_list/vercel-deployment-guide.md)** - 배포 설정 및 트러블슈팅
- **[UI 개선 사항](./docs/md_list/ui-improvements.md)** - UI/UX 개선 계획

### 📝 TODO 및 작업 관리
- **[TODO 문서 표준](./docs/md_list/todo-document-standards.md)** - Enhanced v2.0 표준 규칙
- **[샘플 TODO 문서](./docs/todo_list/sample-project-todo.md)** - 표준 적용 예시
- **[완료된 프로젝트](./docs/todo_list/end_todo/)** - 완료된 작업들

### 📊 분석 및 모니터링
- **[분석 매뉴얼](./docs/md_list/ANALYTICS_MANUAL.md)** - 사용자 행동 분석
- **[버그 리포트](./docs/md_list/bug.md)** - 알려진 이슈 및 해결 방법

## 🎯 주요 성과

### ✅ 완료된 주요 기능들
- **AI 채팅 API 연동** (100% 완료) - Gemini 2.0/2.5 Flash 모델 적용
- **사용 제한 시스템** - IP 기반 하루 3회 제한
- **실시간 상태 동기화** - 서버-클라이언트 사용량 동기화
- **페르소나 기반 최적화** - 9가지 직업군별 프롬프트 맞춤화
- **반응형 디자인** - 모바일 우선 설계

### 📈 성능 지표
- **응답률**: >95% (목표 달성)
- **응답시간**: <2초 (목표 달성)
- **사용자 만족도**: 높은 프롬프트 품질로 사용자 경험 개선
- **비용 효율성**: 무료 서비스로 모든 기능 제공

## 🛠️ 개발 가이드

### 프로젝트 구조
```
spa_landing/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── components/          # React 컴포넌트
│   │   │   ├── sections/        # 페이지 섹션 컴포넌트
│   │   │   ├── shared/          # 공통 컴포넌트
│   │   │   ├── ui/              # UI 기본 컴포넌트
│   │   │   └── demo/            # 데모 컴포넌트
│   │   ├── hooks/               # Custom React Hooks
│   │   ├── lib/                 # 유틸리티 함수
│   │   └── types/               # TypeScript 타입 정의
│   ├── docs/                    # 프로젝트 문서
│   │   ├── md_list/             # 마크다운 문서들
│   │   └── todo_list/           # TODO 관리
│   ├── public/                  # 정적 파일
│   └── 설정 파일들
```

### 개발 규칙
- **TypeScript Strict Mode** 사용
- **ESLint + Prettier** 코드 품질 관리
- **Mobile-First** 반응형 디자인
- **Component-Driven Development** 컴포넌트 중심 개발

## 🚀 배포

### Vercel 배포
1. GitHub 연동 후 자동 배포
2. 환경변수 설정 (Vercel Dashboard)
3. 도메인 설정 및 SSL 인증서 자동 적용

### 배포 전 체크리스트
- [ ] 환경변수 모두 설정됨
- [ ] Supabase 데이터베이스 마이그레이션 완료
- [ ] API 키 유효성 확인
- [ ] 빌드 오류 없음
- [ ] 테스트 통과

## 📊 최근 업데이트 (2025.06.30)

### 🔄 TODO 문서 표준화 (Enhanced v2.0)
- **핵심 개선사항**: 불필요한 항목들 제거하여 실용성 향상
- **제거된 항목들**: 예상 완료일, 담당자, 예상 소요시간 등
- **유지된 기능들**: 자동 날짜 기록, 진행률 계산, 상태 추적
- **새로운 샘플 문서**: 간소화된 표준 적용 예시

### 📚 문서 정리
- AI 채팅 API 연동 프로젝트 완료 → `end_todo/` 디렉토리로 이동
- TODO 문서 표준 규칙 대폭 개선
- 실시간 정확성과 자동화 기능 강화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 환경 설정
```bash
# 개발 의존성 설치
npm install

# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 테스트 실행
npm test
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🔗 유용한 링크

- **[Next.js 문서](https://nextjs.org/docs)** - Next.js 기능 및 API
- **[Supabase 문서](https://supabase.com/docs)** - 백엔드 서비스 가이드
- **[Tailwind CSS](https://tailwindcss.com/docs)** - 스타일링 프레임워크
- **[Google AI Studio](https://aistudio.google.com/)** - Gemini API 관리

## 💡 문의 및 지원

프로젝트에 대한 질문이나 제안사항이 있으시면 GitHub Issues를 통해 연락주세요.

---

**Made with ❤️ by Smart Prompt Assistant Team**
