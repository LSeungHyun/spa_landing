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

    // 모델 버전 상수 - 용도별 최적 모델 설정
    private static readonly MODELS = {
        CHAT: 'gemini-2.0-flash',          // 채팅: 무료 모델
        IMPROVE: 'gemini-2.5-flash',       // 실제 개선: 고성능 무료 모델
        IMPROVE_TEST: 'gemini-2.0-flash',  // 테스트 개선: 무료 모델
        GENERATE: 'gemini-2.0-flash'       // 생성: 무료 모델
    } as const;

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
                console.log('Gemini API initialized successfully with 2.0 Flash model (FREE)');
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

            const model = this.genAI.getGenerativeModel({ 
                model: GeminiService.MODELS.GENERATE,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.9,
                    maxOutputTokens: 2048,
                }
            });

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

    public async improvePrompt(originalPrompt: string, isTest: boolean = false): Promise<string> {
        try {
            // 모델 선택 (테스트용 vs 실제용)
            const selectedModel = isTest ? GeminiService.MODELS.IMPROVE_TEST : GeminiService.MODELS.IMPROVE;
            const modelName = isTest ? 'Gemini 2.0 Flash (FREE)' : 'Gemini 2.5 Flash (FREE)';
            
            console.log(`=== GeminiService.improvePrompt called (${modelName}) ===`);
            console.log('Original prompt length:', originalPrompt.length);
            console.log('Is test mode:', isTest);
            console.log('Selected model:', selectedModel);
            console.log('Has valid API key:', this.hasValidApiKey);

            // API 키가 없거나 유효하지 않은 경우 에러 발생
            if (!this.hasValidApiKey || !this.genAI) {
                throw new Error('Gemini API is not properly configured. Please check your GEMINI_API_KEY environment variable.');
            }

            console.log(`Using ${modelName} for prompt improvement`);

            const model = this.genAI.getGenerativeModel({ 
                model: selectedModel,
                generationConfig: {
                    temperature: isTest ? 0.7 : 0.8,  // 테스트용은 약간 낮은 temperature
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: isTest ? 2048 : 3072,  // 테스트용은 더 짧은 출력, 실제용은 2.5 Flash에 맞게 조정
                }
            });
            console.log('Model instance created successfully');

            const fullPrompt = isTest 
                ? `As a helpful prompt engineer, analyze and improve this prompt for better AI responses:

Original Prompt: "${originalPrompt}"

Your task:
1. Analyze the prompt's current strengths and weaknesses
2. Identify missing elements that would improve clarity
3. Restructure for better AI comprehension

Create an improved prompt that includes:
- Clear, specific objective
- Basic requirements and constraints
- Desired output format
- Relevant context when needed

Focus on making the prompt:
- More specific and actionable
- Better structured for AI processing
- Likely to produce better results

Return only the improved prompt without additional commentary:`
                : `As an expert prompt engineer using advanced reasoning capabilities, analyze and improve this prompt for optimal AI responses:

Original Prompt: "${originalPrompt}"

Your task:
1. Analyze the prompt's current strengths and weaknesses with deep insight
2. Identify missing elements that would improve clarity and effectiveness
3. Restructure for maximum AI comprehension and output quality
4. Apply advanced prompt engineering techniques

Create an improved prompt that includes:
- Clear, specific objective with precise language
- Detailed requirements and constraints
- Desired output format and structure
- Relevant context and examples if beneficial
- Step-by-step instructions when appropriate
- Role definitions and expertise specifications
- Quality criteria and success metrics

Focus on making the prompt:
- More specific and actionable
- Better structured for AI processing
- Likely to produce higher quality, more relevant results
- Optimized for the specific AI model capabilities

Return only the improved prompt without additional commentary:`;

            console.log(`Calling model.generateContent with ${isTest ? 'standard' : 'enhanced'} configuration...`);

            // Rate limiting을 위한 지연 (모델별 차등 적용)
            const delay = isTest ? 500 : 600;  // 테스트용은 짧은 지연, 실제용은 약간 긴 지연
            await new Promise(resolve => setTimeout(resolve, delay));

            const result = await model.generateContent(fullPrompt);
            console.log('generateContent completed, getting response...');

            const response = await result.response;
            console.log('Response received, extracting text...');

            const text = response.text().trim();
            console.log('Text extracted successfully, length:', text.length);
            console.log(`=== GeminiService.improvePrompt completed (${modelName}) ===`);

            return text;
        } catch (error) {
            console.error(`=== GeminiService Error Details (${isTest ? 'Test Mode' : 'Premium Mode'}) ===`);
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

            const errorModel = isTest ? 'Gemini 2.0 Flash API (FREE)' : 'Gemini 2.5 Flash API (FREE)';
            throw new Error(`Failed to improve prompt using ${errorModel}: ` + (error instanceof Error ? error.message : String(error)));
        }
    }

    public async generateChatResponse(userMessage: string): Promise<string> {
        try {
            console.log('=== GeminiService.generateChatResponse called (Gemini 2.0 Flash - FREE) ===');
            console.log('User message length:', userMessage.length);
            console.log('Has valid API key:', this.hasValidApiKey);

            // API 키가 없거나 유효하지 않은 경우 에러 발생
            if (!this.hasValidApiKey || !this.genAI) {
                throw new Error('Gemini API is not properly configured. Please check your GEMINI_API_KEY environment variable.');
            }

            const model = this.genAI.getGenerativeModel({ 
                model: GeminiService.MODELS.CHAT,
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            });
            console.log('Gemini 2.0 Flash model (FREE) instance created successfully');

            const prompt = `You are SPA (Smart Prompt Assistant), an advanced AI assistant powered by Gemini 2.0 Flash (FREE), specialized in improving prompts and helping users with their tasks.

User message: "${userMessage}"

As SPA with reliable performance capabilities, respond naturally and helpfully. Your personality:
- Friendly, encouraging, and approachable
- Professional with deep expertise in prompt engineering
- Focused on helping users improve their prompts and achieve their goals
- Provide practical, actionable suggestions
- Keep responses conversational and engaging
- Use reliable reasoning for effective responses

Guidelines:
- Respond in Korean if the user writes in Korean, English if they write in English
- Be concise but informative (2-4 sentences usually)
- If the user's message seems like a prompt that could be improved, provide specific suggestions
- Always be encouraging and positive
- Use emojis sparingly but appropriately
- Leverage reliable reasoning for good contextual understanding

Generate a natural, helpful response that showcases reliable AI capabilities:`;

            console.log('Calling model.generateContent for chat...');

            // 2.5 Flash는 더 빠르므로 지연 시간 단축
            await new Promise(resolve => setTimeout(resolve, 300));

            const result = await model.generateContent(prompt);
            console.log('generateContent completed, getting response...');

            const response = await result.response;
            console.log('Response received, extracting text...');

            const text = response.text().trim();
            console.log('Text extracted successfully, length:', text.length);
            console.log('=== GeminiService.generateChatResponse completed (2.5 Flash) ===');

            return text;
        } catch (error) {
            console.error('=== GeminiService Chat Error Details (2.5 Flash) ===');
            console.error('Error type:', typeof error);
            console.error('Error instanceof Error:', error instanceof Error);
            console.error('Error message:', error instanceof Error ? error.message : error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
            console.error('Full error object:', error);

            // API 키 무효 에러인 경우 더미 응답 제공 (개발/테스트용)
            if (error instanceof Error && error.message.includes('API key not valid')) {
                console.log('=== Providing fallback chat response due to invalid API key ===');
                return this.generateFallbackChatResponse(userMessage);
            }

            throw new Error('Failed to generate chat response using Gemini 2.5 Flash API: ' + (error instanceof Error ? error.message : String(error)));
        }
    }

    private generateFallbackChatResponse(userMessage: string): string {
        // 사용자 메시지에 따른 적절한 더미 응답 생성
        const message = userMessage.toLowerCase();
        
        if (message.includes('안녕') || message.includes('hello') || message.includes('hi')) {
            return '안녕하세요! SPA(Smart Prompt Assistant)입니다. 프롬프트 개선이나 업무 관련 질문이 있으시면 언제든 말씀해주세요! 😊';
        } else if (message.includes('이메일') || message.includes('email')) {
            return '이메일 작성에 도움이 필요하시군요! 더 구체적인 정보를 주시면 효과적인 이메일 작성 방법을 안내해드릴 수 있어요. 목적이나 대상을 알려주세요.';
        } else if (message.includes('마케팅') || message.includes('marketing')) {
            return '마케팅 관련 작업이시네요! 타겟 고객층이나 제품 특성을 더 구체적으로 알려주시면, 더 효과적인 마케팅 전략을 제안해드릴 수 있어요. 🎯';
        } else if (message.includes('회의') || message.includes('meeting')) {
            return '회의 관련 업무군요! 회의록 정리나 안건 준비 등 구체적으로 어떤 부분에 도움이 필요한지 알려주시면 더 정확한 가이드를 제공해드릴게요.';
        } else if (message.includes('블로그') || message.includes('blog')) {
            return '블로그 포스트 작성이시군요! 주제나 타겟 독자층을 더 구체적으로 설정하면 더 매력적인 콘텐츠를 만들 수 있어요. 어떤 분야의 블로그인지 알려주세요! ✍️';
        } else {
            return '좋은 아이디어네요! 더 구체적인 요구사항이나 맥락을 추가하시면 더 정확하고 유용한 결과를 얻으실 수 있어요. 어떤 부분을 더 발전시키고 싶으신가요?';
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