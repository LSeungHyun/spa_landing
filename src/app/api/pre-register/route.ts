import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

// 환경 변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    serviceKey: !!supabaseServiceKey
  })
}

// Supabase 클라이언트 초기화 (환경 변수가 없어도 에러가 나지 않도록)
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// 요청 데이터 검증 스키마 - 실제 스키마 필드와 일치
const preRegisterSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  name_or_nickname: z.string().optional(),
  expected_feature: z.string().optional(),
  additional_info: z.record(z.any()).optional(), // 추가 정보를 위한 유연한 필드
})

type PreRegisterData = z.infer<typeof preRegisterSchema>

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

// 성공 응답 생성 함수
function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  })
}

// 에러 응답 생성 함수
function createErrorResponse(error: string, status: number = 500, details?: any) {
  return NextResponse.json(
    { 
      error,
      ...(details && { details })
    },
    { 
      status,
      headers: corsHeaders,
    }
  )
}

// OPTIONS 메서드 - CORS 프리플라이트 요청 처리
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// GET 메서드 - API 상태 확인
export async function GET() {
  return createSuccessResponse({ 
    message: 'Pre-registration API endpoint',
    status: 'active',
    supabaseConnected: !!supabase
  })
}

// POST 메서드 - 사전 등록 처리
export async function POST(request: NextRequest) {
  try {
    // Supabase 연결 확인
    if (!supabase) {
      console.error('Supabase not configured')
      return createErrorResponse(
        '서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.',
        500,
        { code: 'SUPABASE_NOT_CONFIGURED' }
      )
    }

    // 요청 본문 파싱
    let body: any
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      return createErrorResponse(
        '잘못된 요청 형식입니다.',
        400,
        { code: 'INVALID_JSON' }
      )
    }
    
    // Zod 스키마로 데이터 검증
    const validationResult = preRegisterSchema.safeParse(body)
    
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        {
          code: 'VALIDATION_ERROR',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        }
      )
    }

    const { email, name_or_nickname, expected_feature, additional_info } = validationResult.data

    // 이메일 중복 확인
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('pre_registrations')
        .select('email')
        .eq('email', email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116은 "no rows returned" 에러로, 중복이 없다는 의미
        console.error('Database check error:', checkError)
        return createErrorResponse(
          '데이터베이스 연결 오류가 발생했습니다.',
          500,
          { code: 'DATABASE_CHECK_ERROR', dbError: checkError.message }
        )
      }

      // 이메일이 이미 존재하는 경우
      if (existingUser) {
        return createErrorResponse(
          '이미 등록된 이메일입니다',
          409,
          { code: 'EMAIL_ALREADY_EXISTS' }
        )
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return createErrorResponse(
        '데이터베이스 연결 오류가 발생했습니다.',
        500,
        { code: 'DATABASE_CONNECTION_ERROR' }
      )
    }

    // 추가 정보가 있는 경우 expected_feature에 포함
    let finalExpectedFeature = expected_feature || null;
    if (additional_info && Object.keys(additional_info).length > 0) {
      if (finalExpectedFeature) {
        finalExpectedFeature += `\n\n[추가 정보]\n${JSON.stringify(additional_info, null, 2)}`;
      } else {
        finalExpectedFeature = `[사용자 정보]\n${JSON.stringify(additional_info, null, 2)}`;
      }
    }

    // 새로운 사전 등록 데이터 삽입 - 실제 스키마 필드만 사용
    try {
      const { data, error: insertError } = await supabase
        .from('pre_registrations')
        .insert([
          {
            email,
            name_or_nickname: name_or_nickname || null,
            expected_feature: finalExpectedFeature,
            // registered_at은 데이터베이스에서 자동으로 설정되므로 제외
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error('Database insert error:', insertError)
        return createErrorResponse(
          '등록 중 오류가 발생했습니다.',
          500,
          { code: 'DATABASE_INSERT_ERROR', dbError: insertError.message }
        )
      }

      // 성공 응답
      return createSuccessResponse(
        {
          message: '사전 등록이 완료되었습니다',
          data: {
            email: data.email,
            name_or_nickname: data.name_or_nickname,
            expected_feature: data.expected_feature,
            registered_at: data.registered_at,
          },
        },
        201
      )
    } catch (insertError) {
      console.error('Database insert error:', insertError)
      return createErrorResponse(
        '등록 중 오류가 발생했습니다.',
        500,
        { code: 'DATABASE_INSERT_ERROR' }
      )
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    return createErrorResponse(
      '알 수 없는 오류가 발생했습니다.',
      500,
      { code: 'UNEXPECTED_ERROR' }
    )
  }
} 