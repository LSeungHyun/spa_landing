import { Persona } from './persona-types';

export const personas: Persona[] = [
    {
        id: 'pm-developer',
        title: 'PM/개발자',
        description: '기술 문서와 제품 기획서를 자주 작성하는 전문가',
        problem: '복잡한 기술 내용을 명확하고 간결하게 전달하는 것이 어려움',
        solution: 'AI가 기술적 복잡성을 체계적으로 정리하고 이해하기 쉽게 구조화',
        features: ['기술 문서 자동 구조화', '복잡한 개념의 단순화', '논리적 흐름 최적화'],
        scenario: {
            before: "새로운 API 기능에 대한 문서를 작성해야 하는데, 기술적 세부사항이 너무 복잡해서 어떻게 설명해야 할지 막막합니다.",
            after: "AI가 기술적 내용을 체계적으로 분석하고, 개발자와 비개발자 모두 이해할 수 있는 구조로 문서를 완성해줍니다."
        },
        stats: {
            timeReduction: '70%',
            qualityImprovement: '85%'
        }
    },
    {
        id: 'content-creator',
        title: '콘텐츠 크리에이터',
        description: '블로그, 유튜브, 소셜미디어 콘텐츠를 제작하는 창작자',
        problem: '매일 새로운 콘텐츠 아이디어를 찾고 매력적인 글을 써야 하는 압박',
        solution: 'AI가 트렌드를 분석하고 타겟 오디언스에 맞는 콘텐츠를 제안',
        features: ['트렌드 기반 주제 추천', '타겟 오디언스 맞춤 톤앤매너', 'SEO 최적화 제안'],
        scenario: {
            before: "매주 5개의 블로그 포스트를 써야 하는데, 아이디어가 떨어져서 항상 마감에 쫓기고 있습니다.",
            after: "AI가 트렌딩 키워드를 분석해서 매력적인 제목과 구조를 제안해주니, 창작에만 집중할 수 있게 되었습니다."
        },
        stats: {
            timeReduction: '60%',
            qualityImprovement: '75%'
        }
    },
    {
        id: 'startup-founder',
        title: '스타트업 창업자',
        description: '사업계획서, 투자제안서, 마케팅 자료를 작성하는 창업가',
        problem: '한정된 시간에 투자자를 설득할 수 있는 임팩트 있는 문서 작성 필요',
        solution: 'AI가 비즈니스 로직을 분석하고 투자자 관점에서 매력적인 스토리로 구성',
        features: ['투자자 관점 스토리텔링', '데이터 기반 근거 제시', '경쟁사 차별화 포인트 강조'],
        scenario: {
            before: "Series A 투자를 위한 피치덱을 만들어야 하는데, 우리 비즈니스의 강점을 어떻게 어필해야 할지 고민입니다.",
            after: "AI가 우리 비즈니스 모델을 분석해서 투자자들이 관심을 가질 만한 포인트들을 논리적으로 구성해줍니다."
        },
        stats: {
            timeReduction: '65%',
            qualityImprovement: '80%'
        }
    },
    {
        id: 'marketer',
        title: '마케터',
        description: '캠페인 기획서, 광고 카피, 마케팅 전략 문서를 작성하는 마케팅 전문가',
        problem: '타겟 고객의 니즈를 정확히 파악하고 이를 효과적으로 전달하는 메시지 개발',
        solution: 'AI가 고객 페르소나를 분석하고 각 타겟에 최적화된 마케팅 메시지 생성',
        features: ['타겟별 맞춤 메시지', '감정적 어필 포인트 분석', 'A/B 테스트용 다양한 버전 제공'],
        scenario: {
            before: "신제품 론칭 캠페인을 기획하고 있는데, 20-30대 여성 타겟에게 어떤 메시지가 효과적일지 확신이 서지 않습니다.",
            after: "AI가 타겟 고객의 라이프스타일과 관심사를 분석해서, 공감대를 형성할 수 있는 캠페인 메시지를 제안해줍니다."
        },
        stats: {
            timeReduction: '55%',
            qualityImprovement: '70%'
        }
    },
    {
        id: 'consultant',
        title: '컨설턴트',
        description: '고객사를 위한 분석 보고서와 전략 제안서를 작성하는 전문 컨설턴트',
        problem: '복잡한 비즈니스 이슈를 명확히 분석하고 실행 가능한 솔루션 제시',
        solution: 'AI가 다양한 데이터를 종합 분석하고 논리적이고 설득력 있는 제안서 구성',
        features: ['데이터 기반 문제 분석', '실행 가능한 솔루션 제시', '리스크 요인 사전 식별'],
        scenario: {
            before: "클라이언트의 매출 하락 원인을 분석하고 개선 방안을 제시해야 하는데, 너무 많은 변수들 때문에 핵심을 찾기 어렵습니다.",
            after: "AI가 다양한 데이터 포인트를 종합해서 핵심 문제와 우선순위별 해결책을 체계적으로 정리해줍니다."
        },
        stats: {
            timeReduction: '50%',
            qualityImprovement: '85%'
        }
    },
    {
        id: 'freelancer',
        title: '프리랜서',
        description: '다양한 클라이언트를 위해 제안서, 프로젝트 문서를 작성하는 독립 전문가',
        problem: '제한된 시간에 여러 프로젝트의 고품질 문서를 동시에 작성해야 하는 부담',
        solution: 'AI가 프로젝트별 특성을 파악하고 클라이언트 니즈에 맞는 맞춤형 문서 생성',
        features: ['프로젝트별 맞춤 템플릿', '클라이언트 히스토리 기반 톤 조절', '빠른 초안 생성'],
        scenario: {
            before: "동시에 진행하는 3개 프로젝트의 제안서를 모두 이번 주에 제출해야 하는데, 각각 다른 업계라 접근 방식을 달리해야 합니다.",
            after: "AI가 각 클라이언트의 업계 특성과 요구사항을 분석해서, 프로젝트별로 최적화된 제안서를 빠르게 작성해줍니다."
        },
        stats: {
            timeReduction: '75%',
            qualityImprovement: '70%'
        }
    },
    {
        id: 'ux-designer',
        title: 'UX/UI 디자이너',
        description: '사용자 리서치 보고서, 디자인 가이드라인, 프로젝트 문서를 작성하는 디자이너',
        problem: '사용자 인사이트를 논리적으로 정리하고 디자인 결정을 설득력 있게 설명',
        solution: 'AI가 사용자 데이터를 분석하고 디자인 원칙에 따른 체계적인 문서 구성',
        features: ['사용자 인사이트 체계화', '디자인 결정 근거 제시', '이해관계자별 맞춤 설명'],
        scenario: {
            before: "앱 리뉴얼 프로젝트의 사용자 테스트 결과를 정리해야 하는데, 너무 많은 피드백을 어떻게 의미있게 분류할지 고민입니다.",
            after: "AI가 사용자 피드백을 패턴별로 분석하고, 우선순위와 함께 개선 방향을 명확하게 제시해줍니다."
        },
        stats: {
            timeReduction: '60%',
            qualityImprovement: '80%'
        }
    },
    {
        id: 'educator',
        title: '교육자',
        description: '강의 자료, 교육 프로그램, 학습 가이드를 제작하는 교육 전문가',
        problem: '복잡한 개념을 학습자 수준에 맞게 쉽고 재미있게 설명하는 방법',
        solution: 'AI가 학습자 특성을 고려하고 교육학적 원리에 따른 효과적인 학습 자료 구성',
        features: ['학습자 수준별 맞춤 설명', '단계별 학습 구조 설계', '흥미 유발 요소 포함'],
        scenario: {
            before: "고등학생들에게 복잡한 경제 개념을 설명해야 하는데, 어떻게 하면 지루하지 않게 이해시킬 수 있을지 고민입니다.",
            after: "AI가 학생들의 관심사와 일상 경험을 활용해서, 경제 개념을 쉽고 재미있게 설명하는 교안을 만들어줍니다."
        },
        stats: {
            timeReduction: '65%',
            qualityImprovement: '75%'
        }
    },
    {
        id: 'researcher',
        title: '연구자',
        description: '논문, 연구 보고서, 학술 자료를 작성하는 연구 전문가',
        problem: '복잡한 연구 결과를 논리적으로 구조화하고 학술적 글쓰기 기준에 맞게 작성',
        solution: 'AI가 연구 데이터를 분석하고 학술 논문의 구조와 형식에 맞는 체계적인 문서 구성',
        features: ['학술적 글쓰기 구조화', '데이터 해석 및 시각화 제안', '인용 및 참고문헌 관리'],
        scenario: {
            before: "6개월간 수집한 실험 데이터를 논문으로 정리해야 하는데, 결과 해석과 논리적 구성이 어렵습니다.",
            after: "AI가 실험 데이터의 패턴을 분석하고, 학술 논문 형식에 맞는 논리적 구조로 내용을 정리해줍니다."
        },
        stats: {
            timeReduction: '55%',
            qualityImprovement: '90%'
        }
    }
];

export const getPersonaById = (id: string): Persona | undefined => {
    return personas.find(persona => persona.id === id);
};

export const getPersonasByCategory = (category: string): Persona[] => {
    // 카테고리별 필터링 로직은 필요에 따라 추가
    return personas;
}; 