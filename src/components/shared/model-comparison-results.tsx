'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Zap,
  Award,
  Target,
  BarChart3,
  Copy,
  CheckCircle2
} from 'lucide-react';

interface ModelComparisonResult {
  modelId: string;
  modelName: string;
  provider: string;
  response: string;
  metrics: {
    responseTime: number;
    tokenCount: number;
    cost: number;
    qualityScore: number;
  };
  timestamp: Date;
}

interface OptimizationRecommendation {
  recommendedModel: string;
  reasoning: string;
  expectedPerformance: {
    speed: number;
    quality: number;
    cost: number;
  };
  alternatives: Array<{
    modelId: string;
    tradeoffs: string;
  }>;
}

interface ModelComparisonResultsProps {
  results: ModelComparisonResult[];
  recommendation: OptimizationRecommendation;
  originalPrompt: string;
  taskType: string;
  isVisible: boolean;
  onCopyPrompt: (prompt: string) => void;
}

export function ModelComparisonResults({
  results,
  recommendation,
  originalPrompt,
  taskType,
  isVisible,
  onCopyPrompt
}: ModelComparisonResultsProps) {
  const [copiedModel, setCopiedModel] = useState<string | null>(null);

  if (!isVisible || results.length === 0) return null;

  const handleCopyResponse = async (response: string, modelId: string) => {
    try {
      await navigator.clipboard.writeText(response);
      setCopiedModel(modelId);
      setTimeout(() => setCopiedModel(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const getModelIcon = (provider: string) => {
    switch (provider) {
      case 'Google': return '🔍';
      case 'OpenAI': return '🤖';
      case 'Anthropic': return '🧠';
      case 'Meta': return '📘';
      default: return '⚡';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBestModel = () => {
    return results.reduce((best, current) => 
      current.metrics.qualityScore > best.metrics.qualityScore ? current : best
    );
  };

  const formatCost = (cost: number) => {
    return cost === 0 ? '무료' : `$${cost.toFixed(4)}`;
  };

  const bestModel = getBestModel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <h3 className="text-2xl font-bold">모델 비교 결과</h3>
        </div>
        <p className="text-gray-600">
          {results.length}개 모델의 성능을 비교했습니다 ({taskType} 작업)
        </p>
      </div>

      {/* 추천 모델 카드 */}
      <Card className="border-2 border-yellow-300 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            추천 모델
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getModelIcon(bestModel.provider)}</span>
            <div>
              <h4 className="font-semibold text-lg">{bestModel.modelName}</h4>
              <p className="text-sm text-gray-600">{bestModel.provider}</p>
            </div>
            <Badge variant="default" className="ml-auto">
              최고 점수: {bestModel.metrics.qualityScore}%
            </Badge>
          </div>
          
          <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">
            {recommendation.reasoning}
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {Math.round(recommendation.expectedPerformance.speed * 100)}%
              </div>
              <div className="text-xs text-gray-500">속도</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {Math.round(recommendation.expectedPerformance.quality * 100)}%
              </div>
              <div className="text-xs text-gray-500">품질</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {Math.round(recommendation.expectedPerformance.cost * 100)}%
              </div>
              <div className="text-xs text-gray-500">비용 효율</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상세 비교 탭 */}
      <Tabs defaultValue="responses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="responses">응답 비교</TabsTrigger>
          <TabsTrigger value="metrics">성능 지표</TabsTrigger>
          <TabsTrigger value="analysis">분석 결과</TabsTrigger>
        </TabsList>

        {/* 응답 비교 탭 */}
        <TabsContent value="responses" className="space-y-4">
          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={result.modelId} className={`${
                result.modelId === bestModel.modelId 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getModelIcon(result.provider)}</span>
                      <div>
                        <CardTitle className="text-sm">{result.modelName}</CardTitle>
                        <p className="text-xs text-gray-500">{result.provider}</p>
                      </div>
                      {result.modelId === bestModel.modelId && (
                        <Badge variant="default" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          최고 성능
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyResponse(result.response, result.modelId)}
                      className="text-xs"
                    >
                      {copiedModel === result.modelId ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          복사됨
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          복사
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-lg border text-sm">
                    {result.response}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 성능 지표 탭 */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4">
            {results.map((result) => (
              <Card key={result.modelId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getModelIcon(result.provider)}</span>
                    <CardTitle className="text-sm">{result.modelName}</CardTitle>
                    {result.modelId === bestModel.modelId && (
                      <Badge variant="default" className="text-xs">최고</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 품질 점수 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        품질 점수
                      </span>
                      <span className={`font-semibold ${getPerformanceColor(result.metrics.qualityScore)}`}>
                        {result.metrics.qualityScore}%
                      </span>
                    </div>
                    <Progress value={result.metrics.qualityScore} className="h-2" />
                  </div>

                  {/* 응답 시간 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        응답 시간
                      </span>
                      <span className="font-semibold">
                        {result.metrics.responseTime}ms
                      </span>
                    </div>
                    <Progress 
                      value={Math.max(0, 100 - (result.metrics.responseTime / 30))} 
                      className="h-2" 
                    />
                  </div>

                  {/* 토큰 사용량 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        토큰 사용량
                      </span>
                      <span className="font-semibold">
                        {result.metrics.tokenCount} tokens
                      </span>
                    </div>
                  </div>

                  {/* 비용 */}
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        비용
                      </span>
                      <span className="font-semibold">
                        {formatCost(result.metrics.cost)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 분석 결과 탭 */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                종합 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">최적 모델 선택 이유</h4>
                <p className="text-blue-800 text-sm">
                  {recommendation.reasoning}
                </p>
              </div>

              {recommendation.alternatives.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">대안 모델</h4>
                  <div className="space-y-2">
                    {recommendation.alternatives.map((alt, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-sm mb-1">
                          {results.find(r => r.modelId === alt.modelId)?.modelName || alt.modelId}
                        </div>
                        <p className="text-xs text-gray-600">{alt.tradeoffs}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">추천 사항</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• {taskType} 작업에는 <strong>{bestModel.modelName}</strong>을 사용하세요</li>
                  <li>• 평균 응답 시간: {bestModel.metrics.responseTime}ms</li>
                  <li>• 예상 비용: {formatCost(bestModel.metrics.cost)}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
} 