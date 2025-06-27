# 🚀 SPA Landing Vercel 배포 가이드

## 📋 목차
1. [배포 전 준비사항](#배포-전-준비사항)
2. [Vercel CLI를 통한 배포](#vercel-cli를-통한-배포)
3. [Vercel 대시보드를 통한 배포](#vercel-대시보드를-통한-배포)
4. [환경변수 설정](#환경변수-설정)
5. [도메인 설정](#도메인-설정)
6. [배포 후 확인사항](#배포-후-확인사항)
7. [트러블슈팅](#트러블슈팅)

## 🔧 배포 전 준비사항

### 1. 필수 환경변수 준비
다음 환경변수들을 미리 준비해주세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI 서비스 설정
GEMINI_API_KEY=your_gemini_api_key

# Redis 설정 (선택사항)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 2. 로컬 빌드 테스트
배포 전 로컬에서 빌드가 성공하는지 확인:

```bash
npm install
npm run build
npm start
```

### 3. Git 저장소 준비
코드가 Git 저장소에 커밋되어 있어야 합니다:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 🚀 Vercel CLI를 통한 배포

### 1. Vercel CLI 설치
```bash
npm install -g vercel
```

### 2. Vercel 로그인
```bash
vercel login
```

### 3. 프로젝트 배포
프로젝트 루트 디렉토리에서:

```bash
vercel
```

대화형 설정에서 다음과 같이 답변:
- `Set up and deploy?` → **Yes**
- `Which scope?` → 본인의 계정 선택
- `Link to existing project?` → **No** (첫 배포 시)
- `What's your project's name?` → `spa-landing` 또는 원하는 이름
- `In which directory is your code located?` → `./` (현재 디렉토리)

### 4. 프로덕션 배포
```bash
vercel --prod
```

## 🌐 Vercel 대시보드를 통한 배포

### 1. Vercel 대시보드 접속
[vercel.com](https://vercel.com)에 로그인

### 2. 새 프로젝트 생성
1. **"New Project"** 클릭
2. Git 저장소 연결 (GitHub, GitLab, Bitbucket)
3. 저장소 선택 후 **"Import"** 클릭

### 3. 프로젝트 설정
- **Framework Preset**: Next.js 자동 감지됨
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

### 4. 환경변수 설정
**Environment Variables** 섹션에서 필수 환경변수 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://your-project.supabase.co | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your_anon_key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | your_service_role_key | Production, Preview, Development |
| `GEMINI_API_KEY` | your_gemini_api_key | Production, Preview, Development |

### 5. 배포 실행
**"Deploy"** 버튼 클릭하여 배포 시작

## ⚙️ 환경변수 설정

### Vercel 대시보드에서 설정
1. 프로젝트 대시보드 → **Settings** → **Environment Variables**
2. 각 환경변수를 다음과 같이 설정:

#### 필수 환경변수
```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://mtowbsogtkpxvysnbdau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI 서비스
GEMINI_API_KEY=AIzaSy...
```

#### 선택적 환경변수
```bash
# Redis (성능 향상용)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# 개발 환경
NODE_ENV=production
```

### CLI를 통한 환경변수 설정
```bash
# 개별 설정
vercel env add GEMINI_API_KEY production

# 파일에서 일괄 설정
vercel env pull .env.local
```

## 🌍 도메인 설정

### 1. 기본 Vercel 도메인
배포 완료 후 자동으로 할당되는 도메인:
- `https://spa-landing-xxx.vercel.app`

### 2. 커스텀 도메인 설정
1. **Settings** → **Domains**
2. **Add Domain** 클릭
3. 도메인 입력 (예: `spa-assistant.com`)
4. DNS 설정 안내에 따라 도메인 제공업체에서 설정

#### DNS 설정 예시
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

## ✅ 배포 후 확인사항

### 1. 기본 기능 테스트
- [ ] 홈페이지 로딩 확인
- [ ] 프롬프트 생성 기능 테스트
- [ ] 프롬프트 개선 기능 테스트
- [ ] 이메일 등록 기능 테스트

### 2. API 엔드포인트 테스트
```bash
# 프롬프트 생성 API 테스트
curl -X POST https://your-domain.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test prompt", "scenario": "blog"}'

# 환경변수 테스트 API
curl https://your-domain.vercel.app/api/test-env
```

### 3. 성능 확인
- [ ] Lighthouse 점수 확인 (90점 이상 목표)
- [ ] Core Web Vitals 확인
- [ ] 모바일 반응형 확인

### 4. 모니터링 설정
- [ ] Vercel Analytics 활성화
- [ ] Error 모니터링 확인
- [ ] 사용량 모니터링 설정

## 🔧 트러블슈팅

### 빌드 실패 시

#### 1. TypeScript 에러
```bash
# 로컬에서 타입 체크
npm run build

# 에러 확인 후 수정
```

#### 2. 환경변수 누락
```bash
# Vercel 대시보드에서 환경변수 확인
# 또는 CLI로 확인
vercel env ls
```

#### 3. 의존성 문제
```bash
# package-lock.json 삭제 후 재설치
rm package-lock.json
rm -rf node_modules
npm install
```

### 런타임 에러 시

#### 1. API 에러
- Vercel Functions 로그 확인: **Dashboard** → **Functions** → **View Logs**
- 환경변수 설정 재확인
- API 엔드포인트 경로 확인

#### 2. Database 연결 에러
- Supabase 프로젝트 상태 확인
- RLS 정책 확인
- 서비스 키 권한 확인

#### 3. 성능 이슈
- 번들 크기 확인: `npm run build` 후 `.next/static` 폴더 크기
- 이미지 최적화 확인
- 코드 스플리팅 적용 확인

### 자주 발생하는 문제들

#### 1. "Module not found" 에러
```bash
# 절대 경로 import 확인
import { component } from '@/components/...'

# tsconfig.json의 paths 설정 확인
```

#### 2. CORS 에러
```javascript
// next.config.js에서 CORS 설정 확인
headers: [
  {
    source: '/api/(.*)',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' }
    ]
  }
]
```

#### 3. 환경변수 접근 불가
```javascript
// 클라이언트에서는 NEXT_PUBLIC_ 접두사 필요
const url = process.env.NEXT_PUBLIC_SUPABASE_URL

// 서버에서만 접근 가능한 환경변수
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
```

## 🔄 자동 배포 설정

### GitHub Actions 연동
Vercel은 Git 연동 시 자동으로 다음과 같이 동작:

- **main/master 브랜치**: 프로덕션 배포
- **다른 브랜치**: 프리뷰 배포
- **Pull Request**: 프리뷰 배포 + 댓글로 URL 공유

### 배포 트리거 설정
```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": false
    }
  }
}
```

## 📊 모니터링 및 분석

### 1. Vercel Analytics 활성화
```javascript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Web Vitals 모니터링
```javascript
// src/lib/web-vitals.ts
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Vercel Analytics로 전송
  if (typeof window !== 'undefined' && window.va) {
    window.va('track', 'Web Vitals', {
      metric: metric.name,
      value: metric.value,
      id: metric.id,
    })
  }
}

// 모든 Core Web Vitals 측정
onCLS(sendToAnalytics)
onINP(sendToAnalytics)
onFCP(sendToAnalytics)
onLCP(sendToAnalytics)
onTTFB(sendToAnalytics)
```

## 🎯 배포 체크리스트

### 배포 전
- [ ] 로컬 빌드 성공 확인
- [ ] 모든 환경변수 준비됨
- [ ] Git 저장소에 최신 코드 푸시됨
- [ ] Supabase 데이터베이스 마이그레이션 완료
- [ ] API 키 및 서비스 연결 테스트 완료

### 배포 중
- [ ] Vercel 프로젝트 생성 및 설정
- [ ] 환경변수 Vercel에 설정
- [ ] 빌드 성공 확인
- [ ] 배포 URL 접근 가능 확인

### 배포 후
- [ ] 모든 페이지 정상 작동 확인
- [ ] API 엔드포인트 테스트
- [ ] 모바일 반응형 확인
- [ ] 성능 지표 확인 (Lighthouse 90점 이상)
- [ ] 모니터링 도구 활성화
- [ ] 도메인 설정 (필요시)

---

## 📞 지원 및 문의

배포 과정에서 문제가 발생하면:

1. **Vercel 공식 문서**: [vercel.com/docs](https://vercel.com/docs)
2. **Next.js 배포 가이드**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
3. **Vercel 커뮤니티**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

*이 가이드는 SPA Landing 프로젝트의 Vercel 배포를 위한 완전한 매뉴얼입니다. 단계별로 따라하시면 성공적으로 배포할 수 있습니다.* 