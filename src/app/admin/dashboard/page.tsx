'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, MousePointer, 
  Target, Clock, Activity, AlertCircle, RefreshCw,
  Calendar, Filter, Download, Eye, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardMetrics, RealTimeMetrics } from '@/lib/analytics-dashboard';

// 대시보드 메트릭 타입
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  loading?: boolean;
}

// 메트릭 카드 컴포넌트
const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  loading = false 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
    green: 'bg-green-500/10 text-green-600 border-green-200',
    yellow: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    red: 'bg-red-500/10 text-red-600 border-red-200',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200'
  };

  const changeColor = change && change > 0 ? 'text-green-600' : 'text-red-600';
  const ChangeIcon = change && change > 0 ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold">{value}</div>
              )}
              {change !== undefined && !loading && (
                <div className={`flex items-center text-xs ${changeColor} mt-1`}>
                  <ChangeIcon className="h-3 w-3 mr-1" />
                  {Math.abs(change)}%
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// 차트 색상 팔레트
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
            {entry.name.includes('율') && '%'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 메인 대시보드 컴포넌트
export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 데이터 페칭 함수
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsResponse, realTimeResponse] = await Promise.all([
        fetch(`/api/dashboard/metrics?range=${selectedDateRange}`),
        fetch('/api/dashboard/realtime')
      ]);

      if (!metricsResponse.ok || !realTimeResponse.ok) {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }

      const metricsData = await metricsResponse.json();
      const realTimeData = await realTimeResponse.json();

      setMetrics(metricsData.data);
      setRealTimeMetrics(realTimeData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드 및 자동 새로고침
  useEffect(() => {
    fetchDashboardData();
  }, [selectedDateRange]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30초마다 새로고침

    return () => clearInterval(interval);
  }, [autoRefresh, selectedDateRange]);

  // 로딩 상태
  if (loading && !metrics) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">전환율 최적화 대시보드</h1>
            <p className="text-muted-foreground">실시간 성과 모니터링 시스템</p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center space-x-2 pt-6">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">오류 발생</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchDashboardData}
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">전환율 최적화 대시보드</h1>
          <p className="text-muted-foreground">
            실시간 성과 모니터링 및 사용자 행동 분석
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Activity className="h-4 w-4 mr-2" />
              {autoRefresh ? '실시간 ON' : '실시간 OFF'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={fetchDashboardData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              내보내기
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center space-x-1">
            {['1d', '7d', '30d'].map((range) => (
              <Button
                key={range}
                variant={selectedDateRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedDateRange(range)}
              >
                {range === '1d' ? '오늘' : range === '7d' ? '7일' : '30일'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 실시간 메트릭 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="총 방문자"
          value={metrics?.total_visitors.toLocaleString() || '0'}
          change={5.2}
          icon={Users}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="데모 완료율"
          value={`${metrics?.demo_completion_rate.toFixed(1) || '0'}%`}
          change={2.1}
          icon={Target}
          color="green"
          loading={loading}
        />
        <MetricCard
          title="사전 등록율"
          value={`${metrics?.overall_conversion_rate.toFixed(1) || '0'}%`}
          change={-0.8}
          icon={UserCheck}
          color="purple"
          loading={loading}
        />
        <MetricCard
          title="평균 세션 시간"
          value={`${Math.round((metrics?.avg_session_duration || 0) / 1000 / 60)}분`}
          change={1.5}
          icon={Clock}
          color="yellow"
          loading={loading}
        />
      </div>

      {/* 실시간 활동 */}
      {realTimeMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              실시간 활동
              <Badge variant="secondary" className="ml-2">
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {realTimeMetrics.active_users}
                </div>
                <div className="text-sm text-muted-foreground">현재 활성 사용자</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {realTimeMetrics.current_hour_visitors}
                </div>
                <div className="text-sm text-muted-foreground">현재 시간 방문자</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {realTimeMetrics.live_conversion_rate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">실시간 전환율</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 탭 컨텐츠 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="conversion">전환 분석</TabsTrigger>
          <TabsTrigger value="personas">페르소나</TabsTrigger>
          <TabsTrigger value="journey">사용자 여정</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* 일별 트렌드 차트 */}
            <Card>
              <CardHeader>
                <CardTitle>일별 방문자 및 전환 트렌드</CardTitle>
                <CardDescription>
                  최근 {selectedDateRange}간의 방문자와 전환율 변화
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics?.daily_stats || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                      name="방문자"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="registrations" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                      name="사전등록"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 전환 퍼널 */}
            <Card>
              <CardHeader>
                <CardTitle>전환 퍼널 분석</CardTitle>
                <CardDescription>
                  방문자부터 사전등록까지의 전환 단계
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">방문자</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.total_visitors.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">데모 시작</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.demo_starts.toLocaleString()} ({metrics?.demo_start_rate.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={metrics?.demo_start_rate || 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">데모 완료</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.demo_completions.toLocaleString()} ({metrics?.demo_completion_rate.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={metrics?.demo_completion_rate || 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">사전 등록</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.pre_registrations.toLocaleString()} ({metrics?.overall_conversion_rate.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={metrics?.overall_conversion_rate || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 전환 분석 탭 */}
        <TabsContent value="conversion" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* 시간대별 전환율 */}
            <Card>
              <CardHeader>
                <CardTitle>시간대별 전환율</CardTitle>
                <CardDescription>24시간 동안의 전환율 패턴</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics?.hourly_stats || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={(value) => new Date(value).getHours() + '시'}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="conversion_rate" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="전환율"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* A/B 테스트 결과 */}
            <Card>
              <CardHeader>
                <CardTitle>A/B 테스트 결과</CardTitle>
                <CardDescription>현재 진행 중인 테스트 성과</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics?.ab_test_results && metrics.ab_test_results.length > 0 ? (
                  <div className="space-y-4">
                    {metrics.ab_test_results.map((test, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{test.test_name}</h4>
                          <Badge variant={
                            test.winner === 'a' ? 'default' : 
                            test.winner === 'b' ? 'secondary' : 'outline'
                          }>
                            {test.winner === 'inconclusive' ? '진행중' : `${test.winner?.toUpperCase()} 승리`}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">변형 A</div>
                            <div className="text-muted-foreground">
                              {test.variant_a.conversion_rate.toFixed(1)}% 
                              ({test.variant_a.conversions}/{test.variant_a.visitors})
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">변형 B</div>
                            <div className="text-muted-foreground">
                              {test.variant_b.conversion_rate.toFixed(1)}% 
                              ({test.variant_b.conversions}/{test.variant_b.visitors})
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    현재 진행 중인 A/B 테스트가 없습니다.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 페르소나 분석 탭 */}
        <TabsContent value="personas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>페르소나별 성과 분석</CardTitle>
              <CardDescription>사용자 유형별 전환율 및 행동 패턴</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* 페르소나별 전환율 차트 */}
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics?.persona_stats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="persona" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="conversion_rate" fill="#3b82f6" name="전환율" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* 페르소나별 상세 테이블 */}
                <div className="space-y-2">
                  {metrics?.persona_stats?.map((persona, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium capitalize">{persona.persona}</div>
                        <div className="text-sm text-muted-foreground">
                          방문자 {persona.visitors}명
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {persona.conversion_rate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          등록 {persona.registrations}명
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 사용자 여정 탭 */}
        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>사용자 여정 분석</CardTitle>
              <CardDescription>최근 사용자들의 행동 패턴 및 전환 경로</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.user_journey?.slice(0, 10).map((journey, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          세션 {journey.session_id.slice(-8)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(journey.total_duration / 1000 / 60)}분 체류
                        </span>
                      </div>
                      {journey.final_conversion && (
                        <Badge variant="default">전환 완료</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {journey.events.map((event, eventIndex) => (
                        <Badge key={eventIndex} variant="secondary" className="text-xs">
                          {event.event_type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 