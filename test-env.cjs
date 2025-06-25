const fs = require('fs');

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://mtowbsogtkpxvysnbdau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b3dic29ndGtweHZ5c25iZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDgxODQsImV4cCI6MjA2NTgyNDE4NH0.pLu1dN6nMzEfm-zrHjPn4natPoN5sARvvKzsNXnIh_I
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b3dic29ndGtweHZ5c25iZGF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI0ODE4NCwiZXhwIjoyMDY1ODI0MTg0fQ.DepOvtohT7kTygJJBVgjPvmLktwNdVrVQb53FVzxO74

# Gemini API Configuration  
GEMINI_API_KEY=
`;

fs.writeFileSync('.env.local', envContent);
console.log('Environment file created successfully');

// 환경변수 로드 테스트
require('dotenv').config({ path: '.env.local' });
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'); 