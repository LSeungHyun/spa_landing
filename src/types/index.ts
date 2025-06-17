// Common types and interfaces for the application

export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
    title?: string;
    description?: string;
    image?: string;
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    variant?: 'default' | 'secondary' | 'muted';
}

// Re-export all types from sub-modules
export * from './process';
export * from './smart-prompt';
export * from './api'; 