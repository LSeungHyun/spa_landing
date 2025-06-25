import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
    try {
        console.log('=== Gemini API Test Started ===');

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

        // 3. 모델 생성 테스트
        console.log('Getting generative model...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        console.log('Model created successfully');

        // 4. 간단한 테스트 호출
        console.log('Testing simple generation...');
        const testPrompt = "Hello, respond with just 'Test successful'";

        const result = await model.generateContent(testPrompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini API response:', text);
        console.log('=== Gemini API Test Completed Successfully ===');

        return NextResponse.json({
            success: true,
            response: text,
            step: 'completed',
            message: 'Gemini API is working correctly'
        });

    } catch (error) {
        console.error('=== Gemini API Test Failed ===');
        console.error('Error details:', error);

        let errorMessage = 'Unknown error';
        let errorCode = 'UNKNOWN_ERROR';

        if (error instanceof Error) {
            errorMessage = error.message;
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            // 특정 에러 타입 분석
            if (error.message.includes('API_KEY_INVALID')) {
                errorCode = 'INVALID_API_KEY';
            } else if (error.message.includes('quota')) {
                errorCode = 'QUOTA_EXCEEDED';
            } else if (error.message.includes('model')) {
                errorCode = 'INVALID_MODEL';
            } else if (error.message.includes('network')) {
                errorCode = 'NETWORK_ERROR';
            }
        }

        return NextResponse.json({
            success: false,
            error: errorMessage,
            errorCode,
            step: 'api_call_failed'
        }, { status: 500 });
    }
} 