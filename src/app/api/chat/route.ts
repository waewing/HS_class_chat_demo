import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
apiKey: process.env.GOOGLE_API_KEY as string
});



// System prompt configuration for EmpowerAI Expert
const SYSTEM_PROMPT = ``;




export async function POST(request: NextRequest) {
  const {messages} = await request.json();
   // Build conversation history with system prompt
  const conversationHistory = [
      {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }]
      },
      {
          role: "model",
          parts: [{ text: "Understood. I will follow these guidelines and assist users accordingly." }]
      }
  ];
  // Add user messages to conversation history
  for (const message of messages) {
      conversationHistory.push({
          role: message.role === "user" ? "user" : "model",
          parts: [{ text: message.content }]
      });
  }
  const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationHistory,
      config: {
          maxOutputTokens: 2000,
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
      }
  });
  const responseText = response.text;
  return new Response(responseText, {
      status: 200,
      headers: {
          'Content-Type': 'text/plain'
      }
  });
}


