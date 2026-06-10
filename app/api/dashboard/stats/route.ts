import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [customers, orders, campaigns] = await Promise.all([
      prisma.customer.count(),
      prisma.order.findMany({ select: { amount: true, createdAt: true } }),
      prisma.campaign.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { segment: { select: { name: true } } },
      }),
    ])

    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0)
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
    const activeCampaigns = await prisma.campaign.count({ where: { status: "active" } })

    const now = new Date()
    const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const month = d.toLocaleString("en-IN", { month: "short" })
      const revenue = orders
        .filter((o) => {
          const od = new Date(o.createdAt)
          return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth()
        })
        .reduce((sum, o) => sum + o.amount, 0)
      return { month, revenue }
    })

    const recentCampaigns = campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      segmentName: c.segment.name,
      createdAt: c.createdAt,
    }))

    return NextResponse.json({ totalCustomers: customers, totalRevenue, activeCampaigns, avgOrderValue, revenueByMonth, recentCampaigns })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
