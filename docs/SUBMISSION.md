Submission Checklist — BeyondChats

Overview
This document summarizes what to include when submitting your project and points to the prepared files in this repository to make review easier.

Evaluation Criteria (as requested)
- Completeness — 40%
- ReadMe & setup docs — 25%
- UI/UX — 15%
- Live Link — 10%
- Code Quality — 10%

What you must provide
1. Public git repository containing all source code (client/ and server/).
2. A clear `README.md` with:
   - Local setup instructions
   - Environment variables
   - Running and deployment instructions
   - Live demo links
   - Screenshots and diagrams
3. Data flow diagram(s) and architecture diagram(s). Files are in `diagrams/`:
   - `diagrams/level0.svg` — System context (DFD Level 0)
   - `diagrams/level1-backend.svg` — Backend data flow
   - `diagrams/level1-frontend.svg` — Frontend flow
4. Screenshots (Original article / Updated article) at repository root.
5. A submission-ready single page that groups README, diagrams and screenshots: `submission/index.html` (open in browser and Print→Save as PDF).

How to produce a PDF for submission
- Open `submission/index.html` in Chrome/Edge/Firefox.
- Press Ctrl/Cmd+P → Destination: Save as PDF → Save.
- Verify the PDF contains the README summary, diagrams, and screenshots.

Optional: Commit & push
- Commit frequently and push the final state to a public repo so reviewers can follow the development history.

Notes
- Puppeteer and the LLM integration require environment variables (`SERP_API`, `GEMINI_API_KEY`). If these cannot be provided for security reasons, include sample output screenshots and explain how to run the features locally in the README.

Contact
- If you want, I can also:
  - Generate a single PDF here and add it to the repo (requires running a headless browser in this environment).
  - Create a short `DEPLOYMENT.md` with step-by-step Render/Vercel deployment instructions.


