import { useCallback } from 'react';

interface APIMetrics {
  apiType: 'chat' | 'improve' | 'test';
  success: boolean;
  responseTime: number;
  messageLength?: number;
  responseLength?: number;
  error?: string;
}

export const useAPIMonitoring = () => {
  const trackAPICall = useCallback(async (metrics: APIMetrics) => {
    try {
      // 클라이언트 사이드 Analytics 추적
      const { trackAPIUsage, trackUserExperience, trackPerformanceMetrics } = await import('@/lib/analytics');
      
      // API 사용량 추적
      trackAPIUsage(metrics.apiType, metrics.success, metrics.responseTime);
      
      // 성능 메트릭 추적
      trackPerformanceMetrics({
        name: `${metrics.apiType}_response_time`,
        value: metrics.responseTime,
        unit: 'ms',
        context: {
          success: metrics.success,
          messageLength: metrics.messageLength,
          responseLength: metrics.responseLength
        }
      });
      
      // 사용자 경험 추적
      trackUserExperience({
        action: `${metrics.apiType}_api_call`,
        category: metrics.apiType,
        label: metrics.success ? 'success' : 'error',
        value: metrics.responseTime
      });
      
      // 개발 환경에서 콘솔 로깅
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Monitor] ${metrics.apiType.toUpperCase()}: ${metrics.success ? 'SUCCESS' : 'FAILED'} (${metrics.responseTime}ms)`, {
          messageLength: metrics.messageLength,
          responseLength: metrics.responseLength,
          error: metrics.error
        });
      }
      
    } catch (error) {
      console.error('Failed to track API metrics:', error);
    }
  }, []);

  const trackTestImprovement = useCallback(async (
    success: boolean, 
    processingTime: number, 
    originalLength: number, 
    improvedLength: number,
    score?: number
  ) => {
    try {
      const { trackUserExperience, trackPerformanceMetrics } = await import('@/lib/analytics');
      
      trackUserExperience({
        action: 'test_improvement_used',
        category: 'test',
        label: success ? 'success' : 'error',
        value: score
      });
      
      trackPerformanceMetrics({
        name: 'test_improvement_processing_time',
        value: processingTime,
        unit: 'ms',
        context: {
          success,
          originalLength,
          improvedLength,
          score,
          improvementRatio: improvedLength / originalLength
        }
      });
      
    } catch (error) {
      console.error('Failed to track test improvement metrics:', error);
    }
  }, []);

  return {
    trackAPICall,
    trackTestImprovement
  };
}; 