'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    FileText,
    Users,
    Building,
    Lightbulb,
    TrendingUp,
    Shield,
    Heart,
    Zap,
    Target,
    Palette,
    Clock,
    CheckCircle2,
    ArrowRight,
    Play,
    CheckCircle
} from 'lucide-react';
import { Container } from '@/components/ui/container';

interface Scenario {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    category: '개발' | '콘텐츠' | '마케팅';
    difficulty: '초급' | '중급' | '고급';
    timeEstimate: string;
    keyFeatures: string[];
    samplePrompt: string;
    expectedOutput: string;
    tags: string[];
    usageStats: {
        completionRate: number;
        avgRating: number;
        userCount: number;
    };
}

const scenarios: Scenario[] = [
    // 개발/PM 시나리오 (6개)
    {
        id: 'api-documentation',
        title: 'API 문서 작성',
        description: '개발자 친화적인 API 문서와 예제 코드 생성',
        icon: FileText,
        category: '개발',
        difficulty: '중급',
        timeEstimate: '2분',
        keyFeatures: ['엔드포인트 설명', '요청/응답 예제', '에러 핸들링'],
        samplePrompt: 'RESTful API 유저 관리 시스템 문서화',
        expectedOutput: '완전한 API 문서 + 코드 예제 + 에러 코드 설명',
        tags: ['API', '문서화', 'REST'],
        usageStats: {
            completionRate: 96,
            avgRating: 4.8,
            userCount: 3247
        }
    },
    {
        id: 'feature-spec',
        title: '기능 명세서 작성',
        description: '모호한 요구사항을 구체적인 기능 명세서로 변환',
        icon: Building,
        category: '개발',
        difficulty: '중급',
        timeEstimate: '3분',
        keyFeatures: ['요구사항 분석', '기능 정의', '수용 기준'],
        samplePrompt: '소셜 로그인 기능 추가 요청',
        expectedOutput: '상세 기능 명세서 + 사용자 플로우 + 테스트 케이스',
        tags: ['기능명세', '요구사항', '기획'],
        usageStats: {
            completionRate: 94,
            avgRating: 4.7,
            userCount: 2856
        }
    },
    {
        id: 'code-review',
        title: '코드 리뷰 가이드',
        description: '코드 품질 향상을 위한 체계적인 리뷰 체크리스트',
        icon: CheckCircle2,
        category: '개발',
        difficulty: '고급',
        timeEstimate: '4분',
        keyFeatures: ['코드 품질 체크', '보안 검토', '성능 최적화'],
        samplePrompt: 'React 컴포넌트 코드 리뷰 가이드라인',
        expectedOutput: '체크리스트 + 모범 사례 + 리팩토링 제안',
        tags: ['코드리뷰', '품질관리', 'React'],
        usageStats: {
            completionRate: 89,
            avgRating: 4.9,
            userCount: 1943
        }
    },
    {
        id: 'database-design',
        title: '데이터베이스 설계',
        description: '효율적인 데이터베이스 스키마 및 관계 설계',
        icon: Zap,
        category: '개발',
        difficulty: '고급',
        timeEstimate: '5분',
        keyFeatures: ['ERD 설계', '정규화', '인덱스 최적화'],
        samplePrompt: 'E-커머스 주문 관리 시스템 DB 설계',
        expectedOutput: 'ERD + 테이블 스키마 + 쿼리 최적화 가이드',
        tags: ['데이터베이스', 'ERD', '최적화'],
        usageStats: {
            completionRate: 87,
            avgRating: 4.6,
            userCount: 1654
        }
    },
    {
        id: 'deployment-strategy',
        title: '배포 전략 수립',
        description: '안전하고 효율적인 서비스 배포 계획',
        icon: Target,
        category: '개발',
        difficulty: '고급',
        timeEstimate: '4분',
        keyFeatures: ['CI/CD 설계', '롤백 전략', '모니터링'],
        samplePrompt: 'Node.js API 서버 AWS 배포 전략',
        expectedOutput: '배포 파이프라인 + 모니터링 설정 + 장애 대응 절차',
        tags: ['배포', 'CI/CD', 'AWS'],
        usageStats: {
            completionRate: 91,
            avgRating: 4.5,
            userCount: 2187
        }
    },
    {
        id: 'security-checklist',
        title: '보안 체크리스트',
        description: '웹 애플리케이션 보안 취약점 점검 및 대응 방안',
        icon: Shield,
        category: '개발',
        difficulty: '고급',
        timeEstimate: '6분',
        keyFeatures: ['취약점 분석', '보안 정책', '대응 방안'],
        samplePrompt: 'React 웹앱 보안 강화 체크리스트',
        expectedOutput: '보안 체크리스트 + 구현 가이드 + 모니터링 방법',
        tags: ['보안', '취약점', '웹보안'],
        usageStats: {
            completionRate: 88,
            avgRating: 4.8,
            userCount: 1456
        }
    },

    // 콘텐츠/마케팅 시나리오 (6개)
    {
        id: 'youtube-content',
        title: '유튜브 콘텐츠 기획',
        description: '조회수 증가를 위한 체계적인 영상 콘텐츠 기획',
        icon: Play,
        category: '콘텐츠',
        difficulty: '중급',
        timeEstimate: '3분',
        keyFeatures: ['주제 발굴', '구성안 작성', 'SEO 최적화'],
        samplePrompt: 'IT 개발자 대상 기술 트렌드 유튜브 채널',
        expectedOutput: '영상 기획안 + 대본 구조 + 썸네일 키워드 + 업로드 전략',
        tags: ['유튜브', '영상기획', 'IT'],
        usageStats: {
            completionRate: 95,
            avgRating: 4.7,
            userCount: 4123
        }
    },
    {
        id: 'social-media-campaign',
        title: 'SNS 캠페인 기획',
        description: '브랜드 인지도 향상을 위한 소셜미디어 전략',
        icon: TrendingUp,
        category: '마케팅',
        difficulty: '중급',
        timeEstimate: '4분',
        keyFeatures: ['플랫폼별 전략', '콘텐츠 캘린더', '성과 측정'],
        samplePrompt: '스타트업 브랜딩을 위한 인스타그램 캠페인',
        expectedOutput: '캠페인 전략 + 콘텐츠 달력 + 해시태그 전략 + KPI 설정',
        tags: ['SNS', '캠페인', '브랜딩'],
        usageStats: {
            completionRate: 92,
            avgRating: 4.6,
            userCount: 3567
        }
    },
    {
        id: 'blog-seo-content',
        title: 'SEO 블로그 포스팅',
        description: '검색 상위 노출을 위한 최적화된 블로그 콘텐츠',
        icon: Lightbulb,
        category: '콘텐츠',
        difficulty: '중급',
        timeEstimate: '5분',
        keyFeatures: ['키워드 분석', '구글 SEO', '읽기 쉬운 구성'],
        samplePrompt: 'Next.js 개발 가이드 블로그 포스팅',
        expectedOutput: 'SEO 최적화 글 + 메타 태그 + 내부 링크 전략 + 이미지 alt 텍스트',
        tags: ['블로그', 'SEO', '개발'],
        usageStats: {
            completionRate: 94,
            avgRating: 4.8,
            userCount: 2934
        }
    },
    {
        id: 'email-marketing',
        title: '이메일 마케팅',
        description: '전환율 높은 이메일 뉴스레터 및 마케팅 메일',
        icon: Target,
        category: '마케팅',
        difficulty: '중급',
        timeEstimate: '3분',
        keyFeatures: ['제목 최적화', '개인화 전략', 'CTA 설계'],
        samplePrompt: 'SaaS 제품 온보딩 이메일 시리즈',
        expectedOutput: '이메일 시퀀스 + 제목 A/B 테스트안 + 개인화 전략 + 성과 측정 지표',
        tags: ['이메일', '마케팅', 'SaaS'],
        usageStats: {
            completionRate: 90,
            avgRating: 4.5,
            userCount: 2445
        }
    },
    {
        id: 'product-launch',
        title: '제품 출시 마케팅',
        description: '성공적인 제품 론칭을 위한 통합 마케팅 전략',
        icon: Zap,
        category: '마케팅',
        difficulty: '고급',
        timeEstimate: '6분',
        keyFeatures: ['런칭 전략', '미디어 키트', 'PR 계획'],
        samplePrompt: '모바일 앱 신규 출시 마케팅 전략',
        expectedOutput: '출시 계획 + 프레스 릴리스 + 인플루언서 협업 전략 + 성과 지표',
        tags: ['제품출시', '마케팅', '모바일'],
        usageStats: {
            completionRate: 86,
            avgRating: 4.9,
            userCount: 1567
        }
    },
    {
        id: 'content-calendar',
        title: '콘텐츠 캘린더',
        description: '일관성 있는 콘텐츠 발행을 위한 체계적인 계획',
        icon: Clock,
        category: '콘텐츠',
        difficulty: '초급',
        timeEstimate: '2분',
        keyFeatures: ['주제 계획', '발행 스케줄', '플랫폼별 최적화'],
        samplePrompt: '테크 스타트업 월간 콘텐츠 캘린더',
        expectedOutput: '월간 캘린더 + 주제별 아이디어 + 플랫폼별 배포 계획 + 성과 추적',
        tags: ['콘텐츠', '계획', '스타트업'],
        usageStats: {
            completionRate: 97,
            avgRating: 4.4,
            userCount: 3789
        }
    }
];

