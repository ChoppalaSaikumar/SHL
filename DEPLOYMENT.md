# Deployment Guide

This document provides instructions on how to deploy the SHL Assessment Recommender platform to various cloud providers.

## Environment Variables
Ensure the following variables are set in your production environment:
- `OPENAI_API_KEY`: Your OpenAI API key.
- `VITE_API_URL`: The URL of your deployed backend (for frontend).

---

## 1. Render (Full Stack)
- **Backend**:
  1. Create a "Web Service".
  2. Connect your GitHub repository.
  3. Environment: `Docker`.
  4. Add `OPENAI_API_KEY` to environment variables.
- **Frontend**:
  1. Create a "Static Site".
  2. Build Command: `npm run build`.
  3. Publish Directory: `dist`.
  4. Add `VITE_API_URL` pointing to your Render backend URL.

## 2. Railway (Full Stack)
- Railway automatically detects the `docker-compose.yml` or the Dockerfiles.
1. Create a new project from your GitHub repo.
2. Railway will deploy both services.
3. Configure environment variables in the Railway dashboard.

## 3. Vercel (Frontend Only)
- Vercel is excellent for the React frontend.
1. Import the `frontend/` directory.
2. Vercel will auto-detect Vite.
3. Set `VITE_API_URL` in project settings.

## 4. Hugging Face Spaces (Backend/RAG)
1. Create a new Space with the `Docker` SDK.
2. Upload the `backend/` contents.
3. Add `OPENAI_API_KEY` as a Secret.
4. Ensure the port is set to 7860 (Hugging Face default) or configure appropriately.

---

## Local Development (Without Docker)
### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
