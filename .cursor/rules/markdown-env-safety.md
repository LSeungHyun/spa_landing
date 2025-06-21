# 마크다운 환경변수 보안 룰 (Markdown Environment Variable Safety Rules)

## 🎯 목적
마크다운 파일에서 환경변수 직접 사용을 방지하여 보안 사고를 예방

## 🚨 금지 패턴들

### ❌ 절대 사용 금지
```markdown
<!-- 이런 패턴들은 절대 사용하지 말 것 -->
process.env.API_KEY
process.env.DATABASE_URL
process.env.SECRET_KEY
ENV.LOCAL
.env.local
${process.env.GEMINI_API_KEY}
```

### ⚠️ 경고 트리거 조건
- `.md`, `.mdx` 파일에서 `process.env` 사용
- 마크다운에서 `ENV.LOCAL` 언급
- 환경변수 직접 노출 시도

## ✅ 권장 대안

### 1. 문서화용 플레이스홀더 사용
```markdown
<!-- ✅ 올바른 방법 -->
NEXT_PUBLIC_API_KEY=your_api_key_here
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_database_connection_string

<!-- ✅ 예시 형태 -->
API_KEY=AIzaSy....(your-actual-key)
SECRET_KEY=sk-proj-...(your-secret)
```

### 2. 환경변수 설명 방식
```markdown
<!-- ✅ 안전한 설명 -->
1. `.env.local` 파일에 다음 변수들을 설정하세요:
   - `GEMINI_API_KEY`: Google Gemini API 키
   - `DATABASE_URL`: 데이터베이스 연결 문자열
   
2. 환경변수 예시 형태:
   ```
   GEMINI_API_KEY=AIzaSy[나머지_키_값]
   ```
```

### 3. 코드 블록에서의 안전한 참조
```markdown
<!-- ✅ 안전한 코드 예시 -->
```typescript
// 환경변수 사용 예시
const apiKey = process.env.GEMINI_API_KEY || 'default_key';
```

<!-- ❌ 실제 값 노출 금지 -->
```typescript
const apiKey = 'AIzaSyC7qhiQvLVix9bnRd4LFWn1K696IU8u59k'; // 절대 금지!
```
```

## 🔍 검증 패턴

### 위험 패턴 감지
- `process\.env\.[A-Z_]+`
- `ENV\.LOCAL`
- `\.env\.local.*=.*[A-Za-z0-9]{20,}`
- 실제 API 키 형태 패턴

### 경고 메시지
```
⚠️ Do not access environment variables in markdown files. Use documentation-safe placeholders instead.

위험 요소:
- 환경변수 직접 노출
- API 키 유출 가능성
- 보안 정보 문서화

권장 대안:
- 플레이스홀더 사용
- 예시 형태로 표현
- 실제 값 대신 설명 사용
```

## 📋 파일 유형별 규칙

### 마크다운 파일 (.md, .mdx)
- ❌ `process.env` 직접 사용 금지
- ❌ 실제 API 키 값 노출 금지
- ✅ 플레이스홀더와 설명 사용

### 문서 파일 (.txt, .rst)
- ❌ 환경변수 실제 값 포함 금지
- ✅ 설정 방법 안내는 허용

### README 파일
- ❌ 실제 환경변수 값 노출 금지
- ✅ 설정 가이드와 예시 형태 허용

## 🛡️ 보안 체크리스트

### 커밋 전 확인사항
- [ ] 마크다운에 `process.env` 사용 없음
- [ ] 실제 API 키 값 노출 없음
- [ ] 플레이스홀더 사용 확인
- [ ] 문서화용 예시만 포함

### 자동 검증 규칙
1. 파일 저장 시 패턴 검사
2. 위험 패턴 발견 시 경고 표시
3. 대안 제시 및 수정 권장

## 🔧 구현 방법

### VSCode/Cursor 설정
```json
{
  "files.associations": {
    "*.md": "markdown"
  },
  "markdown.validate.enabled": true,
  "markdown.validate.duplicateHeaderText.enabled": false
}
```

### 린트 규칙 (eslint-plugin-markdown)
```javascript
{
  "rules": {
    "no-process-env-in-markdown": "error"
  }
}
```

## 📊 위험도 평가

| 패턴 | 위험도 | 조치 |
|------|--------|------|
| `process.env.API_KEY` | 🔴 높음 | 즉시 수정 |
| `ENV.LOCAL` 언급 | 🟡 중간 | 검토 필요 |
| 실제 키 값 노출 | 🔴 높음 | 즉시 제거 |
| 플레이스홀더 사용 | 🟢 안전 | 권장 |

## 💡 모범 사례

### 환경변수 문서화 템플릿
```markdown
## 환경변수 설정

### 필수 환경변수
- `GEMINI_API_KEY`: Google Gemini API 키 (형태: AIzaSy...)
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `JWT_SECRET`: JWT 토큰 서명용 비밀키

### 설정 방법
1. `.env.local` 파일 생성
2. 다음 형태로 변수 설정:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   JWT_SECRET=your_jwt_secret_key
   ```

### 주의사항
- 실제 키 값을 문서에 포함하지 마세요
- `.env.local` 파일은 `.gitignore`에 추가하세요
- 팀원들과 키를 공유할 때는 안전한 채널을 사용하세요
```

---

**핵심 원칙**: 마크다운은 공개 문서이므로 환경변수 실제 값을 절대 포함하지 말고, 항상 플레이스홀더와 설명을 사용하세요. 