import { GoogleGenAI, Type } from '@google/genai';
import { AIAnalysis } from '../types.ts';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { 
      type: Type.STRING, 
      description: "A concise 2-3 sentence summary of the stock's current market position and recent performance." 
    },
    sentiment: { 
      type: Type.STRING, 
      description: "Overall market sentiment for this stock. Must be exactly one of: BULLISH, BEARISH, or NEUTRAL." 
    },
    keyDrivers: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 key factors or recent news items driving the stock price right now."
    },
    support: { 
      type: Type.NUMBER, 
      description: "Estimated technical support level price based on recent trends." 
    },
    resistance: { 
      type: Type.NUMBER, 
      description: "Estimated technical resistance level price based on recent trends." 
    }
  },
  required: ["summary", "sentiment", "keyDrivers", "support", "resistance"]
};

export async function getStockAnalysis(ticker: string, currentPrice: number, recentHistory: string): Promise<AIAnalysis> {
  // Guard Rail 1: Input Validation
  if (!ticker || typeof ticker !== 'string' || ticker.trim() === '') {
    throw new Error("Invalid ticker symbol provided.");
  }
  if (typeof currentPrice !== 'number' || isNaN(currentPrice) || currentPrice <= 0) {
    throw new Error("Invalid current price provided.");
  }
  if (!recentHistory || typeof recentHistory !== 'string') {
    throw new Error("Invalid price history provided.");
  }

  const prompt = `
    Act as an expert financial analyst. Provide a daily technical and fundamental analysis for the stock ticker: ${ticker}.
    
    Current Price: $${currentPrice}
    Recent 30-day price history summary: ${recentHistory}
    
    Based on this data and your general knowledge of the market conditions for this company, provide a structured analysis.
  `;

  try {
    // Guard Rail 2: Implement a timeout race condition to prevent hanging requests
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Analysis request timed out. Please try again.")), 15000); // 15 second timeout
    });

    const fetchPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.text) {
      throw new Error("Received empty response from AI model.");
    }

    const jsonStr = response.text.trim();
    const analysis: AIAnalysis = JSON.parse(jsonStr);
    
    // Guard Rail 3: Strict Enum Validation
    if (!['BULLISH', 'BEARISH', 'NEUTRAL'].includes(analysis.sentiment)) {
      console.warn(`Invalid sentiment received: ${analysis.sentiment}. Defaulting to NEUTRAL.`);
      analysis.sentiment = 'NEUTRAL';
    }
    
    // Guard Rail 4: Ensure numbers are actually numbers
    analysis.support = Number(analysis.support) || currentPrice * 0.9;
    analysis.resistance = Number(analysis.resistance) || currentPrice * 1.1;
    
    return analysis;
  } catch (error: any) {
    console.error("Error fetching Gemini analysis:", error);
    // Provide user-friendly error messages
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response. The model returned invalid data.");
    }
    throw new Error(error.message || "Failed to generate AI analysis. Please try again.");
  }
}
