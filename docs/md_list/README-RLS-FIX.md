# 🔒 Supabase RLS 정책 수정 가이드

## 📋 문제 상황
현재 `pre_registrations` 테이블에 RLS(Row Level Security)가 활성화되어 있지만, 익명 사용자의 INSERT 권한을 허용하는 정책이 없어서 사전 등록이 실패하고 있습니다.

## 🛠️ 해결 방법

### 방법 1: Supabase 대시보드에서 SQL 실행 (권장)

1. **Supabase 대시보드 접속**
   - 링크: https://supabase.com/dashboard/project/mtowbsogtkpxvysnbdau/sql

2. **SQL 에디터에서 다음 쿼리 실행**
   ```sql
   -- Fix RLS policy for pre_registrations table
   
   -- Drop existing policies if they exist (to avoid conflicts)
   DROP POLICY IF EXISTS "Allow anonymous insert on pre_registrations" ON public.pre_registrations;
   DROP POLICY IF EXISTS "Allow authenticated insert on pre_registrations" ON public.pre_registrations;
   DROP POLICY IF EXISTS "Allow anonymous select on pre_registrations" ON public.pre_registrations;
   
   -- Create policy to allow anonymous users to insert into pre_registrations
   CREATE POLICY "Allow anonymous insert on pre_registrations" 
   ON public.pre_registrations 
   FOR INSERT 
   TO anon 
   WITH CHECK (true);
   
   -- Create policy to allow authenticated users to insert (optional but recommended)
   CREATE POLICY "Allow authenticated insert on pre_registrations" 
   ON public.pre_registrations 
   FOR INSERT 
   TO authenticated 
   WITH CHECK (true);
   
   -- Create policy to allow anonymous users to select (optional, for confirmation)
   CREATE POLICY "Allow anonymous select on pre_registrations" 
   ON public.pre_registrations 
   FOR SELECT 
   TO anon 
   USING (true);
   ```

3. **정책 적용 확인**
   ```sql
   -- Verify RLS is enabled on the table
   SELECT 
       schemaname,
       tablename,
       rowsecurity
   FROM pg_tables 
   WHERE tablename = 'pre_registrations' AND schemaname = 'public';
   
   -- Verify the policies were created successfully
   SELECT
       schemaname,
       tablename,
       policyname,
       permissive,
       roles,
       cmd,
       qual,
       with_check
   FROM pg_policies
   WHERE tablename = 'pre_registrations'
   ORDER BY policyname;
   ```

### 방법 2: 로컬에서 SQL 파일 실행

1. **SQL 파일 사용**
   - 파일: `rls-policy-fix.sql` (이미 생성됨)
   - 또는 `supabase-rls-fix.sql` (기존 파일)

2. **Supabase CLI 사용 (선택사항)**
   ```bash
   supabase db reset --db-url "postgresql://postgres:[PASSWORD]@db.mtowbsogtkpxvysnbdau.supabase.co:5432/postgres"
   ```

## 🔍 정책 설명

### 생성되는 정책들:

1. **`Allow anonymous insert on pre_registrations`**
   - 익명 사용자가 `pre_registrations` 테이블에 INSERT 할 수 있도록 허용
   - `WITH CHECK (true)`: 모든 데이터 삽입 허용

2. **`Allow authenticated insert on pre_registrations`**
   - 인증된 사용자도 INSERT 할 수 있도록 허용 (향후 확장성)

3. **`Allow anonymous select on pre_registrations`**
   - 익명 사용자가 SELECT 할 수 있도록 허용 (확인용)

## ✅ 테스트 방법

정책 적용 후 다음과 같이 테스트할 수 있습니다:

```bash
curl -X POST http://localhost:3000/api/pre-register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## 📝 주의사항

1. **보안**: 이 정책은 모든 익명 사용자에게 INSERT 권한을 부여합니다. 프로덕션 환경에서는 추가적인 보안 조치를 고려하세요.

2. **데이터 검증**: 애플리케이션 레벨에서 데이터 검증을 철저히 수행하세요.

3. **모니터링**: 비정상적인 데이터 삽입을 모니터링할 수 있는 시스템을 구축하세요.

## 🔧 추가 보안 강화 (선택사항)

더 강력한 보안을 원한다면 다음과 같은 정책을 고려할 수 있습니다:

```sql
-- 이메일 형식 검증이 포함된 정책
CREATE POLICY "Allow anonymous insert with email validation" 
ON public.pre_registrations 
FOR INSERT 
TO anon 
WITH CHECK (
  email IS NOT NULL 
  AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(email) <= 255
);

-- 시간 제한이 있는 정책 (예: 하루에 같은 IP에서 5회까지만)
-- 이는 추가적인 테이블과 함수가 필요합니다.
```

---

**이 가이드를 따라 RLS 정책을 적용하면 사전 등록 기능이 정상적으로 작동할 것입니다.** 