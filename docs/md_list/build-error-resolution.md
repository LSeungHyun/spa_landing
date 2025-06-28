@command
name: Systematic Build Error Resolution (Top-down Strategy)
description: Resolve TypeScript build errors systematically using proven Top-down methodology from T-023
---

# 🎯 체계적 빌드 에러 해결: Top-down 전략

## ⚡ **핵심 원칙**
**순차적 접근 ❌ → Top-down 전략 ✅**
- 전체 분석 후 핵심부터 해결
- 파급 효과가 큰 문제 우선 처리
- 매 단계마다 진행 상황 측정

---

## 📋 **5단계 체계적 접근법**

### 1️⃣ **전체 에러 분석 및 목록 확보**
```bash
npx tsc --noEmit --pretty
```
- 전체 에러 수와 파일 수 파악
- 에러 패턴 초기 분석
- 베이스라인 설정

### 2️⃣ **에러 패턴별 그룹화**
에러를 다음 4개 그룹으로 분류:

**🎯 그룹 1: 핵심 타입 정의 불일치** (최우선순위)
- interface 간 속성 불일치
- 필수 vs 선택적 속성 차이
- 타입 구조 변경으로 인한 파급 효과

**🎯 그룹 2: 서비스 클래스 접근성 문제**
- private 생성자 직접 접근
- 싱글톤 패턴 위반
- 메서드 시그니처 변경

**🎯 그룹 3: useEffect 클린업 함수 누락**
- "Not all code paths return a value" 에러
- 메모리 누수 방지 관련

**🎯 그룹 4: 메서드 시그니처 변경**
- 파라미터 개수 불일치
- 누락된 메서드들
- 반환 타입 변경

### 3️⃣ **파급 효과 우선순위 설정**
```
타입 정의 → 서비스 클래스 → 컴포넌트 → 테스트 파일
```
- 타입 정의 수정이 가장 많은 에러 해결
- 서비스 레이어 안정화
- UI 컴포넌트 최종 수정

### 4️⃣ **핵심부터 순차 해결**
각 그룹별로:
1. 가장 많이 참조되는 타입부터 수정
2. 수정 후 즉시 빌드 확인
3. 에러 감소 효과 측정
4. 다음 우선순위 타입으로 이동

### 5️⃣ **진행 상황 추적**
```bash
# 매 수정 후 실행
npx tsc --noEmit --pretty | grep "Found.*errors"
```
- 에러 수 감소 추적
- 예상 외 에러 증가 시 롤백 고려
- 목표 달성률 측정

---

## 🛠️ **실전 적용 가이드**

### **타입 정의 수정 시**
```typescript
// ❌ 부분적 수정
interface PartialFix {
  someField: string; // 일부만 수정
}

// ✅ 완전한 타입 통합
interface CompleteFix {
  // 모든 사용처와 호환되는 완전한 구조
  requiredField: string;
  optionalField?: string;
  // 호환성을 위한 추가 속성들
  legacyField?: string;
}
```

### **서비스 클래스 수정 시**
```typescript
// ❌ 직접 인스턴스 생성
const service = new PrivateConstructorService();

// ✅ 싱글톤 패턴 준수
const service = PrivateConstructorService.getInstance();
```

### **useEffect 수정 시**
```typescript
// ❌ 불완전한 반환
useEffect(() => {
  if (condition) {
    const cleanup = () => {};
    return cleanup;
  }
  // 다른 경로에서 반환값 없음
}, []);

// ✅ 모든 경로에서 반환값 보장
useEffect(() => {
  if (condition) {
    const cleanup = () => {};
    return cleanup;
  }
  return; // 명시적 undefined 반환
}, []);
```

---

## 📊 **성과 측정 기준**

### **단기 목표** (각 세션)
- 에러 수 10-20% 감소
- 특정 그룹 완전 해결

### **중기 목표** (프로젝트)
- 전체 에러 50% 이상 감소
- 핵심 타입 시스템 안정화

### **장기 목표** (유지보수)
- 빌드 에러 제로 상태 유지
- 타입 안전성 확보

---

## ⚠️ **주의사항**

### **하지 말아야 할 것**
- ❌ 에러 하나씩 순차적 해결
- ❌ any 타입으로 임시 우회
- ❌ 테스트 파일부터 수정 시작
- ❌ 전체 분석 없이 바로 수정

### **반드시 해야 할 것**
- ✅ 전체 에러 현황 파악 먼저
- ✅ 타입 정의부터 수정 시작
- ✅ 매 수정 후 진행 상황 확인
- ✅ 파급 효과 고려한 우선순위

---

## 🎯 **T-023 검증된 성과**
- **193개 → 156개 에러** (37개 해결, 19% 감소)
- **체계적 접근법의 효과 입증**
- **재사용 가능한 방법론 확립**

---

**💡 기억하세요: 빌드 에러 해결은 전략이 필요한 작업입니다. 무작정 하나씩 고치지 말고, 전체를 보고 핵심부터 해결하세요!** 