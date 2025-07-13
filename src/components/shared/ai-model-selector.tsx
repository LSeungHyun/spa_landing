'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  DollarSign, 
  Clock, 
  Star,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  pricing: {
    inputTokens: number;
    outputTokens: number;
    currency: string;
  };
  performance: {
    speed: number;      // 0-100
    quality: number;    // 0-100
    reliability: number; // 0-100
  };
  capabilities: string[];
  isAvailable: boolean;
}

const AI_MODELS: AIModel[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    description: '최신 고성능 무료 모델, 뛰어난 추론 능력',
    pricing: { inputTokens: 0, outputTokens: 0, currency: 'USD' },
    performance: { speed: 85, quality: 92, reliability: 97 },
    capabilities: ['텍스트 생성', '코드 생성', '추론', '멀티모달'],
    isAvailable: true,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: '빠르고 안정적인 무료 모델',
    pricing: { inputTokens: 0, outputTokens: 0, currency: 'USD' },
    performance: { speed: 95, quality: 85, reliability: 95 },
    capabilities: ['텍스트 생성', '코드 생성', '추론', '멀티모달'],
    isAvailable: true,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: '최고 품질의 프리미엄 모델',
    pricing: { inputTokens: 5.0, outputTokens: 15.0, currency: 'USD' },
    performance: { speed: 70, quality: 95, reliability: 99 },
    capabilities: ['텍스트 생성', '코드 생성', '추론', '멀티모달'],
    isAvailable: false,
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: '뛰어난 추론과 코딩 능력',
    pricing: { inputTokens: 3.0, outputTokens: 15.0, currency: 'USD' },
    performance: { speed: 75, quality: 94, reliability: 98 },
    capabilities: ['텍스트 생성', '코드 생성', '추론'],
    isAvailable: false,
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: '오픈소스 기반 저비용 모델',
    pricing: { inputTokens: 0.59, outputTokens: 0.79, currency: 'USD' },
    performance: { speed: 80, quality: 88, reliability: 93 },
    capabilities: ['텍스트 생성', '코드 생성', '추론'],
    isAvailable: false,
  },
];

interface AIModelSelectorProps {
  selectedModels: string[];
  onModelSelectionChange: (modelIds: string[]) => void;
  taskType: 'creative' | 'technical' | 'business' | 'educational';
  onTaskTypeChange: (taskType: 'creative' | 'technical' | 'business' | 'educational') => void;
  onCompare: () => void;
  isComparing: boolean;
}

export function AIModelSelector({
  selectedModels,
  onModelSelectionChange,
  taskType,
  onTaskTypeChange,
  onCompare,
  isComparing
}: AIModelSelectorProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleModelToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onModelSelectionChange(selectedModels.filter(id => id !== modelId));
    } else if (selectedModels.length < 3) {
      onModelSelectionChange([...selectedModels, modelId]);
    }
  };

  const getProviderIcon = (provider: string) => {
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

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h3 className="text-2xl font-bold">AI 모델 비교 시스템</h3>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          5개 주요 AI 모델의 성능을 비교하고 작업 유형에 맞는 최적 모델을 추천받으세요
        </p>
      </div>

      {/* 작업 유형 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            작업 유형 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={taskType} onValueChange={onTaskTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="작업 유형을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creative">🎨 창작 (Creative)</SelectItem>
              <SelectItem value="technical">⚙️ 기술 (Technical)</SelectItem>
              <SelectItem value="business">💼 비즈니스 (Business)</SelectItem>
              <SelectItem value="educational">📚 교육 (Educational)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 모델 선택 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            모델 선택 ({selectedModels.length}/3)
          </span>
        </div>
        <p className="text-blue-700 text-sm">
          최대 3개 모델을 선택하여 성능을 비교할 수 있습니다. 
          현재 Gemini 모델만 실제 테스트 가능합니다.
        </p>
      </div>

      {/* 모델 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_MODELS.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          const isSelectable = model.isAvailable || selectedModels.length < 3;

          return (
            <motion.div
              key={model.id}
              whileHover={{ scale: isSelectable ? 1.02 : 1 }}
              whileTap={{ scale: isSelectable ? 0.98 : 1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : model.isAvailable
                    ? 'hover:border-gray-300 hover:shadow-sm'
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => model.isAvailable && handleModelToggle(model.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getProviderIcon(model.provider)}</span>
                      <div>
                        <CardTitle className="text-sm">{model.name}</CardTitle>
                        <p className="text-xs text-gray-500">{model.provider}</p>
                      </div>
                    </div>
                    {model.isAvailable && (
                      <Checkbox
                        checked={isSelected}
                        disabled={!isSelectable && !isSelected}
                      />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {model.description}
                  </p>

                  {/* 성능 지표 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        속도
                      </span>
                      <span className={`text-xs font-medium ${getPerformanceColor(model.performance.speed)}`}>
                        {model.performance.speed}%
                      </span>
                    </div>
                    <Progress value={model.performance.speed} className="h-1" />

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        품질
                      </span>
                      <span className={`text-xs font-medium ${getPerformanceColor(model.performance.quality)}`}>
                        {model.performance.quality}%
                      </span>
                    </div>
                    <Progress value={model.performance.quality} className="h-1" />
                  </div>

                  {/* 가격 정보 */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        비용
                      </span>
                      <span className="text-xs font-medium">
                        {model.pricing.inputTokens === 0 
                          ? '무료' 
                          : `$${model.pricing.inputTokens}/1M`
                        }
                      </span>
                    </div>
                  </div>

                  {/* 상태 배지 */}
                  <div className="flex gap-1 flex-wrap">
                    {model.isAvailable ? (
                      <Badge variant="default" className="text-xs">
                        사용 가능
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        준비 중
                      </Badge>
                    )}
                    {model.pricing.inputTokens === 0 && (
                      <Badge variant="outline" className="text-xs">
                        무료
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 비교 실행 버튼 */}
      <div className="flex justify-center">
        <Button
          onClick={onCompare}
          disabled={selectedModels.length < 2 || isComparing}
          size="lg"
          className="px-8"
        >
          {isComparing ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              모델 비교 중...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              선택된 모델 비교하기 ({selectedModels.length}개)
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 