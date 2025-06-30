"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Gift, 
  Clock, 
  Users, 
  Star, 
  Zap, 
  Crown, 
  Trophy,
  Timer,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Vote,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BenefitCard } from '@/components/shared/benefit-card';

interface EarlyBirdSectionProps {
  onRegisterClick?: () => void;
  className?: string;
}



const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // 가상의 마감일 설정 (현재 시간으로부터 7일 후)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center space-x-4 text-white">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px] border border-white/30">
            <div className="text-2xl font-bold">{value.toString().padStart(2, '0')}</div>
          </div>
          <div className="text-xs text-blue-200 mt-1 capitalize">{unit}</div>
        </div>
      ))}
    </div>
  );
};

export function EarlyBirdSection({ onRegisterClick, className }: EarlyBirdSectionProps) {
  const benefits = [
    {
      icon: MessageCircle,
      title: "실질적인 제품 영향력",
      description: "비공개 베타 우선 초대, 신기능 투표, 개발자 직접 소통 채널 참여",
      value: "",
      delay: 0.1
    },
    {
      icon: Trophy,
      title: "영구적인 명예와 인정",
      description: "'명예의 전당(Hall of Fame)'에 닉네임 등재 및 전용 디지털 뱃지 제공",
      value: "",
      highlight: true,
      delay: 0.2
    },
    {
      icon: Gift,
      title: "감사의 웰컴 리워드",
      description: "정식 출시 후 첫 결제 시 사용 가능한 ₩10,000 웰컴 크레딧 제공",
      value: "",
      delay: 0.3
    }
  ];

  return (
    <section className={cn(
      "py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative",
      className
    )}>
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-400 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-lg px-6 py-2">
              <Crown className="w-5 h-5 mr-2" />
              First Mover Club 초대
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                First Mover Club에
              </span>
              <br />
              초대합니다
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              당신의 목소리로 제품을 완성해주세요
            </p>

            {/* 카운트다운 타이머 */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Timer className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-300 font-bold text-lg">독점 초대 마감까지</span>
              </div>
              <CountdownTimer />
            </div>
          </motion.div>

          {/* 혜택 카드들 */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>

          {/* 추가 혜택 및 긴급감 조성 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-8 mb-12 border border-yellow-400/30 relative overflow-hidden"
          >
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
            
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                <span className="text-yellow-300 font-bold text-2xl">VIP 독점 혜택</span>
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
              
              <h3 className="text-white font-bold text-3xl mb-4">
                First Mover Club 특별 혜택
              </h3>
              
              <div className="flex items-center justify-center space-x-8 text-lg text-yellow-200 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6" />
                  <span className="font-semibold">현재 87명 참여</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6" />
                  <span className="font-semibold text-red-300">13자리 남음</span>
                </div>
              </div>

              {/* CTA 버튼 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onRegisterClick}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl border-0"
                >
                  <Crown className="w-6 h-6 mr-3" />
                  First Mover Club 참여하기
                  <Sparkles className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* 사회적 증명 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-8 text-blue-200">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">4.9/5 만족도</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="font-semibold">1,247명 사전 등록</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">실시간 피드백 채널</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
} 