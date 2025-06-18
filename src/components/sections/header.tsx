'use client';

import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    onPreRegisterClick: () => void;
}

export default function Header({ onPreRegisterClick }: HeaderProps) {
    return (
        <header className="border-b border-brand-border-primary bg-brand-dark-primary/90 backdrop-blur fixed top-0 w-full z-50">
            <Container>
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <span className="font-bold text-lg">Smart Prompt</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-brand-text-secondary hover:text-white transition-colors">
                            특징
                        </a>
                        <a href="#how" className="text-brand-text-secondary hover:text-white transition-colors">
                            사용법
                        </a>
                        <a href="#pricing" className="text-brand-text-secondary hover:text-white transition-colors">
                            가격
                        </a>
                        <Button
                            onClick={onPreRegisterClick}
                            variant="outline"
                            className="border-brand-border-primary text-brand-text-primary hover:bg-brand-surface-primary"
                        >
                            사전등록
                        </Button>
                    </nav>
                </div>
            </Container>
        </header>
    );
} 