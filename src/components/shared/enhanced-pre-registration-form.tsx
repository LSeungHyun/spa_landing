'use client';

import { useState } from 'react';
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
import { database } from '@/lib/supabase';
import type { PreRegistrationFormData, ApiResponse, PreRegistrationResponse } from '@/types/spa-landing';

// 폼 유효성 검사 스키마
const preRegistrationSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  name: z.string().optional(),
  persona: z.enum(['pm', 'creator', 'startup', 'developer', 'marketer', 'other'], {
    required_error: '역할을 선택해주세요',
  }),
  company: z.string().optional(),
  company_size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+', 'freelancer']).optional(),
  use_case: z.string().optional(),
  referral_source: z.enum(['google', 'social_media', 'friend', 'blog', 'ad', 'other']).optional(),
  marketing_consent: z.boolean().default(false),
  newsletter_consent: z.boolean().default(false),
  beta_interest: z.boolean().default(true),
  expected_usage: z.enum(['daily', 'weekly', 'monthly', 'occasionally']).optional(),
  current_tools: z.array(z.string()).optional(),
  pain_points: z.array(z.string()).optional(),
  platform_preference: z.enum(['web', 'mobile', 'both', 'api']).optional(),
});

type PreRegistrationFormValues = z.infer<typeof preRegistrationSchema>;

interface EnhancedPreRegistrationFormProps {
  onSuccess?: (data: PreRegistrationResponse) => void;
  onClose?: () => void;
  className?: string;
}

