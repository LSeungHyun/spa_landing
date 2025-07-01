/**
 * 프롬프트 개선 서비스
 * API 호출 없이 로컬에서 고품질 프롬프트 개선을 제공
 */

export interface PromptAnalysis {
  type: 'creative' | 'technical' | 'business' | 'educational' | 'personal' | 'general';
  length: 'short' | 'medium' | 'long';
  clarity: 'poor' | 'fair' | 'good' | 'excellent';
  specificity: 'vague' | 'moderate' | 'specific' | 'very_specific';
  context: 'missing' | 'partial' | 'complete';
  overallScore: number;
  improvements: string[];
}

export interface ImprovementSuggestion {
  improvedPrompt: string;
  improvements: string[];
  tips: string[];
  score: number; // 1-10
}

export interface PromptImprovementResult {
  originalPrompt: string;
  improvedPrompt: string;
  analysis: PromptAnalysis;
  improvements: string[];
  metadata: {
    processingTime: number;
    version: string;
    algorithm: string;
    modelOptimization: string;
  };
}

export class PromptImprovementService {
  private static instance: PromptImprovementService;

  public static getInstance(): PromptImprovementService {
    if (!PromptImprovementService.instance) {
      PromptImprovementService.instance = new PromptImprovementService();
    }
    return PromptImprovementService.instance;
  }

  /**
   * 프롬프트를 분석하여 유형과 품질을 평가
   */
  public analyzePrompt(prompt: string): PromptAnalysis {
    const text = prompt.toLowerCase().trim();

    // 유형 분석
    const type = this.detectPromptType(text);

    // 길이 분석
    const length = text.length < 50 ? 'short' : text.length < 150 ? 'medium' : 'long';

    // 명확성 분석
    const clarity = this.analyzeClarity(text);

    // 특정성 분석
    const specificity = this.analyzeSpecificity(text);

    // 컨텍스트 분석
    const context = this.analyzeContext(text);

    return {
      type,
      length,
      clarity,
      specificity,
      context,
      overallScore: 0,
      improvements: []
    };
  }

  private detectPromptType(text: string): 'creative' | 'technical' | 'business' | 'educational' | 'personal' | 'general' {
    const creativeKeywords = ['창작', '소설', '시', '스토리', '디자인', '아이디어', '브레인스토밍', '창의적'];
    const technicalKeywords = ['코드', '프로그래밍', '알고리즘', 'api', '데이터베이스', '시스템', '개발', '기술'];
    const businessKeywords = ['마케팅', '사업', '전략', '기획', '제안서', '보고서', '회사', '비즈니스'];
    const educationalKeywords = ['설명', '학습', '교육', '강의', '튜토리얼', '가르쳐', '배우고'];
    const personalKeywords = ['개인적', '일기', '편지', '메시지', '추천', '조언'];

    if (creativeKeywords.some(keyword => text.includes(keyword))) return 'creative';
    if (technicalKeywords.some(keyword => text.includes(keyword))) return 'technical';
    if (businessKeywords.some(keyword => text.includes(keyword))) return 'business';
    if (educationalKeywords.some(keyword => text.includes(keyword))) return 'educational';
    if (personalKeywords.some(keyword => text.includes(keyword))) return 'personal';

    return 'general';
  }

  private analyzeClarity(text: string): 'poor' | 'fair' | 'good' | 'excellent' {
    let score = 0;

    // 명확한 동사 사용 (+1)
    const actionVerbs = ['작성', '만들어', '생성', '설명', '분석', '요약', '번역'];
    if (actionVerbs.some(verb => text.includes(verb))) score++;

    // 구체적인 명사 사용 (+1)
    const specificNouns = ['이메일', '보고서', '계획', '리스트', '가이드', '템플릿'];
    if (specificNouns.some(noun => text.includes(noun))) score++;

    // 문장 구조 (+1)
    if (text.includes('?') || text.includes('해주세요') || text.includes('해줘')) score++;

    // 길이 적절성 (+1)
    if (text.length > 10 && text.length < 200) score++;

    if (score >= 4) return 'excellent';
    if (score >= 3) return 'good';
    if (score >= 2) return 'fair';
    return 'poor';
  }

  private analyzeSpecificity(text: string): 'vague' | 'moderate' | 'specific' | 'very_specific' {
    let score = 0;

    // 수치나 구체적인 정보 (+2)
    if (/\d+/.test(text)) score += 2;

    // 구체적인 형용사 (+1)
    const specificAdjectives = ['전문적인', '창의적인', '상세한', '구체적인', '매력적인'];
    if (specificAdjectives.some(adj => text.includes(adj))) score++;

    // 대상 명시 (+1)
    const targetAudience = ['고객', '학생', '팀원', '사용자', '독자'];
    if (targetAudience.some(target => text.includes(target))) score++;

    // 목적 명시 (+1)
    const purposes = ['위해', '목적', '목표', '달성'];
    if (purposes.some(purpose => text.includes(purpose))) score++;

    if (score >= 4) return 'very_specific';
    if (score >= 3) return 'specific';
    if (score >= 2) return 'moderate';
    return 'vague';
  }

