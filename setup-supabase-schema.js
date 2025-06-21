import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Supabase 설정
const SUPABASE_URL = 'https://mtowbsogtkpxvysnbdau.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b3dic29ndGtweHZ5c25iZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDgxODQsImV4cCI6MjA2NTgyNDE4NH0.pLu1dN6nMzEfm-zrHjPn4natPoN5sARvvKzsNXnIh_I';

// Supabase 클라이언트 생성
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupSchema() {
  console.log('🔧 Supabase 스키마 설정 시작...\n');

  try {
    // SQL 파일 읽기
    const sqlSchema = readFileSync('./src/lib/supabase-schema.sql', 'utf8');
    
    // SQL 명령어들을 분리 (세미콜론 기준)
    const sqlCommands = sqlSchema
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📜 총 ${sqlCommands.length}개의 SQL 명령어 발견`);

    // 각 명령어 실행
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      
      if (command.toLowerCase().includes('create table')) {
        const tableName = extractTableName(command);
        console.log(`🏗️  테이블 생성 중: ${tableName}`);
      } else if (command.toLowerCase().includes('create index')) {
        console.log(`📊 인덱스 생성 중...`);
      } else if (command.toLowerCase().includes('create policy')) {
        console.log(`🔒 보안 정책 생성 중...`);
      } else if (command.toLowerCase().includes('create or replace')) {
        console.log(`⚙️  함수/뷰 생성 중...`);
      }

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: command + ';' });
        
        if (error) {
          console.log(`⚠️  명령어 실행 실패 (무시됨): ${error.message}`);
        }
      } catch (err) {
        console.log(`⚠️  명령어 실행 중 오류 (무시됨): ${err.message}`);
      }
    }

    console.log('\n✅ 스키마 설정 완료!');
    
    // 테이블 생성 확인
    console.log('\n🔍 생성된 테이블 확인 중...');
    await checkTables();

  } catch (error) {
    console.error('💥 스키마 설정 오류:', error.message);
  }
}

function extractTableName(sql) {
  const match = sql.match(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+(\w+)/i);
  return match ? match[1] : 'unknown';
}

async function checkTables() {
  const tables = ['pre_registrations', 'user_feedback', 'demo_usage', 'user_events'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: 존재하지 않음`);
      } else {
        console.log(`✅ ${table}: 생성됨`);
      }
    } catch (err) {
      console.log(`❌ ${table}: 확인 실패`);
    }
  }
}

// 스크립트 실행
setupSchema().then(() => {
  console.log('\n🎉 모든 설정이 완료되었습니다!');
  process.exit(0);
}).catch(error => {
  console.error('💥 설정 실패:', error);
  process.exit(1);
}); 