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
}

export interface ImprovementSuggestion {
  improvedPrompt: string;
  improvements: string[];
  tips: string[];
  score: number; // 1-10
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
} 