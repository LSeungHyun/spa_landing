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
    private genAI: GoogleGenerativeAI;

    // 서버 사이드에서만 사용하도록 NEXT_PUBLIC_ 접두사 제거
    private static readonly API_KEY = process.env.GEMINI_API_KEY;

    constructor() {
        if (!GeminiService.API_KEY) {
            console.error('GEMINI_API_KEY environment variable is not set');
            console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
            throw new Error('Google Gemini API key not configured. Please set GEMINI_API_KEY in your .env.local file');
        }
        this.genAI = new GoogleGenerativeAI(GeminiService.API_KEY);
    }

    public static getInstance(): GeminiService {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService();
        }
        return GeminiService.instance;
    }

    public async generatePrompt(idea: string, persona: string = 'researcher'): Promise<string> {
        try {
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
        // 더미 응답 생성 (실제 API 키 문제 해결 전까지 임시 사용)
        return `[개선된 프롬프트 - 데모 버전]

🎯 **명확한 목표 설정**
${originalPrompt}

📋 **구체적인 요구사항**
- 단계별로 자세한 설명 제공
- 실용적이고 실행 가능한 결과물 생성
- 전문적이고 체계적인 접근 방식 사용

📝 **원하는 출력 형식**
- 구조화된 형태로 정보 제공
- 핵심 포인트를 명확하게 구분
- 실무에 바로 적용 가능한 내용

💡 **추가 컨텍스트**
이 프롬프트는 AI가 더 정확하고 유용한 응답을 생성할 수 있도록 최적화되었습니다. 각 섹션은 명확한 목적을 가지고 있으며, 결과물의 품질을 크게 향상시킬 것입니다.

**최종 개선된 프롬프트:**
"${originalPrompt}에 대해 전문가 수준의 상세한 답변을 제공해주세요. 단계별 접근 방식을 사용하고, 실무에 바로 적용할 수 있는 구체적인 예시와 함께 설명해주세요."`;
    }
} 