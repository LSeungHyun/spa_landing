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
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('이메일을 입력해주세요');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/pre-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim()
                })
            });

            const result = await response.json();

            if (response.ok) {
                setIsRegistered(true);
                toast.success('사전등록이 완료되었습니다!');
            } else {
                // 서버에서 온 에러 메시지 표시
                if (result.details?.code === 'EMAIL_ALREADY_EXISTS') {
                    toast.error('이미 등록된 이메일입니다');
                } else if (result.details?.code === 'VALIDATION_ERROR') {
                    toast.error('올바른 이메일 주소를 입력해주세요');
                } else {
                    toast.error(result.error || '등록 중 오류가 발생했습니다');
                }
            }
        } catch (error) {
            console.error('API 호출 오류:', error);
            toast.error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setIsRegistered(false);
        setIsLoading(false);
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
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    등록 중...
                                </div>
                            ) : (
                                '사전등록하기'
                            )}
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
                    disabled={isLoading}
                >
                    닫기
                </Button>
            </div>
        </div>
    );
} 