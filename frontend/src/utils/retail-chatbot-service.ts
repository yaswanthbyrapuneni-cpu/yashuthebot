// Retail Analytics Chatbot API Service for Admin Dashboard

const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || 'http://34.180.18.130:8000';

// Types based on API documentation
export interface RetailChatbotRequest {
  question: string;
  include_sql?: boolean;
  include_raw_data?: boolean;
}

export interface RetailChatbotResponse {
  success: boolean;
  answer: string;
  details: string;
  tables: string[];
  sql: string;
  rows: any[] | null;
  error: string | null;
  processing_time: number;
  timestamp: string;
}

export interface RetailChatbotError {
  error: string;
  details?: string;
}

/**
 * Send an analytics question to the Retail Analytics Chatbot
 * @param question - Admin's analytics question
 * @param includeSql - Whether to include SQL in response (default: true)
 * @param includeRawData - Whether to include raw data rows (default: true)
 * @returns Chatbot response with answer, SQL, and data
 */
export async function sendRetailChatMessage(
  question: string,
  includeSql: boolean = true,
  includeRawData: boolean = true
): Promise<RetailChatbotResponse> {
  if (!question || question.trim().length === 0) {
    throw new Error('Question cannot be empty');
  }

  try {
    const response = await fetch(`${CHATBOT_API_URL}/retail-chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        question: question.trim(),
        include_sql: includeSql,
        include_raw_data: includeRawData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data: RetailChatbotResponse = await response.json();
    
    // Check if the API returned an error in the response
    if (!data.success && data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to retail analytics chatbot');
  }
}

/**
 * Check retail chatbot service health and available tables
 * @returns Health status and table information
 */
export async function checkRetailChatbotHealth(): Promise<any> {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/retail-chatbot/status`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Retail chatbot health check failed:', error);
    return { status: 'unhealthy', available_tables: [] };
  }
}