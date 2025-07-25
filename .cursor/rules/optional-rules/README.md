# 🔧 선택적 규칙 (Optional Rules)

이 폴더의 규칙들은 **프로젝트 특성에 따라 선택적으로 적용하는 규칙들**입니다.

## 📋 포함된 규칙들

### 1. **spa-landing-architecture.mdc** ⭐⭐⭐
- **목적**: Next.js App Router 패턴 강제
- **핵심 가치**: SPA 랜딩페이지 아키텍처 일관성
- **적용 조건**: Next.js + SPA 랜딩페이지 프로젝트
- **기술 의존성**: Next.js, React

### 2. **component-patterns.mdc** ⭐⭐⭐
- **목적**: 컴포넌트 설계 일관성
- **핵심 가치**: 재사용 가능한 컴포넌트 패턴
- **적용 조건**: React 기반 프로젝트
- **기술 의존성**: React, TypeScript

### 3. **code-editing-safety-protocol.mdc** ⭐⭐⭐
- **목적**: 파일 편집 안전성 보장
- **핵심 가치**: 대규모 코드 수정 시 안전성
- **적용 조건**: 대규모 리팩토링이나 복잡한 수정 작업
- **기술 의존성**: 없음 (범용)

### 4. **cursur-step-by-step-rule.mdc** ⭐⭐⭐
- **목적**: 체계적 개발 프로세스
- **핵심 가치**: 복잡한 작업의 단계별 수행
- **적용 조건**: 복잡하거나 다단계 작업
- **기술 의존성**: 없음 (범용)

## 🎯 사용 지침

### 선택 기준
1. **기술 스택 호환성**: 프로젝트에서 사용하는 기술과 일치하는가?
2. **프로젝트 규모**: 규칙의 복잡도가 프로젝트 규모에 적합한가?
3. **팀 숙련도**: 팀이 해당 규칙을 효과적으로 활용할 수 있는가?

### 적용 방법
1. **개별 선택**: 필요한 규칙만 골라서 적용
2. **부분 적용**: 규칙의 일부 섹션만 선택적으로 사용
3. **커스터마이징**: 프로젝트에 맞게 내용 수정 후 적용

## 📊 규칙별 추천 시나리오

| 규칙 | React 프로젝트 | Next.js 프로젝트 | 일반 웹 프로젝트 | 대규모 프로젝트 |
|------|:-------------:|:---------------:|:---------------:|:--------------:|
| spa-landing-architecture | ❌ | ✅ | ❌ | ✅ |
| component-patterns | ✅ | ✅ | ❌ | ✅ |
| code-editing-safety-protocol | ⚠️ | ⚠️ | ⚠️ | ✅ |
| cursur-step-by-step-rule | ⚠️ | ⚠️ | ⚠️ | ✅ |

- ✅ 적극 추천
- ⚠️ 상황에 따라 선택
- ❌ 권장하지 않음

## ⚠️ 주의사항

- **과도한 적용 금지**: 프로젝트에 불필요한 복잡성을 추가하지 말 것
- **성능 영향 고려**: 규칙 적용이 개발 속도를 현저히 저하시키지 않는지 확인
- **팀 합의**: 팀 전체가 동의하는 규칙만 적용 