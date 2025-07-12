import { Sparkles, Target, Zap, Users, MessageSquare, Chrome, Download, Shield } from 'lucide-react';

export type Persona = 'pm-developer' | 'content-creator' | 'startup-founder' | 'marketer' | 'consultant' | 'freelancer';

export interface PersonaData {
    title: string;
    subtitle: string;
    description: string;
    placeholder: string;
    heroText: string;
    problemStatement: string;
    solution: string;
    examples: string[];
}

export const personas: Record<Persona, PersonaData> = {
    'pm-developer': {
        title: 'IT 스타트업 PM/개발자',
        subtitle: 'ChatGPT 옆에서 기획서 작성부터 기술 문서까지',
        description: '복잡한 기술 요구사항을 상세한 기능명세서와 개발 로드맵으로 즉시 변환하는 전문 도구입니다',
        placeholder: '예: 구독 결제 기능을 추가하고 싶어요',
        heroText: '복잡한 기술 요구사항을 명확한 PRD와 개발 계획서로 변환',
        problemStatement: '막연한 아이디어만 있으면 충분합니다.',
        solution: '아이디어 → 실행 가능한 기술 문서',
        examples: [
            '사용자 인증 시스템 → 상세 API 명세서',
            '실시간 알림 기능 → 기술 아키텍처 설계서',
            '데이터 분석 대시보드 → 4주 개발 로드맵'
        ]
    },
    'content-creator': {
        title: '디지털 콘텐츠 크리에이터',
        subtitle: 'ChatGPT 옆에서 유튜브부터 블로그까지',
        description: '막연한 콘텐츠 아이디어를 완성된 기획안과 제작 가이드로 변환하는 크리에이터 전용 도구입니다',
        placeholder: '예: 유튜브 채널 기획안을 만들고 싶어요',
        heroText: '막연한 콘텐츠 아이디어를 완성된 제작 기획서로 변환',
        problemStatement: '아이디어만 있으면 충분합니다.',
        solution: '아이디어 → 완성된 콘텐츠 기획서',
        examples: [
            '유튜브 채널 컨셉 → 6개월 콘텐츠 로드맵',
            '블로그 포스팅 아이디어 → 12편 시리즈 기획서',
            '인스타그램 브랜딩 → 통합 마케팅 전략서'
        ]
    },
    'startup-founder': {
        title: '스타트업 창업자',
        subtitle: 'ChatGPT 옆에서 사업계획서부터 투자유치까지',
        description: '창업 아이디어를 체계적인 사업계획서와 투자 제안서로 변환하는 창업자 필수 도구입니다',
        placeholder: '예: 배달음식 플랫폼 사업을 시작하고 싶어요',
        heroText: '모호한 창업 아이디어를 체계적인 사업계획서와 투자 제안서로 변환',
        problemStatement: '창업 아이디어만 있으면 충분합니다.',
        solution: '아이디어 → 투자 가능한 사업계획서',
        examples: [
            'AI 헬스케어 아이디어 → 시장분석 포함 사업계획서',
            '친환경 배달 플랫폼 → 투자유치용 피치덱',
            'B2B SaaS 솔루션 → 3년 성장 로드맵'
        ]
    },
    'marketer': {
        title: '디지털 마케터',
        subtitle: 'ChatGPT 옆에서 캠페인 기획부터 전략 수립까지',
        description: '마케팅 목표를 데이터 기반 캠페인 전략과 실행 계획서로 변환하는 마케터 전용 도구입니다',
        placeholder: '예: 신제품 론칭 마케팅 캠페인을 기획하고 싶어요',
        heroText: '마케팅 아이디어를 데이터 기반 캠페인 전략서로 변환',
        problemStatement: '마케팅 목표만 있으면 충분합니다.',
        solution: '목표 → 실행 가능한 마케팅 전략서',
        examples: [
            'SNS 바이럴 아이디어 → 4주 캠페인 실행계획서',
            '브랜드 인지도 향상 → 통합 마케팅 전략서',
            'ROI 최적화 목표 → 성과 측정 가능한 광고 전략'
        ]
    },
    'consultant': {
        title: '비즈니스 컨설턴트',
        subtitle: 'ChatGPT 옆에서 전략수립부터 프로세스 개선까지',
        description: '복잡한 비즈니스 문제를 체계적인 솔루션과 실행 로드맵으로 변환하는 컨설팅 전문 도구입니다',
        placeholder: '예: 조직 효율성을 개선하는 방안을 찾고 싶어요',
        heroText: '비즈니스 과제를 전문 컨설팅 보고서와 실행 계획서로 변환',
        problemStatement: '문제 상황만 있으면 충분합니다.',
        solution: '문제 → 실행 가능한 솔루션 보고서',
        examples: [
            '디지털 전환 과제 → 6개월 DX 로드맵',
            '조직문화 개선 → 단계별 실행 가이드',
            '비용 최적화 목표 → ROI 측정 가능한 개선 계획'
        ]
    },
    'freelancer': {
        title: '프리랜서',
        subtitle: 'ChatGPT 옆에서 제안서부터 포트폴리오까지',
        description: '서비스 아이디어를 전문적인 제안서와 프로젝트 계획서로 변환하는 프리랜서 필수 도구입니다',
        placeholder: '예: 웹사이트 리뉴얼 제안서를 작성하고 싶어요',
        heroText: '프리랜서 아이디어를 전문 제안서와 프로젝트 계획서로 변환',
        problemStatement: '서비스 아이디어만 있으면 충분합니다.',
        solution: '아이디어 → 수주 가능한 전문 제안서',
        examples: [
            '웹개발 아이디어 → 상세 견적서 포함 제안서',
            '브랜딩 디자인 → 단계별 작업 계획서',
            '컨설팅 서비스 → 성과 보장형 서비스 소개서'
        ]
    }
};