  private analyzeContext(text: string): 'missing' | 'partial' | 'complete' {
    let score = 0;

    // 배경 정보 (+1)
    const contextKeywords = ['상황', '배경', '현재', '문제', '이유'];
    if (contextKeywords.some(keyword => text.includes(keyword))) score++;

    // 제약 조건 (+1)
    const constraints = ['제한', '조건', '요구사항', '기준', '규칙'];
    if (constraints.some(constraint => text.includes(constraint))) score++;

    // 예시나 참고 자료 (+1)
    const examples = ['예시', '예를 들어', '참고', '사례', '샘플'];
    if (examples.some(example => text.includes(example))) score++;

    if (score >= 3) return 'complete';
    if (score >= 2) return 'partial';
    return 'missing';
  }

  public suggestImprovements(prompt: string): ImprovementSuggestion {
    const analysis = this.analyzePrompt(prompt);
    const improvements: string[] = [];
    const tips: string[] = [];
    let improvedPrompt = prompt;

    // 유형별 개선사항 적용
    const typeImprovements = this.getTypeSpecificImprovements(analysis.type, prompt);
    improvedPrompt = typeImprovements.improved;
    improvements.push(...typeImprovements.improvements);

    // 명확성 개선
    if (analysis.clarity === 'poor' || analysis.clarity === 'fair') {
      const clarityImprovements = this.improveClarity(improvedPrompt);
      improvedPrompt = clarityImprovements.improved;
      improvements.push(...clarityImprovements.improvements);
    }

    // 특정성 개선
    if (analysis.specificity === 'vague' || analysis.specificity === 'moderate') {
      const specificityImprovements = this.improveSpecificity(improvedPrompt, analysis.type);
      improvedPrompt = specificityImprovements.improved;
      improvements.push(...specificityImprovements.improvements);
    }

    // 컨텍스트 개선
    if (analysis.context === 'missing' || analysis.context === 'partial') {
      const contextImprovements = this.improveContext(improvedPrompt, analysis.type);
      improvedPrompt = contextImprovements.improved;
      improvements.push(...contextImprovements.improvements);
    }

    // 팁 생성
    tips.push(...this.generateTips(analysis));

    // 점수 계산 (1-10)
    const score = this.calculateScore(analysis);

    return {
      improvedPrompt,
      improvements,
      tips,
      score
    };
  }

  private getTypeSpecificImprovements(type: string, prompt: string) {
    const improvements: string[] = [];
    let improved = prompt;

    switch (type) {
      case 'creative':
        if (!prompt.includes('창의적')) {
          improved = `창의적이고 독창적인 ${improved}`;
          improvements.push('창의성 강조 추가');
        }
        break;
      case 'technical':
        if (!prompt.includes('구체적') && !prompt.includes('상세')) {
          improved = `구체적이고 기술적으로 상세한 ${improved}`;
          improvements.push('기술적 정확성 강조');
        }
        break;
      case 'business':
        if (!prompt.includes('전문적')) {
          improved = `전문적이고 비즈니스 관점에서 ${improved}`;
          improvements.push('비즈니스 관점 추가');
        }
        break;
    }

    return { improved, improvements };
  }

  private improveClarity(prompt: string) {
    const improvements: string[] = [];
    let improved = prompt;

    // 동사 강화
    if (!improved.includes('해주세요') && !improved.includes('해줘')) {
      improved += '해주세요';
      improvements.push('명확한 요청 표현 추가');
    }

    return { improved, improvements };
  }

  private improveSpecificity(prompt: string, type: string) {
    const improvements: string[] = [];
    let improved = prompt;

    // 구체적인 요구사항 추가
    improved += '\n\n구체적인 요구사항:\n- 목적: [명확한 목표 설정]\n- 대상: [타겟 오디언스 명시]\n- 형식: [원하는 결과물 형태]';
    improvements.push('구체적인 요구사항 템플릿 추가');

    return { improved, improvements };
  }

  private improveContext(prompt: string, type: string) {
    const improvements: string[] = [];
    let improved = prompt;

    // 컨텍스트 정보 추가
    improved += '\n\n배경 정보:\n- 상황: [현재 상황 설명]\n- 제약사항: [고려해야 할 제한사항]\n- 참고사항: [추가 고려사항]';
    improvements.push('배경 컨텍스트 템플릿 추가');

    return { improved, improvements };
  }

