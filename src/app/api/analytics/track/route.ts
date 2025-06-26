import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractIP } from '@/lib/utils/ip-utils';

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 분석 이벤트 데이터 타입
interface AnalyticsEventData {
  session_id: string;
  event_type: string;
  event_data: Record<string, any>;
  page_url: string;
  referrer?: string;
  user_agent?: string;
}

// 이메일 마스킹 함수
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 2
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : local;
  return `${maskedLocal}@${domain}`;
}

// IP 주소 마스킹 함수
function maskIP(ip: string): string {
  if (!ip) return ip;
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  return ip;
}

// POST: 분석 이벤트 저장
export async function POST(request: NextRequest) {
  try {
    const body: AnalyticsEventData = await request.json();
    
    // IP 주소 추출
    const ip_address = extractIP(request);
    
    // 이벤트 데이터 정리 및 검증
    const eventRecord = {
      session_id: body.session_id,
      event_type: body.event_type,
      event_data: body.event_data || {},
      page_url: body.page_url,
      referrer: body.referrer || null,
      ip_address,
      user_agent: body.user_agent || null,
      created_at: new Date().toISOString()
    };

    // Supabase에 저장
    const { data, error } = await supabase
      .from('user_events')
      .insert(eventRecord)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save analytics data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Analytics event saved successfully'
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: 분석 데이터 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터 추출
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const eventType = searchParams.get('event_type');
    const sessionId = searchParams.get('session_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 기본 쿼리 생성
    let query = supabase
      .from('user_events')
      .select('*')
      .order('created_at', { ascending: false });

    // 필터 적용
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    // 페이지네이션 적용
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // 집계 데이터 계산
    const summary = await calculateSummaryStats(startDate, endDate, eventType);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      },
      summary,
      message: 'Analytics data retrieved successfully'
    });

  } catch (error) {
    console.error('Analytics GET API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 요약 통계 계산
async function calculateSummaryStats(
  startDate?: string | null, 
  endDate?: string | null, 
  eventType?: string | null
) {
  try {
    let baseQuery = supabase.from('user_events').select('*');
    
    if (startDate) baseQuery = baseQuery.gte('created_at', startDate);
    if (endDate) baseQuery = baseQuery.lte('created_at', endDate);
    if (eventType) baseQuery = baseQuery.eq('event_type', eventType);

    const { data: events } = await baseQuery;

    if (!events) return null;

    // 기본 통계
    const totalEvents = events.length;
    const uniqueSessions = new Set(events.map(e => e.session_id)).size;
    const uniquePages = new Set(events.map(e => e.page_url)).size;

    // 이벤트 타입별 분포
    const eventTypeDistribution = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 페이지별 조회수
    const pageViews = events.reduce((acc, event) => {
      if (event.event_type === 'page_view') {
        acc[event.page_url] = (acc[event.page_url] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // 전환율 계산
    const demoStarts = events.filter(e => e.event_type === 'demo_start').length;
    const demoCompletes = events.filter(e => e.event_type === 'demo_complete').length;
    const preRegistrations = events.filter(e => e.event_type === 'pre_register_complete').length;

    const demoCompletionRate = demoStarts > 0 ? (demoCompletes / demoStarts) * 100 : 0;
    const registrationRate = uniqueSessions > 0 ? (preRegistrations / uniqueSessions) * 100 : 0;

    return {
      totalEvents,
      uniqueSessions,
      uniquePages,
      eventTypeDistribution,
      pageViews,
      conversions: {
        demoStarts,
        demoCompletes,
        preRegistrations,
        demoCompletionRate: Math.round(demoCompletionRate * 100) / 100,
        registrationRate: Math.round(registrationRate * 100) / 100
      }
    };

  } catch (error) {
    console.error('Error calculating summary stats:', error);
    return null;
  }
} 