# 제품 요구 사항 문서 (PRD)

## 1. 개요
Smart Prompt Assistant는 AI 도움으로 프롬프트 품질을 즉시 향상시키는 크롬 확장 및 웹 데모 서비스이다. 비전문가도 클릭 한 번으로 전문가급 프롬프트를 얻어 업무 효율을 극대화할 수 있다.

## 2. 문제 정의
- 많은 사용자가 막연한 아이디어를 구체적 프롬프트로 변환하지 못해 AI 도구 활용 효과가 낮다.  
- 기존 서비스는 복잡한 설정, 높은 비용, 제한적 맞춤화로 사용자 진입 장벽이 높다.

## 3. 목표 및 목적
- 1차 목표: 자연어 입력을 고품질 프롬프트로 자동 변환하여 작업 시간을 50% 단축.
- 2차 목표: 페르소나별 템플릿 제공으로 사용자 만족도 80% 이상 달성.
- 성공 지표  
  • 주간 활성 사용자(WAU) 5,000명 달성  
  • 프롬프트 개선 클릭당 NPS 50 이상  
  • 크롬 익스텐션 설치→사용 전환율 60% 달성  

## 4. 대상 사용자
### 주요 사용자
- AI 도움을 받고 싶은 지식 근로자(25~45세), 비전문가, 비기술 배경.
### 부차 사용자
- 스타트업, 에이전시, 교육 기관.

## 5. 사용자 스토리
- PM/개발자로서, 난해한 기능 설명을 넣으면 명확한 기획서용 프롬프트를 받고 싶다.  
- 콘텐츠 크리에이터로서, 아이디어 키워드만 입력해 완성형 콘텐츠 프롬프트를 얻고 싶다.  
- 마케터로서, 캠페인 목표를 입력해 데이터 기반 광고 프롬프트를 받고 싶다.

## 6. 기능 요구 사항
### 핵심 기능
1. AI 프롬프트 개선  
   - 입력창에 자연어 입력 → Gemini 2.5 Flash로 개선 → Before/After 비교 표시  
   - 수락/재생성 버튼 제공  
   - 수락 시 클립보드 복사 및 저장  
   - 성능 기준: 3초 내 결과 반환  
2. 페르소나 템플릿  
   - 6개 페르소나 버튼(개발자, 크리에이터 등)  
   - 버튼 클릭 시 샘플 프롬프트 자동 삽입  
3. 사용량 제한  
   - IP 기준 일 3회 무료 사용  
   - Redis로 카운트, 24시간 후 자동 초기화  
   - 초과 시 사전 등록 페이지로 리다이렉트  
4. 크롬 확장  
   - ChatGPT 사이드패널에 버튼 삽입  
   - 원클릭으로 현재 프롬프트 개선  
5. 웹 데모  
   - 4개 샘플 프롬프트 카드  
   - 실시간 타이핑 애니메이션  
   - 키보드 단축키(⌘/Ctrl+↵) 지원  

### 부가 기능
- 다국어 번역 모드  
- 히스토리 보관함(30일)  
- 공유 링크 생성  
- 팀 요금제(추후)  

## 7. 비기능 요구 사항
- 성능: 95퍼센타일 응답 3초 이하  
- 보안: OAuth2, HTTPS, 데이터 암호화 at rest  
- 사용성: WCAG 2.1 AA 준수, 다크모드  
- 확장성: 동시 10k 요청 처리  
- 호환성: Chrome 114+, Edge 114+, 모바일 웹 Safari/Chrome  

## 8. 기술 고려 사항
- 아키텍처: Next.js 14 App Router + Server Actions  
- AI 연동: Google Gemini Flash API  
- 데이터: Supabase Postgres, Redis 캐싱  
- 인증: Supabase Auth, OAuth Google  
- 배포: Vercel + Cloudflare CDN  
- 확장: Manifest V3 기반 크롬 익스텐션  
```typescript
export const MODELS = {
  CHAT: 'gemini-2.0-flash',
  IMPROVE: 'gemini-2.5-flash',
  IMPROVE_TEST: 'gemini-2.0-flash',
  GENERATE: 'gemini-2.0-flash',
};
```

## 9. 성공 지표 및 KPI
- WAU, MAU, 설치 전환율  
- 1인당 일평균 개선 클릭수  
- 응답 지연 평균  
- 유료 전환율(베타 종료 후)  

## 10. 일정 및 마일스톤
| 단계 | 기간 | 주요 산출물 |
|------|------|-------------|
| Phase 1 MVP | M0~M1 | 웹 데모, 프롬프트 개선, 사용량 제한 |
| Phase 2 | M2 | 크롬 확장, 페르소나 템플릿, 분석 대시보드 |
| Phase 3 | M3~M4 | 히스토리, 다국어, 팀 요금제, 공식 런치 |

## 11. 위험 및 완화 전략
- API 비용 증가 → 무료 모델 우선, 캐싱 강화  
- Google 정책 변경 → 대체 모델 조사(Claude, Llama)  
- 남용 및 DoS → Redis Rate Limit, CAPTCHA  
- 사용자 저조 → First Mover Club 리워드, 콘텐츠 마케팅  

## 12. 향후 고려 사항
- GPT-4o 등 유료 모델 옵션  
- 파이어폭스·사파리 확장 포팅  
- 오프라인 모드(로컬 LLM 연동)  
- 커뮤니티 마켓플레이스(사용자 템플릿 거래)