import { create } from 'zustand';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Recommendation {
  name: string;
  url: string;
  test_type: string;
  category?: string;
  duration?: string;
  skills_measured?: string;
}

interface ChatState {
  messages: Message[];
  recommendations: Recommendation[];
  isLoading: boolean;
  endOfConversation: boolean;
  addMessage: (message: Message) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setLoading: (loading: boolean) => void;
  setEndOfConversation: (ended: boolean) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      role: 'assistant',
      content: "Hello! I'm your SHL Assessment Consultant. I can help you find the right tests for your hiring needs. What role are you hiring for today?"
    }
  ],
  recommendations: [],
  isLoading: false,
  endOfConversation: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setRecommendations: (recs) => set({ recommendations: recs }),
  setLoading: (loading) => set({ isLoading: loading }),
  setEndOfConversation: (ended) => set({ endOfConversation: ended }),
  resetChat: () => set({
    messages: [
      {
        role: 'assistant',
        content: "Hello! I'm your SHL Assessment Consultant. I can help you find the right tests for your hiring needs. What role are you hiring for today?"
      }
    ],
    recommendations: [],
    isLoading: false,
    endOfConversation: false
  }),
}));
