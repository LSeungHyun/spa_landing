import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { DashboardMetrics, RealTimeMetrics } from '@/lib/analytics-dashboard';

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    range?: string;
    start_date?: string;
    end_date?: string;
    generated_at?: string;
    cache_duration?: number;
  };
  error?: string;
  details?: string;
}

// 대시보드 메트릭 훅 옵션
interface UseDashboardMetricsOptions {
  range?: '1d' | '7d' | '30d';
  startDate?: string;
  endDate?: string;
  refreshInterval?: number;
  enabled?: boolean;
}

// 실시간 메트릭 훅 옵션
interface UseRealTimeMetricsOptions {
  enabled?: boolean;
  refreshInterval?: number;
}

// Fetcher 함수
const fetcher = async (url: string): Promise<any> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
};

// 대시보드 메트릭 훅
export function useDashboardMetrics(options: UseDashboardMetricsOptions = {}) {
  const {
    range = '7d',
    startDate,
    endDate,
    refreshInterval = 300000, // 5분
    enabled = true
  } = options;

  // URL 구성
  const params = new URLSearchParams();
  if (range) params.append('range', range);
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  const url = enabled ? `/api/dashboard/metrics?${params.toString()}` : null;

  // SWR로 데이터 페칭
  const {
    data: response,
    error,
    mutate,
    isLoading,
    isValidating
  } = useSWR<ApiResponse<DashboardMetrics>>(
    url,
    fetcher,
    {
      refreshInterval: enabled ? refreshInterval : 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1분
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (error) => {
        console.error('Dashboard metrics fetch error:', error);
      }
    }
  );

  // 수동 새로고침 함수
  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  // 데이터 내보내기 함수
  const exportData = useCallback(async (format: 'json' | 'csv' = 'json') => {
    try {
      const exportResponse = await fetch('/api/dashboard/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'export_data',
          params: {
            start_date: startDate,
            end_date: endDate,
            format
          }
        })
      });

      if (!exportResponse.ok) {
        throw new Error('Export failed');
      }

      const exportData = await exportResponse.json();
      
      if (format === 'json') {
        // JSON 다운로드
        const blob = new Blob([JSON.stringify(exportData.data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-metrics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      return exportData.data;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }, [startDate, endDate]);

  return {
    data: response?.data || null,
    meta: response?.meta || null,
    error: error?.message || null,
    isLoading,
    isValidating,
    refresh,
    exportData,
    // 편의 함수들
    isEmpty: !isLoading && !response?.data,
    isError: !!error,
    isSuccess: !!response?.data && !error
  };
}

// 실시간 메트릭 훅
export function useRealTimeMetrics(options: UseRealTimeMetricsOptions = {}) {
  const {
    enabled = true,
    refreshInterval = 30000 // 30초
  } = options;

  const url = enabled ? '/api/dashboard/realtime' : null;

  // SWR로 데이터 페칭
  const {
    data: response,
    error,
    mutate,
    isLoading,
    isValidating
  } = useSWR<ApiResponse<RealTimeMetrics>>(
    url,
    fetcher,
    {
      refreshInterval: enabled ? refreshInterval : 0,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10초
      errorRetryCount: 5,
      errorRetryInterval: 3000,
      onError: (error) => {
        console.error('Real-time metrics fetch error:', error);
      }
    }
  );

  // 수동 새로고침 함수
  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  return {
    data: response?.data || null,
    meta: response?.meta || null,
    error: error?.message || null,
    isLoading,
    isValidating,
    refresh,
    // 편의 함수들
    isEmpty: !isLoading && !response?.data,
    isError: !!error,
    isSuccess: !!response?.data && !error
  };
}

// Server-Sent Events 훅 (실시간 스트림)
export function useRealTimeStream(enabled: boolean = true) {
  const [data, setData] = useState<RealTimeMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource('/api/dashboard/realtime');
        
        eventSource.onopen = () => {
          console.log('Real-time stream connected');
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            
            if (parsed.type === 'metrics_update') {
              setData(parsed.data);
            } else if (parsed.type === 'error') {
              setError(parsed.error);
            }
          } catch (parseError) {
            console.error('Failed to parse SSE data:', parseError);
          }
        };

        eventSource.onerror = (event) => {
          console.error('SSE error:', event);
          setIsConnected(false);
          setError('Connection lost. Attempting to reconnect...');
          
          // 자동 재연결 (5초 후)
          if (eventSource?.readyState === EventSource.CLOSED) {
            reconnectTimeout = setTimeout(() => {
              connect();
            }, 5000);
          }
        };

      } catch (error) {
        console.error('Failed to create EventSource:', error);
        setError('Failed to establish real-time connection');
      }
    };

    connect();

    // 정리 함수
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      setIsConnected(false);
    };
  }, [enabled]);

  const disconnect = useCallback(() => {
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      // EventSource 연결 종료는 useEffect cleanup에서 처리됨
      setIsConnected(false);
    }
  }, []);

  return {
    data,
    error,
    isConnected,
    disconnect,
    // 편의 함수들
    hasData: !!data,
    isError: !!error
  };
}

// 통합 대시보드 훅 (메트릭 + 실시간)
export function useDashboard(options: UseDashboardMetricsOptions & UseRealTimeMetricsOptions = {}) {
  const metrics = useDashboardMetrics(options);
  const realTime = useRealTimeMetrics(options);

  // 전체 새로고침 함수
  const refreshAll = useCallback(async () => {
    await Promise.all([
      metrics.refresh(),
      realTime.refresh()
    ]);
  }, [metrics.refresh, realTime.refresh]);

  return {
    metrics,
    realTime,
    refreshAll,
    // 전체 상태
    isLoading: metrics.isLoading || realTime.isLoading,
    hasError: metrics.isError || realTime.isError,
    errors: [metrics.error, realTime.error].filter(Boolean)
  };
} 