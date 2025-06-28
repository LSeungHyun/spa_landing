'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Rocket, Users, Crown, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegistrationBannerProps {
  isVisible: boolean;
  onClose: () => void;
  onJoinBeta: () => void;
  className?: string;
}

export function RegistrationBanner({
  isVisible,
  onClose,
  onJoinBeta,
  className = ''
}: RegistrationBannerProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleJoinClick = () => {
    onJoinBeta();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 shadow-2xl border-t border-white/20',
            className
          )}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* 배너 내용 */}
          <motion.div
            className="relative"
            animate={{ height: isMinimized ? 'auto' : 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 text-white/70 hover:text-white transition-colors z-10"
              aria-label="배너 닫기"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 최소화된 상태 */}
            {isMinimized ? (
              <div className="px-4 py-3">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-yellow-300" />
                      <span className="text-white font-semibold text-sm">
                        스마트 프롬프트 향상 서비스가 마음에 드시나요?
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                                          <Button
                        onClick={handleJoinClick}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                        variant="outline"
                      >
                        <Gift className="w-4 h-4 mr-1" />
                        베타 참여
                      </Button>
                                          <button
                        onClick={toggleMinimize}
                        className="text-white/70 hover:text-white text-sm"
                      >
                        자세히 보기
                      </button>
                  </div>
                </div>
              </div>
            ) : (
              /* 전체 상태 */
              <div className="px-4 py-6">
                <div className="max-w-6xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* 왼쪽: 메시지 영역 */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Rocket className="w-6 h-6 text-yellow-300" />
                        <h3 className="text-xl font-bold text-white">
                          스마트 프롬프트 향상 서비스가 마음에 드시나요?
                        </h3>
                      </div>
                      
                      <p className="text-blue-100 text-sm md:text-base mb-3">
                        🚀 더욱 스마트한 기능들을 먼저 경험해보세요. 지금 베타 테스터로 참여하세요!
                      </p>

                      {/* 혜택 리스트 */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-blue-100">
                        <div className="flex items-center gap-1">
                          <Crown className="w-3 h-3 text-yellow-300" />
                          <span>프리미엄 기능</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-yellow-300" />
                          <span>전용 커뮤니티</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gift className="w-3 h-3 text-yellow-300" />
                          <span>얼리버드 할인</span>
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽: 액션 영역 */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* 사용자 수 표시 */}
                      <div className="text-center sm:text-right">
                        <div className="text-yellow-300 font-bold text-lg">73+ 사용자</div>
                        <div className="text-blue-100 text-xs">이미 참여 중</div>
                      </div>

                      {/* CTA 버튼 */}
                      <Button
                        onClick={handleJoinClick}
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Gift className="w-5 h-5 mr-2" />
                        베타 참여하기
                      </Button>

                      {/* 최소화 버튼 */}
                      <button
                        onClick={toggleMinimize}
                        className="text-white/70 hover:text-white text-xs underline hidden md:block"
                      >
                        최소화
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* 진행 바 (선택적) */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RegistrationBanner; 