const categories = ['전체', '개발', '콘텐츠', '마케팅'] as const;
const difficulties = ['전체', '초급', '중급', '고급'] as const;

export default function TwelveScenariosDemo() {
    const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('전체');
    const [selectedDifficulty, setSelectedDifficulty] = useState<typeof difficulties[number]>('전체');
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [activeTab, setActiveTab] = useState<'scenarios' | 'result'>('scenarios');

    const filteredScenarios = scenarios.filter(scenario => {
        const categoryMatch = selectedCategory === '전체' || scenario.category === selectedCategory;
        const difficultyMatch = selectedDifficulty === '전체' || scenario.difficulty === selectedDifficulty;
        return categoryMatch && difficultyMatch;
    });

    const handleScenarioSelect = (scenario: Scenario) => {
        setSelectedScenario(scenario);
        setActiveTab('result');
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case '초급': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case '중급': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case '고급': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case '개발': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case '콘텐츠': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case '마케팅': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <Container className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    12종 고정형 시나리오 데모
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                    다양한 분야의 전문 문서를 한 번에 생성할 수 있는 12가지 시나리오를 체험해보세요.
                    각 시나리오는 해당 분야의 전문가가 설계한 최적화된 프롬프트를 사용합니다.
                </p>

                {/* 필터 섹션 */}
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                    <div className="flex gap-2">
                        <span className="font-medium">카테고리:</span>
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <span className="font-medium">난이도:</span>
                        {difficulties.map((difficulty) => (
                            <Button
                                key={difficulty}
                                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedDifficulty(difficulty)}
                            >
                                {difficulty}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <Tabs defaultValue="scenarios" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="scenarios">시나리오 선택</TabsTrigger>
                    <TabsTrigger value="result" disabled={!selectedScenario}>
                        생성 결과
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="scenarios" className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredScenarios.map((scenario) => {
                            const Icon = scenario.icon;
                            return (
                                <Card key={scenario.id} className="group hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                                                    <div className="flex gap-2 mt-2">
                                                        <Badge variant="secondary" className={getCategoryColor(scenario.category)}>
                                                            {scenario.category}
                                                        </Badge>
                                                        <Badge variant="outline" className={getDifficultyColor(scenario.difficulty)}>
                                                            {scenario.difficulty}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                {scenario.timeEstimate}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <CardDescription className="mb-4">
                                            {scenario.description}
                                        </CardDescription>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">주요 기능</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {scenario.keyFeatures.map((feature, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium mb-2">샘플 입력</h4>
                                                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                                    &quot;{scenario.samplePrompt}&quot;
                                                </p>
                                            </div>

                                            <Button
                                                className="w-full"
                                                onClick={() => handleScenarioSelect(scenario)}
                                            >
                                                <Zap className="h-4 w-4 mr-2" />
                                                즉시 생성
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="result" className="mt-8">
                    {selectedScenario && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-100 text-green-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>{selectedScenario.title} - 생성 완료</CardTitle>
                                        <CardDescription>
                                            고품질 문서가 성공적으로 생성되었습니다.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-medium mb-3">생성된 결과 개요</h4>
                                        <p className="text-muted-foreground bg-muted p-4 rounded-lg">
                                            {selectedScenario.expectedOutput}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-3">포함된 주요 섹션</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedScenario.keyFeatures.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-3">관련 태그</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedScenario.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setSelectedScenario(null)}>
                                            다른 시나리오 선택
                                        </Button>
                                        <Button>
                                            결과 다운로드
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </Container>
    );
} 