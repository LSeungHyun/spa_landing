import { NextRequest, NextResponse } from 'next/server';
import { AIModelManager } from '@/lib/ai-model-manager';
import { MultiModelPromptOptimizer } from '@/lib/services/multi-model-prompt-optimizer';

export async function POST(request: NextRequest) {
  try {
    console.log('=== AI Models Comparison API Started ===');

    const { prompt, modelIds, taskType = 'business', options = {} } = await request.json();

    // 입력 검증
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Valid prompt is required',
      }, { status: 400 });
    }

    if (!modelIds || !Array.isArray(modelIds) || modelIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid modelIds array is required',
      }, { status: 400 });
    }

    const aiModelManager = AIModelManager.getInstance();
    const optimizer = MultiModelPromptOptimizer.getInstance();

    // 1. 모델별 프롬프트 최적화
    console.log('Optimizing prompts for multiple models...');
    const crossModelOptimization = await optimizer.optimizeForMultipleModels(
      prompt,
      modelIds,
      taskType
    );

    // 2. 모델 비교 실행 (현재 사용 가능한 모델만)
    console.log('Comparing models...');
    const availableModelIds = modelIds.filter(id => 
      aiModelManager.getModelConfig(id)?.provider === 'google'
    );

    const comparisonResults = await aiModelManager.compareModels(
      availableModelIds,
      prompt,
      options
    );

    // 3. 모델 추천
    const recommendation = aiModelManager.recommendOptimalModel(taskType, {
      prioritizeQuality: options.prioritizeQuality || false,
      prioritizeSpeed: options.prioritizeSpeed || false,
      prioritizeCost: options.prioritizeCost || true,
      maxBudget: options.maxBudget,
    });

    // 4. 결과 정리
    const response = {
      success: true,
      data: {
        originalPrompt: prompt,
        taskType,
        optimization: crossModelOptimization,
        comparison: comparisonResults,
        recommendation,
        summary: {
          totalModels: modelIds.length,
          testedModels: comparisonResults.length,
          bestModel: recommendation.recommendedModel,
          avgResponseTime: comparisonResults.length > 0 
            ? comparisonResults.reduce((sum, r) => sum + r.metrics.responseTime, 0) / comparisonResults.length
            : 0,
          totalCost: comparisonResults.reduce((sum, r) => sum + r.metrics.cost, 0),
        },
      },
      metadata: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now(),
        version: '1.0.0',
      },
    };

    console.log('=== AI Models Comparison API Completed ===');
    return NextResponse.json(response);

  } catch (error) {
    console.error('AI Models Comparison API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    }, { status: 500 });
  }
} 