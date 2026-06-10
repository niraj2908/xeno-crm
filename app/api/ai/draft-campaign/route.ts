import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `You are a WhatsApp marketing expert for an Indian e-commerce brand. 
Write a conversational, friendly WhatsApp message under 160 characters. 
Use 1-2 relevant emojis. Include a clear call to action. 
Write in a warm personal tone. Return only the message text, nothing else.`,
        },
        { role: "user", content: prompt },
      ],
    })
    const draft = completion.choices[0]?.message?.content || ""
    return NextResponse.json({ draft })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 })
  }
}
