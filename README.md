# 🤖 SPA: Smart Prompt Assistant

**Gemini API 기반 AI 프롬프트 어시시턴트 랜딩 페이지. 사용자의 아이디어를 정교한 프롬프트로 변환하여 '백지 증후군'을 해결합니다.**

> AI와 대화하고 싶지만 어떤 질문을 해야 할지 막막했던 경험, 전문가가 아니라서 질문의 수준이 낮아지고 결국 원하는 답변을 얻지 못했던 경험을 해결하고자 이 프로젝트를 시작했습니다. SPA는 사용자의 간단한 입력을 받아, AI가 가장 잘 이해할 수 있는 구조화된 프롬프트로 즉시 개선해주는 서비스입니다.

**🔗 서비스 바로가기:** https://smart-prompt-assistant.vercel.app/

<br>

<br>

## 💡 프로젝트 소개

AI 시대에 가장 중요한 스킬은 AI와 효과적으로 소통하는 능력입니다. 하지만 많은 사람들이 '무엇을 어떻게 물어봐야 할지' 모르는 상황에 직면합니다. SPA(Smart Prompt Assistant)는 이러한 '백지 증후군'을 해결하기 위해 탄생했습니다. 사용자의 막연한 아이디어나 간단한 요청을 받아, AI가 최적으로 이해할 수 있는 구조화되고 구체적인 프롬프트로 변환해주는 서비스입니다. 단순한 텍스트 변환을 넘어, 맥락과 목적을 파악하여 실무에 바로 적용 가능한 수준의 프롬프트를 제공합니다.

## ✨ 주요 기능

* **🤖 실시간 프롬프트 개선:** 사용자의 아이디어를 입력하면, 자체적으로 설계한 프롬프트 템플릿과 Gemini API를 통해 즉시 개선된 프롬프트 제안
* **🔄 스트리밍 UI:** AI가 실시간으로 답변을 생성하는 과정을 시각적으로 보여주어 사용자 경험 향상
* **🔒 사용량 제한 시스템:** IP 주소를 기반으로 일일 사용량을 추적하고, Redis 캐싱을 통해 DB 부하를 최소화하여 안정적인 서비스 환경 제공
* **📊 사용자 분석:** Google Analytics와 Microsoft Clarity를 도입하여 사용자 행동 패턴을 분석하고 서비스 개선에 활용

## 🛠 기술 스택

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion
* **Backend & DB:** Supabase (PostgreSQL), Redis (Caching)
* **AI:** Google Gemini API, Prompt Engineering
* **Deployment:** Vercel
* **State Management:** Zustand, React Query
* **Analytics:** Google Analytics, Microsoft Clarity

## 📚 핵심 경험 및 배운 점

* **AI 서비스 아키텍처 설계:** Next.js API Route를 중심으로 프론트엔드 요청 처리, 사용량 제한 검증(Redis, Supabase), Gemini API 연동, 응답 처리 및 DB 업데이트까지 이어지는 **End-to-End AI 서비스 파이프라인을 직접 설계하고 구축**했습니다.
* **DB 부하 관리를 위한 캐싱 전략 도입:** IP 기반 사용량 제한 기능 구현 시, 모든 요청이 DB에 직접 접근할 경우 발생할 수 있는 성능 저하를 예측했습니다. 이 문제를 해결하기 위해 **Redis를 도입하여 Cache-First 전략을 적용**, DB 부하를 80% 이상 줄이고 응답 속도를 개선했습니다.
* **프롬프트 엔지니어링 및 튜닝:** Gemini API의 성능을 극대화하기 위해 역할(전문 프롬프트 엔지니어), 분석 지침, 출력 형식 등을 정의한 **정교한 프롬프트 템플릿을 설계**하고, temperature, topK 등 생성 옵션을 튜닝하며 원하는 결과물을 얻는 과정을 경험했습니다.
