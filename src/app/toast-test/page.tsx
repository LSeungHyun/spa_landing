'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ToastTestPage() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Toast 테스트</h1>
            <div className="space-y-4">
                <Button onClick={() => toast.success('성공!')}>
                    성공 토스트
                </Button>
                <Button onClick={() => toast.error('에러!')}>
                    에러 토스트
                </Button>
                <Button onClick={() => toast('기본 토스트')}>
                    기본 토스트
                </Button>
            </div>
        </div>
    );
} 