'use client';

import { useState, useEffect } from 'react';
import { Home, Sparkles, Zap, CreditCard, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
}

const navItems: NavItem[] = [
    {
        id: 'hero',
        label: '홈',
        icon: Home,
        href: '#hero',
    },
    {
        id: 'demo',
        label: 'AI 체험',
        icon: Sparkles,
        href: '#demo',
    },
    {
        id: 'features',
        label: '기능',
        icon: Zap,
        href: '#features',
    },
    {
        id: 'pricing',
        label: '요금제',
        icon: CreditCard,
        href: '#pricing',
    },
    {
        id: 'contact',
        label: '문의',
        icon: MessageCircle,
        href: '#contact',
    },
];

export function MobileNavBar() {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-50% 0px -50% 0px',
            }
        );

        // 관찰할 섹션들
        const sections = navItems.map(item => item.id);
        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, []);

    const handleNavClick = (href: string) => {
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <div className="bg-brand-dark-primary/95 backdrop-blur-md border-t border-brand-border-primary">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.href)}
                                className={cn(
                                    'flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-all duration-200',
                                    'hover:bg-brand-surface-primary active:scale-95',
                                    isActive
                                        ? 'text-white bg-brand-surface-primary'
                                        : 'text-brand-text-secondary hover:text-brand-text-primary'
                                )}
                                aria-label={`${item.label}로 이동`}
                            >
                                <Icon
                                    className={cn(
                                        'w-5 h-5 mb-1 transition-all duration-200',
                                        isActive && 'scale-110'
                                    )}
                                />
                                <span
                                    className={cn(
                                        'text-xs font-medium transition-all duration-200',
                                        isActive ? 'opacity-100' : 'opacity-80'
                                    )}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {/* Safe area padding for iPhone */}
                <div className="h-safe-area-inset-bottom" />
            </div>
        </nav>
    );
} 