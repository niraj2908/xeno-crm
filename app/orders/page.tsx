"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, Upload, Loader2 } from "lucide-react"

interface Order {
  id: string
  customerName: string
  amount: number
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false) })
  }

  useEffect(() => { fetchOrders() }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/orders/import", { method: "POST", body: formData })
    const data = await res.json()
    setMessage(data.message || "Import complete")
    fetchOrders()
    setUploading(false)
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e5e1e4]">Orders</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">{orders.length} total orders</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-[#c0c1ff] text-[#1000a9] text-xs font-semibold rounded-lg hover:brightness-110 transition-all cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{uploading ? "Importing..." : "Import CSV"}</span>
          <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {message && (
        <div className="bg-[#a6d38a]/10 border border-[#a6d38a]/30 text-[#a6d38a] text-xs px-4 py-2 rounded-lg">
          {message}
        </div>
      )}

      <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#A1A1AA] text-xs">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
            <p className="text-xs text-[#A1A1AA]">No orders yet. Import a CSV to get started.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#27272A] text-[#A1A1AA] text-[10px] uppercase font-mono tracking-wider">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors text-[#e5e1e4]">
                  <td className="px-5 py-3 font-medium">{o.customerName}</td>
                  <td className="px-5 py-3 text-right font-mono text-[#a6d38a]">{formatCurrency(o.amount)}</td>
                  <td className="px-5 py-3 text-right text-[#A1A1AA]">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
