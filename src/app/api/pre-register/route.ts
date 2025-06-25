import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseClient, supabaseAdmin } from '@/lib/supabase-client'
import { env } from '@/lib/env'

// 요청 데이터 검증 스키마
const preRegisterSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  name_or_nickname: z.string().optional(),
  expected_feature: z.string().optional(),
  additional_info: z.record(z.any()).optional(),
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
  console.error('API Error:', error, details)
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
    env: {
      hasClientConfig: !!(env.client.NEXT_PUBLIC_SUPABASE_URL && env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      hasAdminConfig: !!supabaseAdmin,
      isDevelopment: env.isDevelopment,
      isProduction: env.isProduction,
    }
  })
}

// POST 메서드 - 사전 등록 처리
export async function POST(request: NextRequest) {
  try {
    // Supabase 클라이언트 선택 (Admin이 있으면 Admin 사용, 없으면 Client 사용)
    const supabase = supabaseAdmin || supabaseClient

    if (!supabase) {
      return createErrorResponse(
        '서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.',
        500,
        {
          code: 'SUPABASE_NOT_CONFIGURED',
          env: {
            hasClientConfig: !!(env.client.NEXT_PUBLIC_SUPABASE_URL && env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY),
            hasAdminConfig: !!supabaseAdmin,
          }
        }
      )
    }

    // 요청 본문 파싱
    let body: any
    try {
      body = await request.json()
      console.log('📥 Received request:', { email: body.email, hasName: !!body.name_or_nickname })
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
        '입력 데이터가 올바르지 않습니다.',
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
      console.log('🔍 Checking email existence:', email)

      const { data: existingUser, error: checkError } = await supabase
        .from('pre_registrations')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle()

      if (checkError) {
        console.error('❌ Database check error:', checkError)
        return createErrorResponse(
          '데이터베이스 연결 오류가 발생했습니다.',
          500,
          { code: 'DATABASE_CHECK_ERROR', dbError: checkError.message }
        )
      }

      // 이메일이 이미 존재하는 경우
      if (existingUser) {
        console.log('⚠️ Email already exists:', email)
        return createErrorResponse(
          '이미 등록된 이메일입니다',
          409,
          { code: 'EMAIL_ALREADY_EXISTS' }
        )
      }
    } catch (dbError) {
      console.error('❌ Database connection error:', dbError)
      return createErrorResponse(
        '데이터베이스 연결 오류가 발생했습니다.',
        500,
        { code: 'DATABASE_CONNECTION_ERROR' }
      )
    }

    // 추가 정보 처리
    let finalExpectedFeature = expected_feature || null;
    if (additional_info && Object.keys(additional_info).length > 0) {
      const additionalInfoStr = JSON.stringify(additional_info, null, 2);
      if (finalExpectedFeature) {
        finalExpectedFeature += `\n\n[추가 정보]\n${additionalInfoStr}`;
      } else {
        finalExpectedFeature = `[사용자 정보]\n${additionalInfoStr}`;
      }
    }

    // 새로운 사전 등록 데이터 삽입
    try {
      const insertData = {
        email: email.toLowerCase().trim(),
        name_or_nickname: name_or_nickname?.trim() || null,
        expected_feature: finalExpectedFeature,
      }

      console.log('💾 Inserting data:', {
        email: insertData.email,
        hasName: !!insertData.name_or_nickname,
        usingAdmin: !!supabaseAdmin,
        clientType: supabaseAdmin ? 'admin' : 'client'
      })

      // RLS 우회를 위해 Service Role을 사용하려고 시도
      const insertClient = supabaseAdmin || supabaseClient;

      const { data, error: insertError } = await insertClient
        .from('pre_registrations')
        .insert([insertData])
        .select()
        .single()

      if (insertError) {
        console.error('❌ Database insert error:', insertError)

        // 테이블이 존재하지 않는 경우
        if (insertError.code === '42P01') {
          return createErrorResponse(
            '데이터베이스 테이블이 설정되지 않았습니다. 관리자에게 문의해주세요.',
            500,
            { code: 'TABLE_NOT_EXISTS', dbError: insertError.message }
          )
        }

        return createErrorResponse(
          '등록 중 오류가 발생했습니다.',
          500,
          { code: 'DATABASE_INSERT_ERROR', dbError: insertError.message }
        )
      }

      console.log('✅ Successfully inserted:', { id: data.id, email: data.email })

      // 성공 응답
      return createSuccessResponse(
        {
          message: '사전 등록이 완료되었습니다',
          data: {
            id: data.id,
            email: data.email,
            name_or_nickname: data.name_or_nickname,
            registered_at: data.registered_at,
          },
        },
        201
      )
    } catch (insertError) {
      console.error('❌ Unexpected insert error:', insertError)
      return createErrorResponse(
        '등록 중 예상치 못한 오류가 발생했습니다.',
        500,
        { code: 'UNEXPECTED_INSERT_ERROR' }
      )
    }

  } catch (error) {
    console.error('❌ Unexpected API error:', error)
    return createErrorResponse(
      '서버에서 예상치 못한 오류가 발생했습니다.',
      500,
      { code: 'UNEXPECTED_ERROR' }
    )
  }
} 