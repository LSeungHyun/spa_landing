import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
    try {
        console.log('=== Gemini 2.0 Flash API Test Started (FREE MODEL) ===');

        // 1. 환경변수 확인
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('API Key exists:', !!apiKey);
        console.log('API Key length:', apiKey?.length || 0);
        console.log('API Key prefix:', apiKey?.substring(0, 10) + '...');

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'GEMINI_API_KEY not found',
                step: 'environment_check'
            }, { status: 500 });
        }

        // 2. GoogleGenerativeAI 인스턴스 생성 테스트
        console.log('Creating GoogleGenerativeAI instance...');
        const genAI = new GoogleGenerativeAI(apiKey);
        console.log('GoogleGenerativeAI instance created successfully');

        // 3. Gemini 2.5 Flash 모델 생성 테스트
        console.log('Getting Gemini 2.5 Flash model...');
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.9,
                maxOutputTokens: 1024,
            }
        });
        console.log('Gemini 2.5 Flash model created successfully');

        // 4. 간단한 테스트 호출
        console.log('Testing Gemini 2.5 Flash generation...');
        const testPrompt = "Hello! Please respond with 'Gemini 2.5 Flash is working correctly' to confirm the model upgrade.";

        const result = await model.generateContent(testPrompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini 2.5 Flash API response:', text);
        console.log('=== Gemini 2.5 Flash API Test Completed Successfully ===');

        return NextResponse.json({
            success: true,
            response: text,
            model: 'gemini-2.5-flash',
            step: 'completed',
            message: 'Gemini 2.5 Flash API is working correctly',
            features: {
                enhancedReasoning: true,
                improvedSpeed: true,
                betterContextHandling: true
            }
        });

    } catch (error) {
        console.error('=== Gemini 2.5 Flash API Test Failed ===');
        console.error('Error details:', error);
        
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            step: 'test_failed',
            model: 'gemini-2.5-flash'
        }, { status: 500 });
    }
} 