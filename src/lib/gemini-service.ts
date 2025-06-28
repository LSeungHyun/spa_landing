import { GoogleGenerativeAI } from '@google/generative-ai';
// import { promptCache } from './prompt-cache'; // 임시 비활성화

export interface GeminiResponse {
    candidates: {
        content: {
            parts: {
                text: string;
            }[];
        };
    }[];
}

export class GeminiService {
    private static instance: GeminiService;
    private genAI: GoogleGenerativeAI | null = null;
    private hasValidApiKey: boolean = false;

    // 서버 사이드에서만 사용하도록 NEXT_PUBLIC_ 접두사 제거
    private static readonly API_KEY = process.env.GEMINI_API_KEY;

    constructor() {
        if (!GeminiService.API_KEY) {
            console.error('GEMINI_API_KEY environment variable is not set');
            console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
            this.hasValidApiKey = false;
            this.genAI = null;
            // API 키가 없으면 에러를 발생시킴
            throw new Error('Google Gemini API key not configured. Please set GEMINI_API_KEY in your .env.local file');
        } else {
            try {
                this.genAI = new GoogleGenerativeAI(GeminiService.API_KEY);
                this.hasValidApiKey = true;
                console.log('Gemini API initialized successfully');
            } catch (error) {
                console.error('Failed to initialize Gemini API:', error);
                this.hasValidApiKey = false;
                this.genAI = null;
                throw new Error('Failed to initialize Gemini API: ' + (error instanceof Error ? error.message : String(error)));
            }
        }
    }

