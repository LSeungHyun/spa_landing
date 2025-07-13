/**
 * 다중 AI 모델용 프롬프트 최적화 엔진
 * 각 AI 모델의 특성에 맞는 프롬프트 최적화 및 변환 기능 제공
 */

import { AIModelManager, AIModelConfig } from '../ai-model-manager';

export interface ModelSpecificOptimization {
  modelId: string;
  originalPrompt: string;
  optimizedPrompt: string;
  optimizationRules: string[];
  expectedImprovement: {
    clarity: number;
    specificity: number;
    effectiveness: number;
  };
}

export interface CrossModelOptimization {
  originalPrompt: string;
  optimizations: ModelSpecificOptimization[];
  bestModel: string;
  reasoning: string;
  unifiedOptimization?: string;
}

export class MultiModelPromptOptimizer {
  private static instance: MultiModelPromptOptimizer;
  private aiModelManager: AIModelManager;

  // 모델별 최적화 규칙
  private modelOptimizationRules: Map<string, {
    strengths: string[];
    weaknesses: string[];
    promptStructure: string;
    optimizationTips: string[];
  }> = new Map();

  private constructor() {
    this.aiModelManager = AIModelManager.getInstance();
    this.initializeOptimizationRules();
  }

  public static getInstance(): MultiModelPromptOptimizer {
    if (!MultiModelPromptOptimizer.instance) {
      MultiModelPromptOptimizer.instance = new MultiModelPromptOptimizer();
    }
    return MultiModelPromptOptimizer.instance;
  }

  private initializeOptimizationRules(): void {
    // Gemini 모델 최적화 규칙
    this.modelOptimizationRules.set('gemini-2.0-flash', {
      strengths: ['빠른 응답', '다양한 언어 지원', '멀티모달 처리'],
      weaknesses: ['복잡한 추론', '긴 컨텍스트 처리'],
      promptStructure: `
        작업 정의 → 구체적 요구사항 → 출력 형식 → 예시 (선택적)
      `,
      optimizationTips: [
        '명확하고 직접적인 지시어 사용',
        '단계별 작업 분해',
        '구체적인 출력 형식 명시',
        '예시보다는 규칙 기반 설명 선호',
      ],
    });

    this.modelOptimizationRules.set('gemini-2.5-flash', {
      strengths: ['향상된 추론', '복잡한 작업 처리', '구조화된 출력'],
      weaknesses: ['약간 느린 응답', '과도한 설명'],
      promptStructure: `
        역할 정의 → 맥락 설명 → 구체적 작업 → 제약 조건 → 출력 형식
      `,
      optimizationTips: [
        '역할 기반 프롬프트 사용',
        '충분한 맥락 정보 제공',
        '복잡한 작업의 경우 단계별 분해',
        '출력 구조화 요청',
      ],
    });

    this.modelOptimizationRules.set('gpt-4o', {
      strengths: ['뛰어난 추론', '창의적 사고', '긴 컨텍스트'],
      weaknesses: ['높은 비용', '느린 응답'],
      promptStructure: `
        시스템 메시지 → 사용자 의도 → 상세 요구사항 → 출력 제약
      `,
      optimizationTips: [
        '시스템 메시지로 역할 명확화',
        '사고 과정 유도 (Chain of Thought)',
        '창의적 작업에 최적화',
        '예시 기반 학습 활용',
      ],
    });

    this.modelOptimizationRules.set('claude-3.5-sonnet', {
      strengths: ['정확한 분석', '긴 문서 처리', '윤리적 판단'],
      weaknesses: ['창의성 제한', '속도'],
      promptStructure: `
        명확한 지시 → 상세한 맥락 → 분석 요구사항 → 출력 기준
      `,
      optimizationTips: [
        '분석적 작업에 최적화',
        '상세한 맥락 정보 제공',
        '객관적 기준 명시',
        '윤리적 고려사항 포함',
      ],
    });

    this.modelOptimizationRules.set('llama-3.3-70b', {
      strengths: ['오픈소스', '코드 생성', '기술 문서'],
      weaknesses: ['일반적 추론', '창의성'],
      promptStructure: `
        기술적 요구사항 → 구체적 스펙 → 코드/문서 형식 → 제약 조건
      `,
      optimizationTips: [
        '기술적 작업에 특화',
        '구체적 스펙 제공',
        '코드 예시 활용',
        '명확한 형식 지정',
      ],
    });
  }

