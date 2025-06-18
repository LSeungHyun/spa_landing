'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PreRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PreRegisterModal({ isOpen, onClose }: PreRegisterModalProps) {
    const [email, setEmail] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('이메일을 입력해주세요');
            return;
        }
        setIsRegistered(true);
        toast.success('사전등록이 완료되었습니다!');
    };

    const handleClose = () => {
        setEmail('');
        setIsRegistered(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface-primary border border-brand-border-primary rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-center">🚀 사전등록</h2>
                <p className="text-brand-text-secondary mb-6 text-center">
                    런칭 소식을 가장 먼저 받아보세요!
                </p>

                {!isRegistered ? (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="이메일 주소를 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-brand-dark-primary border-brand-border-primary text-brand-text-primary"
                        />
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            사전등록하기
                        </Button>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2">등록 완료!</h4>
                        <p className="text-brand-text-secondary mb-4">
                            출시 소식을 이메일로 보내드릴게요
                        </p>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-brand-text-secondary mb-4">
                        또는 다른 방법으로 소식을 받아보세요:
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => {
                                window.open('https://www.instagram.com/ledag_official/', '_blank');
                                onClose();
                            }}
                            className="w-full mt-4 text-brand-text-secondary hover:text-brand-text-primary"
                        >
                            Instagram
                        </button>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="w-full mt-4 text-brand-text-secondary hover:text-brand-text-primary"
                >
                    닫기
                </Button>
            </div>
        </div>
    );
} 