'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Sparkles,
    Wand2,
    RefreshCw,
    Copy,
    Check,
    Code2,
    PenTool,
    Target,
    Lightbulb
} from 'lucide-react';
import { SmartPromptAI } from '@/lib/ai-service';

type Persona = 'pm-developer' | 'content-creator' | 'business-strategist' | 'researcher' | 'consultant' | 'innovator' | null;

interface AIDemoProps {
    selectedPersona: Persona;
    demoText: string;
    setDemoText: (text: string) => void;
    improvedText: string;
    setImprovedText: (text: string) => void;
}

const demoScenarios = {
    'pm-developer': {
        title: 'PM/개발자 시나리오',
        icon: Code2,
        color: 'from-blue-500 to-cyan-500',
        scenarios: [
            {
                name: 'API 문서 작성',
                input: `GET /api/users
사용자 목록을 가져옵니다.
파라미터: page, limit
반환: 사용자 배열`,
                improved: `## GET /api/users

### 개요
시스템에 등록된 사용자 목록을 페이징 형태로 조회하는 API입니다.

### 요청 파라미터
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| page | number | 선택 | 1 | 페이지 번호 (1부터 시작) |
| limit | number | 선택 | 20 | 페이지당 사용자 수 (최대 100) |

### 응답 형식
\`\`\`json
{
  &quot;data&quot;: [
    {
      &quot;id&quot;: &quot;string&quot;,
      &quot;email&quot;: &quot;string&quot;, 
      &quot;name&quot;: &quot;string&quot;,
      &quot;createdAt&quot;: &quot;ISO 8601&quot;
    }
  ],
  &quot;pagination&quot;: {
    &quot;page&quot;: &quot;number&quot;,
    &quot;limit&quot;: &quot;number&quot;, 
    &quot;total&quot;: &quot;number&quot;,
    &quot;hasNext&quot;: &quot;boolean&quot;
  }
}
\`\`\`

### 예시 요청
\`GET /api/users?page=1&limit=10\`

### 에러 코드
- 400: 잘못된 파라미터
- 401: 인증 필요
- 500: 서버 오류`
            },
            {
                name: '기능 요구사항',
                input: `사용자가 로그인할 수 있어야 함
패스워드 찾기 기능
소셜 로그인 지원`,
                improved: `## 사용자 인증 시스템 요구사항

### 🎯 핵심 목표
- 안전하고 편리한 사용자 인증 경험 제공
- 다양한 로그인 옵션으로 접근성 향상
- 보안 강화 및 사용자 계정 복구 지원

### 📋 기능 명세

#### 1. 기본 로그인 시스템
**사용자 스토리**: &quot;사용자로서 이메일과 패스워드로 안전하게 로그인하고 싶다&quot;

**요구사항**:
- 이메일/패스워드 기반 인증
- 입력 데이터 유효성 검증 (이메일 형식, 패스워드 강도)
- 로그인 시도 제한 (5회 실패 시 15분 잠금)
- 세션 관리 및 자동 로그아웃

#### 2. 패스워드 복구 시스템
**사용자 스토리**: &quot;패스워드를 잊었을 때 쉽게 재설정하고 싶다&quot;

**요구사항**:
- 이메일 기반 패스워드 재설정 링크 발송
- 토큰 유효시간 24시간 제한
- 새 패스워드 설정 시 강도 검증
- 패스워드 변경 완료 알림

#### 3. 소셜 로그인 연동
**사용자 스토리**: &quot;기존 소셜 계정으로 간편하게 가입/로그인하고 싶다&quot;

**지원 플랫폼**:
- Google OAuth 2.0
- GitHub OAuth
- 네이버/카카오 (국내 사용자 대상)

**기술 요구사항**:
- OAuth 2.0 표준 준수
- 사용자 정보 최소 수집 원칙
- 계정 연결/해제 기능
- 기존 계정과 소셜 계정 병합 지원

### ✅ 수용 기준
- [ ] 기본 로그인 성공률 99% 이상
- [ ] 패스워드 재설정 이메일 발송 시간 5초 이내
- [ ] 소셜 로그인 인증 완료 시간 10초 이내
- [ ] OWASP 보안 가이드라인 준수
- [ ] 모바일/데스크톱 반응형 지원`
            },
            {
                name: '버그 리포트',
                input: `버그 발생
페이지가 안 열림
콘솔에 에러`,
                improved: `# 🐛 버그 리포트: 페이지 로딩 실패

## 📊 버그 정보
- **심각도**: High
- **우선순위**: P1 (즉시 해결 필요)
- **상태**: Open
- **할당자**: Frontend Team
- **발견일**: ${new Date().toLocaleDateString('ko-KR')}

## 🔍 문제 설명
특정 페이지 접근 시 완전히 로딩되지 않고 빈 화면이 표시됨

## 📋 재현 단계
1. 브라우저에서 해당 URL 접근
2. 페이지 로딩 대기
3. 빈 화면 확인 및 콘솔 에러 발생

## 🎯 예상 동작
- 페이지가 정상적으로 로딩되어야 함
- 모든 컴포넌트가 올바르게 렌더링되어야 함

## 🚨 실제 동작
- 페이지가 빈 화면으로 표시됨
- 콘솔에 JavaScript 에러 발생

## 🌐 환경 정보
- **OS**: Windows 10
- **브라우저**: Chrome 121.0.0.0
- **기기**: Desktop
- **네트워크**: WiFi (안정적)

## 📝 추가 정보
- **콘솔 에러 메시지**: [스크린샷 또는 정확한 에러 메시지 첨부 필요]
- **발생 빈도**: 항상 재현됨
- **영향 범위**: 특정 페이지에 국한됨

## 🔧 임시 해결책
- 브라우저 새로고침
- 캐시 삭제 후 재접속

## 📎 첨부 파일
- [ ] 스크린샷
- [ ] 콘솔 에러 로그
- [ ] 네트워크 탭 정보
- [ ] 브라우저 개발자 도구 전체 로그

## 💡 제안 사항
1. 에러 경계(Error Boundary) 구현 검토
2. 로딩 상태 표시 개선
3. 에러 로깅 시스템 강화`
            }
        ]
    },
    'content-creator': {
        title: '콘텐츠 크리에이터 시나리오',
        icon: PenTool,
        color: 'from-purple-500 to-pink-500',
        scenarios: [
            {
                name: '블로그 포스트',
                input: `오늘 카페에서 맛있는 커피를 마셨다.
라떼아트가 예뻤고 분위기도 좋았다.
추천한다.`,
                improved: `# ☕ 숨겨진 보석 같은 카페, 'OO카페'에서의 특별한 오후

## 🌟 첫인상부터 남달랐던 공간

바쁜 일상 속에서 우연히 발견한 이 작은 카페는 마치 도심 속 오아시스 같았습니다. 문을 열고 들어서는 순간, 원두의 깊은 향과 함께 따뜻한 분위기가 저를 감쌌습니다.

## ☕ 예술이 된 한 잔의 라떼

주문한 카페라떼는 단순한 음료를 넘어 하나의 작품이었습니다. 바리스타가 정성스럽게 그려낸 라떼아트는 마치 작은 갤러리에서 작품을 감상하는 기분을 선사했습니다. 

**맛의 특징**:
- 🎯 **균형감**: 에스프레소의 진한 맛과 부드러운 우유의 조화
- 🔥 **온도**: 입술에 닿는 순간부터 완벽한 온도
- 🎨 **비주얼**: Instagram에 올리고 싶어지는 아름다운 라떼아트

## 🏠 머물고 싶어지는 공간의 매력

카페의 인테리어는 미니멀하면서도 아늑함을 잃지 않았습니다. 창가 자리에 앉아 거리를 바라보며 마시는 커피는 일상의 소소한 행복을 선사했습니다.

**공간의 장점**:
- 📚 독서하기 좋은 조용한 분위기
- 💻 노트북 작업이 가능한 넉넉한 테이블
- 🎵 귀에 거슬리지 않는 잔잔한 배경음악
- 📸 SNS 인증샷 명소로도 제격

## 💝 진심을 담은 추천

이곳은 단순히 커피를 마시는 곳이 아닌, 잠시 쉬어가며 자신만의 시간을 가질 수 있는 특별한 공간입니다. 혼자만의 시간이 필요할 때, 친구와 수다를 떨고 싶을 때, 혹은 영감이 필요한 창작 작업을 할 때 모두 완벽한 선택이 될 것입니다.

**⭐ 평점: 4.8/5**
**📍 재방문 의향: 200% YES!**

*커피 한 잔에 담긴 정성과 공간의 따뜻함이 만나 만들어낸 완벽한 하루였습니다. 여러분도 꼭 한 번 경험해보시길 추천드립니다! ☕✨*`
            },
            {
                name: 'SNS 캡션',
                input: `새로 산 신발
편하고 예쁨
#신발 #쇼핑`,
                improved: `👟 오늘의 새 가족! 한눈에 반해버린 운명의 신발 ✨

드디어 찾았다... 편안함과 스타일을 모두 잡은 완벽한 신발! 👌
첫걸음부터 구름 위를 걷는 기분이에요 ☁️

발 편함 지수: ⭐⭐⭐⭐⭐ (완벽!)
스타일 지수: ⭐⭐⭐⭐⭐ (어디든 잘 어울려!)
가성비 지수: ⭐⭐⭐⭐ (이 가격에 이 퀄리티라니!)

💫 이런 분들께 추천:
• 하루 종일 서서 일하시는 분
• 캐주얼룩을 좋아하시는 분  
• 편안하면서도 세련된 신발 찾는 분

정말 오랜만에 마음에 쏙 드는 신발을 찾았어요! 
여러분도 좋은 신발 만나시길 🙏💕

.
.
.
#신발추천 #데일리슈즈 #편한신발 #OOTD #쇼핑후기 
#신발스타그램 #슈즈 #패션아이템 #일상 #소확행
#쇼핑성공 #신발러버 #스타일링 #패션 #라이프스타일`
            },
            {
                name: '유튜브 썸네일 텍스트',
                input: `10분 요리
간단한 파스타`,
                improved: `🍝 바쁜 사람들을 위한 10분 완성!
"진짜 맛있는" 원팬 파스타 레시피

✨ 설거지도 최소화! ✨
👩‍🍳 요리 초보도 성공 100% 👨‍🍳

📍 재료 5가지로 뚝딱!
📍 실패 확률 ZERO%
📍 레스토랑 급 맛 보장

💡 꿀팁 대방출 💡
"이 재료 하나로 맛이 달라져요!"

⏰ 단 10분이면 OK
🔥 지금 바로 도전해보세요!

#10분요리 #간단파스타 #원팬레시피 #바쁜직장인 #초보요리 #집밥 #쿡방`
            }
        ]
    }
};

