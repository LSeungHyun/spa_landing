'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, PenTool, Check, ChevronRight, Sparkles, Target, Zap, Clock, TrendingUp, Palette, GraduationCap, Rocket, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Persona {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    painPoint: string;
    solution: string;
    icon: React.ComponentType<any>;
    badge?: {
        text: string;
        variant: 'default' | 'secondary' | 'outline' | 'destructive';
        color: string;
    };
    features: string[];
    scenarios: {
        input: string;
        output: string;
        time: string;
    }[];
    gradient: string;
    shadowColor: string;
    stats: {
        timeReduction: string;
        accuracyImprovement: string;
        satisfaction: string;
    };
}

export interface PersonaSelectorProps {
    selectedPersona: string;
    onPersonaChange: (persona: string) => void;
    className?: string;
}

const personas: Persona[] = [
    {
        id: 'pm-developer',
        title: '만능 해결사',
        subtitle: 'IT 스타트업 PM/개발자',
        description: '막연한 아이디어를 명확한 명세서로, 1분 안에',
        painPoint: '"아이디어는 있는데 구체적으로 어떻게 만들지 막막해..."',
        solution: '백지의 압박을 해결하는 보이지 않는 강화 엔진',
        icon: Code,
        badge: {
            text: '추천',
            variant: 'default',
            color: 'bg-blue-500'
        },
        features: [
            '요구사항 명세서 자동 생성',
            'API 설계 가이드라인 제공',
            '개발 마일스톤 자동 계획',
            '기술 스택 최적화 추천',
            '테스트 케이스 자동 생성'
        ],
        scenarios: [
            {
                input: '"구독 결제 시스템 만들어줘"',
                output: '완전한 기능 명세서 + API 설계 + 보안 체크리스트 + 개발 일정',
                time: '1분'
            },
            {
                input: '"소셜 로그인 기능 추가하고 싶어"',
                output: 'OAuth 2.0 구현 가이드 + 보안 정책 + 사용자 플로우 + 테스트 시나리오',
                time: '45초'
            },
            {
                input: '"푸시 알림 시스템 구축"',
                output: '실시간 알림 아키텍처 + FCM 연동 가이드 + 사용자 권한 관리',
                time: '1분 20초'
            }
        ],
        gradient: 'from-blue-600 via-blue-500 to-indigo-600',
        shadowColor: 'shadow-blue-500/25',
        stats: {
            timeReduction: '개발 기획 시간 90% 단축',
            accuracyImprovement: '명세서 정확도 95% 향상',
            satisfaction: '팀 커뮤니케이션 효율 10배 증가'
        }
    },
    {
        id: 'content-creator',
        title: '콘텐츠 쳇바퀴 위의 크리에이터',
        subtitle: '유튜버, 블로거, 마케터',
        description: '막힌 창작의 벽을 뚫고, 아이디어를 완성된 콘텐츠로',
        painPoint: '"매일 콘텐츠 만들어야 하는데 아이디어가 떠오르지 않아..."',
        solution: '창작 블록을 해결하는 무한 아이디어 생성기',
        icon: PenTool,
        badge: {
            text: '인기',
            variant: 'secondary',
            color: 'bg-purple-500'
        },
        features: [
            '콘텐츠 구조 자동 설계',
            'SEO 최적화 키워드 발굴',
            '썸네일 제목 자동 생성',
            '해시태그 전략 수립',
            '시리즈 기획안 제안'
        ],
        scenarios: [
            {
                input: '"밀레니얼 대상 유튜브 영상 만들고 싶어"',
                output: '완성된 기획안 + 대본 구조 + 썸네일 문구 + 업로드 최적 시간',
                time: '2분'
            },
            {
                input: '"IT 트렌드 블로그 포스팅 써야 해"',
                output: '글 구조 + SEO 키워드 + 메타 설명 + 관련 이미지 제안',
                time: '1분 30초'
            },
            {
                input: '"인스타그램 릴스 콘텐츠 기획"',
                output: '15초 스토리보드 + 음악 추천 + 해시태그 조합 + 최적 업로드 시간',
                time: '1분'
            }
        ],
        gradient: 'from-purple-600 via-pink-500 to-purple-600',
        shadowColor: 'shadow-purple-500/25',
        stats: {
            timeReduction: '콘텐츠 기획 시간 80% 단축',
            accuracyImprovement: '조회수 평균 3.5배 증가',
            satisfaction: '창작 만족도 95% 향상'
        }
    },
    {
        id: 'startup-founder',
        title: '꿈을 현실로 만드는 건축가',
        subtitle: '스타트업 창업자/대표',
        description: '아이디어에서 비즈니스 모델까지, 완전한 사업 계획 수립',
        painPoint: '"사업 아이디어는 있는데 구체적인 실행 방안이 막막해..."',
        solution: '성공하는 스타트업의 DNA를 심어주는 전략 설계사',
        icon: Rocket,
        badge: {
            text: 'HOT',
            variant: 'destructive',
            color: 'bg-red-500'
        },
        features: [
            '비즈니스 모델 캔버스 자동 생성',
            '시장 분석 및 경쟁사 리서치',
            '투자 데크 구조 설계',
            'MVP 개발 로드맵 수립',
            '수익 모델 시나리오 분석'
        ],
        scenarios: [
            {
                input: '"펫테크 플랫폼 사업하고 싶어"',
                output: '시장 분석 + 비즈니스 모델 + 경쟁사 분석 + 수익화 전략 + 투자 계획',
                time: '4분'
            },
            {
                input: '"AI 기반 교육 서비스 런칭"',
                output: 'TAM/SAM 분석 + 고객 세그먼트 + 기술 개발 계획 + 마케팅 전략',
                time: '3분 30초'
            },
            {
                input: '"구독형 배달 서비스 기획"',
                output: '운영 모델 + 물류 전략 + 단위경제학 + 확장 계획 + 위험 요소 분석',
                time: '3분'
            }
        ],
        gradient: 'from-red-600 via-orange-500 to-red-600',
        shadowColor: 'shadow-red-500/25',
        stats: {
            timeReduction: '사업 계획 수립 시간 85% 단축',
            accuracyImprovement: '투자 유치 성공률 4.5배 향상',
            satisfaction: '사업 실행 가능성 검증 92% 정확도'
        }
    },
    {
        id: 'marketer',
        title: '성과 중독자',
        subtitle: '디지털 마케터/퍼포먼스 마케터',
        description: 'ROI 극대화를 위한 데이터 기반 마케팅 전략 수립',
        painPoint: '"캠페인은 돌리는데 정확한 성과 측정이 어려워..."',
        solution: '숫자로 말하는 마케팅 전략가의 든든한 파트너',
        icon: TrendingUp,
        badge: {
            text: 'NEW',
            variant: 'outline',
            color: 'bg-green-500'
        },
        features: [
            '데이터 기반 캠페인 설계',
            'A/B 테스트 시나리오 생성',
            '퍼널 최적화 전략 수립',
            'ROI/ROAS 추적 체계 구축',
            '고객 여정 맵핑 자동화'
        ],
        scenarios: [
            {
                input: '"신규 SaaS 제품 런칭 마케팅 전략"',
                output: 'Go-to-market 전략 + 채널별 예산 배분 + 성과 KPI + 퍼널 분석',
                time: '3분'
            },
            {
                input: '"이커머스 전환율 개선하고 싶어"',
                output: 'CRO 전략 + A/B 테스트 계획 + 사용자 행동 분석 + 개선 로드맵',
                time: '2분 30초'
            },
            {
                input: '"브랜드 인지도 측정 방법"',
                output: '브랜드 트래킹 체계 + 설문 설계 + 소셜 모니터링 + 리포팅 대시보드',
                time: '2분'
            }
        ],
        gradient: 'from-green-600 via-teal-500 to-emerald-600',
        shadowColor: 'shadow-green-500/25',
        stats: {
            timeReduction: '캠페인 기획 시간 85% 단축',
            accuracyImprovement: 'ROAS 평균 4.2배 개선',
            satisfaction: '마케팅 성과 예측 정확도 92% 달성'
        }
    },
    {
        id: 'consultant',
        title: '문제 해결의 프로',
        subtitle: '경영 컨설턴트/전략 기획자',
        description: '복잡한 비즈니스 문제를 명확한 솔루션으로 전환',
        painPoint: '"클라이언트 문제는 파악했는데 체계적인 해결책 도출이 어려워..."',
        solution: '논리적 사고의 틀을 제공하는 전략적 사고 도우미',
        icon: Target,
        badge: {
            text: 'NEW',
            variant: 'outline',
            color: 'bg-indigo-500'
        },
        features: [
            '문제 정의 및 구조화',
            '논리적 프레임워크 적용',
            '데이터 기반 가설 설정',
            '실행 계획 로드맵 수립',
            '리스크 분석 및 대응책'
        ],
        scenarios: [
            {
                input: '"제조업체 디지털 전환 컨설팅"',
                output: '현황 분석 + 디지털화 로드맵 + 기술 도입 계획 + ROI 시뮬레이션',
                time: '5분'
            },
            {
                input: '"조직 효율성 개선 프로젝트"',
                output: '조직 진단 + 프로세스 개선안 + 변화관리 계획 + 성과 측정 체계',
                time: '4분'
            },
            {
                input: '"신사업 진출 타당성 검토"',
                output: '시장 기회 분석 + 경쟁 우위 요소 + 진입 전략 + 재무 모델링',
                time: '4분 30초'
            }
        ],
        gradient: 'from-indigo-600 via-purple-500 to-indigo-600',
        shadowColor: 'shadow-indigo-500/25',
        stats: {
            timeReduction: '분석 보고서 작성 시간 75% 단축',
            accuracyImprovement: '컨설팅 만족도 98% 달성',
            satisfaction: '문제 해결 정확도 94% 향상'
        }
    },
    {
        id: 'freelancer',
        title: '1인 기업의 올라운더',
        subtitle: '프리랜서/개인사업자',
        description: '제안서부터 프로젝트 관리까지, 비즈니스 전 영역 지원',
        painPoint: '"혼자 다 해야 하는데 각 영역별 전문성이 부족해..."',
        solution: '1인 기업가를 위한 만능 비즈니스 어시스턴트',
        icon: Briefcase,
        badge: {
            text: 'NEW',
            variant: 'outline',
            color: 'bg-amber-500'
        },
        features: [
            '프로젝트 제안서 자동 생성',
            '클라이언트 커뮤니케이션 템플릿',
            '업무 프로세스 최적화',
            '포트폴리오 구성 가이드',
            '수익 다각화 전략 수립'
        ],
        scenarios: [
            {
                input: '"웹사이트 리뉴얼 프로젝트 제안서 작성"',
                output: '완전한 제안서 + 견적서 + 일정표 + 계약서 초안 + 포트폴리오 구성',
                time: '3분'
            },
            {
                input: '"브랜딩 프로젝트 클라이언트 미팅 준비"',
                output: '질문 리스트 + 포트폴리오 발표자료 + 계약 조건 + 후속 조치 계획',
                time: '2분'
            },
            {
                input: '"수익 다각화 방안 모색"',
                output: '스킬 분석 + 시장 기회 + 수익 모델 + 실행 계획 + 리스크 관리',
                time: '3분 30초'
            }
        ],
        gradient: 'from-amber-600 via-yellow-500 to-amber-600',
        shadowColor: 'shadow-amber-500/25',
        stats: {
            timeReduction: '제안서 작성 시간 90% 단축',
            accuracyImprovement: '프로젝트 수주율 3.8배 증가',
            satisfaction: '업무 효율성 85% 향상'
        }
    }
            {
        input: '"모바일 뱅킹 앱 UX 개선"',
        output: '사용자 여정 맵 + 와이어프레임 + 인터랙션 가이드 + 접근성 체크리스트',
        time: '4분'
    },
    {
        input: '"이커머스 결제 플로우 최적화"',
        output: '결제 여정 분석 + UI 개선안 + 폼 최적화 + 에러 처리 가이드',
        time: '3분'
    },
    {
        input: '"B2B SaaS 대시보드 디자인"',
        output: '정보 아키텍처 + 컴포넌트 시스템 + 사용성 테스트 계획',
        time: '5분'
    }
],
    gradient: 'from-pink-600 via-rose-500 to-orange-500',
    shadowColor: 'shadow-pink-500/25',
    stats: {
        timeReduction: '디자인 기획 시간 75% 단축',
        accuracyImprovement: '사용성 테스트 통과율 88% 향상',
        satisfaction: '개발자 협업 효율 6배 증가'
    }
    },
{
    id: 'educator-trainer',
        title: '지식 전달의 달인',
            subtitle: '교육자/강사/트레이너',
                description: '효과적인 학습 경험을 위한 교육 콘텐츠 설계',
                    painPoint: '"가르칠 내용은 많은데 어떻게 전달할지 고민돼..."',
                        solution: '학습자 중심의 체계적인 교육과정 설계 도우미',
                            icon: GraduationCap,
                                badge: {
        text: 'NEW',
            variant: 'outline',
                color: 'bg-indigo-500'
    },
    features: [
        '학습 목표 기반 커리큘럼 설계',
        '단계별 평가 체계 구축',
        '인터랙티브 활동 제안',
        '학습자 참여도 향상 전략',
        '성과 측정 지표 개발'
    ],
        scenarios: [
            {
                input: '"프로그래밍 입문 온라인 강의 제작"',
                output: '16주 커리큘럼 + 주차별 학습목표 + 실습 프로젝트 + 평가 루브릭',
                time: '6분'
            },
            {
                input: '"기업 신입사원 디지털 마케팅 교육"',
                output: '교육과정 로드맵 + 실무 케이스 스터디 + 워크샵 활동 + 성과 평가',
                time: '4분'
            },
            {
                input: '"중고등학생 창업 체험 프로그램"',
                output: '프로젝트 기반 학습 설계 + 팀 활동 가이드 + 멘토링 체계',
                time: '5분'
            }
        ],
            gradient: 'from-indigo-600 via-purple-500 to-blue-600',
                shadowColor: 'shadow-indigo-500/25',
                    stats: {
        timeReduction: '교육과정 설계 시간 70% 단축',
            accuracyImprovement: '학습자 만족도 4.6/5.0 달성',
                satisfaction: '수업 완주율 85% 향상'
    }
},
{
    id: 'startup-founder',
        title: '스타트업 생존 전략가',
            subtitle: '스타트업 창업자/사업자',
                description: '제한된 자원으로 최대 효과를 내는 비즈니스 전략 수립',
                    painPoint: '"아이디어는 있는데 사업 계획서 작성이 막막해..."',
                        solution: '투자자가 인정하는 사업 계획서를 1시간 안에',
                            icon: Rocket,
                                badge: {
        text: 'HOT',
            variant: 'destructive',
                color: 'bg-red-500'
    },
    features: [
        '사업 계획서 자동 생성',
        '시장 분석 및 경쟁사 조사',
        '수익 모델 설계 가이드',
        '투자 유치 전략 수립',
        'MVP 개발 로드맵 제시'
    ],
        scenarios: [
            {
                input: '"AI 기반 맞춤형 학습 앱 사업"',
                output: '사업계획서 + 시장분석 + 수익모델 + 투자 전략 + 6개월 로드맵',
                time: '8분'
            },
            {
                input: '"소상공인 대상 배달 플랫폼 창업"',
                output: '비즈니스 모델 캔버스 + 경쟁사 분석 + 마케팅 전략 + 예산 계획',
                time: '6분'
            },
            {
                input: '"친환경 제품 D2C 브랜드 런칭"',
                output: '브랜드 전략 + 공급망 구축 + 온라인 마케팅 + 재무 계획',
                time: '7분'
            }
        ],
            gradient: 'from-red-600 via-orange-500 to-yellow-600',
                shadowColor: 'shadow-red-500/25',
                    stats: {
        timeReduction: '사업 계획 수립 시간 80% 단축',
            accuracyImprovement: '투자 유치 성공률 3.2배 향상',
                satisfaction: '창업 준비 만족도 4.8/5.0 달성'
    }
},
{
    id: 'consultant',
        title: '문제 해결의 마법사',
            subtitle: '경영 컨설턴트/전략 컨설턴트',
                description: '복잡한 비즈니스 문제를 체계적으로 분석하고 해결책 제시',
                    painPoint: '"클라이언트 문제는 복잡한데 분석 틀 잡기가 어려워..."',
                        solution: '맥킨지식 문제 해결 프레임워크를 5분 안에',
                            icon: Briefcase,
                                badge: {
        text: 'PRO',
            variant: 'secondary',
                color: 'bg-slate-500'
    },
    features: [
        '문제 정의 및 구조화',
        '근본 원인 분석 (RCA)',
        '해결책 우선순위 매트릭스',
        '실행 계획 로드맵',
        '성과 측정 KPI 설계'
    ],
        scenarios: [
            {
                input: '"제조업체 생산성 향상 프로젝트"',
                output: '현상 분석 + 원인 파악 + 개선 방안 + 실행 계획 + ROI 계산',
                time: '10분'
            },
            {
                input: '"IT 회사 조직 효율성 개선"',
                output: '조직 진단 + 프로세스 분석 + 개선 제안 + 변화 관리 계획',
                time: '8분'
            },
            {
                input: '"유통업체 디지털 전환 전략"',
                output: 'As-Is 분석 + To-Be 설계 + 단계별 실행 + 리스크 관리',
                time: '12분'
            }
        ],
            gradient: 'from-slate-600 via-gray-500 to-zinc-600',
                shadowColor: 'shadow-slate-500/25',
                    stats: {
        timeReduction: '문제 분석 시간 75% 단축',
            accuracyImprovement: '솔루션 적중률 92% 달성',
                satisfaction: '클라이언트 만족도 4.7/5.0 달성'
    }
}
];

