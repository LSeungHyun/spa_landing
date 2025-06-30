'use client';

import { motion } from 'framer-motion';
import { 
    Star, 
    Shield, 
    Users, 
    Award, 
    Lock, 
    CheckCircle, 
    Zap,
    MessageSquare,
    TrendingUp,
    Eye,
    Clock,
    Target,
    Lightbulb,
    Heart
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TrustElementsProps {
    variant?: 'default' | 'compact' | 'detailed';
    showTestimonials?: boolean;
    showStats?: boolean;
    className?: string;
}

interface TrustBadge {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    color: string;
    bgColor: string;
}

interface Testimonial {
    quote: string;
    author: string;
    role: string;
    rating: number;
    verified: boolean;
}

const trustBadges: TrustBadge[] = [
    {
        icon: Shield,
        title: "개인정보 보호",
        description: "사용자 데이터는 안전하게 보호됩니다",
        color: "text-green-600",
        bgColor: "bg-green-100"
    },
    {
        icon: Target,
        title: "검증된 컨셉",
        description: "베타 테스터 검증 완료",
        color: "text-blue-600",
        bgColor: "bg-blue-100"
    },
    {
        icon: Lightbulb,
        title: "AI 전문팀",
        description: "프롬프트 엔지니어링 전문가 개발",
        color: "text-purple-600",
        bgColor: "bg-purple-100"
    },
    {
        icon: Heart,
        title: "사용자 중심",
        description: "실제 사용자 피드백 기반 개발",
        color: "text-red-600",
        bgColor: "bg-red-100"
    }
];

const testimonials: Testimonial[] = [
    {
        quote: "베타 테스트에서 프롬프트 작성 시간이 정말 많이 줄었어요. 정식 출시가 기대됩니다!",
        author: "김민수",
        role: "스타트업 대표",
        rating: 5,
        verified: true
    },
    {
        quote: "개발 관련 프롬프트 생성 기능이 인상적이었습니다. 꼭 사용해보고 싶어요.",
        author: "이지현",
        role: "프론트엔드 개발자",
        rating: 5,
        verified: true
    },
    {
        quote: "콘텐츠 제작에 정말 도움이 될 것 같아요. 출시되면 바로 사용할 예정입니다.",
        author: "박소영",
        role: "콘텐츠 크리에이터",
        rating: 5,
        verified: true
    }
];

const trustStats = [
    {
        icon: Users,
        value: "1,248명",
        label: "사전 등록자",
        color: "text-blue-600"
    },
    {
        icon: Star,
        value: "4.9/5",
        label: "베타 만족도",
        color: "text-yellow-500"
    },
    {
        icon: TrendingUp,
        value: "95%",
        label: "출시 기대율",
        color: "text-green-600"
    },
    {
        icon: Clock,
        value: "2025년 1월",
        label: "예정 출시일",
        color: "text-purple-600"
    }
];

export function TrustElements({ 
    variant = 'default', 
    showTestimonials = true, 
    showStats = true,
    className 
}: TrustElementsProps) {
    return (
        <div className={cn("w-full", className)}>
            {/* Trust Badges */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                {variant === 'compact' ? (
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
                        {trustBadges.map((badge, index) => {
                            const Icon = badge.icon;
                            return (
                                <div key={badge.title} className="flex items-center gap-2">
                                    <Icon className={cn("w-4 h-4", badge.color)} />
                                    <span>{badge.title}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {trustBadges.map((badge, index) => {
                            const Icon = badge.icon;
                            return (
                                <motion.div
                                    key={badge.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="p-4 text-center hover:shadow-lg transition-all duration-300 h-full">
                                        <div className={cn("w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center", badge.bgColor)}>
                                            <Icon className={cn("w-6 h-6", badge.color)} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                                            {badge.title}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {badge.description}
                                        </p>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Trust Statistics */}
            {showStats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                🚀 베타 테스터들의 반응
                            </h3>
                            <p className="text-sm text-gray-600">
                                실제 베타 테스터들의 피드백과 통계입니다
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {trustStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="flex items-center justify-center mb-2">
                                            <Icon className={cn("w-6 h-6", stat.color)} />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Testimonials */}
            {showTestimonials && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            💬 베타 테스터 후기
                        </h3>
                        <p className="text-sm text-gray-600">
                            실제 사용해본 분들의 솔직한 후기입니다
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            >
                                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300">
                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    
                                    {/* Quote */}
                                    <blockquote className="text-gray-700 text-sm leading-relaxed mb-4">
                                        "{testimonial.quote}"
                                    </blockquote>
                                    
                                    {/* Author */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">
                                                {testimonial.author}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {testimonial.role}
                                            </div>
                                        </div>
                                        
                                        {testimonial.verified && (
                                            <Badge variant="secondary" className="text-xs">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                베타 테스터
                                            </Badge>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Privacy Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 text-center"
            >
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                    <Lock className="w-4 h-4" />
                    <span>사전등록 정보는 안전하게 보호되며, 마케팅 목적으로만 사용됩니다</span>
                </div>
            </motion.div>
        </div>
    );
}

// Variant components for different use cases
export function CompactTrustElements({ className }: { className?: string }) {
    return (
        <TrustElements 
            variant="compact" 
            showTestimonials={false} 
            showStats={false}
            className={className}
        />
    );
}

export function DetailedTrustElements({ className }: { className?: string }) {
    return (
        <TrustElements 
            variant="detailed" 
            showTestimonials={true} 
            showStats={true}
            className={className}
        />
    );
} 