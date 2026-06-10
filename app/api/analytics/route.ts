import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: { segment: { select: { name: true } } },
  })

  const data = campaigns.map((c) => {
    const stats = c.stats as any
    if (!stats) return null
    return {
      id: c.id,
      name: c.name,
      segment: c.segment.name,
      sent: stats.sent || 0,
      delivered: stats.delivered || 0,
      read: stats.read || 0,
      clicked: stats.clicked || 0,
      deliveryRate: stats.sent ? Math.round((stats.delivered / stats.sent) * 100) : 0,
      readRate: stats.sent ? Math.round((stats.read / stats.sent) * 100) : 0,
      clickRate: stats.sent ? Math.round((stats.clicked / stats.sent) * 100) : 0,
    }
  }).filter(Boolean)

  return NextResponse.json(data)
}