export default function AIDemo({
    selectedPersona,
    demoText,
    setDemoText,
    improvedText,
    setImprovedText
}: AIDemoProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentScenario, setCurrentScenario] = useState(0);
    const [copied, setCopied] = useState(false);

    const scenarios = selectedPersona ? demoScenarios[selectedPersona].scenarios : [];
    const personaConfig = selectedPersona ? demoScenarios[selectedPersona] : null;

    // AI 텍스트 개선 시뮬레이션 함수
    const improveText = async () => {
        if (!demoText.trim() || !selectedPersona) return;

        setIsProcessing(true);

        // 실제 AI 처리 시뮬레이션 (2초 대기)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 시나리오 기반 개선 또는 간단한 텍스트 개선
        const currentScenarioData = scenarios[currentScenario];
        if (demoText === currentScenarioData?.input) {
            setImprovedText(currentScenarioData.improved);
        } else {
            // 간단한 텍스트 개선 로직
            const improved = generateImprovedText(demoText, selectedPersona);
            setImprovedText(improved);
        }

        setIsProcessing(false);
    };

    // 간단한 텍스트 개선 생성 함수
    const generateImprovedText = (text: string, persona: Persona): string => {
        if (persona === 'pm-developer') {
            return `## 개선된 ${text.split('\n')[0] || '문서'}

### 📋 개요
${text}

### 🎯 상세 설명
이 내용은 다음과 같은 특징을 가집니다:
- 명확한 구조화된 형태
- 구체적인 예시 포함
- 실행 가능한 단계별 가이드

### ✅ 체크리스트
- [ ] 요구사항 확인
- [ ] 구현 계획 수립
- [ ] 테스트 시나리오 작성
- [ ] 문서화 완료

### 🔗 참고 자료
관련 문서 및 리소스를 추가로 참조하시기 바랍니다.`;
        } else {
            return `✨ ${text.split('\n')[0] || '제목'} ✨

${text.split('\n').slice(1).map(line => line.trim()).filter(Boolean).map(line =>
                `💫 ${line}`
            ).join('\n') || '내용을 더욱 매력적이고 읽기 쉽게 개선했습니다!'}

🌟 **핵심 포인트:**
- 더욱 생생하고 감성적인 표현
- 읽는 재미를 더하는 이모지 활용
- SNS 공유하기 좋은 형태로 구성

#콘텐츠 #창작 #글쓰기 #소통`;
        }
    };

    const loadScenario = (index: number) => {
        const scenario = scenarios[index];
        if (scenario) {
            setCurrentScenario(index);
            setDemoText(scenario.input);
            setImprovedText('');
        }
    };

    const copyToClipboard = async () => {
        if (improvedText) {
            await navigator.clipboard.writeText(improvedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!selectedPersona) {
        return (
            <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Target className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            먼저 페르소나를 선택해주세요
                        </h2>
                        <p className="text-lg text-gray-600">
                            맞춤형 AI 데모 체험을 위해 위에서 페르소나를 선택해주세요.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const IconComponent = personaConfig!.icon;

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <Badge className={`mb-4 bg-gradient-to-r ${personaConfig!.color} text-white`}>
                        <IconComponent className="w-4 h-4 mr-2" />
                        {personaConfig!.title}
                    </Badge>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        AI 텍스트 개선 체험
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        실제 업무에서 사용할 수 있는 시나리오로 AI의 강력한 텍스트 개선 능력을 체험해보세요.
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto">
                    {/* 시나리오 선택 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                            데모 시나리오 선택
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {scenarios.map((scenario, index) => (
                                <Button
                                    key={index}
                                    variant={currentScenario === index ? "default" : "outline"}
                                    onClick={() => loadScenario(index)}
                                    className={currentScenario === index ?
                                        `bg-gradient-to-r ${personaConfig!.color} text-white border-none` :
                                        'border-gray-300 hover:border-gray-400'
                                    }
                                >
                                    {scenario.name}
                                </Button>
                            ))}
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* 입력 영역 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-gray-900">
                                        <PenTool className="w-5 h-5 mr-2" />
                                        원본 텍스트
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Textarea
                                        value={demoText}
                                        onChange={(e) => setDemoText(e.target.value)}
                                        placeholder={selectedPersona === 'pm-developer'
                                            ? "API 문서, 요구사항, 버그 리포트 등을 입력해주세요..."
                                            : "블로그 글, SNS 캡션, 영상 스크립트 등을 입력해주세요..."
                                        }
                                        className="min-h-[300px] resize-none"
                                    />
                                    <Button
                                        onClick={improveText}
                                        disabled={!demoText.trim() || isProcessing}
                                        className={`w-full bg-gradient-to-r ${personaConfig!.color} text-white border-none hover:opacity-90 transition-all duration-300`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                AI가 개선 중...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="w-4 h-4 mr-2" />
                                                AI로 텍스트 개선하기
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* 결과 영역 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-gray-900">
                                        <div className="flex items-center">
                                            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                                            AI 개선 결과
                                        </div>
                                        {improvedText && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={copyToClipboard}
                                                className="ml-2"
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-4 h-4 mr-1 text-green-600" />
                                                        복사됨
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4 mr-1" />
                                                        복사
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="min-h-[300px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <AnimatePresence mode="wait">
                                            {isProcessing ? (
                                                <motion.div
                                                    key="processing"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center justify-center h-full"
                                                >
                                                    <div className="text-center space-y-4">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                            className="w-12 h-12 mx-auto"
                                                        >
                                                            <Sparkles className="w-12 h-12 text-blue-500" />
                                                        </motion.div>
                                                        <div className="space-y-2">
                                                            <p className="text-lg font-medium text-gray-900">AI가 텍스트를 개선하고 있습니다</p>
                                                            <div className="flex items-center justify-center space-x-1">
                                                                <motion.div
                                                                    animate={{ scale: [1, 1.2, 1] }}
                                                                    transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                                                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                                                />
                                                                <motion.div
                                                                    animate={{ scale: [1, 1.2, 1] }}
                                                                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                                                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                                                />
                                                                <motion.div
                                                                    animate={{ scale: [1, 1.2, 1] }}
                                                                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                                                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : improvedText ? (
                                                <motion.div
                                                    key="result"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="prose prose-sm max-w-none"
                                                >
                                                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                                                        {improvedText}
                                                    </pre>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="empty"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center justify-center h-full"
                                                >
                                                    <div className="text-center">
                                                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                                        <p className="text-gray-500">
                                                            텍스트를 입력하고 &quot;AI로 텍스트 개선하기&quot; 버튼을 눌러보세요.
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
} 