export interface Feature {
    title: string;
    description: string;
    icon: any;
    size: 'large' | 'small';
    image: string;
}

export const features: Feature[] = [
    {
        title: "브라우저 확장 프로그램",
        description: "ChatGPT 옆에 딱 붙어서 작동하는 Chrome 확장 프로그램으로 즉시 사용 가능합니다",
        icon: Chrome,
        size: "large" as const,
        image: "https://picsum.photos/seed/chrome-extension/400/300"
    },
    {
        title: "AI 프롬프트 자동 생성",
        description: "간단한 아이디어만 입력하면 전문적인 프롬프트가 즉시 생성됩니다",
        icon: Sparkles,
        size: "small" as const,
        image: "https://picsum.photos/seed/ai-prompt/300/200"
    },
    {
        title: "12가지 시나리오 지원",
        description: "개발, 콘텐츠, 마케팅 등 다양한 업무 시나리오를 지원합니다",
        icon: Target,
        size: "small" as const,
        image: "https://picsum.photos/seed/scenarios/300/200"
    },
    {
        title: "실시간 결과 확인",
        description: "생성된 프롬프트의 품질을 즉시 확인하고 개선할 수 있습니다",
        icon: Zap,
        size: "small" as const,
        image: "https://picsum.photos/seed/realtime/300/200"
    },
    {
        title: "페르소나 맞춤 최적화",
        description: "PM/개발자, 콘텐츠 크리에이터 등 역할별 최적화된 프롬프트를 제공합니다",
        icon: Users,
        size: "small" as const,
        image: "https://picsum.photos/seed/persona/300/200"
    },
    {
        title: "간편한 복사 및 공유",
        description: "생성된 프롬프트를 클릭 한 번으로 복사하여 바로 사용할 수 있습니다",
        icon: MessageSquare,
        size: "small" as const,
        image: "https://picsum.photos/seed/copy/300/200"
    }
];