export function EnhancedPreRegistrationForm({
  onSuccess,
  onClose,
  className = '',
}: EnhancedPreRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PreRegistrationFormValues>({
    resolver: zodResolver(preRegistrationSchema),
    defaultValues: {
      marketing_consent: false,
      newsletter_consent: false,
      beta_interest: true,
    },
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

  const companySizeOptions = [
    { value: 'freelancer', label: '프리랜서' },
    { value: '1-10', label: '1-10명' },
    { value: '11-50', label: '11-50명' },
    { value: '51-200', label: '51-200명' },
    { value: '201-1000', label: '201-1000명' },
    { value: '1000+', label: '1000명 이상' },
  ];

  const referralOptions = [
    { value: 'google', label: '구글 검색' },
    { value: 'social_media', label: '소셜 미디어' },
    { value: 'friend', label: '지인 추천' },
    { value: 'blog', label: '블로그/기사' },
    { value: 'ad', label: '온라인 광고' },
    { value: 'other', label: '기타' },
  ];

  const usageOptions = [
    { value: 'daily', label: '매일' },
    { value: 'weekly', label: '주 2-3회' },
    { value: 'monthly', label: '월 2-3회' },
    { value: 'occasionally', label: '가끔' },
  ];

  const platformOptions = [
    { value: 'web', label: '웹 브라우저' },
    { value: 'mobile', label: '모바일 앱' },
    { value: 'both', label: '웹 + 모바일' },
    { value: 'api', label: 'API 연동' },
  ];

  const onSubmit = async (data: PreRegistrationFormValues) => {
    setIsSubmitting(true);

    try {
      // 이메일 중복 확인
      const { exists, error: checkError } = await database.checkEmailExists(data.email);
      
      if (checkError) {
        toast.error('이메일 확인 중 오류가 발생했습니다.');
        return;
      }

      if (exists) {
        toast.error('이미 등록된 이메일입니다.');
        return;
      }

      // 사전 등록 데이터 저장
      const registrationData = {
        email: data.email,
        name: data.name || null,
        persona: data.persona,
        company: data.company || null,
        company_size: data.company_size || null,
        use_case: data.use_case || null,
        referral_source: data.referral_source || null,
        marketing_consent: data.marketing_consent,
        newsletter_consent: data.newsletter_consent,
        beta_interest: data.beta_interest,
        expected_usage: data.expected_usage || null,
        current_tools: data.current_tools || [],
        pain_points: data.pain_points || [],
        platform_preference: data.platform_preference || null,
        ip_address: null, // 클라이언트에서는 설정하지 않음
        user_agent: navigator.userAgent,
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
      };

      const { data: result, error } = await database.addPreRegistration(registrationData);

      if (error) {
        console.error('Registration error:', error);
        toast.error('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        return;
      }

      // 성공 처리
      toast.success('🎉 사전 등록이 완료되었습니다!');
      
      if (data.newsletter_consent) {
        toast.success('📧 뉴스레터 구독이 설정되었습니다.');
      }

      if (data.beta_interest) {
        toast.success('🚀 베타 테스트 알림을 받으실 수 있습니다.');
      }

      onSuccess?.(result);
      onClose?.();

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('예상치 못한 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep1 = () => (
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
          이름 (선택사항)
        </Label>
        <Input
          id="name"
          placeholder="홍길동"
          className="mt-1"
          {...register('name')}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">역할 *</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {personaOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('persona', option.value as any)}
                className={`p-3 border rounded-lg text-left transition-all ${
                  watchedValues.persona === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <p className="text-xs text-gray-600">{option.description}</p>
              </button>
            );
          })}
        </div>
        {errors.persona && (
          <p className="text-sm text-red-600 mt-1">{errors.persona.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="company" className="text-sm font-medium">
          회사명 (선택사항)
        </Label>
        <Input
          id="company"
          placeholder="회사명을 입력해주세요"
          className="mt-1"
          {...register('company')}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">회사 규모</Label>
        <Select onValueChange={(value) => setValue('company_size', value as any)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="회사 규모를 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            {companySizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="use_case" className="text-sm font-medium">
          사용 목적 (선택사항)
        </Label>
        <Textarea
          id="use_case"
          placeholder="어떤 용도로 사용하실 예정인가요?"
          className="mt-1"
          rows={3}
          {...register('use_case')}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">어떻게 알게 되셨나요?</Label>
        <Select onValueChange={(value) => setValue('referral_source', value as any)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="경로를 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            {referralOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">예상 사용 빈도</Label>
        <Select onValueChange={(value) => setValue('expected_usage', value as any)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="사용 빈도를 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            {usageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">선호 플랫폼</Label>
        <Select onValueChange={(value) => setValue('platform_preference', value as any)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="플랫폼을 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            {platformOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="marketing_consent"
            checked={watchedValues.marketing_consent}
            onCheckedChange={(checked) => setValue('marketing_consent', !!checked)}
          />
          <div>
            <Label htmlFor="marketing_consent" className="text-sm font-medium">
              마케팅 정보 수신 동의
            </Label>
            <p className="text-xs text-gray-600 mt-1">
              제품 업데이트, 이벤트, 할인 혜택 등의 마케팅 정보를 받아보실 수 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="newsletter_consent"
            checked={watchedValues.newsletter_consent}
            onCheckedChange={(checked) => setValue('newsletter_consent', !!checked)}
          />
          <div>
            <Label htmlFor="newsletter_consent" className="text-sm font-medium">
              뉴스레터 구독
            </Label>
            <p className="text-xs text-gray-600 mt-1">
              AI 프롬프트 작성 팁과 업계 인사이트를 담은 뉴스레터를 받아보세요.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="beta_interest"
            checked={watchedValues.beta_interest}
            onCheckedChange={(checked) => setValue('beta_interest', !!checked)}
          />
          <div>
            <Label htmlFor="beta_interest" className="text-sm font-medium">
              베타 테스트 참여 관심
            </Label>
            <p className="text-xs text-gray-600 mt-1">
              출시 전 베타 버전을 먼저 체험하고 피드백을 제공해주세요.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-sm mb-2">🎁 얼리버드 혜택</h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• 출시 시 30% 할인 쿠폰</li>
          <li>• 프리미엄 기능 1개월 무료</li>
          <li>• 베타 테스터 전용 커뮤니티 초대</li>
          <li>• 개발진과의 직접 소통 기회</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          무료 사전 등록
          <span className="text-sm font-normal text-gray-500">
            {step}/{totalSteps}
          </span>
        </CardTitle>
        <CardDescription>
          Smart Prompt Assistant 출시 알림을 받고 특별 혜택을 누려보세요!
        </CardDescription>
        
        {/* 진행 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                이전
              </Button>
            )}
            
            <div className="flex-1" />

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!watchedValues.email || !watchedValues.persona}
              >
                다음
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="min-w-[120px]"
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
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 