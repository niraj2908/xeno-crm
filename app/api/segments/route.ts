import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const segments = await prisma.segment.findMany({
    include: { members: true, campaigns: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(segments.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    memberCount: s.members.length,
    campaignCount: s.campaigns.length,
    createdAt: s.createdAt,
  })))
}

export async function POST(req: Request) {
  const { name, description, rules, customerIds } = await req.json()

  const segment = await prisma.segment.create({
    data: {
      name,
      description,
      rules,
      members: {
        create: customerIds.map((id: string) => ({ customerId: id })),
      },
    },
  })

  return NextResponse.json(segment)
}
