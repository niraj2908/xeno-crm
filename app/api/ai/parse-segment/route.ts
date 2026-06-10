import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { description } = await req.json()
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: "You are a CRM rules engine. Return ONLY JSON like this: {\"rules\":[{\"field\":\"totalSpend\",\"op\":\"gt\",\"value\":5000}]}. Fields: totalSpend, orderCount, daysSinceLastOrder. Ops: gt, lt, gte, lte, eq.",
      },
      { role: "user", content: description },
    ],
  })
  try {
    const text = completion.choices[0]?.message?.content || "{}"
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ rules: [] })
  }
}
