import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsDashboard } from '@/lib/analytics-dashboard';

// 실시간 메트릭 조회 API
export async function GET(request: NextRequest) {
  try {
    // 대시보드 인스턴스 생성
    const dashboard = AnalyticsDashboard.getInstance();
    
    // 실시간 메트릭 데이터 조회
    const realTimeMetrics = await dashboard.getRealTimeMetrics();
    
    // 응답 반환
    return NextResponse.json({
      success: true,
      data: realTimeMetrics,
      meta: {
        generated_at: new Date().toISOString(),
        cache_duration: 30, // 30초 캐시
        refresh_interval: 30000 // 30초마다 새로고침 권장
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Real-time metrics API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch real-time metrics',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 실시간 이벤트 스트림 (Server-Sent Events)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'subscribe') {
      // SSE 스트림 설정
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        start(controller) {
          const sendMetrics = async () => {
            try {
              const dashboard = AnalyticsDashboard.getInstance();
              const metrics = await dashboard.getRealTimeMetrics();
              
              const data = `data: ${JSON.stringify({
                type: 'metrics_update',
                data: metrics,
                timestamp: new Date().toISOString()
              })}\n\n`;
              
              controller.enqueue(encoder.encode(data));
            } catch (error) {
              console.error('SSE metrics error:', error);
              
              const errorData = `data: ${JSON.stringify({
                type: 'error',
                error: 'Failed to fetch metrics',
                timestamp: new Date().toISOString()
              })}\n\n`;
              
              controller.enqueue(encoder.encode(errorData));
            }
          };
          
          // 즉시 첫 번째 데이터 전송
          sendMetrics();
          
          // 30초마다 업데이트
          const interval = setInterval(sendMetrics, 30000);
          
          // 연결 종료 시 정리
          return () => {
            clearInterval(interval);
          };
        },
        cancel() {
          // 클라이언트가 연결을 끊었을 때
          console.log('Real-time metrics stream cancelled');
        }
      });
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control'
        }
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action',
      available_actions: ['subscribe']
    }, { status: 400 });
    
  } catch (error) {
    console.error('Real-time metrics POST API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process real-time request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 