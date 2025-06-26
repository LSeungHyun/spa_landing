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
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>무료 사전 등록</CardTitle>
        <CardDescription>
          Smart Prompt Assistant 출시 알림을 받고 특별 혜택을 누려보세요!
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
              <Label className="text-sm font-medium">주요 역할 (선택사항)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {personaOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${watchedValues.persona === option.value
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
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-2 mb-6">
              <GiftIcon className="w-6 h-6 text-blue-600" />
              <h4 className="font-bold text-blue-900 text-lg">얼리버드 특별 혜택</h4>
            </div>
            
            <div className="space-y-3 mb-6">
              <CompactBenefitCard
                icon={Zap}
                title="우선 액세스"
                value="₩49,000 상당 • 7일 먼저 체험"
                color="blue"
              />
              <CompactBenefitCard
                icon={Crown}
                title="프리미엄 무료"
                value="₩87,000 상당 • 3개월 무료"
                color="purple"
              />
              <CompactBenefitCard
                icon={Trophy}
                title="창립 멤버 특전"
                value="₩500,000+ 상당 • 평생 50% 할인"
                color="yellow"
              />
              <CompactBenefitCard
                icon={Users}
                title="전용 커뮤니티"
                value="개발진과 직접 소통"
                color="green"
              />
            </div>
            
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border border-yellow-300">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-lg">⚡</span>
                <span className="font-bold text-yellow-800">총 ₩636,000 상당 혜택</span>
              </div>
              <div className="flex items-center justify-center space-x-4 text-xs text-yellow-700">
                <span>첫 100명 한정</span>
                <span>•</span>
                <span>현재 73명 등록</span>
                <span>•</span>
                <span className="font-semibold text-red-600">27자리 남음</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !watchedValues.email}
              className="w-full min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  등록 중...
                </>
              ) : (
                '사전 등록하기'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}