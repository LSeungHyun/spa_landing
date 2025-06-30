'use client';

import React, { useState, useCallback } from 'react';
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
import { Loader2, User, Building, Target, Users, Zap, Mail, Crown, Trophy, Gift as GiftIcon } from 'lucide-react';
import { CompactBenefitCard } from './benefit-card';

// 폼 유효성 검사 스키마
const preRegistrationSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  name: z.string().optional(),
  persona: z.enum(['pm', 'creator', 'startup', 'developer', 'marketer', 'other']).optional(),
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
  const [apiStatus, setApiStatus] = useState<'unknown' | 'checking' | 'available' | 'unavailable'>('unknown');

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

      // 응답이 JSON인지 확인
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('API returned non-JSON response:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          url: response.url
        });

        // HTML 응답인 경우 (보통 404나 500 에러 페이지)
        if (contentType && contentType.includes('text/html')) {
          throw new Error('API_NOT_AVAILABLE');
        }

        throw new Error('INVALID_RESPONSE_FORMAT');
      }

      const result = await response.json();

      if (response.ok) {
        // 성공 처리
        toast.success('🎉 사전 등록이 완료되었습니다!');
        onSuccess?.(result);
        onClose?.();
      } else if (response.status === 409) {
        toast.error(result.error || '이미 등록된 이메일입니다.');
      } else {
        console.error('API error response:', {
          status: response.status,
          error: result.error,
          details: result.details
        });
        toast.error(result.error || '등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      }

    } catch (error) {
      console.error('Registration error:', error);

      // 에러 타입에 따른 적절한 메시지 표시
      if (error instanceof Error) {
        switch (error.message) {
          case 'API_NOT_AVAILABLE':
            toast.error('서비스가 일시적으로 이용할 수 없습니다. 잠시 후 다시 시도해주세요.');
            break;
          case 'INVALID_RESPONSE_FORMAT':
            toast.error('서버 응답 형식이 올바르지 않습니다. 관리자에게 문의해주세요.');
            break;
          default:
            if (error.message.includes('fetch')) {
              toast.error('네트워크 연결을 확인하고 다시 시도해주세요.');
            } else {
              toast.error('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
      } else {
        toast.error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 개발 모드에서 API 상태 확인
  const checkApiStatus = useCallback(async () => {
    if (process.env.NODE_ENV !== 'development') return;

    setApiStatus('checking');
    try {
      const response = await fetch('/api/pre-register', { method: 'GET' });
      const contentType = response.headers.get('content-type');

      if (response.ok && contentType?.includes('application/json')) {
        const data = await response.json();
        console.log('API Status Check:', data);
        setApiStatus('available');
      } else {
        console.error('API Status Check Failed:', {
          status: response.status,
          contentType,
          url: response.url
        });
        setApiStatus('unavailable');
      }
    } catch (error) {
      console.error('API Status Check Error:', error);
      setApiStatus('unavailable');
    }
  }, []);

  // 컴포넌트 마운트 시 API 상태 확인 (개발 모드에서만)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      checkApiStatus();
    }
  }, [checkApiStatus]);

  return (
    <Card className={`w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Crown className="w-6 h-6 text-yellow-400" />
          <span>First Mover Club 참여하기</span>
        </CardTitle>
        <CardDescription className="text-purple-200">
          제품 개발에 직접 참여하고 특별한 혜택을 받아보세요!
        </CardDescription>

        {/* 개발 모드에서만 API 상태 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div className={`text-xs px-2 py-1 rounded-md ${apiStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' :
            apiStatus === 'available' ? 'bg-green-100 text-green-800' :
              apiStatus === 'unavailable' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
            }`}>
            API 상태: {
              apiStatus === 'checking' ? '확인 중...' :
                apiStatus === 'available' ? '정상' :
                  apiStatus === 'unavailable' ? '오류' :
                    '알 수 없음'
            }
            {apiStatus === 'unavailable' && (
              <button
                onClick={checkApiStatus}
                className="ml-2 underline hover:no-underline"
              >
                다시 확인
              </button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-white">
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
              <Label htmlFor="name" className="text-sm font-medium text-white">
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
              <Label className="text-sm font-medium text-white">주요 역할 (선택사항)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {personaOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${watchedValues.persona === option.value
                        ? 'border-purple-400 bg-purple-500/20 text-white'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800/50 text-gray-300 hover:text-white'
                        }`}
                      onClick={() => setValue('persona', option.value as any)}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs mt-1 opacity-75">{option.description}</p>
                    </div>
                  );
                })}
              </div>
              {errors.persona && (
                <p className="text-sm text-red-600 mt-1">{errors.persona.message}</p>
              )}
            </div>
          </div>



          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !watchedValues.email}
              className="w-full min-w-[120px] bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  등록 중...
                </>
              ) : (
                'First Mover Club 참여하기'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}