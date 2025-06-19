import { GoogleGenerativeAI } from '@google/generative-ai';

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
            throw new Error('Google Gemini API key not configured');
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
            const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

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
            const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
                You are an expert prompt engineer specializing in optimizing AI prompts for better results.
                
                Transform the following prompt into a more effective, clear, and specific version that will generate better AI responses.
                
                Original prompt: "${originalPrompt}"
                
                Guidelines for improvement:
                - Make the request more specific and detailed
                - Add context and background information when needed
                - Specify the desired format, style, or structure
                - Include relevant constraints or requirements
                - Add examples if helpful
                - Clarify the target audience or purpose
                - Use clear, actionable language
                - Break down complex requests into steps if needed
                
                Improved prompt structure should include:
                1. Clear objective/goal
                2. Specific requirements or constraints
                3. Desired output format
                4. Context or background (if relevant)
                5. Examples (if helpful)
                
                Please provide ONLY the improved prompt without any explanation or additional text:
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to improve prompt using Gemini API');
        }
    }
} 