import { Boxes, Code, Scale, Search, Smartphone, Zap, Target, Clock, Users, Lightbulb, FileText, Workflow, Rocket } from "lucide-react";
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
        title: "아이디어 → 실행 문서 변환",
        description: "막연한 아이디어를 PRD, 기획서, 사업계획서 등 즉시 활용 가능한 실행 문서로 자동 변환합니다",
        icon: FileText,
        size: "large",
        image: "/images/features/smart-prompt.jpg"
    },
    {
        title: "페르소나 맞춤 특화",
        description: "PM, 창업자, 마케터 등 6개 역할별 특화된 템플릿으로 더 정확하고 실용적인 결과물을 제공합니다",
        icon: Users,
        size: "small",
        image: "/images/features/optimization.jpg"
    },
    {
        title: "ChatGPT 네이티브 통합",
        description: "브라우저 전환 없이 ChatGPT 사이드패널에서 바로 작동하는 원클릭 워크플로우를 제공합니다",
        icon: Workflow,
        size: "small",
        image: "/images/features/templates.jpg"
    },
    {
        title: "1분 완성 워크플로우",
        description: "아이디어 입력부터 완성된 결과물까지 1분 이내 완료되는 초고속 생산성 워크플로우입니다",
        icon: Rocket,
        size: "small",
        image: "/images/features/collaboration.jpg"
    },
    {
        title: "실시간 품질 검증",
        description: "Before/After 비교를 통해 개선된 프롬프트의 품질을 즉시 확인하고 최적의 결과를 보장합니다",
        icon: Target,
        size: "large",
        image: "/images/features/analytics.jpg"
    },
    {
        title: "전문가급 결과물 보장",
        description: "초보자도 전문가 수준의 기획서, 제안서, 전략 문서를 생성할 수 있도록 지원합니다",
        icon: Lightbulb,
        size: "small",
        image: "/images/features/speed.jpg"
    }
]; 