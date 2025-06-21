# MEMORY: 마크다운 환경변수 보안 검증

## 🧠 기억해야 할 핵심 패턴

### ⚠️ 자동 경고 트리거
마크다운 파일(.md, .mdx)에서 다음 패턴 발견 시 즉시 경고:

```
⚠️ Do not access environment variables in markdown files. Use documentation-safe placeholders instead.
```

### 🚨 위험 패턴 감지 목록
1. `process.env.` + 대문자 변수명
2. `ENV.LOCAL` 언급
3. `.env.local` + 실제 키 값 조합
4. 실제 API 키 형태 (20자 이상 영숫자)

### ✅ 안전한 대안 제시
- `GEMINI_API_KEY=your_api_key_here` (플레이스홀더)
- `API_KEY=AIzaSy....(your-actual-key)` (부분 마스킹)
- 설정 방법 설명 (실제 값 제외)

### 🔍 검증 시점
- 파일 저장 시
- 커밋 전 검토
- 마크다운 파일 편집 중

### 📋 기억할 원칙
1. **마크다운 = 공개 문서** → 환경변수 실제 값 절대 금지
2. **플레이스홀더 우선** → 예시나 설명으로 대체
3. **보안 우선** → 의심스러우면 경고 표시
4. **대안 제시** → 단순 금지가 아닌 해결책 제공

---
**자동 적용**: 이 패턴은 모든 마크다운 파일 작업에서 자동으로 검증됩니다. 