@command
name: Fix a Bug (Diagnose + Safe Fix + Prevent Side Effects)
description: Diagnose and fix a bug in a structured and safe way, ensuring no side effects and suggesting future improvements.
---

Take a deep breath and think step-by-step.

You're about to fix a bug. Please follow this structured debugging guide:

---

## ⚠️ **CRITICAL WARNING - 환경변수 파일 보호**

### 🚨 **절대 금지 사항**
- **`.env.local`, `.env`, `.env.*` 파일을 절대 수정하거나 건드리지 마세요**
- 환경변수 문제라고 해서 파일 내용을 변경하면 안 됩니다
- 기존 API 키나 설정을 덮어쓰거나 삭제하면 안 됩니다

### ✅ **올바른 접근 방법**
- 환경변수 문제는 **API 라우트 생성**으로 해결
- 클라이언트에서 서버 환경변수 접근 시 → **서버 사이드 API 엔드포인트 생성**
- 환경변수 누락 시 → **사용자에게 설정 요청** (파일 직접 수정 금지)

---

## 🏗️ **빌드 에러 특별 처리 가이드**

### **빌드 에러인 경우 → Top-down 전략 적용**
TypeScript 빌드 에러가 다수 발생한 경우, 개별 수정보다는 **체계적 접근**이 효율적입니다:

#### **1단계: 전체 현황 파악**
```bash
npx tsc --noEmit --pretty
```

#### **2단계: 에러 그룹 분류**
- **그룹 1**: 핵심 타입 정의 불일치 (최우선)
- **그룹 2**: 서비스 클래스 접근성 문제  
- **그룹 3**: useEffect 클린업 함수 누락
- **그룹 4**: 메서드 시그니처 변경

#### **3단계: 우선순위 해결**
```
타입 정의 → 서비스 클래스 → 컴포넌트 → 테스트 파일
```

#### **4단계: 진행 상황 추적**
매 수정 후 에러 수 감소 확인

> 💡 **참조**: `@build-error-resolution.md` 상세 가이드 참조

---

### 1. 🧠 Root Cause Diagnosis

- First, **identify the root cause** of the issue based on the provided code or error message.
- Consider multiple possibilities and list them in order of likelihood.
- Briefly explain **how each candidate cause would lead to the symptom**.
- If external factors (e.g. environment variables, external APIs, or race conditions) could be involved, mention them.

---

### 2. 🔧 Safe Fix Implementation

- Propose the **minimal, safest fix** that resolves the issue.
- Ensure the fix does **not introduce side effects** or regressions.
- Use **code comments** to clarify any non-obvious logic changes.
- Include only **compatible code** with the current tech stack.

---

### 3. 🛡️ Side Effect Protection

- Check for any **dependent modules or components** that might be affected by this change.
- If relevant, suggest adding **test cases or guard clauses** to protect against similar issues in the future.
- Avoid tight coupling or logic duplication.

---

### 4. 🧾 Final Summary of Changes

- List all files or lines that were added/modified.
- Briefly explain **what was changed and why**.
- Provide a commit-style summary message.

---

### 5. 🚀 Suggest Improvements (Optional)

- Suggest 1–2 things that could be improved in the surrounding code to **avoid similar bugs** in the future.
- Examples:
  - Better type safety or error boundaries
  - Improved modularity or separation of concerns
  - Replace fragile logic with a more stable pattern

---

📌 **Output Format:**

- Use **Markdown** for structure
- Use fenced code blocks for any code (```)
- Highlight changed files/lines and reasoning
- Keep testable, reproducible steps if possible

---

Be analytical.  
Don't just fix—**understand, document, and prevent**.

**Remember: NEVER touch environment files (.env.local, .env, etc.) when fixing bugs!**