  private generateTips(analysis: PromptAnalysis): string[] {
    const tips: string[] = [];

    if (analysis.length === 'short') {
      tips.push('💡 더 구체적인 세부사항을 추가하면 더 나은 결과를 얻을 수 있습니다.');
    }

    if (analysis.specificity === 'vague') {
      tips.push('🎯 구체적인 예시나 수치를 포함하면 더 정확한 답변을 받을 수 있습니다.');
    }

    if (analysis.context === 'missing') {
      tips.push('📝 배경 정보나 목적을 명시하면 더 적절한 답변을 받을 수 있습니다.');
    }

    return tips;
  }

  private calculateScore(analysis: PromptAnalysis): number {
    let score = 5; // 기본 점수

    // 명확성 점수
    switch (analysis.clarity) {
      case 'excellent': score += 2; break;
      case 'good': score += 1; break;
      case 'fair': break;
      case 'poor': score -= 1; break;
    }

    // 특정성 점수
    switch (analysis.specificity) {
      case 'very_specific': score += 2; break;
      case 'specific': score += 1; break;
      case 'moderate': break;
      case 'vague': score -= 1; break;
    }

    // 컨텍스트 점수
    switch (analysis.context) {
      case 'complete': score += 1; break;
      case 'partial': break;
      case 'missing': score -= 1; break;
    }

    return Math.max(1, Math.min(10, score));
  }



  // 품질 문자열을 숫자 점수로 변환하는 유틸리티 메서드
  private getScoreFromQuality(quality: string): number {
    const qualityScores: { [key: string]: number } = {
      // Clarity scores
      'poor': 2,
      'fair': 5,
      'good': 7,
      'excellent': 9,

      // Specificity scores
      'vague': 2,
      'moderate': 5,
      'specific': 7,
      'very_specific': 9,

      // Context scores
      'missing': 2,
      'partial': 5,
      'complete': 9
    };

    return qualityScores[quality] || 5; // 기본값 5
  }

  // 향상된 프롬프트 분석 알고리즘 (Gemini 2.5 Flash 최적화)
  private enhancedAnalyzePrompt(prompt: string): PromptAnalysis {
    const text = prompt.toLowerCase().trim();
    const analysis: PromptAnalysis = {
      type: this.detectPromptType(text),
      length: text.length < 50 ? 'short' : text.length < 150 ? 'medium' : 'long',
      clarity: this.analyzeClarity(text),
      specificity: this.analyzeSpecificity(text),
      context: this.analyzeContext(text),
      overallScore: 0,
      improvements: []
    };

    // Gemini 2.5 Flash의 향상된 추론 능력을 고려한 점수 계산
    const clarityScore = this.getScoreFromQuality(analysis.clarity);
    const specificityScore = this.getScoreFromQuality(analysis.specificity);
    const contextScore = this.getScoreFromQuality(analysis.context);

    const weights = { clarity: 0.35, specificity: 0.35, context: 0.30 };
    analysis.overallScore = Math.round(
      clarityScore * weights.clarity +
      specificityScore * weights.specificity +
      contextScore * weights.context
    );

    // 고급 개선 제안 생성
    analysis.improvements = this.generateEnhancedImprovements(analysis);

    return analysis;
  }

  private generateEnhancedImprovements(analysis: PromptAnalysis): string[] {
    const improvements: string[] = [];

    // Gemini 2.5 Flash의 향상된 기능을 활용한 개선 제안
    const clarityScore = this.getScoreFromQuality(analysis.clarity);
    if (clarityScore < 7) {
      improvements.push("🎯 명확성 향상: 구체적인 목표와 기대 결과를 명시하여 AI가 더 정확한 추론을 할 수 있도록 개선");
    }

    const specificityScore = this.getScoreFromQuality(analysis.specificity);
    if (specificityScore < 7) {
      improvements.push("📋 구체성 강화: 단계별 지침과 세부 요구사항을 추가하여 Gemini 2.5 Flash의 고급 추론 능력 활용");
    }

    const contextScore = this.getScoreFromQuality(analysis.context);
    if (contextScore < 7) {
      improvements.push("�� 맥락 정보 보강: 배경 정보와 제약 조건을 명확히 하여 모델의 향상된 컨텍스트 이해 능력 극대화");
    }

    // 프롬프트 유형별 특화 개선 제안
    switch (analysis.type) {
      case 'creative':
        improvements.push("🎨 창작 최적화: Gemini 2.5 Flash의 향상된 창의성을 위한 스타일 가이드와 톤 설정 추가");
        break;
      case 'technical':
        improvements.push("⚙️ 기술적 정밀도: 고급 추론 능력을 활용한 기술 문서화 및 코드 생성 최적화");
        break;
      case 'business':
        improvements.push("💼 비즈니스 전략: 향상된 분석 능력을 위한 KPI 및 성과 지표 명시");
        break;
      case 'educational':
        improvements.push("📚 교육 효과: 학습 목표와 평가 기준을 명확히 하여 교육적 가치 극대화");
        break;
    }

    return improvements;
  }