  public async optimizeForModel(
    prompt: string,
    modelId: string,
    taskType: 'creative' | 'technical' | 'business' | 'educational' = 'business'
  ): Promise<ModelSpecificOptimization> {
    const modelConfig = this.aiModelManager.getModelConfig(modelId);
    const optimizationRules = this.modelOptimizationRules.get(modelId);

    if (!modelConfig || !optimizationRules) {
      throw new Error(`Model ${modelId} not supported for optimization`);
    }

    const analysis = this.analyzePrompt(prompt);
    const optimizedPrompt = this.generateOptimizedPrompt(
      prompt,
      modelConfig,
      optimizationRules,
      taskType
    );

    const appliedRules = this.identifyAppliedRules(
      prompt,
      optimizedPrompt,
      optimizationRules
    );

    const expectedImprovement = this.calculateExpectedImprovement(
      analysis,
      optimizationRules,
      taskType
    );

    return {
      modelId,
      originalPrompt: prompt,
      optimizedPrompt,
      optimizationRules: appliedRules,
      expectedImprovement,
    };
  }

  public async optimizeForMultipleModels(
    prompt: string,
    modelIds: string[],
    taskType: 'creative' | 'technical' | 'business' | 'educational' = 'business'
  ): Promise<CrossModelOptimization> {
    const optimizations: ModelSpecificOptimization[] = [];

    for (const modelId of modelIds) {
      try {
        const optimization = await this.optimizeForModel(prompt, modelId, taskType);
        optimizations.push(optimization);
      } catch (error) {
        console.error(`Failed to optimize for ${modelId}:`, error);
      }
    }

    // 최적 모델 선택
    const recommendation = this.aiModelManager.recommendOptimalModel(taskType, {
      prioritizeQuality: true,
    });

    const bestModel = recommendation.recommendedModel;
    const reasoning = this.generateOptimizationReasoning(
      optimizations,
      bestModel,
      taskType
    );

    // 통합 최적화 생성 (선택적)
    const unifiedOptimization = this.generateUnifiedOptimization(
      prompt,
      optimizations,
      taskType
    );

    return {
      originalPrompt: prompt,
      optimizations,
      bestModel,
      reasoning,
      unifiedOptimization,
    };
  }

  private analyzePrompt(prompt: string): {
    length: number;
    complexity: 'simple' | 'medium' | 'complex';
    clarity: number;
    specificity: number;
    structure: 'unstructured' | 'semi-structured' | 'structured';
  } {
    const words = prompt.split(/\s+/).length;
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    const complexity = words < 20 ? 'simple' : words < 100 ? 'medium' : 'complex';
    const clarity = this.calculateClarity(prompt);
    const specificity = this.calculateSpecificity(prompt);
    const structure = this.detectStructure(prompt);

    return {
      length: words,
      complexity,
      clarity,
      specificity,
      structure,
    };
  }

  private generateOptimizedPrompt(
    originalPrompt: string,
    modelConfig: AIModelConfig,
    rules: any,
    taskType: string
  ): string {
    const analysis = this.analyzePrompt(originalPrompt);
    let optimizedPrompt = originalPrompt;

    // 모델별 최적화 적용
    switch (modelConfig.provider) {
      case 'google':
        optimizedPrompt = this.optimizeForGemini(originalPrompt, modelConfig, rules, taskType);
        break;
      case 'openai':
        optimizedPrompt = this.optimizeForGPT(originalPrompt, modelConfig, rules, taskType);
        break;
      case 'anthropic':
        optimizedPrompt = this.optimizeForClaude(originalPrompt, modelConfig, rules, taskType);
        break;
      case 'meta':
        optimizedPrompt = this.optimizeForLlama(originalPrompt, modelConfig, rules, taskType);
        break;
    }

    return optimizedPrompt;
  }

  private optimizeForGemini(
    prompt: string,
    modelConfig: AIModelConfig,
    rules: any,
    taskType: string
  ): string {
    const analysis = this.analyzePrompt(prompt);
    
    // Gemini 최적화 패턴
    let optimized = prompt;

    // 1. 명확한 작업 정의 추가
    if (analysis.clarity < 0.7) {
      optimized = `작업: ${this.extractTaskFromPrompt(prompt)}\n\n${optimized}`;
    }

    // 2. 구체적 출력 형식 명시
    if (!prompt.includes('형식') && !prompt.includes('format')) {
      optimized += '\n\n출력 형식: 구조화된 텍스트로 명확하게 정리해주세요.';
    }

    // 3. 단계별 작업 분해 (복잡한 작업의 경우)
    if (analysis.complexity === 'complex') {
      optimized = `다음 작업을 단계별로 수행해주세요:\n\n${optimized}`;
    }

    // 4. 모델별 특화 최적화
    if (modelConfig.id === 'gemini-2.5-flash') {
      optimized = `당신은 ${this.getTaskRole(taskType)} 전문가입니다.\n\n${optimized}`;
    }

    return optimized;
  }

