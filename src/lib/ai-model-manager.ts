/**
 * AI 모델 통합 관리 서비스
 * 다양한 AI 모델을 통합하여 성능 비교 및 최적화를 제공
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'google' | 'openai' | 'anthropic' | 'meta' | 'microsoft';
  modelId: string;
  capabilities: {
    textGeneration: boolean;
    codeGeneration: boolean;
    reasoning: boolean;
    multimodal: boolean;
  };
  pricing: {
    inputTokens: number;  // per 1M tokens
    outputTokens: number; // per 1M tokens
    currency: 'USD' | 'KRW';
  };
  limits: {
    maxTokens: number;
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  performance: {
    avgResponseTime: number; // milliseconds
    reliability: number;     // 0-1 score
    accuracy: number;        // 0-1 score
  };
}

export interface ModelComparisonResult {
  modelId: string;
  prompt: string;
  response: string;
  metrics: {
    responseTime: number;
    tokenCount: number;
    cost: number;
    qualityScore: number;
  };
  timestamp: Date;
}

export interface OptimizationRecommendation {
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

export class AIModelManager {
  private static instance: AIModelManager;
  private models: Map<string, AIModelConfig> = new Map();
  private geminiService: GoogleGenerativeAI | null = null;

  private constructor() {
    this.initializeModels();
    this.initializeServices();
  }

  public static getInstance(): AIModelManager {
    if (!AIModelManager.instance) {
      AIModelManager.instance = new AIModelManager();
    }
    return AIModelManager.instance;
  }

  private initializeModels(): void {
    // Google Gemini 모델들
    this.models.set('gemini-2.0-flash', {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      provider: 'google',
      modelId: 'gemini-2.0-flash',
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        reasoning: true,
        multimodal: true,
      },
      pricing: {
        inputTokens: 0,    // Free tier
        outputTokens: 0,   // Free tier
        currency: 'USD',
      },
      limits: {
        maxTokens: 8192,
        requestsPerMinute: 15,
        requestsPerDay: 1500,
      },
      performance: {
        avgResponseTime: 800,
        reliability: 0.95,
        accuracy: 0.85,
      },
    });

    this.models.set('gemini-2.5-flash', {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      provider: 'google',
      modelId: 'gemini-2.5-flash',
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        reasoning: true,
        multimodal: true,
      },
      pricing: {
        inputTokens: 0,    // Free tier
        outputTokens: 0,   // Free tier
        currency: 'USD',
      },
      limits: {
        maxTokens: 8192,
        requestsPerMinute: 15,
        requestsPerDay: 1500,
      },
      performance: {
        avgResponseTime: 1200,
        reliability: 0.97,
        accuracy: 0.92,
      },
    });

    // OpenAI GPT 모델들 (향후 확장)
    this.models.set('gpt-4o', {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'openai',
      modelId: 'gpt-4o',
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        reasoning: true,
        multimodal: true,
      },
      pricing: {
        inputTokens: 5.0,
        outputTokens: 15.0,
        currency: 'USD',
      },
      limits: {
        maxTokens: 128000,
        requestsPerMinute: 500,
        requestsPerDay: 10000,
      },
      performance: {
        avgResponseTime: 2000,
        reliability: 0.99,
        accuracy: 0.95,
      },
    });

    // Anthropic Claude 모델들 (향후 확장)
    this.models.set('claude-3.5-sonnet', {
      id: 'claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      modelId: 'claude-3-5-sonnet-20241022',
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        reasoning: true,
        multimodal: false,
      },
      pricing: {
        inputTokens: 3.0,
        outputTokens: 15.0,
        currency: 'USD',
      },
      limits: {
        maxTokens: 200000,
        requestsPerMinute: 50,
        requestsPerDay: 1000,
      },
      performance: {
        avgResponseTime: 1500,
        reliability: 0.98,
        accuracy: 0.94,
      },
    });

    // Meta Llama 모델들 (향후 확장)
    this.models.set('llama-3.3-70b', {
      id: 'llama-3.3-70b',
      name: 'Llama 3.3 70B',
      provider: 'meta',
      modelId: 'llama-3.3-70b-versatile',
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        reasoning: true,
        multimodal: false,
      },
      pricing: {
        inputTokens: 0.59,
        outputTokens: 0.79,
        currency: 'USD',
      },
      limits: {
        maxTokens: 32768,
        requestsPerMinute: 30,
        requestsPerDay: 14400,
      },
      performance: {
        avgResponseTime: 1800,
        reliability: 0.93,
        accuracy: 0.88,
      },
    });
  }

  private initializeServices(): void {
    // Gemini API 초기화
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      this.geminiService = new GoogleGenerativeAI(geminiApiKey);
    }
  }

  public getAvailableModels(): AIModelConfig[] {
    return Array.from(this.models.values());
  }

  public getModelConfig(modelId: string): AIModelConfig | null {
    return this.models.get(modelId) || null;
  }

  public getModelsByProvider(provider: string): AIModelConfig[] {
    return Array.from(this.models.values()).filter(
      model => model.provider === provider
    );
  }

  public async generateWithModel(
    modelId: string,
    prompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    }
  ): Promise<{
    response: string;
    metrics: {
      responseTime: number;
      tokenCount: number;
      cost: number;
    };
  }> {
    const startTime = Date.now();
    const model = this.models.get(modelId);
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    let response = '';
    let tokenCount = 0;

    try {
      switch (model.provider) {
        case 'google':
          response = await this.generateWithGemini(modelId, prompt, options);
          break;
        case 'openai':
          response = await this.generateWithOpenAI(modelId, prompt, options);
          break;
        case 'anthropic':
          response = await this.generateWithClaude(modelId, prompt, options);
          break;
        case 'meta':
          response = await this.generateWithLlama(modelId, prompt, options);
          break;
        default:
          throw new Error(`Provider ${model.provider} not supported`);
      }

      tokenCount = this.estimateTokenCount(response);
      const responseTime = Date.now() - startTime;
      const cost = this.calculateCost(model, tokenCount);

      return {
        response,
        metrics: {
          responseTime,
          tokenCount,
          cost,
        },
      };
    } catch (error) {
      console.error(`Error generating with ${modelId}:`, error);
      throw error;
    }
  }

  private async generateWithGemini(
    modelId: string,
    prompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    }
  ): Promise<string> {
    if (!this.geminiService) {
      throw new Error('Gemini service not initialized');
    }

    const model = this.geminiService.getGenerativeModel({
      model: modelId,
      generationConfig: {
        temperature: options?.temperature || 0.8,
        topP: options?.topP || 0.95,
        maxOutputTokens: options?.maxTokens || 3072,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  private async generateWithOpenAI(
    modelId: string,
    prompt: string,
    options?: any
  ): Promise<string> {
    // TODO: OpenAI API 통합 구현
    throw new Error('OpenAI integration not implemented yet');
  }

  private async generateWithClaude(
    modelId: string,
    prompt: string,
    options?: any
  ): Promise<string> {
    // TODO: Claude API 통합 구현
    throw new Error('Claude integration not implemented yet');
  }

  private async generateWithLlama(
    modelId: string,
    prompt: string,
    options?: any
  ): Promise<string> {
    // TODO: Llama API 통합 구현
    throw new Error('Llama integration not implemented yet');
  }

  public async compareModels(
    modelIds: string[],
    prompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<ModelComparisonResult[]> {
    const results: ModelComparisonResult[] = [];

    for (const modelId of modelIds) {
      try {
        const startTime = Date.now();
        const { response, metrics } = await this.generateWithModel(
          modelId,
          prompt,
          options
        );

        const qualityScore = await this.evaluateResponseQuality(
          prompt,
          response,
          modelId
        );

        results.push({
          modelId,
          prompt,
          response,
          metrics: {
            ...metrics,
            qualityScore,
          },
          timestamp: new Date(),
        });
      } catch (error) {
        console.error(`Failed to generate with ${modelId}:`, error);
        // 실패한 모델은 결과에서 제외
      }
    }

    return results;
  }

  public recommendOptimalModel(
    taskType: 'creative' | 'technical' | 'business' | 'educational',
    requirements: {
      prioritizeSpeed?: boolean;
      prioritizeQuality?: boolean;
      prioritizeCost?: boolean;
      maxBudget?: number;
    }
  ): OptimizationRecommendation {
    const availableModels = this.getAvailableModels();
    
    // 작업 유형별 모델 가중치
    const taskWeights = {
      creative: { accuracy: 0.4, speed: 0.2, cost: 0.4 },
      technical: { accuracy: 0.5, speed: 0.3, cost: 0.2 },
      business: { accuracy: 0.3, speed: 0.4, cost: 0.3 },
      educational: { accuracy: 0.4, speed: 0.3, cost: 0.3 },
    };

    const weights = taskWeights[taskType];
    let bestModel: AIModelConfig | null = null;
    let bestScore = -1;

    for (const model of availableModels) {
      // 예산 제한 확인
      if (requirements.maxBudget && model.pricing.inputTokens > requirements.maxBudget) {
        continue;
      }

      // 종합 점수 계산
      const speedScore = 1 - (model.performance.avgResponseTime / 3000); // 3초 기준 정규화
      const qualityScore = model.performance.accuracy;
      const costScore = model.pricing.inputTokens === 0 ? 1 : 1 / (model.pricing.inputTokens + 1);

      const totalScore = 
        qualityScore * weights.accuracy +
        speedScore * weights.speed +
        costScore * weights.cost;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestModel = model;
      }
    }

    if (!bestModel) {
      throw new Error('No suitable model found for the given requirements');
    }

    // 대안 모델들 찾기
    const alternatives = availableModels
      .filter(model => model.id !== bestModel!.id)
      .sort((a, b) => {
        const scoreA = a.performance.accuracy * weights.accuracy +
                      (1 - a.performance.avgResponseTime / 3000) * weights.speed +
                      (a.pricing.inputTokens === 0 ? 1 : 1 / (a.pricing.inputTokens + 1)) * weights.cost;
        const scoreB = b.performance.accuracy * weights.accuracy +
                      (1 - b.performance.avgResponseTime / 3000) * weights.speed +
                      (b.pricing.inputTokens === 0 ? 1 : 1 / (b.pricing.inputTokens + 1)) * weights.cost;
        return scoreB - scoreA;
      })
      .slice(0, 3)
      .map(model => ({
        modelId: model.id,
        tradeoffs: this.generateTradeoffAnalysis(bestModel!, model),
      }));

    return {
      recommendedModel: bestModel.id,
      reasoning: this.generateRecommendationReasoning(bestModel, taskType, requirements),
      expectedPerformance: {
        speed: 1 - (bestModel.performance.avgResponseTime / 3000),
        quality: bestModel.performance.accuracy,
        cost: bestModel.pricing.inputTokens === 0 ? 1 : 1 / (bestModel.pricing.inputTokens + 1),
      },
      alternatives,
    };
  }

  private async evaluateResponseQuality(
    prompt: string,
    response: string,
    modelId: string
  ): Promise<number> {
    // 간단한 품질 평가 알고리즘
    // 실제 구현에서는 더 정교한 평가 모델 사용
    const lengthScore = Math.min(response.length / 1000, 1);
    const relevanceScore = this.calculateRelevanceScore(prompt, response);
    const coherenceScore = this.calculateCoherenceScore(response);
    
    return (lengthScore * 0.2 + relevanceScore * 0.5 + coherenceScore * 0.3);
  }

  private calculateRelevanceScore(prompt: string, response: string): number {
    // 키워드 매칭 기반 관련성 점수
    const promptWords = prompt.toLowerCase().split(/\s+/);
    const responseWords = response.toLowerCase().split(/\s+/);
    
    const commonWords = promptWords.filter(word => 
      responseWords.includes(word) && word.length > 3
    );
    
    return Math.min(commonWords.length / Math.max(promptWords.length, 1), 1);
  }

  private calculateCoherenceScore(response: string): number {
    // 응답의 일관성 점수 (문장 길이, 구조 등 기반)
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const lengthVariance = sentences.reduce((sum, s) => sum + Math.pow(s.length - avgSentenceLength, 2), 0) / sentences.length;
    
    // 적절한 문장 길이와 일관성을 가진 응답에 높은 점수
    const lengthScore = Math.max(0, 1 - Math.abs(avgSentenceLength - 100) / 100);
    const consistencyScore = Math.max(0, 1 - Math.sqrt(lengthVariance) / 50);
    
    return (lengthScore + consistencyScore) / 2;
  }

  private estimateTokenCount(text: string): number {
    // 간단한 토큰 수 추정 (실제로는 모델별 토크나이저 사용)
    return Math.ceil(text.length / 4);
  }

  private calculateCost(model: AIModelConfig, tokenCount: number): number {
    if (model.pricing.inputTokens === 0) return 0;
    return (tokenCount / 1000000) * model.pricing.inputTokens;
  }

  private generateRecommendationReasoning(
    model: AIModelConfig,
    taskType: string,
    requirements: any
  ): string {
    const reasons = [];
    
    if (model.pricing.inputTokens === 0) {
      reasons.push('무료 사용 가능');
    }
    
    if (model.performance.accuracy > 0.9) {
      reasons.push('높은 정확도');
    }
    
    if (model.performance.avgResponseTime < 1000) {
      reasons.push('빠른 응답 속도');
    }
    
    if (model.capabilities.multimodal) {
      reasons.push('멀티모달 지원');
    }
    
    return `${taskType} 작업에 최적화된 ${model.name}을 추천합니다. ${reasons.join(', ')}의 장점을 제공합니다.`;
  }

  private generateTradeoffAnalysis(bestModel: AIModelConfig, alternative: AIModelConfig): string {
    const tradeoffs = [];
    
    if (alternative.performance.avgResponseTime < bestModel.performance.avgResponseTime) {
      tradeoffs.push('더 빠른 응답');
    }
    
    if (alternative.performance.accuracy > bestModel.performance.accuracy) {
      tradeoffs.push('더 높은 정확도');
    }
    
    if (alternative.pricing.inputTokens < bestModel.pricing.inputTokens) {
      tradeoffs.push('더 저렴한 비용');
    }
    
    if (alternative.limits.maxTokens > bestModel.limits.maxTokens) {
      tradeoffs.push('더 긴 컨텍스트');
    }
    
    return tradeoffs.length > 0 ? tradeoffs.join(', ') : '비슷한 성능';
  }
} 