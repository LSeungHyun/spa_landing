// 전환율 최적화 대시보드 및 분석 시스템
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 (서버용)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 대시보드 메트릭 타입들
export interface DashboardMetrics {
  // 기본 지표
  total_visitors: number;
  total_page_views: number;
  demo_starts: number;
  demo_completions: number;
  pre_registrations: number;
  
  // 전환율 지표
  demo_start_rate: number;      // 방문자 대비 데모 시작율
  demo_completion_rate: number; // 데모 시작 대비 완료율
  registration_rate: number;    // 데모 완료 대비 사전등록율
  overall_conversion_rate: number; // 전체 전환율 (방문자 → 사전등록)
  
  // 시간대별 데이터
  hourly_stats: HourlyStats[];
  daily_stats: DailyStats[];
  
  // 페르소나별 성과
  persona_stats: PersonaStats[];
  
  // 성능 지표
  avg_session_duration: number;
  avg_scroll_depth: number;
  exit_intent_rate: number;
  
  // 사용자 여정 분석
  user_journey: UserJourney[];
  
  // A/B 테스트 결과
  ab_test_results: ABTestResult[];
}

export interface HourlyStats {
  hour: string; // '2024-12-27T14:00:00Z'
  visitors: number;
  page_views: number;
  demo_starts: number;
  demo_completions: number;
  registrations: number;
  conversion_rate: number;
}

export interface DailyStats {
  date: string; // '2024-12-27'
  visitors: number;
  page_views: number;
  demo_starts: number;
  demo_completions: number;
  registrations: number;
  conversion_rate: number;
  avg_session_duration: number;
}

export interface PersonaStats {
  persona: 'pm' | 'creator' | 'startup' | 'unknown';
  visitors: number;
  demo_starts: number;
  demo_completions: number;
  registrations: number;
  conversion_rate: number;
  avg_improvement_ratio?: number;
}

export interface UserJourney {
  session_id: string;
  events: JourneyEvent[];
  total_duration: number;
  final_conversion: boolean;
  conversion_type?: 'demo_only' | 'registration';
}

export interface JourneyEvent {
  event_type: string;
  timestamp: string;
  event_data: any;
}

export interface ABTestResult {
  test_name: string;
  variant_a: TestVariant;
  variant_b: TestVariant;
  confidence_level: number;
  winner?: 'a' | 'b' | 'inconclusive';
}

export interface TestVariant {
  name: string;
  visitors: number;
  conversions: number;
  conversion_rate: number;
}

// 실시간 지표 타입
export interface RealTimeMetrics {
  active_users: number;
  current_hour_visitors: number;
  current_hour_conversions: number;
  live_conversion_rate: number;
  trending_events: TrendingEvent[];
}

export interface TrendingEvent {
  event_type: string;
  count: number;
  growth_rate: number; // 전 시간 대비 증가율
}

class AnalyticsDashboard {
  private static instance: AnalyticsDashboard;

  static getInstance(): AnalyticsDashboard {
    if (!AnalyticsDashboard.instance) {
      AnalyticsDashboard.instance = new AnalyticsDashboard();
    }
    return AnalyticsDashboard.instance;
  }

  // 전체 대시보드 메트릭 조회
  async getDashboardMetrics(
    startDate?: string,
    endDate?: string
  ): Promise<DashboardMetrics> {
    const start = startDate || this.getDateDaysAgo(7);
    const end = endDate || new Date().toISOString();

    // 병렬로 모든 데이터 조회
    const [
      basicMetrics,
      hourlyStats,
      dailyStats,
      personaStats,
      userJourneys,
      abTestResults
    ] = await Promise.all([
      this.getBasicMetrics(start, end),
      this.getHourlyStats(start, end),
      this.getDailyStats(start, end),
      this.getPersonaStats(start, end),
      this.getUserJourneys(start, end),
      this.getABTestResults(start, end)
    ]);

    return {
      ...basicMetrics,
      hourly_stats: hourlyStats,
      daily_stats: dailyStats,
      persona_stats: personaStats,
      user_journey: userJourneys,
      ab_test_results: abTestResults
    };
  }

