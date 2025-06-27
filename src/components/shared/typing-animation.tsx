import React, { useState, useEffect, useCallback } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number; // 타이핑 속도 (ms)
  onComplete?: () => void;
  onCancel?: () => void;
  onProgress?: (progress: number) => void; // 타이핑 진행률 콜백 (0-1)
  className?: string;
  showCursor?: boolean;
  startDelay?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 50,
  onComplete,
  onCancel,
  onProgress,
  className = '',
  showCursor = true,
  startDelay = 0,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // 타이핑 중단 함수
  const cancelTyping = useCallback(() => {
    setIsCancelled(true);
    setIsTyping(false);
    onCancel?.();
  }, [onCancel]);

  // 즉시 완성 함수
  const completeTyping = useCallback(() => {
    setDisplayedText(text);
    setCurrentIndex(text.length);
    setIsTyping(false);
    onComplete?.();
  }, [text, onComplete]);

  useEffect(() => {
    if (isCancelled) return;

    const startTyping = () => {
      setIsTyping(true);
      setCurrentIndex(0);
      setDisplayedText('');
    };

    // 시작 지연 적용
    const startTimer = setTimeout(startTyping, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, startDelay, isCancelled]);

  useEffect(() => {
    if (!isTyping || isCancelled || currentIndex >= text.length) {
      if (currentIndex >= text.length && isTyping) {
        setIsTyping(false);
        onComplete?.();
        onProgress?.(1); // 완료 시 100% 진행률
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        // 진행률 콜백 호출
        if (onProgress && text.length > 0) {
          onProgress(newIndex / text.length);
        }
        return newIndex;
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, isTyping, text, speed, onComplete, onProgress, isCancelled]);

  // 클릭 시 즉시 완성
  const handleClick = () => {
    if (isTyping) {
      completeTyping();
    }
  };

  return (
    <span 
      className={`${className} ${isTyping ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      title={isTyping ? '클릭하여 즉시 완성' : undefined}
    >
      {displayedText}
      {showCursor && isTyping && (
        <span className="animate-pulse text-gray-400">|</span>
      )}
    </span>
  );
};

export default TypingAnimation;
export { TypingAnimation, type TypingAnimationProps }; 