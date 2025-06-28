'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wand2, Send, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhanceInterceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnhanceNow: () => void;
  onSendAnyway: () => void;
  className?: string;
}

export function EnhanceInterceptModal({
  isOpen,
  onClose,
  onEnhanceNow,
  onSendAnyway,
  className = ''
}: EnhanceInterceptModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEnhanceClick = () => {
    onEnhanceNow();
    onClose();
  };

  const handleSendClick = () => {
    onSendAnyway();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className={cn(
              'relative w-full max-w-md',
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Card className="p-6 bg-white dark:bg-gray-900 shadow-xl border-0">
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 헤더 */}
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </motion.div>

                <motion.h2
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  프롬프트를 먼저 개선해보세요!
                </motion.h2>

                <motion.p
                  className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  ✨ 더 명확한 프롬프트로 훨씬 나은 결과를 얻을 수 있어요. 
                  전송하기 전에 '개선하기'를 클릭해보세요!
                </motion.p>
              </div>

              {/* 혜택 설명 */}
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Wand2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      프롬프트 개선의 장점
                    </h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• 더 구체적이고 실행 가능한 답변</li>
                      <li>• 향상된 맥락 이해</li>
                      <li>• 개선된 출력 품질</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* 액션 버튼들 */}
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* 향상하기 버튼 (권장) */}
                <Button
                  onClick={handleEnhanceClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                  size="lg"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  지금 개선하기 (권장)
                </Button>

                {/* 그냥 보내기 버튼 */}
                <Button
                  onClick={handleSendClick}
                  variant="outline"
                  className="w-full text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Send className="w-4 h-4 mr-2" />
                  그냥 보내기
                </Button>
              </motion.div>

              {/* 하단 팁 */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  💡 팁: 입력 필드에서 Ctrl+Enter로 바로 개선할 수 있어요
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EnhanceInterceptModal; 