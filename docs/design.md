# Smart Prompt Assistant - 인터랙티브 랜딩페이지 디자인 가이드

## 🎯 목적
**사용자 설득 + 체험 유도 + 고신뢰 전환**을 위한 몰입형 인터페이스

## 🎨 디자인 톤
- **전문적**: 기업 고객이 신뢰할 수 있는 수준
- **신뢰감**: 데이터와 결과 중심의 검증된 느낌
- **현대적 미니멀**: Notion + Linear + Framer 스타일

## 🌈 색상 팔레트

### 주 색상
- **Primary**: Indigo/Sky Blue/Violet/Deep Navy 기반
- **Accent**: 밝은 블루/그린 (CTA 버튼용)
- **Text**: White/Light Gray 계열

### 배경 시스템
```css
/* 메인 배경 */
background: linear-gradient(135deg, #0f172a 0%, #0a0e1a 100%);

/* 3D Gradient 배경 */
background: radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%);

/* Noise Texture 레이어 */
background-image: url('data:image/svg+xml;base64,...noise-pattern...');
opacity: 0.05;
```

### 카드 색상
```css
/* 글래스모피즘 카드 */
background: rgba(15, 23, 42, 0.8);
backdrop-filter: blur(20px);
border: 1px solid rgba(148, 163, 184, 0.1);
```

## 📝 타이포그래피
- **Primary**: Inter (영문), Pretendard (한글)
- **Secondary**: Plus Jakarta Sans
- **Mono**: JetBrains Mono (코드 블록)

### 텍스트 계층
```css
/* Hero Title */
font-size: 3.5rem;
font-weight: 800;
line-height: 1.1;
background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Section Title */
font-size: 2.5rem;
font-weight: 700;
color: #f1f5f9;

/* Body Text */
font-size: 1.125rem;
line-height: 1.6;
color: #cbd5e1;
```

## 🏗️ 레이아웃 시스템

### 컨테이너
```css
max-width: 1200px;
margin: 0 auto;
padding: 0 1.5rem;
```

### 카드 기반 레이아웃
- **카드 간격**: 2rem (32px)
- **카드 패딩**: 2rem (32px)
- **카드 반지름**: 1.5rem (24px)
- **카드 그림자**: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

### 부드러운 레이아웃 전환
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## 📱 섹션별 디자인 명세

### 1. Hero 섹션
```jsx
<section className="min-h-screen flex items-center justify-center relative overflow-hidden">
  {/* 배경 그라디언트 */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#0a0e1a]" />
  
  {/* 메인 콘텐츠 */}
  <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
      AI가 당신의 아이디어를<br />
      전문가 결과물로 바꿉니다
    </h1>
    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
      단순한 키워드를 논문급 초록과 서론으로 변환하는<br />
      Smart Prompt Assistant를 체험해보세요
    </p>
  </div>
</section>
```

### 2. 페르소나 선택 섹션
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {personas.map((persona) => (
    <div 
      key={persona.id}
      className="group relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* 페르소나 콘텐츠 */}
    </div>
  ))}
</div>
```

### 3. Before/After 데모 비교
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
  {/* SPA OFF */}
  <div className="bg-red-950/20 border border-red-800/30 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <span className="text-red-400 font-semibold">SPA OFF</span>
    </div>
    {/* Monaco Editor 스타일 코드 블록 */}
  </div>
  
  {/* SPA ON */}
  <div className="bg-green-950/20 border border-green-800/30 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <span className="text-green-400 font-semibold">SPA ON</span>
    </div>
    {/* 개선된 결과 */}
  </div>
</div>
```

### 4. 실시간 체험 인터페이스
```jsx
<div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8">
  {/* 단계별 프로세스 */}
  <div className="flex items-center justify-between mb-8">
    {steps.map((step, index) => (
      <div key={step.id} className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          currentStep >= index ? 'bg-blue-500 text-white' : 'bg-zinc-700 text-zinc-400'
        }`}>
          {index + 1}
        </div>
        {index < steps.length - 1 && (
          <div className={`w-16 h-0.5 ${
            currentStep > index ? 'bg-blue-500' : 'bg-zinc-700'
          }`} />
        )}
      </div>
    ))}
  </div>
  
  {/* 인터랙티브 콘텐츠 영역 */}
  <div className="min-h-[400px]">
    {/* 단계별 UI 렌더링 */}
  </div>
</div>
```

## 🎭 배경 디자인

### 메인 배경
```css
/* 기본 그라디언트 */
background: linear-gradient(135deg, #0f172a 0%, #0a0e1a 100%);

/* 추가 레이어 */
background-image: 
  radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
  radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
```

### Blur Circle 레이어
```jsx
<div className="fixed inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
</div>
```

## 🎯 UI 컴포넌트 스타일

### 버튼
```jsx
/* Primary CTA */
<button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
  지금 체험하기
</button>

/* Secondary */
<button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600 py-3 px-8 rounded-xl transition-all duration-300">
  더 알아보기
</button>
```

### 입력 필드
```jsx
<input className="w-full bg-zinc-900/50 border border-zinc-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" />
```

### 진행률 표시기
```jsx
<div className="w-full bg-zinc-800 rounded-full h-2">
  <div 
    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
    style={{ width: `${progress}%` }}
  />
</div>
```

## 🎬 애니메이션 가이드

### Framer Motion 설정
```jsx
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};
```

### 호버 효과
```css
/* 카드 호버 */
.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
}

/* 버튼 호버 */
.button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
}
```

## 🚀 구현 우선순위

### Phase 1 (필수)
- [x] 메인 배경 그라디언트 적용
- [x] Hero 섹션 타이포그래피 업데이트
- [x] 페르소나 선택 카드 UI
- [x] Before/After 비교 섹션

### Phase 2 (권장)
- [ ] 실시간 체험 인터페이스
- [ ] Framer Motion 애니메이션
- [ ] 글래스모피즘 효과
- [ ] 반응형 최적화

### Phase 3 (선택)
- [ ] 고급 배경 애니메이션
- [ ] 마이크로 인터랙션
- [ ] 성능 최적화
- [ ] A/B 테스트 준비

## 📱 모바일 최적화

### 반응형 브레이크포인트
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 모바일 전용 스타일
```jsx
<div className="px-4 sm:px-6 lg:px-8">
  <h1 className="text-3xl sm:text-4xl lg:text-6xl">
    {/* 반응형 타이포그래피 */}
  </h1>
</div>
```

## 📊 성과 지표

### 사용자 경험 지표
- **페이지 로드 시간**: < 2초
- **인터랙션 응답시간**: < 100ms
- **모바일 성능 점수**: > 90점
- **접근성 점수**: > 95점

### 전환 지표
- **체험 완료율**: > 60%
- **이메일 등록률**: > 15%
- **페이지 체류시간**: > 3분

## 🎨 브랜드 가이드라인

### 로고 사용
- 다크 배경에서는 화이트/그라디언트 버전
- 최소 크기: 120px (가로)
- 여백: 로고 높이의 1/2

### 아이콘 스타일
- **라이브러리**: Lucide React
- **스타일**: Outline
- **크기**: 16px, 20px, 24px, 32px
- **색상**: 텍스트 색상과 일치

### 일관성 체크리스트
- [ ] 색상 팔레트 준수
- [ ] 타이포그래피 계층 일관성
- [ ] 간격 시스템 적용
- [ ] 애니메이션 일관성
- [ ] 반응형 동작 확인 