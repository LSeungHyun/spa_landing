import { Boxes, Code, Scale, Search, Smartphone, Zap, Target, Clock, Users, Lightbulb } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
    size: "small" | "large";
    image: string;
}

export const defaultFeatures: Feature[] = [
    {
        title: "스마트 프롬프트 생성",
        description: "AI가 당신의 의도를 파악해 최적의 프롬프트를 자동 생성합니다",
        icon: Lightbulb,
        size: "large",
        image: "/images/features/smart-prompt.jpg"
    },
    {
        title: "실시간 최적화",
        description: "사용 패턴을 학습해 개인 맞춤형 결과를 제공합니다",
        icon: Zap,
        size: "small",
        image: "/images/features/optimization.jpg"
    },
    {
        title: "다양한 템플릿",
        description: "직업군별, 용도별 특화된 프롬프트 템플릿을 제공합니다",
        icon: Boxes,
        size: "small",
        image: "/images/features/templates.jpg"
    },
    {
        title: "협업 기능",
        description: "팀원들과 프롬프트를 공유하고 함께 개선할 수 있습니다",
        icon: Users,
        size: "small",
        image: "/images/features/collaboration.jpg"
    },
    {
        title: "성과 분석",
        description: "프롬프트 성능을 분석하고 개선점을 제안합니다",
        icon: Target,
        size: "large",
        image: "/images/features/analytics.jpg"
    },
    {
        title: "빠른 응답",
        description: "1분 이내 고품질 결과물을 생성합니다",
        icon: Clock,
        size: "small",
        image: "/images/features/speed.jpg"
    }
]; 