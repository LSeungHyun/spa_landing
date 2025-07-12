'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { 
  Crown, 
  Users, 
  Clock, 
  Gift, 
  CheckCircle2,
  Mail,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export function PreRegistrationSection() {
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handlePreRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('이메일을 입력해주세요');
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch('/api/pre-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 사전 등록 완료! 출시 알림을 받으실 거예요.');
        setEmail('');
        
        setTimeout(() => {
          toast.success('🎁 얼리버드 혜택이 적용되었습니다!');
        }, 1500);
      } else if (response.status === 409) {
        toast.error(data.error || '이미 등록된 이메일입니다');
      } else {
        toast.error(data.error || '등록에 실패했습니다. 다시 시도해주세요.');
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Section id="pre-registration-section" className="bg-gradient-to-br from-blue-50 to-purple-50">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-800">
              <Crown className="w-4 h-4 mr-1" />
              First Mover Club 초대
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              First Mover Club에 초대합니다 🚀
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              당신의 목소리로 제품을 완성해주세요
            </p>
          </div>

          {/* 혜택 카드들 */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="font-bold text-lg mb-3">실질적인 제품 영향력</h3>
                  <p className="text-sm text-gray-600">
                    비공개 베타 우선 초대, 신기능 투표, 개발자 직접 소통 채널 참여
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="font-bold text-lg mb-3">영구적인 명예와 인정</h3>
                  <p className="text-sm text-gray-600">
                    '명예의 전당(Hall of Fame)'에 닉네임 등재 및 전용 디지털 뱃지 제공
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🎁</div>
                  <h3 className="font-bold text-lg mb-3">감사의 웰컴 리워드</h3>
                  <p className="text-sm text-gray-600">
                    정식 출시 후 첫 결제 시 사용 가능한 ₩10,000 웰컴 크레딧 제공
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* VIP 독점 혜택 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-8 border border-yellow-200"
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-2xl">👑</span>
                <span className="text-yellow-700 font-bold text-lg">VIP 독점 혜택</span>
              </div>
              <p className="text-gray-800 font-semibold mb-2">
                First Mover Club 특별 혜택
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-yellow-700">
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>현재 87명 참여</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>13자리 남음</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 사전 등록 폼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  사전 등록하기
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePreRegistration} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="이메일 주소를 입력하세요"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    {isRegistering ? '등록 중...' : '지금 등록하기'}
                  </Button>
                </form>
                
                <div className="mt-4 text-center text-xs text-gray-500">
                  스팸 메일은 절대 보내지 않습니다. 언제든지 구독을 취소할 수 있습니다.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
} 