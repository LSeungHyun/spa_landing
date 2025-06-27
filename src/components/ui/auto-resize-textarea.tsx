import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAutoResize } from '@/hooks/use-auto-resize';

export interface AutoResizeTextareaProps
  extends Omit<React.ComponentProps<'textarea'>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
  maxRows?: number;
  lineHeight?: number;
  enableSmoothResize?: boolean;
}

const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(({ 
  className, 
  value, 
  onChange, 
  minRows = 1, 
  maxRows = 10, 
  lineHeight = 24,
  enableSmoothResize = true,
  ...props 
}, ref) => {
  const { textareaRef, resize } = useAutoResize({
    minRows,
    maxRows,
    lineHeight,
    enableSmoothResize,
  });

  // ref 병합을 위한 함수
  const mergedRef = React.useCallback(
    (node: HTMLTextAreaElement) => {
      // textareaRef에 node 할당
      (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [textareaRef, ref]
  );

  // 값 변경 시 크기 조절
  React.useEffect(() => {
    resize();
  }, [value, resize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // 입력 즉시 크기 조절 - requestAnimationFrame으로 성능 최적화
    requestAnimationFrame(() => {
      resize();
    });
  };

  // 키보드 입력 시에도 즉시 반응
  const handleInput = React.useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    requestAnimationFrame(() => {
      resize();
    });
  }, [resize]);

  return (
    <textarea
      className={cn(
        'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        enableSmoothResize ? 'transition-all duration-150 ease-out' : '',
        className,
      )}
      ref={mergedRef}
      value={value}
      onChange={handleChange}
      onInput={handleInput}
      style={{ 
        resize: 'none', 
        minHeight: `${minRows * lineHeight}px`,
        overflowY: 'hidden',
        // 부드러운 크기 조절을 위한 추가 스타일
        ...(enableSmoothResize && {
          transition: 'height 0.15s ease-out, border-color 0.2s ease-out',
        })
      }}
      {...props}
    />
  );
});

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

export { AutoResizeTextarea }; 