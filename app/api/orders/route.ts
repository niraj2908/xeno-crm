import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: { select: { name: true } } },
  })
  return NextResponse.json(orders.map((o) => ({
    id: o.id,
    customerName: o.customer.name,
    amount: o.amount,
    createdAt: o.createdAt,
  })))
}
