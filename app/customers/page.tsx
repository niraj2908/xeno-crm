"use client"

import { useEffect, useState } from "react"
import { Users, Search, Upload, Loader2 } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  totalSpend: number
  orderCount: number
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const fetchCustomers = () => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data) => { setCustomers(data); setLoading(false) })
  }

  useEffect(() => { fetchCustomers() }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/customers/import", { method: "POST", body: formData })
    const data = await res.json()
    setMessage(data.message || "Import complete")
    fetchCustomers()
    setUploading(false)
  }

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e5e1e4]">Customers</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">{customers.length} total customers</p>
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0C0C0E] border border-[#27272A] rounded-lg pl-9 pr-4 py-2.5 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c0c1ff] transition-all"
        />
      </div>

      <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#A1A1AA] text-xs">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
            <p className="text-xs text-[#A1A1AA]">No customers found. Import a CSV to get started.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#27272A] text-[#A1A1AA] text-[10px] uppercase font-mono tracking-wider">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3 text-right">Orders</th>
                <th className="px-5 py-3 text-right">Total Spend</th>
                <th className="px-5 py-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors text-[#e5e1e4]">
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-[#A1A1AA]">{c.email}</td>
                  <td className="px-5 py-3 text-[#A1A1AA]">{c.phone || "—"}</td>
                  <td className="px-5 py-3 text-right font-mono">{c.orderCount}</td>
                  <td className="px-5 py-3 text-right font-mono text-[#a6d38a]">{formatCurrency(c.totalSpend)}</td>
                  <td className="px-5 py-3 text-right text-[#A1A1AA]">{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
