from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import logging
import os
from dotenv import load_dotenv

from rag.engine import RAGEngine
from scraper.shl_scraper import SHLScraper
from rag.vector_db import VectorDB

load_dotenv()

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SHL Assessment Recommender API")

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class Recommendation(BaseModel):
    name: str
    url: str
    test_type: str
    category: Optional[str] = None
    duration: Optional[str] = None
    skills_measured: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    recommendations: List[Recommendation]
    end_of_conversation: bool

# Initialize RAG Engine
# We'll do this lazily or at startup
engine = None

@app.on_event("startup")
async def startup_event():
    global engine
    logger.info("Initializing SHL Assessment Recommender...")
    
    # Check if DB needs seeding
    db = VectorDB()
    if db.get_stats()["count"] == 0:
        logger.info("Vector DB is empty. Seeding data...")
        scraper = SHLScraper()
        data = scraper.scrape_catalog()
        db.ingest_data(data)
    
    engine = RAGEngine()
    logger.info("System ready.")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")
    
    # Convert Pydantic messages to dicts for the engine
    messages_dict = [{"role": m.role, "content": m.content} for m in request.messages]
    
    # Ensure conversation length is handled (max 8 turns)
    if len(messages_dict) > 16: # 8 turns = 16 messages (user + assistant)
        return ChatResponse(
            reply="We have reached the maximum conversation limit. How else can I help you in a new session?",
            recommendations=[],
            end_of_conversation=True
        )

    reply, recommendations, end_of_conversation = engine.generate_response(messages_dict)
    
    # Format recommendations to match output schema
    formatted_recs = []
    for rec in recommendations:
        formatted_recs.append(Recommendation(
            name=rec.get("name", "Unknown"),
            url=rec.get("url", "https://www.shl.com"),
            test_type=rec.get("test_type", "K"),
            category=rec.get("category"),
            duration=rec.get("duration"),
            skills_measured=rec.get("skills_measured")
        ))

    return ChatResponse(
        reply=reply,
        recommendations=formatted_recs,
        end_of_conversation=end_of_conversation
    )

@app.get("/admin/stats")
async def get_admin_stats():
    db = VectorDB()
    return {
        "vector_db": db.get_stats(),
        "status": "healthy",
        "model": "gpt-4-turbo-preview"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