export interface HowItWorksStep {
    number: string;
    title: string;
    description: string;
    image: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
    {
        number: "01",
        title: "Chrome 확장 프로그램 설치",
        description: "Chrome 웹스토어에서 Smart Prompt Assistant를 설치하세요",
        image: "https://picsum.photos/seed/install/200/150"
    },
    {
        number: "02",
        title: "ChatGPT에서 확장 프로그램 활성화",
        description: "ChatGPT 사이트에서 확장 프로그램 아이콘을 클릭하여 활성화하세요",
        image: "https://picsum.photos/seed/activate/200/150"
    },
    {
        number: "03",
        title: "페르소나 선택",
        description: "본인의 역할에 맞는 페르소나를 선택하세요",
        image: "https://picsum.photos/seed/step1/200/150"
    },
    {
        number: "04",
        title: "아이디어 입력",
        description: "간단한 아이디어나 요구사항을 자연어로 입력하세요",
        image: "https://picsum.photos/seed/step2/200/150"
    },
    {
        number: "05",
        title: "프롬프트 생성 및 사용",
        description: "AI가 생성한 전문적인 프롬프트를 ChatGPT에 바로 사용하세요",
        image: "https://picsum.photos/seed/step3/200/150"
    }
];

export interface PricingFeature {
    text: string;
    included: boolean;
}

export interface PricingPlan {
    name: string;
    description: string;
    price: string;
    popular?: boolean;
    features: PricingFeature[];
}

export const pricingPlans: PricingPlan[] = [
    {
        name: "사전 등록",
        description: "Chrome 확장 프로그램 출시 알림을 받으세요",
        price: "무료",
        popular: true,
        features: [
            { text: "출시 즉시 알림", included: true },
            { text: "얼리버드 할인 혜택", included: true },
            { text: "베타 테스터 우선 선발", included: true },
            { text: "월 50회 프롬프트 생성", included: true },
            { text: "모든 페르소나 지원", included: true },
            { text: "프리미엄 기능", included: false },
        ]
    },
    {
        name: "무료 체험",
        description: "웹에서 스마트 프롬프트를 경험해보세요",
        price: "₩0",
        features: [
            { text: "월 10회 프롬프트 생성", included: true },
            { text: "2가지 페르소나 지원", included: true },
            { text: "기본 시나리오 지원", included: true },
            { text: "이메일 지원", included: true },
            { text: "Chrome 확장 프로그램", included: false },
            { text: "고급 기능", included: false },
        ]
    },
    {
        name: "프로 플랜",
        description: "전문가를 위한 고급 기능",
        price: "₩29,000/월",
        features: [
            { text: "무제한 프롬프트 생성", included: true },
            { text: "모든 페르소나 지원", included: true },
            { text: "고급 시나리오 지원", included: true },
            { text: "우선 고객 지원", included: true },
            { text: "Chrome 확장 프로그램", included: true },
            { text: "팀 협업 기능", included: true },
        ]
    }
];

// Chrome Extension specific data
export interface ChromeExtensionData {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustElements: string[];
    installationSteps: string[];
}

export const chromeExtensionData: ChromeExtensionData = {
    heroTitle: "🧠 ChatGPT가 더 똑똑해지는 마법",
    heroSubtitle: "📌 브라우저에서 즉시 작동하는 크롬 확장 프로그램",
    heroDescription: "ChatGPT 옆에 딱 붙어 막연한 아이디어를 1분 안에 실행 가능한 결과물로",
    ctaPrimary: "Chrome 확장 프로그램 출시 알림 받기",
    ctaSecondary: "👇 지금 바로 체험해보세요",
    trustElements: [
        "개인정보 보호",
        "Chrome 웹스토어 승인",
        "4.9/5 평점",
        "1,248명 사전등록"
    ],
    installationSteps: [
        "Chrome 웹스토어에서 설치",
        "ChatGPT 사이트에서 활성화",
        "즉시 사용 시작"
    ]
};

export const getPersonaData = (persona: Persona): PersonaData => {
    return personas[persona];
};

export const getAllPersonas = (): Persona[] => {
    return Object.keys(personas) as Persona[];
};

export const getPersonaPlaceholder = (persona: Persona): string => {
    return personas[persona].placeholder;
}; 