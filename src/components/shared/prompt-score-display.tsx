'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Target,
  FileText,
  Brain,
  Layers,
  CheckSquare
} from 'lucide-react';
import { DetailedPromptScore } from '@/lib/services/prompt-improvement-service';
import { cn } from '@/lib/utils';

interface PromptScoreDisplayProps {
  score: DetailedPromptScore;
  isVisible?: boolean;
  showAnimation?: boolean;
  compact?: boolean;
}

export function PromptScoreDisplay({
  score,
  isVisible = true,
  showAnimation = true,
  compact = false
}: PromptScoreDisplayProps) {
  if (!isVisible) return null;

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-100 border-green-200';
    if (value >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const categoryIcons = {
    clarity: Target,
    specificity: Brain,
    context: FileText,
    structure: Layers,
    completeness: CheckSquare
  };

  const categoryNames = {
    clarity: '명확성',
    specificity: '구체성',
    context: '맥락',
    structure: '구조',
    completeness: '완성도'
  };

  if (compact) {
    return (
      <motion.div
        initial={showAnimation ? { opacity: 0, scale: 0.9 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm"
      >
        {/* 원형 점수 */}
        <div className="relative">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white",
            getGradeColor(score.grade)
          )}>
            {score.overall}
          </div>
          <div className="absolute -top-1 -right-1">
            <Badge variant="secondary" className="text-xs px-1">
              {score.grade}
            </Badge>
          </div>
        </div>

        {/* 간단한 정보 */}
        <div className="flex-1">
          <div className="text-sm font-medium">
            프롬프트 품질: {score.overall}/100
          </div>
          <div className="text-xs text-gray-500">
            신뢰도 {score.confidence}% · {score.breakdown.suggestions.length}개 제안
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={showAnimation ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* 전체 점수 및 등급 */}
      <Card className={cn("border-2", getScoreBgColor(score.overall))}>
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2">
            <TrendingUp className={cn("w-5 h-5", getScoreColor(score.overall))} />
            프롬프트 품질 점수
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative inline-block">
            {/* 원형 점수 게이지 */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                {/* 배경 원 */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-200"
                />
                {/* 점수 원 */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={getScoreColor(score.overall)}
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 50 * (1 - score.overall / 100)
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              
              {/* 중앙 점수 표시 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className={cn("text-3xl font-bold", getScoreColor(score.overall))}
                >
                  {score.overall}
                </motion.div>
                <div className="text-sm text-gray-500">/ 100</div>
              </div>
            </div>

            {/* 등급 배지 */}
            <div className="mt-4">
              <Badge 
                className={cn(
                  "text-white text-lg px-4 py-1",
                  getGradeColor(score.grade)
                )}
              >
                등급 {score.grade}
              </Badge>
            </div>

            {/* 신뢰도 */}
            <div className="mt-2 text-sm text-gray-600">
              신뢰도: {score.confidence}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리별 세부 점수 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="w-5 h-5" />
            세부 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(score.categories).map(([category, value]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              const name = categoryNames[category as keyof typeof categoryNames];
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                    <span className={cn("text-sm font-semibold", getScoreColor(value))}>
                      {value}/100
                    </span>
                  </div>
                  <Progress 
                    value={value} 
                    className="h-2"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 강점 */}
      {score.breakdown.strengths.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              강점
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.breakdown.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {strength}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 개선 제안 */}
      {score.breakdown.suggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
              <AlertCircle className="w-5 h-5" />
              개선 제안
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.breakdown.suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-blue-700"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
} 