  private optimizeForGPT(
    prompt: string,
    modelConfig: AIModelConfig,
    rules: any,
    taskType: string
  ): string {
    // GPT 최적화 로직 (향후 구현)
    let optimized = prompt;

    // 시스템 메시지 형태로 변환
    const systemMessage = `You are an expert ${this.getTaskRole(taskType)}. `;
    optimized = systemMessage + optimized;

    // Chain of Thought 유도
    if (taskType === 'technical' || taskType === 'business') {
      optimized += '\n\nPlease think step by step and explain your reasoning.';
    }

    return optimized;
  }

  private optimizeForClaude(
    prompt: string,
    modelConfig: AIModelConfig,
    rules: any,
    taskType: string
  ): string {
    // Claude 최적화 로직 (향후 구현)
    let optimized = prompt;

    // 상세한 맥락 정보 추가
    optimized = `Context: This is a ${taskType} task requiring careful analysis.\n\n${optimized}`;

    // 분석적 접근 유도
    optimized += '\n\nPlease provide a thorough analysis with clear reasoning.';

    return optimized;
  }

  private optimizeForLlama(
    prompt: string,
    modelConfig: AIModelConfig,
    rules: any,
    taskType: string
  ): string {
    // Llama 최적화 로직 (향후 구현)
    let optimized = prompt;

    // 기술적 작업에 특화
    if (taskType === 'technical') {
      optimized = `Technical Task: ${optimized}`;
      optimized += '\n\nProvide detailed technical specifications and code examples if applicable.';
    }

    return optimized;
  }

  private identifyAppliedRules(
    original: string,
    optimized: string,
    rules: any
  ): string[] {
    const appliedRules: string[] = [];

    // 변경사항 분석하여 적용된 규칙 식별
    if (optimized.length > original.length * 1.2) {
      appliedRules.push('상세한 맥락 정보 추가');
    }

    if (optimized.includes('단계별') || optimized.includes('step by step')) {
      appliedRules.push('단계별 작업 분해');
    }

    if (optimized.includes('형식') || optimized.includes('format')) {
      appliedRules.push('출력 형식 명시');
    }

    if (optimized.includes('전문가') || optimized.includes('expert')) {
      appliedRules.push('역할 기반 프롬프트');
    }

    return appliedRules;
  }

  private calculateExpectedImprovement(
    analysis: any,
    rules: any,
    taskType: string
  ): {
    clarity: number;
    specificity: number;
    effectiveness: number;
  } {
    // 기본 개선 점수 계산
    const baseImprovement = {
      clarity: 0.1,
      specificity: 0.1,
      effectiveness: 0.1,
    };

    // 분석 결과에 따른 개선 점수 조정
    if (analysis.clarity < 0.7) {
      baseImprovement.clarity += 0.2;
    }

    if (analysis.specificity < 0.7) {
      baseImprovement.specificity += 0.2;
    }

    if (analysis.structure === 'unstructured') {
      baseImprovement.effectiveness += 0.15;
    }

    // 작업 유형에 따른 가중치 적용
    const taskWeights = {
      creative: { clarity: 1.0, specificity: 0.8, effectiveness: 1.2 },
      technical: { clarity: 1.2, specificity: 1.3, effectiveness: 1.0 },
      business: { clarity: 1.1, specificity: 1.1, effectiveness: 1.1 },
      educational: { clarity: 1.3, specificity: 1.0, effectiveness: 1.1 },
    };

    const weights = taskWeights[taskType] || taskWeights.business;

    return {
      clarity: Math.min(baseImprovement.clarity * weights.clarity, 1.0),
      specificity: Math.min(baseImprovement.specificity * weights.specificity, 1.0),
      effectiveness: Math.min(baseImprovement.effectiveness * weights.effectiveness, 1.0),
    };
  }

