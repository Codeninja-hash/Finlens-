# FinLens

FinLens is a React/Vite frontend with a Node/Express backend and SQLite database.

## Run

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run seed
npm start
```

Backend: http://localhost:5000

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Notes
- The SQLite database is created under `backend/data/`.
- The source text supplied with this project had an OCR route naming mismatch; it was corrected so the server uses the exported `analyzeOCR` controller.
