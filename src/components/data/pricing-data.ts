export interface PricingPlan {
    name: string;
    description: string;
    price: string;
    features: Array<{
        text: string;
        included: boolean;
    }>;
    popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
    {
        name: "스타터",
        description: "개인 사용자를 위한 기본 플랜",
        price: "무료",
        features: [
            { text: "월 10개 프롬프트 생성", included: true },
            { text: "기본 페르소나 3개", included: true },
            { text: "이메일 지원", included: true },
            { text: "고급 페르소나", included: false },
            { text: "팀 협업 기능", included: false },
            { text: "API 접근", included: false }
        ]
    },
    {
        name: "프로",
        description: "전문가를 위한 완전한 기능",
        price: "월 29,000원",
        popular: true,
        features: [
            { text: "무제한 프롬프트 생성", included: true },
            { text: "모든 페르소나 9개", included: true },
            { text: "우선 고객 지원", included: true },
            { text: "고급 최적화 기능", included: true },
            { text: "프롬프트 히스토리", included: true },
            { text: "API 접근", included: false }
        ]
    },
    {
        name: "팀",
        description: "팀과 기업을 위한 협업 플랜",
        price: "월 99,000원",
        features: [
            { text: "무제한 프롬프트 생성", included: true },
            { text: "모든 페르소나 + 커스텀", included: true },
            { text: "24/7 전담 지원", included: true },
            { text: "팀 협업 및 공유", included: true },
            { text: "고급 분석 대시보드", included: true },
            { text: "전체 API 접근", included: true }
        ]
    }
]; 