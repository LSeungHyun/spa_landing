# AI 채팅 API 연동 개선 TODO

## 📋 프로젝트 개요
**목적**: 현재 하드코딩된 채팅 응답을 실제 AI API 연동으로 개선  
**현재 상태**: 혼합 방식 (일부 하드코딩, 일부 실제 API)  
**목표**: 완전한 AI 기반 대화 시스템 구축

---

## 🔍 현재 상태 분석

### 📊 버튼별 API 연동 현황
| 버튼 | 기능 | API 연동 상태 | 응답 방식 | 사용 제한 |
|------|------|---------------|-----------|-----------|
| 📤 **전송** | 일반 채팅 | ❌ 하드코딩 | 3개 고정 응답 랜덤 | 없음 |
| 🪄 **개선** | 프롬프트 개선 | ✅ Gemini API | 실제 AI 응답 | 3회/일 |
| 🧪 **테스트** | 테스트 개선 | ❌ 로컬 로직 | 패턴 기반 개선 | 없음 |

### 📁 관련 파일 구조
```
src/
├── app/
│   ├── page.tsx                    # 메인 페이지 (채팅 UI)
│   └── api/
│       ├── improve-prompt/route.ts # 프롬프트 개선 API (✅ 연동됨)
│       └── chat/route.ts          # 일반 채팅 API (❌ 미구현)
├── lib/
│   ├── gemini-service.ts          # Gemini API 서비스
│   └── services/
│       └── usage-limit-service.ts # 사용량 제한 관리
```

---

## 🎯 Phase 1: 전송 버튼 AI 연동

### 작업 항목
- [ ] **채팅 API 엔드포인트 생성**
  - 파일: `src/app/api/chat/route.ts` (신규 생성)
  - 기능: 사용자 메시지에 대한 AI 응답 생성
  - 모델: Gemini 1.5 Flash
  - 사용 제한: 무제한 (일반 채팅용)

- [ ] **GeminiService에 채팅 메서드 추가**
  - 파일: `src/lib/gemini-service.ts`
  - 메서드: `generateChatResponse(message: string): Promise<string>`
  - 프롬프트: 일반 대화형 AI 어시스턴트 역할

- [ ] **프론트엔드 연동**
  - 파일: `src/app/page.tsx`
  - 함수: `handleSendMessage()` 수정
  - 하드코딩된 응답 제거 → API 호출로 변경

### 구현 세부사항

#### 1. 채팅 API 엔드포인트 (`src/app/api/chat/route.ts`)
```typescript
export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();
        
        const geminiService = GeminiService.getInstance();
        const response = await geminiService.generateChatResponse(message);
        
        return NextResponse.json({ response });
    } catch (error) {
        return NextResponse.json(
            { error: '응답 생성에 실패했습니다.' },
            { status: 500 }
        );
    }
}
```

#### 2. GeminiService 채팅 메서드
```typescript
public async generateChatResponse(message: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are a helpful AI assistant for Smart Prompt Assistant platform.
    
User message: "${message}"

Respond naturally and helpfully in Korean. Be friendly but professional.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}
```

#### 3. 프론트엔드 수정
```typescript
const handleSendMessage = async () => {
    // 기존 하드코딩 로직 제거
    // API 호출로 변경
    const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: inputText })
    });
    
    const data = await response.json();
    // AI 응답을 채팅에 추가
};
```

---

## 🧪 Phase 2: 테스트 버튼 개선

### 작업 항목
- [ ] **테스트 개선 API 최적화**
  - 현재: 로컬 패턴 기반 처리
  - 개선: 경량화된 AI 모델 사용 또는 고도화된 로컬 로직
  - 목적: API 제한 없는 무료 체험 유지

- [ ] **개선 품질 향상**
  - 더 정교한 패턴 매칭 로직
  - 프롬프트 유형별 맞춤 개선
  - 실제 AI 응답과 유사한 품질 달성

---

## 🔧 Phase 3: 통합 최적화

### 작업 항목
- [ ] **API 사용량 모니터링**
  - Gemini API 호출량 추적
  - 비용 최적화 방안 수립
  - 사용자별 제한 정책 검토

- [ ] **에러 처리 개선**
  - API 실패 시 폴백 메커니즘
  - 사용자 친화적 에러 메시지
  - 재시도 로직 구현

- [ ] **성능 최적화**
  - 응답 속도 개선
  - 캐싱 전략 수립
  - 로딩 상태 UX 개선

---

## 📊 현재 API 설정 상태

### Gemini API 구성
- **API 키**: `GEMINI_API_KEY` 환경변수
- **모델**: `gemini-1.5-flash`
- **검증 엔드포인트**: `/api/test-gemini-key`
- **사용 제한**: 프롬프트 개선 기능만 3회/일

### 사용량 관리
- **추적 방식**: IP 기반
- **저장소**: Supabase 데이터베이스
- **리셋 주기**: 매일 자정
- **제한 대상**: 프롬프트 개선 기능만

---

## 🎯 우선순위 및 일정

### 높음 (1주일 내)
1. **전송 버튼 AI 연동**: 사용자 체험 품질 향상
2. **에러 처리 개선**: 안정성 확보

### 중간 (2주일 내)
1. **테스트 버튼 개선**: 무료 체험 품질 향상
2. **API 사용량 모니터링**: 비용 관리

### 낮음 (1개월 내)
1. **성능 최적화**: 응답 속도 개선
2. **캐싱 시스템**: 중복 요청 최적화

---

## 🚨 주의사항

### API 비용 관리
- Gemini API는 사용량 기반 과금
- 무분별한 API 호출 방지 필요
- 적절한 사용 제한 정책 유지

### 사용자 경험
- API 응답 지연 시 로딩 표시
- 실패 시 명확한 안내 메시지
- 하드코딩 응답과의 품질 차이 최소화

### 보안
- API 키 보안 관리
- 사용자 입력 검증 강화
- 악용 방지 메커니즘

---

## 📈 성공 지표

### 기술적 지표
- [ ] API 응답 성공률 > 95%
- [ ] 평균 응답 시간 < 3초
- [ ] 에러 발생률 < 5%

### 사용자 경험 지표
- [ ] 채팅 응답 품질 만족도
- [ ] API 연동 전후 사용 시간 비교
- [ ] 사용자 피드백 긍정률

---

## 🔄 업데이트 로그

### 2024-12-27
- **문서 생성**: AI 채팅 API 연동 TODO 리스트 작성
- **현재 상태 분석**: 혼합 방식 API 연동 상태 파악
- **Phase별 작업 계획**: 3단계 개선 로드맵 수립 