  private generateOptimizationReasoning(
    optimizations: ModelSpecificOptimization[],
    bestModel: string,
    taskType: string
  ): string {
    const bestOptimization = optimizations.find(opt => opt.modelId === bestModel);
    
    if (!bestOptimization) {
      return `${bestModel}이 ${taskType} 작업에 가장 적합한 모델로 선택되었습니다.`;
    }

    const improvements = bestOptimization.expectedImprovement;
    const totalImprovement = (improvements.clarity + improvements.specificity + improvements.effectiveness) / 3;

    return `${bestModel}을 선택한 이유:
- 예상 성능 향상: ${Math.round(totalImprovement * 100)}%
- 적용된 최적화 규칙: ${bestOptimization.optimizationRules.join(', ')}
- ${taskType} 작업에 특화된 프롬프트 구조 적용`;
  }

  private generateUnifiedOptimization(
    originalPrompt: string,
    optimizations: ModelSpecificOptimization[],
    taskType: string
  ): string {
    // 모든 최적화에서 공통적으로 적용된 개선사항 추출
    const commonRules = this.findCommonRules(optimizations);
    
    let unified = originalPrompt;

    // 공통 개선사항 적용
    if (commonRules.includes('역할 기반 프롬프트')) {
      unified = `당신은 ${this.getTaskRole(taskType)} 전문가입니다.\n\n${unified}`;
    }

    if (commonRules.includes('출력 형식 명시')) {
      unified += '\n\n출력 형식: 구조화된 형태로 명확하게 정리해주세요.';
    }

    if (commonRules.includes('단계별 작업 분해')) {
      unified = `다음 작업을 단계별로 수행해주세요:\n\n${unified}`;
    }

    return unified;
  }

  private findCommonRules(optimizations: ModelSpecificOptimization[]): string[] {
    const ruleCounts = new Map<string, number>();

    optimizations.forEach(opt => {
      opt.optimizationRules.forEach(rule => {
        ruleCounts.set(rule, (ruleCounts.get(rule) || 0) + 1);
      });
    });

    // 50% 이상의 모델에서 적용된 규칙만 공통 규칙으로 선택
    const threshold = Math.ceil(optimizations.length * 0.5);
    return Array.from(ruleCounts.entries())
      .filter(([rule, count]) => count >= threshold)
      .map(([rule]) => rule);
  }

  private calculateClarity(prompt: string): number {
    // 명확성 점수 계산 로직
    const hasQuestionMarks = (prompt.match(/\?/g) || []).length;
    const hasSpecificWords = (prompt.match(/구체적|specific|명확|clear|정확|exact/gi) || []).length;
    const hasVagueWords = (prompt.match(/아마|maybe|perhaps|대충|roughly/gi) || []).length;
    
    let score = 0.5; // 기본 점수
    
    if (hasSpecificWords > 0) score += 0.2;
    if (hasVagueWords > 0) score -= 0.2;
    if (hasQuestionMarks > 2) score -= 0.1; // 너무 많은 질문은 불명확함을 의미
    
    return Math.max(0, Math.min(1, score));
  }

  private calculateSpecificity(prompt: string): number {
    // 구체성 점수 계산 로직
    const hasNumbers = (prompt.match(/\d+/g) || []).length;
    const hasExamples = (prompt.match(/예시|example|예를 들어|for example/gi) || []).length;
    const hasConstraints = (prompt.match(/조건|constraint|제한|limit|요구사항|requirement/gi) || []).length;
    
    let score = 0.3; // 기본 점수
    
    if (hasNumbers > 0) score += 0.2;
    if (hasExamples > 0) score += 0.3;
    if (hasConstraints > 0) score += 0.2;
    
    return Math.max(0, Math.min(1, score));
  }

  private detectStructure(prompt: string): 'unstructured' | 'semi-structured' | 'structured' {
    const hasBulletPoints = (prompt.match(/[-*•]/g) || []).length;
    const hasNumbering = (prompt.match(/\d+\./g) || []).length;
    const hasHeaders = (prompt.match(/^#+\s/gm) || []).length;
    const hasLineBreaks = (prompt.match(/\n/g) || []).length;
    
    const structureScore = hasBulletPoints + hasNumbering + hasHeaders + (hasLineBreaks > 2 ? 1 : 0);
    
    if (structureScore >= 3) return 'structured';
    if (structureScore >= 1) return 'semi-structured';
    return 'unstructured';
  }

  private extractTaskFromPrompt(prompt: string): string {
    // 프롬프트에서 주요 작업 추출
    const firstSentence = prompt.split(/[.!?]/)[0];
    return firstSentence.trim();
  }

  private getTaskRole(taskType: string): string {
    const roles = {
      creative: '창작 및 기획',
      technical: '기술 및 개발',
      business: '비즈니스 전략',
      educational: '교육 및 학습',
    };
    return roles[taskType] || '전문';
  }
} 