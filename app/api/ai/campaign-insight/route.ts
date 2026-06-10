import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const { campaigns } = await req.json()
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content: "You are a CRM analyst. Given campaign stats, write one sharp insight in under 2 sentences. Be specific with numbers. No fluff.",
        },
        {
          role: "user",
          content: `Campaign data: ${JSON.stringify(campaigns)}. Give me one key insight.`,
        },
      ],
    })
    const insight = completion.choices[0]?.message?.content || ""
    return NextResponse.json({ insight })
  } catch (error) {
  console.error(error)

  return NextResponse.json({
    insight: "Unable to generate AI insight right now."
  })
}
}
