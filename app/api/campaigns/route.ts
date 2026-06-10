import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: { segment: { select: { name: true, members: true } } },
  })
  return NextResponse.json(campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    message: c.message,
    status: c.status,
    stats: c.stats,
    segmentName: c.segment.name,
    audienceSize: c.segment.members.length,
    createdAt: c.createdAt,
  })))
}

export async function POST(req: Request) {
  const { name, segmentId, message } = await req.json()
  const segment = await prisma.segment.findUnique({
    where: { id: segmentId },
    include: { members: true },
  })
  const audienceSize = segment?.members.length || 0
  const stats = {
    sent: audienceSize,
    delivered: Math.floor(audienceSize * 0.95),
    read: Math.floor(audienceSize * 0.72),
    clicked: Math.floor(audienceSize * 0.34),
  }
  const campaign = await prisma.campaign.create({
    data: { name, segmentId, message, status: "active", stats },
  })
  return NextResponse.json(campaign)
}
