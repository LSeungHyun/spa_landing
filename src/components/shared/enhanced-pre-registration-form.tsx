'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Building, Target, Users, Zap, Mail } from 'lucide-react';

// 폼 유효성 검사 스키마
const preRegistrationSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  name: z.string().optional(),
  persona: z.enum(['pm', 'creator', 'startup', 'developer', 'marketer', 'other'], {
    required_error: '역할을 선택해주세요',
  }),
});

type PreRegistrationFormValues = z.infer<typeof preRegistrationSchema>;

interface EnhancedPreRegistrationFormProps {
  onSuccess?: (data: any) => void;
  onClose?: () => void;
  className?: string;
}

export function EnhancedPreRegistrationForm({
  onSuccess,
  onClose,
  className = '',
}: EnhancedPreRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PreRegistrationFormValues>({
    resolver: zodResolver(preRegistrationSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const watchedValues = watch();

  const personaOptions = [
    { value: 'pm', label: '프로덕트 매니저', icon: Target, description: '제품 기획 및 관리' },
    { value: 'creator', label: '콘텐츠 크리에이터', icon: Zap, description: '콘텐츠 제작 및 마케팅' },
    { value: 'startup', label: '스타트업 창업자', icon: Users, description: '사업 기획 및 운영' },
    { value: 'developer', label: '개발자', icon: User, description: '소프트웨어 개발' },
    { value: 'marketer', label: '마케터', icon: Mail, description: '마케팅 및 홍보' },
    { value: 'other', label: '기타', icon: Building, description: '기타 직무' },
  ];


  const onSubmit = async (data: PreRegistrationFormValues) => {
    setIsSubmitting(true);

    try {
      // API를 통한 사전 등록
      const response = await fetch('/api/pre-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          name_or_nickname: data.name || undefined,
          // 추가 정보들
          additional_info: {
            persona: data.persona,
            user_agent: navigator.userAgent,
            utm_source: new URLSearchParams(window.location.search).get('utm_source'),
            utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
            utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          }
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // 성공 처리
        toast.success('🎉 사전 등록이 완료되었습니다!');

        onSuccess?.(result);
        onClose?.();
      } else if (response.status === 409) {
        toast.error(result.error || '이미 등록된 이메일입니다.');
      } else {
        toast.error(result.error || '등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>무료 사전 등록</CardTitle>
        <CardDescription>
          Smart Prompt Assistant 출시 알림을 받고 특별 혜택을 누려보세요!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                이메일 주소 *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="mt-1"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                이름 또는 닉네임 (선택사항)
              </Label>
              <Input
                id="name"
                placeholder="홍길동"
                className="mt-1"
                {...register('name')}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">주요 역할 *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {personaOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        watchedValues.persona === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setValue('persona', option.value as any)}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                    </div>
                  );
                })}
              </div>
              {errors.persona && (
                <p className="text-sm text-red-600 mt-1">{errors.persona.message}</p>
              )}
            </div>
          </div>

          {/* 얼리버드 혜택 카드 */}
          <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">🎁 얼리버드 혜택</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 출시 시 30% 할인 쿠폰</li>
                <li>• 프리미엄 기능 1개월 무료</li>
                <li>• 베타 테스터 전용 커뮤니티 초대</li>
                <li>• 개발진과의 직접 소통 기회</li>
              </ul>
            </div>

          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !watchedValues.email || !watchedValues.persona}
              className="w-full min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  등록 중...
                </>
              ) : (
                '등록 완료'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}