export default function PersonaSelector({
    selectedPersona,
    onPersonaChange,
    className = ''
}: PersonaSelectorProps) {
    const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);
    const [selectedScenario, setSelectedScenario] = useState<Record<string, number>>({
        'pm-developer': 0,
        'content-creator': 0,
        'digital-marketer': 0,
        'ui-ux-designer': 0,
        'educator-trainer': 0,
        'startup-founder': 0,
        'consultant': 0
    });

    const handleScenarioChange = (personaId: string, scenarioIndex: number) => {
        setSelectedScenario(prev => ({
            ...prev,
            [personaId]: scenarioIndex
        }));
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 mb-6"
                >
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
                        맞춤형 AI 어시스턴트
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
                >
                    당신은 어떤 유형인가요?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-slate-600 max-w-2xl mx-auto"
                >
                    노력 없는 전문성으로 <strong>증폭된 결과물</strong>을 경험해보세요
                </motion.p>
            </div>

            {/* Persona Cards - Updated to grid layout for 5 personas */}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {personas.map((persona, index) => {
                    const isSelected = selectedPersona === persona.id;
                    const isHovered = hoveredPersona === persona.id;
                    const currentScenario = selectedScenario[persona.id] || 0;

                    return (
                        <motion.div
                            key={persona.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="relative"
                        >
                            <Card
                                className={`
                                    relative overflow-hidden cursor-pointer transition-all duration-300 h-full
                                    ${isSelected
                                        ? `ring-2 ring-blue-500 ${persona.shadowColor} shadow-xl transform scale-[1.02]`
                                        : 'hover:shadow-lg hover:transform hover:scale-[1.01]'
                                    }
                                    ${isHovered ? persona.shadowColor : ''}
                                `}
                                onClick={() => onPersonaChange(persona.id)}
                                onMouseEnter={() => setHoveredPersona(persona.id)}
                                onMouseLeave={() => setHoveredPersona(null)}
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${persona.gradient} opacity-5`} />

                                {/* Badge */}
                                {persona.badge && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge
                                            variant={persona.badge.variant}
                                            className={`${persona.badge.color} text-white border-0`}
                                        >
                                            {persona.badge.text}
                                        </Badge>
                                    </div>
                                )}

                                <div className="p-8 relative z-10">
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${persona.gradient} mb-6`}>
                                        <persona.icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Title & Subtitle */}
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                            {persona.title}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500 mb-3">
                                            {persona.subtitle}
                                        </p>
                                        <p className="text-lg font-semibold text-slate-700 mb-4">
                                            {persona.description}
                                        </p>

                                        {/* Pain Point */}
                                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                            <p className="text-red-700 text-sm italic">
                                                {persona.painPoint}
                                            </p>
                                        </div>

                                        {/* Solution */}
                                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-4 h-4 text-green-600" />
                                                <span className="text-green-800 font-semibold text-sm">해결책</span>
                                            </div>
                                            <p className="text-green-700 text-sm font-medium">
                                                {persona.solution}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Interactive Scenario Demo */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                            <Target className="w-4 h-4" />
                                            실제 사용 시나리오
                                        </h4>

                                        {/* Scenario Tabs */}
                                        <div className="flex gap-1 mb-4">
                                            {persona.scenarios.map((_, scenarioIndex) => (
                                                <button
                                                    key={scenarioIndex}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleScenarioChange(persona.id, scenarioIndex);
                                                    }}
                                                    className={`px-3 py-1 text-xs rounded-full transition-colors ${currentScenario === scenarioIndex
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                                        }`}
                                                >
                                                    {scenarioIndex + 1}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Scenario Content */}
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentScenario}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-3"
                                            >
                                                <div className="bg-slate-50 rounded-lg p-3">
                                                    <div className="text-xs text-slate-500 mb-1">입력</div>
                                                    <div className="text-sm text-slate-700">
                                                        {persona.scenarios[currentScenario].input}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-center">
                                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                                </div>

                                                <div className="bg-green-50 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="text-xs text-green-600">출력</div>
                                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                                            <Clock className="w-3 h-3" />
                                                            {persona.scenarios[currentScenario].time}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-green-700 font-medium">
                                                        {persona.scenarios[currentScenario].output}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-1 gap-3 mb-6">
                                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                                            <div className="text-xs text-slate-500 mb-1">효과</div>
                                            <div className="text-sm font-semibold text-slate-700">
                                                {persona.stats.timeReduction}
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                                            <div className="text-xs text-slate-500 mb-1">품질 향상</div>
                                            <div className="text-sm font-semibold text-slate-700">
                                                {persona.stats.accuracyImprovement}
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                                            <div className="text-xs text-slate-500 mb-1">만족도</div>
                                            <div className="text-sm font-semibold text-slate-700">
                                                {persona.stats.satisfaction}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-slate-800 mb-3">핵심 기능</h4>
                                        <div className="space-y-2">
                                            {persona.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-sm text-slate-600">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Selection Button */}
                                    <Button
                                        variant={isSelected ? "default" : "outline"}
                                        className={`w-full ${isSelected ? `bg-gradient-to-r ${persona.gradient} border-0` : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPersonaChange(persona.id);
                                        }}
                                    >
                                        {isSelected ? '선택됨' : '이 페르소나 선택'}
                                        {!isSelected && <ChevronRight className="ml-2 w-4 h-4" />}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center mt-12"
            >
                <p className="text-slate-600 mb-6">
                    아직 확신이 서지 않나요? 두 페르소나 모두 무료로 체험해보세요!
                </p>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    무료 체험 시작하기
                    <Sparkles className="ml-2 w-5 h-5" />
                </Button>
            </motion.div>
        </div>
    );
} 