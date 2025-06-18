'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Brain,
    TestTube,
    Computer,
    Heart,
    Globe,
    Calculator,
    Atom,
    Users,
    BookOpen,
    Building,
    Palette,
    Microscope,
    Play,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 12종 고정형 시나리오 데이터
const SCENARIOS = [
    {
        id: 'ai-ml',
        title: 'AI/머신러닝',
        icon: Brain,
        description: '딥러닝, 신경망, 컴퓨터 비전 연구',
        color: 'purple',
        keywords: ['딥러닝', '신경망', '컴퓨터비전', 'NLP', '강화학습'],
        sample: '본 연구에서는 transformer 기반의 새로운 어텐션 메커니즘을 제안하여...'
    },
    {
        id: 'biotech',
        title: '생명공학',
        icon: TestTube,
        description: '유전학, 분자생물학, 바이오메디컬',
        color: 'green',
        keywords: ['유전자', '단백질', '세포', '바이오마커', '치료법'],
        sample: '본 연구는 CRISPR-Cas9 시스템을 활용한 유전자 편집 기법의 효율성을...'
    },
    {
        id: 'computer-sci',
        title: '컴퓨터과학',
        icon: Computer,
        description: '알고리즘, 데이터베이스, 분산시스템',
        color: 'blue',
        keywords: ['알고리즘', '데이터구조', '분산처리', '보안', '네트워크'],
        sample: '제안하는 분산 데이터베이스 아키텍처는 기존 시스템 대비 처리량을...'
    },
    {
        id: 'medical',
        title: '의학',
        icon: Heart,
        description: '임상연구, 진단, 치료법 개발',
        color: 'red',
        keywords: ['임상시험', '진단', '치료', '환자', '의료기기'],
        sample: '본 임상연구는 새로운 항암제의 안전성과 유효성을 평가하기 위해...'
    },
    {
        id: 'environment',
        title: '환경과학',
        icon: Globe,
        description: '기후변화, 생태계, 환경보전',
        color: 'emerald',
        keywords: ['기후변화', '생태계', '오염', '지속가능성', '환경정책'],
        sample: '본 연구는 기후변화가 생물다양성에 미치는 영향을 분석하여...'
    },
    {
        id: 'engineering',
        title: '공학',
        icon: Calculator,
        description: '기계, 전기, 화학공학',
        color: 'orange',
        keywords: ['시스템', '최적화', '설계', '재료', '공정'],
        sample: '제안된 시스템 최적화 알고리즘은 기존 방법 대비 에너지 효율성을...'
    },
    {
        id: 'physics',
        title: '물리학',
        icon: Atom,
        description: '양자역학, 입자물리학, 천체물리학',
        color: 'cyan',
        keywords: ['양자', '입자', '에너지', '파동', '상대성'],
        sample: '본 연구는 양자역학적 현상을 이용한 새로운 에너지 변환 메커니즘을...'
    },
    {
        id: 'social-sci',
        title: '사회과학',
        icon: Users,
        description: '심리학, 사회학, 정치학',
        color: 'pink',
        keywords: ['행동', '사회', '문화', '정책', '인간관계'],
        sample: '본 연구는 소셜미디어가 사회적 상호작용에 미치는 영향을 분석하여...'
    },
    {
        id: 'education',
        title: '교육학',
        icon: BookOpen,
        description: '교육방법론, 학습이론, 교육공학',
        color: 'indigo',
        keywords: ['학습', '교육', '인지', '발달', '교수법'],
        sample: '제안하는 개인화 학습 시스템은 학습자의 인지 스타일을 고려하여...'
    },
    {
        id: 'economics',
        title: '경제학',
        icon: Building,
        description: '금융, 경제정책, 시장분석',
        color: 'amber',
        keywords: ['시장', '경제', '금융', '정책', '투자'],
        sample: '본 연구는 디지털 화폐가 전통적인 금융 시스템에 미치는 영향을...'
    },
    {
        id: 'humanities',
        title: '인문학',
        icon: Palette,
        description: '문학, 철학, 역사, 예술',
        color: 'rose',
        keywords: ['문화', '역사', '철학', '예술', '문학'],
        sample: '본 연구는 디지털 시대의 문화적 변화가 전통적 예술 형식에...'
    },
    {
        id: 'chemistry',
        title: '화학',
        icon: Microscope,
        description: '유기화학, 무기화학, 분석화학',
        color: 'violet',
        keywords: ['분자', '반응', '촉매', '합성', '분석'],
        sample: '새로운 촉매 시스템을 통한 친환경적 화학 합성 방법론을...'
    }
];

export function ScenarioSelector() {
    const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleScenarioSelect = (scenarioId: string) => {
        setSelectedScenario(scenarioId);
    };

    const handleGenerateDemo = () => {
        setIsGenerating(true);
        // 실제 생성 시뮬레이션
        setTimeout(() => {
            setIsGenerating(false);
        }, 2000);
    };

    const selectedData = SCENARIOS.find(s => s.id === selectedScenario);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8">
            {/* 헤더 */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">12종 고정형 시나리오</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    연구 분야별 최적화된 프롬프트로 즉시 시작하세요.
                    각 시나리오는 해당 분야의 특성과 논문 작성 관례를 반영합니다.
                </p>
            </div>

            {/* 시나리오 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SCENARIOS.map((scenario) => {
                    const IconComponent = scenario.icon;
                    const isSelected = selectedScenario === scenario.id;

                    return (
                        <motion.div
                            key={scenario.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                className={`cursor-pointer transition-all duration-200 ${isSelected
                                    ? `border-${scenario.color}-500 bg-${scenario.color}-50 shadow-md`
                                    : 'hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                onClick={() => handleScenarioSelect(scenario.id)}
                            >
                                <CardContent className="p-4 text-center space-y-2">
                                    <div className={`w-12 h-12 mx-auto flex items-center justify-center rounded-lg bg-${scenario.color}-100`}>
                                        <IconComponent className={`h-6 w-6 text-${scenario.color}-600`} />
                                    </div>
                                    <h3 className="font-semibold text-sm">{scenario.title}</h3>
                                    <p className="text-xs text-gray-600 leading-tight">
                                        {scenario.description}
                                    </p>
                                    {isSelected && (
                                        <Badge className={`bg-${scenario.color}-500`}>선택됨</Badge>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* 선택된 시나리오 상세 */}
            <AnimatePresence>
                {selectedData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <Card className={`border-${selectedData.color}-200 bg-${selectedData.color}-50`}>
                            <CardHeader>
                                <CardTitle className={`flex items-center gap-3 text-${selectedData.color}-800`}>
                                    <selectedData.icon className="h-6 w-6" />
                                    {selectedData.title} 시나리오
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">주요 키워드:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedData.keywords.map((keyword, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className={`bg-${selectedData.color}-100 text-${selectedData.color}-700`}
                                            >
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">예시 생성 결과:</h4>
                                    <div className="bg-white p-4 rounded-lg border">
                                        <p className="text-sm text-gray-700 italic">
                                            &ldquo;{selectedData.sample}&rdquo;
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4" />
                                        <span>예상 생성 시간: 2-3초</span>
                                    </div>

                                    <Button
                                        onClick={handleGenerateDemo}
                                        disabled={isGenerating}
                                        className={`bg-${selectedData.color}-600 hover:bg-${selectedData.color}-700`}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                                />
                                                생성 중...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-4 w-4 mr-2" />
                                                데모 실행
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 