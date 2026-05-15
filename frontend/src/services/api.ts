import axios from 'axios';
import { Message, Recommendation } from '../store/useChatStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export interface ChatResponse {
  reply: string;
  recommendations: Recommendation[];
  end_of_conversation: boolean;
}

// Mock data for when the backend is offline
const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    name: "OPQ32 (Occupational Personality Questionnaire)",
    url: "https://www.shl.com/en/assessments/personality/opq/",
    test_type: "P",
    category: "Behavioral",
    duration: "25-35 mins",
    skills_measured: "Influence, Analysis, Creativity, Resilience"
  },
  {
    name: "Verify Interactive - G+",
    url: "https://www.shl.com/en/assessments/cognitive-ability/verify-interactive-g-plus/",
    test_type: "A",
    category: "Cognitive",
    duration: "20 mins",
    skills_measured: "Problem Solving, Deductive Reasoning"
  }
];

export const chatService = {
  async sendMessage(messages: Message[]): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>('/chat', { messages });
      return response.data;
    } catch (error) {
      console.warn("Backend not reached, using Mock Mode:", error);
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lastMessage = messages[messages.length - 1].content.toLowerCase();
      
      if (lastMessage.includes("java") || lastMessage.includes("developer")) {
        return {
          reply: "Based on your request for a Java developer, I recommend technical skills tests and cognitive ability screens to ensure high performance.",
          recommendations: [
            {
              name: "Java 8 (Advanced)",
              url: "https://www.shl.com/en/assessments/skills/it-skills/",
              test_type: "K",
              category: "Technical",
              duration: "45 mins",
              skills_measured: "Java Syntax, OOP, Concurrency"
            },
            MOCK_RECOMMENDATIONS[1]
          ],
          end_of_conversation: false
        };
      }

      return {
        reply: "I've analyzed your requirements. Here are the most suitable SHL assessments for this role. Would you like to add a personality component?",
        recommendations: MOCK_RECOMMENDATIONS,
        end_of_conversation: false
      };
    }
  },

  async getHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch {
      return { status: "mock_mode" };
    }
  },

  async getAdminStats() {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch {
      return {
        vector_db: { count: 10, name: "shl_assessments (Mocked)" },
        status: "healthy (mock)",
        model: "gpt-4-turbo-preview"
      };
    }
  }
};