    public static getInstance(): GeminiService {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService();
        }
        return GeminiService.instance;
    }

    public async generatePrompt(idea: string, persona: string = 'researcher'): Promise<string> {
        try {
            // API 키가 없거나 유효하지 않은 경우 에러 발생
            if (!this.hasValidApiKey || !this.genAI) {
                throw new Error('Gemini API is not properly configured. Please check your GEMINI_API_KEY environment variable.');
            }

            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `
                You are an expert academic writing assistant specialized in creating compelling research paper abstracts and introductions.
                
                Transform the following research idea into a professional academic ${persona === 'researcher' ? 'abstract' : 'introduction'}.
                
                Research idea: "${idea}"
                
                Guidelines:
                - Use formal academic language
                - Include clear research objectives
                - Mention methodology approach
                - Highlight expected contributions
                - Keep it concise but comprehensive
                - Follow standard academic writing conventions
                
                Generate a well-structured ${persona === 'researcher' ? 'abstract' : 'introduction'} (200-300 words):
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to generate content using Gemini API');
        }
    }

    public async improvePrompt(originalPrompt: string): Promise<string> {
        try {
            console.log('=== GeminiService.improvePrompt called ===');
            console.log('Original prompt length:', originalPrompt.length);
            console.log('Has valid API key:', this.hasValidApiKey);

            // API 키가 없거나 유효하지 않은 경우 에러 발생
            if (!this.hasValidApiKey || !this.genAI) {
                throw new Error('Gemini API is not properly configured. Please check your GEMINI_API_KEY environment variable.');
            }

            // 캐시 확인 먼저 (임시 비활성화)
            // const cachedResult = promptCache.getCachedPrompt(originalPrompt);
            // if (cachedResult) {
            //     console.log('Returning cached result, skipping API call');
            //     return cachedResult;
            // }

            console.log('No cache hit, proceeding with API call');
            console.log('Getting model: gemini-1.5-flash');

            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            console.log('Model instance created successfully');

            const prompt = `As a prompt engineer, improve this prompt for better AI responses:

"${originalPrompt}"

Make it more specific, structured, and actionable. Include:
- Clear objective
- Specific requirements  
- Desired format
- Context if needed

Return only the improved prompt:`;

            console.log('Calling model.generateContent...');

            // Rate limiting을 위한 지연
            await new Promise(resolve => setTimeout(resolve, 1000));

            const result = await model.generateContent(prompt);
            console.log('generateContent completed, getting response...');

            const response = await result.response;
            console.log('Response received, extracting text...');

            const text = response.text().trim();
            console.log('Text extracted successfully, length:', text.length);

            // 결과를 캐시에 저장 (임시 비활성화)
            // promptCache.setCachedPrompt(originalPrompt, text);
            console.log('Result cached for future use');
            console.log('=== GeminiService.improvePrompt completed ===');

            return text;
        } catch (error) {
            console.error('=== GeminiService Error Details ===');
            console.error('Error type:', typeof error);
            console.error('Error instanceof Error:', error instanceof Error);
            console.error('Error message:', error instanceof Error ? error.message : error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
            console.error('Full error object:', error);

            // API 키 무효 에러인 경우 더미 응답 제공 (개발/테스트용)
            if (error instanceof Error && error.message.includes('API key not valid')) {
                console.log('=== Providing fallback response due to invalid API key ===');
                return this.generateFallbackResponse(originalPrompt);
            }

            throw new Error('Failed to improve prompt using Gemini API: ' + (error instanceof Error ? error.message : String(error)));
        }
    }

    private generateFallbackResponse(originalPrompt: string): string {
        // 다양한 개선 패턴을 가진 더미 응답 생성
        const improvements = [
            {
                title: "📝 문서 작성 전문가 프롬프트",
                template: `# 전문적인 ${originalPrompt} 작성 가이드

## 🎯 목표
- 명확하고 체계적인 문서 작성
- 독자의 이해도 극대화
- 실무에 바로 적용 가능한 결과물

## 📋 세부 요구사항
1. **구조화된 접근**: 도입-본론-결론 형태로 구성
2. **구체적인 예시**: 실제 사례와 템플릿 포함
3. **단계별 가이드**: 실행 가능한 액션 아이템 제시
4. **품질 검증**: 체크리스트와 검토 포인트 포함

## 💡 최적화된 프롬프트
"${originalPrompt}에 대한 전문가급 가이드를 작성해주세요. 구체적인 단계별 방법론, 실제 적용 사례, 주의사항, 그리고 성공을 위한 체크리스트를 포함하여 실무진이 바로 활용할 수 있도록 상세히 설명해주세요."`
            },
            {
                title: "🎯 전략 기획 전문가 프롬프트", 
                template: `# ${originalPrompt} 전략적 접근 방안

## 🎯 전략적 목표
- 체계적이고 논리적인 분석
- 실행 가능한 구체적 방안 도출
- 리스크 요소 사전 식별 및 대응책 마련

## 📊 분석 프레임워크
1. **현황 분석**: 내부/외부 환경 진단
2. **목표 설정**: SMART 기준 적용
3. **전략 수립**: 다양한 옵션 검토
4. **실행 계획**: 단계별 로드맵 구성
5. **성과 측정**: KPI 및 평가 지표 설정

## 💡 개선된 프롬프트
"${originalPrompt}에 대한 종합적인 전략을 수립해주세요. 현재 상황 분석부터 시작하여, 명확한 목표 설정, 다각도 접근 방안, 단계별 실행 계획, 예상되는 장애물과 해결책, 그리고 성과 측정 방법까지 포함한 완전한 전략 문서를 작성해주세요."`
            },
            {
                title: "💼 비즈니스 솔루션 프롬프트",
                template: `# ${originalPrompt} 비즈니스 솔루션

## 🎯 비즈니스 목표
- 실용적이고 효율적인 솔루션 제공
- 비용 대비 효과 극대화
- 지속 가능한 성장 모델 구축

## 🔍 분석 관점
1. **시장 관점**: 트렌드, 경쟁사, 기회 요소
2. **고객 관점**: 니즈, 페인 포인트, 기대값
3. **운영 관점**: 프로세스, 리소스, 효율성
4. **재무 관점**: 투자, 수익, ROI 분석

## 💡 최적화된 프롬프트
"${originalPrompt}에 대한 비즈니스 솔루션을 제안해주세요. 시장 분석, 고객 니즈 파악, 구체적인 실행 방안, 예상 투자비용과 수익 모델, 성공 지표, 그리고 단계별 실행 타임라인을 포함한 종합적인 비즈니스 플랜을 작성해주세요."`
            }
        ];

        // 원본 프롬프트 길이나 키워드에 따라 적절한 템플릿 선택
        let selectedTemplate;
        const prompt = originalPrompt.toLowerCase();
        
        if (prompt.includes('문서') || prompt.includes('작성') || prompt.includes('글') || prompt.includes('보고서')) {
            selectedTemplate = improvements[0];
        } else if (prompt.includes('전략') || prompt.includes('계획') || prompt.includes('기획') || prompt.includes('방안')) {
            selectedTemplate = improvements[1];
        } else if (prompt.includes('비즈니스') || prompt.includes('사업') || prompt.includes('마케팅') || prompt.includes('수익')) {
            selectedTemplate = improvements[2];
        } else {
            // 기본적으로 첫 번째 템플릿 사용
            selectedTemplate = improvements[0];
        }

        return selectedTemplate.template;
    }
} 