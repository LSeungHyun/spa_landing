import { useEffect, useRef, useCallback } from 'react';

interface UseAutoResizeOptions {
  minRows?: number;
  maxRows?: number;
  lineHeight?: number;
  enableSmoothResize?: boolean;
}

interface UseAutoResizeReturn {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  resize: () => void;
}

export function useAutoResize({
  minRows = 1,
  maxRows = 10,
  lineHeight = 24,
  enableSmoothResize = true,
}: UseAutoResizeOptions = {}): UseAutoResizeReturn {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 애니메이션 최적화를 위해 일시적으로 transition 비활성화
    const originalTransition = textarea.style.transition;
    if (!enableSmoothResize) {
      textarea.style.transition = 'none';
    }

    // 높이를 auto로 설정하여 실제 컨텐츠 높이를 측정
    textarea.style.height = 'auto';
    
    // 실제 컨텐츠 높이 계산
    const scrollHeight = textarea.scrollHeight;
    
    // 최소/최대 높이 계산
    const minHeight = minRows * lineHeight;
    const maxHeight = maxRows * lineHeight;
    
    // 적절한 높이 설정
    const targetHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    // 부드러운 애니메이션을 위해 transition 복원
    if (!enableSmoothResize) {
      textarea.style.transition = originalTransition;
    }
    
    textarea.style.height = `${targetHeight}px`;
    
    // 최대 높이에 도달했을 때 스크롤 표시
    if (scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }, [minRows, maxRows, lineHeight, enableSmoothResize]);

  // 컴포넌트 마운트 시 초기 크기 설정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 초기 스타일 설정
    textarea.style.resize = 'none';
    
    // 부드러운 애니메이션 설정
    if (enableSmoothResize) {
      textarea.style.transition = 'height 0.15s ease-out';
    }
    
    // 초기 크기 조절
    resize();

    // ResizeObserver를 사용하여 폰트 크기 변경 등에 대응
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        resize();
      });
    });

    resizeObserver.observe(textarea);

    return () => {
      resizeObserver.disconnect();
    };
  }, [resize, enableSmoothResize]);

  return {
    textareaRef,
    resize,
  };
}

export default useAutoResize; 