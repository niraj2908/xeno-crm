import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Papa from "papaparse"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const text = await file.text()
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })

  let imported = 0
  for (const row of data as any[]) {
    try {
      await prisma.customer.upsert({
        where: { email: row.email },
        update: {},
        create: {
          name: row.name || "Unknown",
          email: row.email,
          phone: row.phone || null,
        },
      })
      imported++
    } catch {}
  }

  return NextResponse.json({ message: `Successfully imported ${imported} customers!` })
}
