'use client';

import { useState, useEffect, useRef } from 'react';
import { Home, Wand2, Gift, Calendar, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
    badge?: string;
    disabled?: boolean;
}

interface MobileNavBarProps {
    hasTriedDemo?: boolean;
    improveCount?: number;
    showPreRegistration?: boolean;
    onNavigate?: (section: string) => void;
}

export function MobileNavBar({ 
    hasTriedDemo = false, 
    improveCount = 0, 
    showPreRegistration = false,
    onNavigate 
}: MobileNavBarProps) {
    const [activeSection, setActiveSection] = useState('hero');
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    // 스크롤에 따른 네비게이션 바 표시/숨김
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY.current;
            
            // 스크롤 방향에 따라 네비게이션 바 표시/숨김
            if (isScrollingDown && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 섹션 관찰
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id || 'hero';
                        setActiveSection(sectionId);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-20% 0px -20% 0px',
            }
        );

        // 관찰할 섹션들
        const sections = ['hero', 'demo', 'pre-registration'];
        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId) || 
                           document.querySelector(`[data-section="${sectionId}"]`);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (sectionId: string) => {
        let element: HTMLElement | null = null;
        
        switch (sectionId) {
            case 'hero':
                element = document.querySelector('[data-section="hero"]') as HTMLElement ||
                         document.body.firstElementChild as HTMLElement;
                break;
            case 'demo':
                element = document.querySelector('[data-section="demo"]') as HTMLElement ||
                         document.getElementById('demo');
                break;
            case 'pre-registration':
                element = document.querySelector('[data-section="pre-registration"]') as HTMLElement;
                break;
            default:
                element = document.getElementById(sectionId);
        }

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }

        onNavigate?.(sectionId);
    };

    // 동적 네비게이션 아이템 생성
    const getNavItems = (): NavItem[] => {
        const baseItems: NavItem[] = [
            {
                id: 'hero',
                label: '홈',
                icon: Home,
                action: () => scrollToSection('hero'),
            },
            {
                id: 'demo',
                label: hasTriedDemo ? '체험 완료' : 'AI 체험',
                icon: hasTriedDemo ? CheckCircle : Wand2,
                action: () => scrollToSection('demo'),
                badge: hasTriedDemo ? `${Math.min(improveCount, 3)}/3` : undefined,
            },
        ];

        // 무료 등록 버튼 제거 (예약 버튼과 중복되므로)

        // 예약 아이템 (항상 표시) - 사전 등록 섹션으로 스크롤
        baseItems.push({
            id: 'reservation',
            label: '예약',
            icon: Calendar,
            action: () => {
                onNavigate?.('pre-registration');
                scrollToSection('pre-registration');
            },
            badge: showPreRegistration || improveCount >= 1 ? undefined : 'HOT',
        });

        return baseItems;
    };

    const navItems = getNavItems();

    return (
        <>
            {/* 모바일 네비게이션 바 */}
            <nav 
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300",
                    isVisible ? "translate-y-0" : "translate-y-full"
                )}
            >
                {/* 메인 네비게이션 */}
                <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
                    {/* 프로그레스 인디케이터 (체험 진행 시) */}
                    {hasTriedDemo && (
                        <div className="px-4 pt-2">
                            <div className="bg-gray-100 rounded-full h-1 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${(Math.min(improveCount, 3) / 3) * 100}%` }}
                                />
                            </div>
                            <div className="text-center mt-1 mb-2">
                                <span className="text-xs text-gray-600 font-medium">
                                    체험 진행률: {Math.min(improveCount, 3)}/3
                                    {improveCount >= 3 && " 🎉"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* 네비게이션 아이템들 */}
                    <div className="flex items-center justify-around px-2 py-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    disabled={item.disabled}
                                    className={cn(
                                        'relative flex flex-col items-center justify-center min-w-[60px] min-h-[52px] px-3 py-2 rounded-xl transition-all duration-200',
                                        'hover:bg-gray-100 active:scale-95 touch-friendly',
                                        'disabled:opacity-50 disabled:cursor-not-allowed',
                                        isActive
                                            ? 'bg-gradient-to-t from-blue-50 to-purple-50 text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    )}
                                    aria-label={`${item.label}${item.badge ? ` (${item.badge})` : ''}`}
                                >
                                    {/* 배지 */}
                                    {item.badge && (
                                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold shadow-sm min-w-[18px] text-center">
                                            {item.badge}
                                        </div>
                                    )}

                                    {/* 아이콘 */}
                                    <div className={cn(
                                        'relative mb-1 transition-all duration-200',
                                        isActive && 'scale-110'
                                    )}>
                                        <Icon
                                            className={cn(
                                                'w-5 h-5 transition-all duration-200',
                                                isActive ? 'text-blue-600' : 'text-gray-600',
                                                item.id === 'demo' && hasTriedDemo && 'text-green-600'
                                            )}
                                        />
                                        
                                        {/* 활성 상태 인디케이터 */}
                                        {isActive && (
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
                                        )}
                                    </div>

                                    {/* 라벨 */}
                                    <span
                                        className={cn(
                                            'text-xs font-medium transition-all duration-200 text-center leading-tight',
                                            isActive ? 'text-blue-600' : 'text-gray-600',
                                            item.id === 'demo' && hasTriedDemo && 'text-green-600'
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 세이프 에어리어 패딩 (iPhone 등) */}
                    <div className="pb-safe h-safe-area-inset-bottom" />
                </div>
            </nav>

            {/* 네비게이션 바 공간 확보 */}
            <div className="h-20 lg:hidden" />
        </>
    );
} 