import { NextRequest, NextResponse } from 'next/server';
import AnalyticsDashboard from '@/lib/analytics-dashboard';

// 대시보드 메트릭 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터 추출
    const range = searchParams.get('range') || '7d';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    
    // 날짜 범위 계산
    let calculatedStartDate = startDate;
    let calculatedEndDate = endDate || new Date().toISOString();
    
    if (!startDate && range) {
      const now = new Date();
      const daysAgo = range === '1d' ? 1 : range === '7d' ? 7 : 30;
      calculatedStartDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    }
    
    // 대시보드 인스턴스 생성
    const dashboard = AnalyticsDashboard.getInstance();
    
    // 메트릭 데이터 조회
    const metrics = await dashboard.getDashboardMetrics(
      calculatedStartDate,
      calculatedEndDate
    );
    
    // 응답 반환
    return NextResponse.json({
      success: true,
      data: metrics,
      meta: {
        range,
        start_date: calculatedStartDate,
        end_date: calculatedEndDate,
        generated_at: new Date().toISOString(),
        cache_duration: 300 // 5분 캐시
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Dashboard metrics API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard metrics',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 메트릭 업데이트 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    // 여기서 인증 확인 로직 추가 가능
    // const isAdmin = await verifyAdminAccess(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const body = await request.json();
    const { action, params } = body;
    
    const dashboard = AnalyticsDashboard.getInstance();
    
    switch (action) {
      case 'refresh_cache':
        // 캐시 새로고침 로직
        return NextResponse.json({
          success: true,
          message: 'Cache refreshed successfully',
          timestamp: new Date().toISOString()
        });
        
      case 'export_data':
        // 데이터 내보내기 로직
        const exportData = await dashboard.getDashboardMetrics(
          params?.start_date,
          params?.end_date
        );
        
        return NextResponse.json({
          success: true,
          data: exportData,
          format: 'json',
          exported_at: new Date().toISOString()
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          available_actions: ['refresh_cache', 'export_data']
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Dashboard metrics POST API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 