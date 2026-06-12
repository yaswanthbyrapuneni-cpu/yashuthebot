// Chatbot API Service for Alankara AI Customer Support

const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || 'https://chatbot.alankaraai.com';
const CHATBOT_TIMEOUT = parseInt(import.meta.env.VITE_CHATBOT_TIMEOUT || '30000');

// Types based on API documentation
export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  response: string;
  enhanced_queries: string[];
  search_results_count: number;
  processing_time: number;
  timestamp: string;
}

export interface ChatbotError {
  error: string;
  details?: string;
}

/**
 * Send a message to the Alankara AI User Manual Chatbot
 * @param message - User's question or message
 * @returns Chatbot response with answer and metadata
 */
export async function sendChatMessage(message: string): Promise<ChatbotResponse> {
  if (!message || message.trim().length === 0) {
    throw new Error('Message cannot be empty');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHATBOT_TIMEOUT);

  try {
    const response = await fetch(`${CHATBOT_API_URL}/user-chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message.trim() }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data: ChatbotResponse = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw error;
    }
    throw new Error('Failed to connect to chatbot service');
  }
}

/**
 * Check chatbot service health
 * @returns Health status object
 */
export async function checkChatbotHealth(): Promise<any> {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/health`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Chatbot health check failed:', error);
    return { status: 'unhealthy' };
  }
}