  // 기본 메트릭 계산
  private async getBasicMetrics(startDate: string, endDate: string) {
    const { data: events } = await supabase
      .from('user_analytics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (!events) return this.getEmptyBasicMetrics();

    // 고유 세션 수 (방문자 수)
    const uniqueSessions = new Set(events.map(e => e.session_id)).size;
    
    // 이벤트 타입별 카운트
    const eventCounts = events.reduce((acc: Record<string, number>, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {});

    const totalPageViews = eventCounts['page_view'] || 0;
    const demoStarts = eventCounts['demo_start'] || 0;
    const demoCompletions = eventCounts['demo_complete'] || 0;
    const preRegistrations = eventCounts['pre_register_complete'] || 0;

    // 전환율 계산
    const demoStartRate = uniqueSessions > 0 ? (demoStarts / uniqueSessions) * 100 : 0;
    const demoCompletionRate = demoStarts > 0 ? (demoCompletions / demoStarts) * 100 : 0;
    const registrationRate = demoCompletions > 0 ? (preRegistrations / demoCompletions) * 100 : 0;
    const overallConversionRate = uniqueSessions > 0 ? (preRegistrations / uniqueSessions) * 100 : 0;

    // 세션 지속 시간 계산
    const avgSessionDuration = await this.calculateAvgSessionDuration(events);
    
    // 스크롤 깊이 평균 계산
    const avgScrollDepth = this.calculateAvgScrollDepth(events);
    
    // Exit Intent 비율 계산
    const exitIntentRate = this.calculateExitIntentRate(events, uniqueSessions);

    return {
      total_visitors: uniqueSessions,
      total_page_views: totalPageViews,
      demo_starts: demoStarts,
      demo_completions: demoCompletions,
      pre_registrations: preRegistrations,
      demo_start_rate: demoStartRate,
      demo_completion_rate: demoCompletionRate,
      registration_rate: registrationRate,
      overall_conversion_rate: overallConversionRate,
      avg_session_duration: avgSessionDuration,
      avg_scroll_depth: avgScrollDepth,
      exit_intent_rate: exitIntentRate
    };
  }

  // 시간대별 통계
  private async getHourlyStats(startDate: string, endDate: string): Promise<HourlyStats[]> {
    const { data: events } = await supabase
      .from('user_analytics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (!events) return [];

    // 시간대별 그룹핑
    const hourlyGroups: Record<string, any[]> = {};
    
    events.forEach(event => {
      const hour = event.created_at.substring(0, 13) + ':00:00Z'; // YYYY-MM-DDTHH:00:00Z
      if (!hourlyGroups[hour]) {
        hourlyGroups[hour] = [];
      }
      hourlyGroups[hour].push(event);
    });

    return Object.entries(hourlyGroups).map(([hour, hourEvents]) => {
      const uniqueSessions = new Set(hourEvents.map(e => e.session_id)).size;
      const pageViews = hourEvents.filter(e => e.event_type === 'page_view').length;
      const demoStarts = hourEvents.filter(e => e.event_type === 'demo_start').length;
      const demoCompletions = hourEvents.filter(e => e.event_type === 'demo_complete').length;
      const registrations = hourEvents.filter(e => e.event_type === 'pre_register_complete').length;
      
      return {
        hour,
        visitors: uniqueSessions,
        page_views: pageViews,
        demo_starts: demoStarts,
        demo_completions: demoCompletions,
        registrations,
        conversion_rate: uniqueSessions > 0 ? (registrations / uniqueSessions) * 100 : 0
      };
    }).sort((a, b) => a.hour.localeCompare(b.hour));
  }

  // 일별 통계
  private async getDailyStats(startDate: string, endDate: string): Promise<DailyStats[]> {
    const { data: events } = await supabase
      .from('user_analytics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (!events) return [];

    // 일별 그룹핑
    const dailyGroups: Record<string, any[]> = {};
    
    events.forEach(event => {
      const date = event.created_at.split('T')[0]; // YYYY-MM-DD
      if (!dailyGroups[date]) {
        dailyGroups[date] = [];
      }
      dailyGroups[date].push(event);
    });

    return Object.entries(dailyGroups).map(([date, dayEvents]) => {
      const uniqueSessions = new Set(dayEvents.map(e => e.session_id)).size;
      const pageViews = dayEvents.filter(e => e.event_type === 'page_view').length;
      const demoStarts = dayEvents.filter(e => e.event_type === 'demo_start').length;
      const demoCompletions = dayEvents.filter(e => e.event_type === 'demo_complete').length;
      const registrations = dayEvents.filter(e => e.event_type === 'pre_register_complete').length;
      
      return {
        date,
        visitors: uniqueSessions,
        page_views: pageViews,
        demo_starts: demoStarts,
        demo_completions: demoCompletions,
        registrations,
        conversion_rate: uniqueSessions > 0 ? (registrations / uniqueSessions) * 100 : 0,
        avg_session_duration: 0 // TODO: 세션별 지속시간 계산
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  }

  // 페르소나별 성과 분석
  private async getPersonaStats(startDate: string, endDate: string): Promise<PersonaStats[]> {
    const { data: events } = await supabase
      .from('user_analytics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (!events) return [];

    const personaGroups: Record<string, any[]> = {
      pm: [],
      creator: [],
      startup: [],
      unknown: []
    };

    events.forEach(event => {
      const persona = event.event_data?.persona || 'unknown';
      if (personaGroups[persona]) {
        personaGroups[persona].push(event);
      } else {
        personaGroups.unknown.push(event);
      }
    });

    return Object.entries(personaGroups).map(([persona, personaEvents]) => {
      const uniqueSessions = new Set(personaEvents.map(e => e.session_id)).size;
      const demoStarts = personaEvents.filter(e => e.event_type === 'demo_start').length;
      const demoCompletions = personaEvents.filter(e => e.event_type === 'demo_complete').length;
      const registrations = personaEvents.filter(e => e.event_type === 'pre_register_complete').length;
      
      return {
        persona: persona as 'pm' | 'creator' | 'startup' | 'unknown',
        visitors: uniqueSessions,
        demo_starts: demoStarts,
        demo_completions: demoCompletions,
        registrations,
        conversion_rate: uniqueSessions > 0 ? (registrations / uniqueSessions) * 100 : 0
      };
    }).filter(stat => stat.visitors > 0);
  }

  // 사용자 여정 분석
  private async getUserJourneys(startDate: string, endDate: string): Promise<UserJourney[]> {
    const { data: events } = await supabase
      .from('user_analytics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (!events) return [];

    // 세션별 그룹핑
    const sessionGroups: Record<string, any[]> = {};
    
    events.forEach(event => {
      if (!sessionGroups[event.session_id]) {
        sessionGroups[event.session_id] = [];
      }
      sessionGroups[event.session_id].push(event);
    });

    return Object.entries(sessionGroups).map(([sessionId, sessionEvents]) => {
      const journeyEvents: JourneyEvent[] = sessionEvents.map(event => ({
        event_type: event.event_type,
        timestamp: event.created_at,
        event_data: event.event_data
      }));

      const hasRegistration = sessionEvents.some(e => e.event_type === 'pre_register_complete');
      const hasDemo = sessionEvents.some(e => e.event_type === 'demo_complete');
      
      const firstEvent = sessionEvents[0];
      const lastEvent = sessionEvents[sessionEvents.length - 1];
      const totalDuration = new Date(lastEvent.created_at).getTime() - new Date(firstEvent.created_at).getTime();

      return {
        session_id: sessionId,
        events: journeyEvents,
        total_duration: totalDuration,
        final_conversion: hasRegistration,
        conversion_type: hasRegistration ? 'registration' as const : hasDemo ? 'demo_only' as const : undefined
      };
    }).slice(0, 100); // 최근 100개 세션만
  }

  // A/B 테스트 결과 분석
  private async getABTestResults(startDate: string, endDate: string): Promise<ABTestResult[]> {
    const { data: events } = await supabase
      .from('user_analytics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (!events) return [];

    // A/B 테스트 이벤트 필터링
    const abTestEvents = events.filter(e => 
      e.event_data?.test_type === 'ab_test' && 
      e.event_data?.ab_test_name
    );

    if (abTestEvents.length === 0) return [];

    // 테스트별 그룹핑
    const testGroups: Record<string, any[]> = {};
    
    abTestEvents.forEach(event => {
      const testName = event.event_data.ab_test_name;
      if (!testGroups[testName]) {
        testGroups[testName] = [];
      }
      testGroups[testName].push(event);
    });

    return Object.entries(testGroups).map(([testName, testEvents]) => {
      // 변형별 성과 계산
      const variantA = testEvents.filter(e => e.event_data.ab_test_variant === 'A');
      const variantB = testEvents.filter(e => e.event_data.ab_test_variant === 'B');
      
      const aVisitors = new Set(variantA.map(e => e.session_id)).size;
      const bVisitors = new Set(variantB.map(e => e.session_id)).size;
      
      // 각 변형의 전환율 계산 (여기서는 단순화)
      const aConversions = variantA.length;
      const bConversions = variantB.length;
      
      const aRate = aVisitors > 0 ? (aConversions / aVisitors) * 100 : 0;
      const bRate = bVisitors > 0 ? (bConversions / bVisitors) * 100 : 0;
      
      return {
        test_name: testName,
        variant_a: {
          name: 'A',
          visitors: aVisitors,
          conversions: aConversions,
          conversion_rate: aRate
        },
        variant_b: {
          name: 'B',
          visitors: bVisitors,
          conversions: bConversions,
          conversion_rate: bRate
        },
        confidence_level: 0, // TODO: 통계적 유의성 계산
        winner: aRate > bRate ? 'a' : bRate > aRate ? 'b' : 'inconclusive'
      };
    });
  }

  // 실시간 메트릭 조회
  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const [currentHourData, previousHourData] = await Promise.all([
      this.getEventsInTimeRange(oneHourAgo.toISOString(), now.toISOString()),
      this.getEventsInTimeRange(twoHoursAgo.toISOString(), oneHourAgo.toISOString())
    ]);

    const currentVisitors = new Set(currentHourData.map(e => e.session_id)).size;
    const currentConversions = currentHourData.filter(e => 
      e.event_type === 'pre_register_complete'
    ).length;

    const previousVisitors = new Set(previousHourData.map(e => e.session_id)).size;
    const previousConversions = previousHourData.filter(e => 
      e.event_type === 'pre_register_complete'
    ).length;

    // 트렌딩 이벤트 계산
    const currentEventCounts = this.getEventCounts(currentHourData);
    const previousEventCounts = this.getEventCounts(previousHourData);
    
    const trendingEvents: TrendingEvent[] = Object.entries(currentEventCounts).map(([eventType, count]) => {
      const previousCount = previousEventCounts[eventType] || 0;
      const growthRate = previousCount > 0 ? ((count - previousCount) / previousCount) * 100 : 0;
      
      return {
        event_type: eventType,
        count,
        growth_rate: growthRate
      };
    }).sort((a, b) => b.growth_rate - a.growth_rate);

    return {
      active_users: currentVisitors,
      current_hour_visitors: currentVisitors,
      current_hour_conversions: currentConversions,
      live_conversion_rate: currentVisitors > 0 ? (currentConversions / currentVisitors) * 100 : 0,
      trending_events: trendingEvents.slice(0, 5)
    };
  }

  // 헬퍼 메서드들
  private async getEventsInTimeRange(startDate: string, endDate: string) {
    const { data } = await supabase
      .from('user_analytics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
    
    return data || [];
  }

  private getEventCounts(events: any[]): Record<string, number> {
    return events.reduce((acc: Record<string, number>, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {});
  }

  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  }

  private getEmptyBasicMetrics() {
    return {
      total_visitors: 0,
      total_page_views: 0,
      demo_starts: 0,
      demo_completions: 0,
      pre_registrations: 0,
      demo_start_rate: 0,
      demo_completion_rate: 0,
      registration_rate: 0,
      overall_conversion_rate: 0,
      avg_session_duration: 0,
      avg_scroll_depth: 0,
      exit_intent_rate: 0
    };
  }

  private async calculateAvgSessionDuration(events: any[]): Promise<number> {
    const sessionGroups: Record<string, any[]> = {};
    
    events.forEach(event => {
      if (!sessionGroups[event.session_id]) {
        sessionGroups[event.session_id] = [];
      }
      sessionGroups[event.session_id].push(event);
    });

    const durations = Object.values(sessionGroups).map(sessionEvents => {
      if (sessionEvents.length < 2) return 0;
      
      const sorted = sessionEvents.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      const first = new Date(sorted[0].created_at).getTime();
      const last = new Date(sorted[sorted.length - 1].created_at).getTime();
      
      return last - first;
    }).filter(duration => duration > 0);

    return durations.length > 0 
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
      : 0;
  }

  private calculateAvgScrollDepth(events: any[]): number {
    const scrollEvents = events.filter(e => e.event_type === 'scroll_depth');
    
    if (scrollEvents.length === 0) return 0;
    
    const depths = scrollEvents.map(e => e.event_data?.scroll_percentage || 0);
    return depths.reduce((sum, depth) => sum + depth, 0) / depths.length;
  }

  private calculateExitIntentRate(events: any[], totalVisitors: number): number {
    const exitIntentEvents = events.filter(e => e.event_type === 'exit_intent');
    const uniqueExitSessions = new Set(exitIntentEvents.map(e => e.session_id)).size;
    
    return totalVisitors > 0 ? (uniqueExitSessions / totalVisitors) * 100 : 0;
  }
}

export default AnalyticsDashboard; 