'use client';

import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    onPreRegisterClick: () => void;
}

export default function Header({ onPreRegisterClick }: HeaderProps) {
    return (
        <header className="border-b border-[#2D2D2D] bg-[#0A0A0A]/90 backdrop-blur fixed top-0 w-full z-50">
            <Container>
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <span className="font-bold text-lg">Smart Prompt</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-[#94A3B8] hover:text-white transition-colors">
                            기능
                        </a>
                        <a href="#how" className="text-[#94A3B8] hover:text-white transition-colors">
                            작동원리
                        </a>
                        <a href="#pricing" className="text-[#94A3B8] hover:text-white transition-colors">
                            요금제
                        </a>
                        <Button
                            onClick={onPreRegisterClick}
                            variant="outline"
                            className="border-[#2D2D2D] text-[#E2E8F0] hover:bg-[#1A1A1A]"
                        >
                            사전등록
                        </Button>
                    </nav>
                </div>
            </Container>
        </header>
    );
} 