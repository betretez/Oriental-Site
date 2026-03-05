import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages } from 'ai'; // 1. Import this helper

const model = anthropic('claude-3-haiku-20240307');


// --- KNOWLEDGE BASE UPGRADE ---
const ORIENTAL_ORTHODOX_KNOWLEDGE = `
[... Your existing history and Christology text here ...]

## Modern Ecumenical Dialogue (20th-21st Century)
- Since 1964, unofficial and official dialogues (Aarhus, Bristol, Chambésy) have concluded that the 451 AD split was primarily due to terminology and politics, not a difference in essential faith.
- We recognize Eastern Orthodox, Catholic, and many Anglican/Protestant bodies as fellow Christians, though full sacramental communion remains a goal.
- Avoid polemical "heresy" labels; focus on the "Agreed Statements" which affirm we both believe Christ is fully God and fully Man.
`;

const SYSTEM_PROMPT = `You are an Oriental Orthodox Christian theological expert.
Guidelines:
1. Be warm, pastoral, and academically rigorous.
2. If asked about controversial history, emphasize the modern "Agreed Statements."
3. Use Scripture and Church Fathers (Athanasius, Cyril, Severus) to back up claims.
4. When explaining Miaphysitism, use the analogy of the "Iron and the Fire" (the iron is permeated by fire but remains iron; the fire permeates the iron but remains fire).

KNOWLEDGE BASE:
${ORIENTAL_ORTHODOX_KNOWLEDGE}`;

// src/app/api/chat/route.ts

export async function POST(req: Request) {
  try {
    // 1. Destructure messages from the request
    const { messages } = await req.json();

    // 2. SAFETY CHECK: If messages is undefined or not an array, 
    // provide an empty array so .filter() doesn't crash inside the SDK.
    const safeMessages = Array.isArray(messages) ? messages : [];

    const result = streamText({
      model,
      // System prompt belongs here, not inside the messages array
      system: SYSTEM_PROMPT,
      // convertToModelMessages is synchronous and expects only UI messages
      messages: await convertToModelMessages(safeMessages),
      temperature: 0.2,
      maxTokens: 2000,
    });

    // 4. Use the correct UI stream response
    return result.toUIMessageStreamResponse();
    
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error) 
    }), { status: 500 });
  }
}