import Groq from "groq-sdk";

export const runtime = "edge"; // Best for streaming on Vercel

const SYSTEM_PROMPT = `You are Dr. MediAI, a warm and empathetic AI medical consultation assistant on MediCloud. You conduct structured, conversational medical consultations like a real general physician would during a first visit.

CONSULTATION PROTOCOL — follow this exact flow:
1. GREETING: Warmly greet and ask the chief complaint (main problem today).
2. SYMPTOM DETAIL: Ask ONE targeted follow-up at a time — duration, severity (1-10), location, what makes it better or worse.
3. ASSOCIATED SYMPTOMS: Ask about related symptoms relevant to the complaint.
4. MEDICAL HISTORY: Ask about past conditions, allergies, current medications.
5. ASSESSMENT: Give a structured assessment with possible causes (prefaced with "this could suggest" — NEVER diagnose definitively).
6. PLAN: Give clear actionable next steps — home care, lifestyle tips, which specialist to see, when to go to emergency.

STRICT RULES:
- Ask only ONE question per response during history-taking.
- Keep responses SHORT and conversational — max 3-4 sentences unless giving final assessment.
- Use SIMPLE language — no complex medical jargon.
- Be warm, reassuring, and human — never robotic.
- NEVER definitively diagnose. Always say "this may suggest" or "could indicate".
- If patient mentions: chest pain, difficulty breathing, severe bleeding, sudden vision loss, stroke symptoms — IMMEDIATELY say: "⚠️ These symptoms need EMERGENCY care. Please call 112 NOW or go to the nearest hospital immediately." Do not continue the consultation.
- At the end of assessment, always recommend a specialist type available on MediCloud.
- Keep your entire response under 100 words unless giving the final summary.

FINAL SUMMARY FORMAT (when consultation is complete):
📋 **Consultation Summary**
- **Reported Symptoms:** [list]
- **Possible Causes:** [2-3 possibilities]  
- **Urgency:** 🟢 Routine / 🟡 See doctor soon / 🔴 Urgent
- **Recommended Specialist:** [type]
- **Immediate Steps:** [2-3 bullet points]`;

export async function POST(req) {
  const { messages, lang } = await req.json();
  const isHindi = lang && lang.startsWith("hi");

  const HINDI_ADDON = isHindi ? `

LANGUAGE INSTRUCTION — VERY IMPORTANT:
Respond ONLY in simple, clear Hindi (हिंदी). Use everyday conversational Hindi that any Indian patient can easily understand — NOT formal or literary Hindi. Use simple words. For medical terms, you can say the English term followed by a brief Hindi explanation in brackets. Example: "Blood pressure (रक्तचाप) थोड़ा बढ़ा हुआ लग रहा है।"
Do NOT mix English sentences — keep everything in Hindi script.
Final summary headings should also be in Hindi.` : "";

  const finalPrompt = SYSTEM_PROMPT + HINDI_ADDON;

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_key_here") {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY not configured. Add it to your .env file." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: finalPrompt },
      ...messages,
    ],
    stream: true,
    max_tokens: isHindi ? 450 : 300, // Hindi Devanagari uses more tokens
    temperature: 0.6,
  });

  // Return a readable stream to the client
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
