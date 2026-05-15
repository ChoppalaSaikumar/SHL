import os
from typing import List, Dict, Tuple
import logging
from openai import OpenAI
from rag.vector_db import VectorDB
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class RAGEngine:
    def __init__(self):
        self.db = VectorDB()
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = "gpt-4-turbo-preview"
        
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            logger.warning("OPENAI_API_KEY not found. Running in Backend Mock Mode.")
            self.client = None

    def generate_response(self, messages: List[Dict]) -> Tuple[str, List[Dict], bool]:
        user_query = messages[-1]["content"].lower()
        
        # Always try to get recommendations from DB (even if LLM fails)
        recommendations = self.db.search(user_query, n_results=5)
        
        # If no API key, use logic-based mock response
        if not self.client:
            return self._generate_mock_response(user_query, recommendations)

        # Build Prompt for real LLM
        context = self._format_context(recommendations)
        system_prompt = self._get_system_prompt(context)
        full_messages = [{"role": "system", "content": system_prompt}] + messages
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=full_messages,
                temperature=0.3,
                max_tokens=500
            )
            reply = response.choices[0].message.content
            return reply, recommendations, self._detect_end_of_conversation(reply, user_query)
        except Exception as e:
            logger.error(f"Error calling OpenAI: {e}")
            return self._generate_mock_response(user_query, recommendations)

    def _generate_mock_response(self, query: str, recommendations: List[Dict]) -> Tuple[str, List[Dict], bool]:
        if "java" in query or "developer" in query:
            reply = "I've analyzed your request for a Java developer. I recommend starting with technical skills assessments followed by a cognitive ability screen to ensure they have the right problem-solving mindset."
        elif "personality" in query:
            reply = "For personality insights, the OPQ32 is the industry standard. It measures 32 behavioral dimensions that predict job performance across various roles."
        else:
            reply = "I've reviewed the SHL catalog for your requirements. Here are the top recommended assessments that match your hiring needs. Would you like to refine this by seniority or specific skills?"
            
        return reply, recommendations, False

    def _format_context(self, recommendations: List[Dict]) -> str:
        context_str = "Available SHL Assessments:\n"
        for rec in recommendations:
            context_str += f"- {rec['name']}: {rec['category']}, {rec['test_type']}. {rec['skills_measured']}. Duration: {rec['duration']}\n"
        return context_str

    def _get_system_prompt(self, context: str) -> str:
        return f"""
        You are a professional SHL Assessment Consultant. Only recommend assessments from the provided list:
        {context}
        Ask clarification questions if vague. Support refinement and comparisons. Refuse off-topic requests.
        """

    def _detect_end_of_conversation(self, reply: str, query: str) -> bool:
        finish_keywords = ["goodbye", "thank you", "thanks", "done"]
        for kw in finish_keywords:
            if kw in query.lower(): return True
        return False

rag_engine = RAGEngine()
