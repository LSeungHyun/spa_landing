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
  ...props 
}, ref) => {
  const { textareaRef, resize } = useAutoResize({
    minRows,
    maxRows,
    lineHeight,
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
    // 입력 즉시 크기 조절
    setTimeout(resize, 0);
  };

  return (
    <textarea
      className={cn(
        'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
        className,
      )}
      ref={mergedRef}
      value={value}
      onChange={handleChange}
      style={{ 
        resize: 'none', 
        minHeight: `${minRows * lineHeight}px`,
        overflowY: 'hidden'
      }}
      {...props}
    />
  );
});

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

export { AutoResizeTextarea }; 