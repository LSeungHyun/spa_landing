import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    background?: 'default' | 'gradient' | 'dark';
}

export const Section: React.FC<SectionProps> = ({
    children,
    className,
    id,
    background = 'default'
}) => {
    const backgroundClasses = {
        default: 'bg-white',
        gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
        dark: 'bg-gray-900 text-white'
    };

    return (
        <section
            id={id}
            className={cn(
                'py-16 md:py-24',
                backgroundClasses[background],
                className
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
}; 