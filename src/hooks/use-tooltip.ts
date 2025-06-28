'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTooltipOptions {
  delay?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  trigger?: 'manual' | 'input' | 'hover' | 'focus';
}

interface UseTooltipReturn {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  reset: () => void;
}

export function useTooltip({
  delay = 1000,
  autoHide = false,
  autoHideDelay = 5000,
  trigger = 'manual'
}: UseTooltipOptions = {}): UseTooltipReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const show = useCallback(() => {
    // 이미 표시 중이면 중복 실행 방지
    if (isVisible) return;

    // 기존 타이머 클리어
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    if (delay > 0) {
      showTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        
        // 자동 숨김 설정
        if (autoHide && autoHideDelay > 0) {
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, autoHideDelay);
        }
      }, delay);
    } else {
      setIsVisible(true);
      
      // 자동 숨김 설정
      if (autoHide && autoHideDelay > 0) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, autoHideDelay);
      }
    }
  }, [isVisible, delay, autoHide, autoHideDelay]);

  const hide = useCallback(() => {
    // 모든 타이머 클리어
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    setIsVisible(false);
  }, []);

  const toggle = useCallback(() => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }, [isVisible, show, hide]);

  const reset = useCallback(() => {
    hide();
    setIsTriggered(false);
  }, [hide]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return {
    isVisible,
    show,
    hide,
    toggle,
    reset
  };
}

// 입력 기반 툴팁을 위한 특화된 훅
export function useInputTooltip({
  delay = 1000,
  autoHide = true,
  autoHideDelay = 5000
}: Omit<UseTooltipOptions, 'trigger'> = {}) {
  const tooltip = useTooltip({ delay, autoHide, autoHideDelay, trigger: 'input' });
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const onInputStart = useCallback(() => {
    if (!hasStartedTyping) {
      setHasStartedTyping(true);
      tooltip.show();
    }
  }, [hasStartedTyping, tooltip]);

  const onInputClear = useCallback(() => {
    setHasStartedTyping(false);
    tooltip.reset();
  }, [tooltip]);

  const reset = useCallback(() => {
    setHasStartedTyping(false);
    tooltip.reset();
  }, [tooltip]);

  return {
    ...tooltip,
    hasStartedTyping,
    onInputStart,
    onInputClear,
    reset
  };
}

export default useTooltip; 