  public improvePrompt(originalPrompt: string): PromptImprovementResult {
    try {
      console.log('=== Enhanced Prompt Improvement Service (Gemini 2.5 Flash Optimized) ===');

      const analysis = this.enhancedAnalyzePrompt(originalPrompt);
      const improvedPrompt = this.generateEnhancedImprovedPrompt(originalPrompt, analysis);

      const result: PromptImprovementResult = {
        originalPrompt,
        improvedPrompt,
        analysis,
        improvements: analysis.improvements,
        metadata: {
          processingTime: Date.now(),
          version: '2.1.0', // Gemini 2.5 Flash 최적화 버전
          algorithm: 'enhanced-reasoning-v2',
          modelOptimization: 'gemini-2.5-flash'
        }
      };

      console.log(`Prompt improved successfully. Score: ${analysis.overallScore}/10`);
      console.log(`Improvements generated: ${analysis.improvements.length}`);

      return result;

    } catch (error) {
      console.error('Enhanced prompt improvement failed:', error);
      return this.generateFallbackImprovement(originalPrompt);
    }
  }

  private generateEnhancedImprovedPrompt(originalPrompt: string, analysis: PromptAnalysis): string {
    const improvements: string[] = [];

    // Gemini 2.5 Flash의 고급 기능을 활용한 프롬프트 구조화
    improvements.push("# 🎯 목표 및 맥락");
    improvements.push(`다음 작업을 Gemini 2.5 Flash의 향상된 추론 능력을 활용하여 수행해주세요:`);
    improvements.push("");

    // 원본 프롬프트 분석 기반 개선
    if (analysis.type === 'technical') {
      improvements.push("## 📋 기술적 요구사항");
      improvements.push("- 정확한 기술 문서화");
      improvements.push("- 코드 품질 및 베스트 프랙티스 준수");
      improvements.push("- 단계별 구현 가이드 제공");
    } else if (analysis.type === 'creative') {
      improvements.push("## 🎨 창작 가이드라인");
      improvements.push("- 독창적이고 매력적인 콘텐츠");
      improvements.push("- 타겟 오디언스 고려");
      improvements.push("- 브랜드 톤앤매너 반영");
    }

    improvements.push("");
    improvements.push("## 📝 상세 요청사항");
    improvements.push(`${originalPrompt}`);
    improvements.push("");

    // 출력 형식 및 품질 기준
    improvements.push("## 📤 출력 형식 및 품질 기준");
    improvements.push("- 구조화된 형태로 정리");
    improvements.push("- 실행 가능한 구체적 내용");
    improvements.push("- 검증 가능한 결과물");

    if (analysis.overallScore < 8) {
      improvements.push("");
      improvements.push("## 🔍 추가 고려사항");
      improvements.push("- 명확한 성공 기준 제시");
      improvements.push("- 예상 문제점 및 해결 방안");
      improvements.push("- 단계별 검증 포인트");
    }

    return improvements.join("\n");
  }

  private generateFallbackImprovement(originalPrompt: string): PromptImprovementResult {
    console.log('Using enhanced fallback improvement');

    const fallbackAnalysis: PromptAnalysis = {
      type: 'general',
      length: originalPrompt.length < 50 ? 'short' : originalPrompt.length < 150 ? 'medium' : 'long',
      clarity: 'fair',
      specificity: 'moderate',
      context: 'partial',
      overallScore: 6,
      improvements: [
        "🎯 목표를 더 구체적으로 명시하여 Gemini 2.5 Flash의 향상된 추론 활용",
        "📋 단계별 지침 추가로 고급 AI 기능 극대화",
        "🔍 맥락 정보 보강으로 정확도 향상"
      ]
    };

    const improvedPrompt = `# 🎯 향상된 프롬프트 (Gemini 2.5 Flash 최적화)

## 📝 요청사항
${originalPrompt}

## 📋 추가 지침
- 구체적이고 실행 가능한 결과 제공
- 단계별 설명과 근거 포함
- 품질 높은 구조화된 출력

## 📤 기대 결과
고품질의 상세하고 유용한 응답을 Gemini 2.5 Flash의 향상된 능력으로 생성해주세요.`;

    return {
      originalPrompt,
      improvedPrompt,
      analysis: fallbackAnalysis,
      improvements: fallbackAnalysis.improvements,
      metadata: {
        processingTime: Date.now(),
        version: '2.1.0-fallback',
        algorithm: 'enhanced-fallback-v2',
        modelOptimization: 'gemini-2.5-flash'
      }
    };
  }
} 