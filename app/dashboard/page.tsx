"use client"

import { useEffect, useState } from "react"
import { Users, CheckCircle, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight, Sparkles, Send, Copy, ArrowRight, Loader2, Megaphone, Check } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Stats {
  totalCustomers: number
  totalRevenue: number
  activeCampaigns: number
  avgOrderValue: number
  revenueByMonth: { month: string; revenue: number }[]
  recentCampaigns: { id: string; name: string; status: string; segmentName: string; createdAt: string }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleGenerateCampaign = async () => {
    if (!aiPrompt.trim()) return
    setIsAiLoading(true)
    setAiResponse("")
    try {
      const res = await fetch("/api/ai/draft-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await res.json()
      setAiResponse(data.draft || "No response received.")
    } catch {
      setAiResponse("Could not reach AI. Please check your OpenAI key.")
    } finally {
      setIsAiLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResponse)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  const statCards = stats ? [
    { label: "Total Customers", value: stats.totalCustomers.toLocaleString(), icon: Users, change: "+12.0%", up: true, color: "text-[#c0c1ff]", hover: "hover:border-[#c0c1ff]/30" },
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: DollarSign, change: "+18.7%", up: true, color: "text-[#c0c1ff]", hover: "hover:border-[#c0c1ff]/30" },
    { label: "Active Campaigns", value: stats.activeCampaigns.toString(), icon: CheckCircle, change: "+5.4%", up: true, color: "text-[#a6d38a]", hover: "hover:border-[#a6d38a]/30" },
    { label: "Avg Order Value", value: formatCurrency(stats.avgOrderValue), icon: AlertTriangle, change: "-2.1%", up: false, color: "text-red-400", hover: "hover:border-red-500/20" },
  ] : []

  return (
    <div className="space-y-6 p-6">
      <section className="bg-[#0C0C0E] border border-[#27272A] p-6 rounded-xl relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6]/10 via-[#c0c1ff]/10 to-[#8B5CF6]/10 rounded-xl blur-xl opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#8B5CF6]/15 border border-[#8B5CF6]/35 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider text-[#c0c1ff] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>AI-driven Engine Active</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#e5e1e4]">AI Customer Engagement CRM</h2>
            <p className="text-xs text-[#A1A1AA] max-w-2xl leading-relaxed">
              Segment customers with natural language, generate WhatsApp campaigns with AI, and track performance in real-time.
            </p>
          </div>
          <div className="flex gap-2.5">
            <a href="/segments" className="px-4 py-2 bg-[#c0c1ff] text-[#1000a9] text-xs font-semibold rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Segment</span>
            </a>
            <a href="/analytics" className="px-4 py-2 bg-[#201f22] text-[#e5e1e4] border border-[#27272A] text-xs font-semibold rounded-lg hover:bg-[#2a2a2c] transition-all">
              View Analytics
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-[#0C0C0E] border border-[#27272A] p-5 rounded-xl animate-pulse h-28" />
        )) : statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`bg-[#0C0C0E] border border-[#27272A] p-5 rounded-xl transition-all ${card.hover}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1AA]">{card.label}</span>
                <div className="p-1.5 rounded-lg bg-[#201f22]">
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#e5e1e4]">{card.value}</h3>
              <div className={`flex items-center gap-1 mt-1 text-[11px] font-mono ${card.up ? "text-[#a6d38a]" : "text-red-400"}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{card.change}</span>
                <span className="text-[#A1A1AA]/50 text-[10px] ml-1">vs last mo</span>
              </div>
            </div>
          )
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0C0C0E] border border-[#27272A] p-5 rounded-xl">
          <h4 className="text-sm font-semibold text-[#e5e1e4] mb-1">Revenue Trend</h4>
          <p className="text-[11px] text-[#A1A1AA] mb-4">Monthly revenue over time</p>
          <div className="h-48 w-full">
            {loading ? <div className="h-full bg-[#201f22] rounded animate-pulse" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.revenueByMonth || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#201f22", borderColor: "#27272A", borderRadius: "6px" }} labelStyle={{ color: "#e5e1e4", fontSize: 11 }} itemStyle={{ color: "#c0c1ff", fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#c0c1ff" strokeWidth={2} fillOpacity={1} fill="url(#gradientRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-[#0C0C0E] border border-[#27272A] p-5 rounded-xl">
          <h4 className="text-sm font-semibold text-[#e5e1e4] mb-1">Channel Performance</h4>
          <p className="text-[11px] text-[#A1A1AA] mb-4">ROI by channel</p>
          <div className="space-y-3">
            {[
              { channel: "WhatsApp", pct: 92, color: "bg-[#a6d38a]" },
              { channel: "Email", pct: 78, color: "bg-[#c0c1ff]" },
              { channel: "Push", pct: 61, color: "bg-[#8B5CF6]" },
              { channel: "SMS", pct: 45, color: "bg-[#577e7b]" },
            ].map((c) => (
              <div key={c.channel} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#e5e1e4]">{c.channel}</span>
                  <span className="font-mono text-[#c7c4d7]">{c.pct}%</span>
                </div>
                <div className="h-2 w-full bg-[#1c1b1d] rounded-full overflow-hidden border border-[#27272A]">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-6">
        <div className="xl:col-span-8 bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-[#e5e1e4]">Recent Campaigns</h4>
            <a href="/campaigns" className="text-[10px] font-mono text-[#c0c1ff] hover:underline">View All</a>
          </div>
          {loading ? (
            <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-10 bg-[#201f22] rounded animate-pulse" />)}</div>
          ) : (stats?.recentCampaigns?.length ?? 0) === 0 ? (
            <div className="text-center py-10 text-[#A1A1AA] text-xs">
              No campaigns yet. <a href="/campaigns/new" className="text-[#c0c1ff] hover:underline">Create your first one →</a>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#27272A] text-[#A1A1AA] text-[10px] uppercase font-mono tracking-wider">
                  <th className="pb-3 pt-1">Campaign</th>
                  <th className="pb-3 pt-1">Segment</th>
                  <th className="pb-3 pt-1 text-center">Status</th>
                  <th className="pb-3 pt-1 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/50 text-[#e5e1e4]">
                {stats?.recentCampaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-medium flex items-center gap-2"><Megaphone className="w-3.5 h-3.5 text-[#c0c1ff]" />{c.name}</td>
                    <td className="py-3 text-[#A1A1AA]">{c.segmentName}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono border ${c.status === "active" ? "bg-[#2a5016]/20 text-[#a6d38a] border-[#2a5016]/50" : c.status === "draft" ? "bg-[#201f22] text-[#A1A1AA] border-[#27272A]" : "bg-[#c0c1ff]/10 text-[#c0c1ff] border-[#c0c1ff]/30"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-[#A1A1AA]">{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="xl:col-span-4 bg-[#0C0C0E] border border-dashed border-[#8B5CF6]/40 p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B5CF6]/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <h5 className="text-xs font-semibold text-[#e5e1e4]">AI Campaign Assistant</h5>
          </div>
          <p className="text-[11px] text-[#A1A1AA] leading-relaxed">Describe your campaign goal and get an AI-generated WhatsApp message instantly.</p>
          <div className="relative">
            <textarea
              className="w-full bg-[#131315] border border-[#27272A] rounded-lg p-3 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/45 focus:outline-none focus:border-[#8B5CF6] resize-none min-h-[72px]"
              placeholder="e.g. Win back inactive customers with a 20% discount"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <button onClick={handleGenerateCampaign} disabled={isAiLoading || !aiPrompt.trim()}
              className="absolute bottom-2 right-2 p-1.5 rounded-md bg-[#8B5CF6] hover:brightness-110 disabled:opacity-40 transition-all">
              {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Send className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Win back inactive users", "Promote flash sale", "Upsell premium tier"].map((txt) => (
              <button key={txt} onClick={() => setAiPrompt(txt)}
                className="text-[9px] text-[#A1A1AA] bg-[#201f22]/50 border border-[#27272A] px-2 py-0.5 rounded-full hover:text-[#e5e1e4] transition-colors">
                {txt}
              </button>
            ))}
          </div>
          {aiResponse && (
            <div className="p-3 bg-[#131315] border border-[#27272A] rounded-lg relative group">
              <button onClick={copyToClipboard} className="absolute top-2 right-2 p-1 rounded bg-[#201f22] text-[#A1A1AA] hover:text-[#e5e1e4]">
                {isCopied ? <Check className="w-3 h-3 text-[#a6d38a]" /> : <Copy className="w-3 h-3" />}
              </button>
              <div className="text-[10px] text-[#c7c4d7] overflow-y-auto max-h-40 whitespace-pre-wrap leading-relaxed pr-6">{aiResponse}</div>
              <div className="mt-3 flex justify-end">
                <a href="/campaigns/new" className="inline-flex items-center gap-1 text-[9px] bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 text-[#c0c1ff] hover:bg-[#8B5CF6]/20 px-2 py-1 rounded font-semibold">
                  <span>Build campaign with this</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
