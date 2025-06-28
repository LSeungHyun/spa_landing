'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  isVisible?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  animation?: 'pulse-glow' | 'fade' | 'scale';
  onVisibilityChange?: (visible: boolean) => void;
}

export function Tooltip({
  content,
  children,
  isVisible = false,
  position = 'top',
  delay = 0,
  className = '',
  animation = 'fade',
  onVisibilityChange
}: TooltipProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 외부에서 제어되는 visibility
  useEffect(() => {
    if (isVisible && delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setShouldShow(true);
        setInternalVisible(true);
        onVisibilityChange?.(true);
      }, delay);
    } else if (isVisible) {
      setShouldShow(true);
      setInternalVisible(true);
      onVisibilityChange?.(true);
    } else {
      setShouldShow(false);
      setInternalVisible(false);
      onVisibilityChange?.(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, delay, onVisibilityChange]);

  // 포지션에 따른 스타일 계산
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  // 화살표 포지션 계산
  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-900 border-b-0';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-gray-900 border-t-0';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-gray-900 border-r-0';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-gray-900 border-l-0';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-900 border-b-0';
    }
  };

  // 애니메이션 variants
  const getAnimationVariants = () => {
    switch (animation) {
      case 'pulse-glow':
        return {
          hidden: { 
            opacity: 0, 
            scale: 0.8,
            filter: 'drop-shadow(0 0 0px rgba(59, 130, 246, 0))'
          },
          visible: { 
            opacity: 1, 
            scale: 1,
            filter: [
              'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))',
              'drop-shadow(0 0 16px rgba(59, 130, 246, 0.5))',
              'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
            ],
            transition: {
              duration: 0.3,
              filter: {
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut'
              }
            }
          },
          exit: { 
            opacity: 0, 
            scale: 0.8,
            filter: 'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
            transition: { duration: 0.2 }
          }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        };
      default:
        return {
          hidden: { opacity: 0, y: position === 'top' ? 10 : -10 },
          visible: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: position === 'top' ? 10 : -10 }
        };
    }
  };

  return (
    <div className="relative inline-block">
      {children}
      
      <AnimatePresence>
        {shouldShow && internalVisible && (
          <motion.div
            ref={tooltipRef}
            className={cn(
              'absolute z-50 px-4 py-3 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
              'w-[300px] sm:w-[350px] whitespace-normal break-words leading-relaxed text-center',
              getPositionStyles(),
              className
            )}
            variants={getAnimationVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="tooltip"
            aria-hidden={!internalVisible}
          >
            {content}
            
            {/* 화살표 */}
            <div
              className={cn(
                'absolute w-0 h-0 border-4',
                getArrowStyles()
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tooltip; 