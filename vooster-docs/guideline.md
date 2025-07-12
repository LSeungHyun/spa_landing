# Code Guidelines for Smart Prompt Assistant

## 1. Project Overview  
Smart Prompt Assistant combines a Next.js 14 App Router frontend, Next.js Server Actions backend, Google Gemini Flash API, Supabase Postgres/Auth, Redis caching, and a Manifest V3 Chrome Extension. It is deployed on Vercel with Cloudflare CDN.  
Key architectural decisions:  
- Use Next.js 14 App Router + Server Actions for unified SSR/SSG and API.  
- Domain-driven, feature-based modules under `src/features`.  
- Supabase for persistent storage & auth; Redis for rate‐limiting and caching.  
- Chrome Extension shares the Next.js backend via Messaging API.  

---

## 2. Core Principles  
1. **Single Responsibility**: Each module, component, or function MUST do one thing and do it well; max 100 lines.  
2. **Type Safety**: All functions, components, and API handlers MUST declare explicit TypeScript types or interfaces.  
3. **Consistent Structure**: File organization MUST follow the `/apps/{web|extension}`, `/libs`, `/prisma`, `/public` hierarchy.  
4. **Performance-Aware**: Cache repeated API calls in Redis; use Next.js caching options (`fetch(..., { next: { revalidate: 60 } })`).  
5. **Security-First**: All HTTP endpoints MUST validate JWT from Supabase Auth and sanitize inputs.

---

## 3. Language-Specific Guidelines

### 3.1 TypeScript (Shared)  
- **File Organization**:  
  - Use absolute imports with `tsconfig.json` paths (`@/features/prompt`).  
  - Group by domain: `src/features/{auth,prompt,usage,extension}`.  
- **Imports**:  
  - Order: 1) External libs, 2) Aliased internal modules, 3) Relative imports, 4) Styles/assets.  
  - Use ESLint import/order rule.  
- **Error Handling**:  
  - In Server Actions, wrap external calls in `try/catch` and throw custom `ApiError`.  
  - Expose minimal error messages to frontend; log details server-side.

### 3.2 React / Next.js App Router  
- **Components**:  
  - Use functional components with React hooks; no class components.  
  - Keep `app/` files small: pages call child components in `components/`.  
- **Server Actions**:  
  - Annotate with `'use server'` at top of file.  
  - Validate inputs before calling downstream services.  
- **Styling**:  
  - Use Tailwind CSS utility classes; avoid inline styles.  
  - Extract repeated patterns into `components/ui/` or `styles/`.

### 3.3 Chrome Extension (Manifest V3)  
- **Structure**:  
  - `apps/extension/src/` for popup/panel code, `background.ts` for service worker.  
- **Messaging**:  
  - Use `chrome.runtime.sendMessage` / `chrome.runtime.onMessage` to call Next.js API.  
  - Sanitize responses before injecting into the page.

---

## 4. Code Style Rules

### MUST Follow  
1. **ESLint + Prettier**: Enforce formatting and code quality.  
   Rationale: Guarantees consistent style and prevents common errors.  
2. **One Export per File**: Use `export default` or named exports, not both.  
   Rationale: Simplifies imports and tree‐shaking.  
3. **Explicit Types**: No implicit `any`; use interfaces/type aliases for props and API responses.  
   Rationale: Prevents runtime errors, improves developer experience.  
4. **Descriptive Naming**: Variables, functions, and files must clearly reflect their purpose (`improvePrompt`, not `doIt`).  
5. **Atomic Tailwind Classes**: Use only utility classes; abstract repeated patterns into `components/ui/Button.tsx`.

### MUST NOT Do  
1. **No Console Logs in Production**  
   // MUST NOT:  
   ```ts
   console.log('user data', user)  
   ```  
   // Logging raw data can leak PII; use structured server‐side logging.  
2. **No Large Multi-Responsibility Modules**  
   // MUST NOT:  
   ```ts
   // src/features/prompt/PromptService.ts (500 lines)
   export class PromptService { /* UI, DB, API, cache, auth all in one */ }
   ```  
   // Split into `services/`, `db/`, `api/`.  
3. **No Inline Styles or Hardcoded URLs**  
4. **No Unsafe Type Assertions (`as any`)**  

---

## 5. Architecture Patterns

### 5.1 Component & Module Structure  
- **Feature Module**:  
  ```
  src/features/prompt/
    ├── components/     # UI subcomponents
    ├── services/       # Business logic (API calls, caching)
    ├── hooks/          # Custom React hooks
    ├── types.ts        # Domain types/interfaces
    └── routes.ts       # Server Actions endpoints
  ```  

- **Shared**:  
  ```
  src/components/ui/     # Buttons, Inputs, Cards
  src/lib/api/           # Gemini API client
  src/lib/db/            # Supabase & Redis init
  src/lib/auth/          # Supabase Auth wrapper
  src/types/             # Global types
  ```

### 5.2 Data Flow Patterns  
1. **Client → Server Action**:  
   - Client calls form `<form action={improvePrompt}>`.  
2. **Server Action**:  
   - Validate input → call `libs/api/geminiClient` → cache in Redis → write history to Postgres → return result.  
3. **Client Rendering**:  
   - Display before/after, store accepted prompt via another action.

### 5.3 State Management  
- **Local State**: Page- or component-level via `useState`.  
- **Server State**: Fetch with Next.js `fetch` and `cache`/`revalidate` options.  
- **Global Auth State**: Wrap in `AuthContext` using Supabase Auth listener.

### 5.4 API Design Standards  
- **Naming**: `/api/prompt/improve`, `/api/prompt/generate`.  
- **HTTP Methods**: POST for create/update, GET for retrieval.  
- **Response Shape**:  
  ```ts
  interface ApiResponse<T> {
    data: T | null
    error?: { code: string; message: string }
  }
  ```  
- **Error Codes**: Follow `ApiError` with `code:string`, `status:number`.

---

## 6. Example Code Snippets

```typescript
// MUST: Server Action with validation, caching, and error handling
'use server'
import { z } from 'zod'
import { improvePrompt as geminiImprove } from '@/lib/api/geminiClient'
import { redis } from '@/lib/db'
import { saveHistory } from '@/features/prompt/services/historyService'

const ImprovePromptSchema = z.object({ text: z.string().min(1) })

export async function improvePrompt(data: FormData) {
  const { text } = ImprovePromptSchema.parse({ text: data.get('prompt') })
  const cacheKey = `improve:${text}`
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached) as string

  try {
    const improved = await geminiImprove(text)
    await redis.set(cacheKey, JSON.stringify(improved), { EX: 3600 })
    await saveHistory({ original: text, improved })
    return improved
  } catch (e) {
    console.error(e)
    throw new Error('Prompt improvement failed. Please try again.')
  }
}
```

```typescript
// MUST NOT: Monolithic handler without types, validation, or caching
export async function badImprovePrompt(form) {
  const prompt = form.get('prompt')
  const res = await fetch('https://gemini.api', { body: prompt })
  return res.text()
}
```

---

_End of Code Guidelines_