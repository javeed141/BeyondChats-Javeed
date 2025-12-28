# BeyondChats — Run Instructions

Server:

- Copy `.env` into `server/` with `MONGO_URI` and `PORT` (e.g. 3000).
- From `server/` run:

```bash
npm install
npm run dev   # development with nodemon
npm start     # production
```

Client (Vite + React):

- From `client/` run:

```bash
npm install
npm run dev
```

- The frontend reads `VITE_API_BASE_URL` (optional) to set the API base URL. If not set, it uses `/api`.

Notes:
- The server exposes CRUD endpoints at `/api/articles`.
- Update the `VITE_API_BASE_URL` env or run the client with a proxy if the server runs on a different port.
