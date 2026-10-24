# BrandGuard AI MVP

## Requirements
- Node.js LTS (Node 22+ recommended)
- VS Code
- Optional Gemini API key: https://aistudio.google.com/app/apikey

## Run
1. Extract this ZIP and open the `BrandGuard_AI_MVP` folder in VS Code.
2. Open Terminal > New Terminal.
3. Run `npm install`.
4. Optional real AI: copy `.env.example` to `.env`, then set `GEMINI_API_KEY=your_key`. Keep `.env private; never upload it to GitHub or share the key.
5. Run `npm start`.
6. Open http://localhost:3000.

Without a key, the app runs in demo mode using simple pattern checks. With a key, it uses the Gemini API. The header indicates which mode is active. If you add a key after starting, stop with Ctrl+C and restart `npm start`.

## Quick test
The preloaded sample contains exaggerated claims. Click **Review content** and check that potential issues appear. API health endpoint: http://localhost:3000/api/health

PowerShell API test:
`Invoke-RestMethod -Uri http://localhost:3000/api/review -Method Post -ContentType 'application/json' -Body '{"content":"Our product is the best in the world! Guaranteed results for everyone.","guidelines":"Use a professional tone. Avoid unsupported claims."}'`

## MVP limits
The content checker and Express API work; demo mode is not AI. Approval is not persisted and there is no login or database yet. Compliance scores are estimates, not guarantees. Verify factual claims and avoid sending confidential content to external AI services.

## Next steps
1. Add MySQL storage for guidelines, reviews, issues and approvals.
2. Add authentication and reviewer roles.
3. Save approval/revision history.
4. Add tests and deployment.
