import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { rules, logic = "AND" } = await req.json()

  const customers = await prisma.customer.findMany({
    include: { orders: true },
  })

  const now = Date.now()

  const matched = customers.filter((c) => {
    const totalSpend = c.orders.reduce((sum, o) => sum + o.amount, 0)
    const orderCount = c.orders.length
    const lastOrder = c.orders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
    const daysSinceLastOrder = lastOrder
      ? Math.floor((now - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 999

    const results = rules.map((rule: any) => {
      const fieldMap: any = { totalSpend, orderCount, daysSinceLastOrder }
      const val = fieldMap[rule.field]
      if (rule.op === "gt") return val > rule.value
      if (rule.op === "lt") return val < rule.value
      if (rule.op === "gte") return val >= rule.value
      if (rule.op === "lte") return val <= rule.value
      if (rule.op === "eq") return val === rule.value
      return false
    })

    return logic === "AND" ? results.every(Boolean) : results.some(Boolean)
  })

  return NextResponse.json({
    count: matched.length,
    customers: matched.slice(0, 10).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      totalSpend: c.orders.reduce((sum, o) => sum + o.amount, 0),
      orderCount: c.orders.length,
      daysSinceLastOrder: (() => {
        const last = c.orders.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
        return last ? Math.floor((now - new Date(last.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 999
      })(),
    })),
    allIds: matched.map((c) => c.id),
  })
}
