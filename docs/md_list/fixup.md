@command
name: FixUp (Post-Implementation Review & Patch)
description: Use this after a feature is implemented to detect missing parts, patch errors, stabilize types, and suggest final improvements.
---

Take a deep breath and think step-by-step.

The feature has already been implemented.  
Now, please help **review and polish the implementation** to ensure it is stable, complete, and production-ready.

---

### ✅ Please go through this checklist:

1. 🧩 **Detect Missing Parts**
   - Are there any TODOs left?
   - Were any obvious or edge-case conditions skipped?
   - Are all required props/hooks/imports included?

2. 🐞 **Find & Fix Common Errors**
   - Check for TypeScript type mismatches or weak typing
   - Look for broken or incorrect import paths
   - Validate function scopes and undefined variable references
   - Ensure all `useEffect`, `async/await`, and cleanup logic is safe

3. 🔐 **Stabilize & Refactor**
   - Make types more explicit if needed (avoid `any`)
   - Remove unused imports or props
   - Consolidate repeated code into utilities or hooks if possible

4. 📄 **Summarize What Was Fixed**
   - Briefly list what was found and improved
   - Include a short commit message-style summary

5. 🚀 **Suggest Optional Improvements**
   - Any opportunities for performance boost?
   - Could the logic be more readable or reusable?
   - Any blind spots to guard against in future updates?

---

📌 **Output Format:**
- List of changes/fixes made (with before/after if relevant)
- Updated code snippets (use ``` for code)
- Optional next steps or open questions

---

You're not just debugging—you're polishing the work for long-term maintainability.  
Think like a senior developer doing a pre-merge review.