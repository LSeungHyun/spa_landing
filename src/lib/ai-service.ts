// 간단한 텍스트 개선 규칙 기반 AI 시뮬레이션
export class SmartPromptAI {
    private isInitialized = false;

    constructor() {
        // 브라우저 환경에서만 초기화
        if (typeof window !== 'undefined') {
            this.initialize().catch(console.error);
        }
    }

    private async initialize() {
        if (this.isInitialized || typeof window === 'undefined') return;

        try {
            // 간단한 초기화 (TensorFlow 제거)
            this.isInitialized = true;
        } catch (error) {
            console.warn('AI 서비스 초기화 실패:', error);
            // 모델 없이도 기본 기능은 동작하도록 함
            this.isInitialized = true;
        }
    }

    async improveText(text: string, persona: 'pm-developer' | 'content-creator'): Promise<string> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        // 기본 텍스트 개선 로직
        const improved = this.applyImprovementRules(text, persona);

        return improved;
    }

    private applyImprovementRules(text: string, persona: 'pm-developer' | 'content-creator'): string {
        if (persona === 'pm-developer') {
            return this.improveTechnicalContent(text);
        } else {
            return this.improveCreativeContent(text);
        }
    }

    private improveTechnicalContent(text: string): string {
        let improved = text;

        // 기술 문서 개선 규칙들
        const technicalImprovements = [
            // 제목 자동 생성
            {
                pattern: /^([가-힣\w\s\-_.]{10,})/m,
                replacement: (match: string) => {
                    // null 체크 추가
                    if (!match) return '';
                    if (match.length > 50 && !match.includes(':')) {
                        return `## ${match}\n\n### 개요\n${match}에 대한 상세 설명입니다.`;
                    }
                    return match;
                }
            },

            // API 문서 개선
            {
                pattern: /(GET|POST|PUT|DELETE)\s+([\/\w]+)/g,
                replacement: '## $1 $2\n\n### 엔드포인트\n`$1 $2`'
            },

            // 파라미터 구조화
            {
                pattern: /파라미터[:：]\s*([^\n]+)/gi,
                replacement: '### 요청 파라미터\n| 파라미터 | 타입 | 설명 |\n|---------|------|------|\n| $1 | string | 상세 설명 필요 |'
            },

            // 기능 목록 개선
            {
                pattern: /^([가-힣\w\s]+)\s*기능/gm,
                replacement: '#### $1 기능\n**목적**: $1을 통한 사용자 경험 향상'
            },

            // 에러 처리 추가
            {
                pattern: /(에러|오류|버그)/gi,
                replacement: '🚨 $1'
            }
        ];

        // 규칙 적용
        technicalImprovements.forEach(rule => {
            if (typeof rule.replacement === 'function') {
                improved = improved.replace(rule.pattern, rule.replacement);
            } else {
                improved = improved.replace(rule.pattern, rule.replacement);
            }
        });

        // 전체적인 구조 개선
        if (!improved.includes('#') && improved.length > 100) {
            const lines = improved.split('\n').filter(line => line.trim());
            const title = lines[0];
            const content = lines.slice(1).join('\n');

            improved = `# ${title}\n\n## 개요\n${content}\n\n## 상세 설명\n추가적인 기술적 세부사항이 필요합니다.\n\n## 구현 고려사항\n- 성능 최적화\n- 에러 처리\n- 테스트 커버리지\n- 문서화`;
        }

        return improved;
    }

    private improveCreativeContent(text: string): string {
        let improved = text;

        // 크리에이티브 콘텐츠 개선 규칙들
        const creativeImprovements = [
            // 감정적 표현 강화
            {
                pattern: /좋았다|맛있었다|재미있었다/g,
                replacement: '정말 환상적이었다'
            },

            // 구체적 묘사 추가
            {
                pattern: /카페/g,
                replacement: '아늑한 분위기의 로컬 카페'
            },

            // 해시태그 추가
            {
                pattern: /(\.|!|\?)(\s*)$/,
                replacement: '$1\n\n#일상 #카페 #좋은하루 #맛집 #추천'
            },

            // 제목 개선
            {
                pattern: /^([가-힣\w\s]{5,30})$/m,
                replacement: '✨ $1 - 특별한 순간의 기록'
            },

            // 스토리텔링 요소 추가
            {
                pattern: /오늘/g,
                replacement: '바쁜 하루 중 잠시 여유를 찾은 오늘'
            }
        ];

        // 규칙 적용
        creativeImprovements.forEach(rule => {
            improved = improved.replace(rule.pattern, rule.replacement);
        });

        // SNS 최적화
        if (improved.length < 100) {
            improved = this.optimizeForSNS(improved);
        } else {
            improved = this.optimizeForBlog(improved);
        }

        return improved;
    }

    private optimizeForSNS(text: string): string {
        const emojis = ['✨', '💫', '🌟', '🎉', '🔥', '💖', '🌈', '⭐'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        return `${randomEmoji} ${text}\n\n📍 팔로우하고 더 많은 일상을 만나보세요!\n\n#데일리 #라이프스타일 #일상스타그램 #좋아요반사`;
    }

    private optimizeForBlog(text: string): string {
        const lines = text.split('\n').filter(line => line.trim());
        const title = lines[0];
        const content = lines.slice(1).join('\n');

        return `# ${title}\n\n${content}\n\n## 마무리하며\n\n이런 작은 일상의 순간들이 모여 우리의 하루를 특별하게 만드는 것 같습니다. 여러분도 오늘 어떤 특별한 순간을 경험하셨나요?\n\n**함께 읽으면 좋은 글:**\n- 일상 속 작은 행복 찾기\n- 카페에서의 힐링 타임\n- 나만의 여유 시간 만들기\n\n---\n\n*이 글이 도움이 되셨다면 공유해주세요! 💌*`;
    }

    // 텍스트 분석 메트릭
    analyzeImprovement(original: string, improved: string) {
        const originalWords = original.trim().split(/\s+/).length;
        const improvedWords = improved.trim().split(/\s+/).length;
        const wordIncrease = ((improvedWords - originalWords) / originalWords * 100).toFixed(1);

        const originalChars = original.length;
        const improvedChars = improved.length;
        const charIncrease = ((improvedChars - originalChars) / originalChars * 100).toFixed(1);

        // 구조적 개선 점수 (마크다운, 헤딩, 리스트 등)
        const structureScore = this.calculateStructureScore(improved);

        // 전문성 점수 (기술 용어, 체계적 구성 등)
        const professionalismScore = this.calculateProfessionalismScore(improved);

        return {
            wordCount: {
                original: originalWords,
                improved: improvedWords,
                increase: `+${wordIncrease}%`
            },
            characterCount: {
                original: originalChars,
                improved: improvedChars,
                increase: `+${charIncrease}%`
            },
            qualityScores: {
                structure: structureScore,
                professionalism: professionalismScore,
                overall: Math.round((structureScore + professionalismScore) / 2)
            },
            improvementLevel: this.getImprovementLevel(
                parseFloat(wordIncrease), 
                structureScore, 
                professionalismScore
            )
        };
    }

    private calculateStructureScore(text: string): number {
        let score = 0;
        
        // 헤딩 구조 점수
        if (text.includes('#')) score += 20;
        if (text.includes('##')) score += 15;
        if (text.includes('###')) score += 10;
        
        // 리스트 구조 점수
        if (text.includes('- ') || text.includes('* ')) score += 15;
        if (text.includes('1. ') || text.includes('2. ')) score += 15;
        
        // 표 구조 점수
        if (text.includes('|')) score += 20;
        
        // 코드 블록 점수
        if (text.includes('```') || text.includes('`')) score += 10;
        
        return Math.min(score, 100);
    }

    private calculateProfessionalismScore(text: string): number {
        let score = 0;
        
        // 기술 용어 점수
        const techTerms = ['API', 'HTTP', 'JSON', 'REST', '개발', '구현', '최적화', '성능'];
        const foundTerms = techTerms.filter(term => text.includes(term));
        score += foundTerms.length * 10;
        
        // 체계적 구성 점수
        if (text.includes('개요') || text.includes('목적')) score += 15;
        if (text.includes('상세') || text.includes('설명')) score += 10;
        if (text.includes('고려사항') || text.includes('주의점')) score += 15;
        
        // 문서 길이 점수
        if (text.length > 500) score += 10;
        if (text.length > 1000) score += 10;
        
        return Math.min(score, 100);
    }

    private getImprovementLevel(wordIncrease: number, structureScore: number, professionalismScore: number): string {
        const totalScore = (wordIncrease / 10) + structureScore + professionalismScore;
        
        if (totalScore >= 150) return '탁월한 개선';
        if (totalScore >= 100) return '상당한 개선';
        if (totalScore >= 50) return '적절한 개선';
        return '기본적 개선';
    }
}

// 싱글톤 인스턴스
export const smartPromptAI = new SmartPromptAI(); 