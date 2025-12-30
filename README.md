
# BeyondChats

A content-enhancing platform that stores articles, finds authoritative references via Google, and rewrites articles using an LLM to improve clarity, structure, and references.

Live / Demo
- Frontend (deployed): https://beyond-chats-javeed.vercel.app/
- API (deployed): https://beyondchats-javeed.onrender.com/

---

## Data Flow Diagrams & Architecture

- Data Flow Diagrams:

	- System context (DFD Level 0):

		![DFD Level 0](./diagrams/level0.svg)

	- Backend data flow:

		![Backend Flow](./diagrams/level1-backend.svg)

	- Frontend data flow:

		![Frontend Flow](./diagrams/level1-frontend.svg)

- Screenshots (Original / Updated):

	![Original Article](./Screenshot%202025-12-30%20180927.png)

	![Updated Article](./Screenshot%202025-12-30%20181029.png)


Tech Stack
- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Scraping: SerpApi + Puppeteer
- LLM: Google Gemini via @google/genai wrapper (optional)

---

Table of Contents
- Project Overview
- Features
- Architecture
- Local Setup
- Environment Variables
- Running (Dev & Prod)
- API Reference
- Deployment Notes
- Troubleshooting
- Contributing
- License & Contact

---

## Project Overview
BeyondChats stores articles and can enrich/rewrites them by searching for external references on Google and running a rewrite through an LLM. The server exposes a simple CRUD API for articles and a special endpoint to `update-from-google` which:
1. Searches Google for matching references (via SerpApi).
2. Scrapes reference pages using Puppeteer.
3. Sends original + references to an LLM to produce rewritten content.
4. Stores the rewritten content and reference URLs.

## Features
- Create, read, update, delete articles
- Find external references for an article and rewrite content using an LLM
- Puppeteer scraping fallback for content extraction
- Configurable CORS for local development and deployed origins

## Architecture
- `client/`: React application (UI)
- `server/`: Express API, controllers, models, scrapers, and LLM wrapper
- `server/models/Article.js`: Mongoose schema for article storage
- `server/scrapers/googleScraper.js`: SerpApi + Puppeteer scraping
- `server/utils/llm.js`: Wrapper for Google Gemini (@google/genai)

## Local Setup (Development)
Prerequisites:
- Node.js 18+ and npm
- MongoDB (Atlas recommended) or a local MongoDB instance

1. Clone repository

2. Install dependencies

```bash
# server
cd server
npm install

# client
cd ../client
npm install
```

3. Create environment variables (server/.env)

Create a `.env` file in the `server/` folder with at least:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
SERP_API=your_serpapi_key
GEMINI_API_KEY=your_gemini_key (optional)
GEMINI_MODEL=gemini-2.5-flash (optional)
```

Note: `googleScraper.js` loads `server/.env` explicitly in the scrapers folder.

## Running Locally
Start the backend and frontend separately.

```bash
# in server/
npm run dev    # or node server.js

# in client/
npm run dev
```

Frontend default dev URL: `http://localhost:5173`

If you encounter CORS issues while developing, either:
- Start the backend with CORS configured to accept `http://localhost:5173`, or
- Use Vite proxy (see `vite.config.js`) to forward `/api` requests to your backend.

Example Vite proxy snippet (client/vite.config.js):
```js
server: {
	proxy: {
		'/api': {
			target: 'http://localhost:5000',
			changeOrigin: true,
			secure: false,
		}
	}
}
```

## Environment Variables (summary)
- `MONGO_URI` — MongoDB connection string (required)
- `PORT` — Server port (default 5000 recommended)
- `SERP_API` — SerpApi key used for Google searches (required for `update-from-google`)
- `GEMINI_API_KEY` — Google Gemini key (optional; used in `server/utils/llm.js`)
- `GEMINI_MODEL` — model identifier (optional)

## API Reference
Base path: `/api/articles`

- `POST /api/articles`
	- Create an article. Body: `{ title, author, url, content }`
	- Response: `201` created article object

- `GET /api/articles`
	- List all articles

- `GET /api/articles/:id`
	- Get a single article by ID

- `POST /api/articles/:id/update-from-google`
	- Trigger Google search + scrape + rewrite for the article
	- Response: updated article object

- `PUT /api/articles/:id`
	- Update article fields

- `DELETE /api/articles/:id`
	- Delete article

Notes:
- The `update-from-google` endpoint depends on `SERP_API` and Puppeteer; it may take several seconds and requires your hosting environment to allow headless Chromium.

## Deployment Notes
- When deploying to platforms like Render or Vercel, ensure these environment variables are set in the deployment dashboard.
- Puppeteer requires special flags on some hosts (e.g., `--no-sandbox`). Confirm your host supports running headless Chromium or use a serverless scraping alternative.
- CORS: the server includes an origin whitelist—ensure the deployed origin(s) (e.g., Vercel URL) are included.

## Troubleshooting
- CORS errors: verify deployed server is running and returning `Access-Control-Allow-Origin` for your origin. A 502 or network error means the server is unreachable or crashing before sending headers.
- 502 Bad Gateway: check your hosting logs (Render/Vercel) for crashes, missing environment variables, or Puppeteer startup errors.
- LLM errors: if `@google/genai` is not installed or `GEMINI_API_KEY` is missing, the LLM wrapper will fail — either install/configure or fallback to no-LLM mode.



Submission package
- A printable submission page has been prepared at `submission/index.html`. Open it in your browser and use Print → Save as PDF to produce a single PDF for submission. The `diagrams/` folder and screenshots are embedded there.
