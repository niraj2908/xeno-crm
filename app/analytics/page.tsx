"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Sparkles, Loader2, TrendingUp } from "lucide-react"

interface CampaignStat {
  id: string
  name: string
  segment: string
  sent: number
  delivered: number
  read: number
  clicked: number
  deliveryRate: number
  readRate: number
  clickRate: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<CampaignStat[]>([])
  const [loading, setLoading] = useState(true)
  const [insight, setInsight] = useState("")
  const [loadingInsight, setLoadingInsight] = useState(false)

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
  }, [])

  const handleGetInsight = async () => {
    setLoadingInsight(true)
    const res = await fetch("/api/ai/campaign-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaigns: stats }),
    })
    const data = await res.json()
    setInsight(data.insight || "")
    setLoadingInsight(false)
  }

  const chartData = stats.map((s) => ({
    name: s.name.length > 15 ? s.name.slice(0, 15) + "..." : s.name,
    "Delivery %": s.deliveryRate,
    "Read %": s.readRate,
    "Click %": s.clickRate,
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e5e1e4]">Analytics</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">Campaign performance overview</p>
        </div>
        <button onClick={handleGetInsight} disabled={loadingInsight || stats.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white text-xs font-semibold rounded-lg hover:brightness-110 disabled:opacity-40 transition-all">
          {loadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loadingInsight ? "Analyzing..." : "Get AI Insight"}
        </button>
      </div>

      {insight && (
        <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl p-4 flex gap-3">
          <TrendingUp className="w-4 h-4 text-[#8B5CF6] mt-0.5 shrink-0" />
          <p className="text-xs text-[#e5e1e4] leading-relaxed">{insight}</p>
        </div>
      )}

      {loading ? (
        <div className="h-64 bg-[#0C0C0E] border border-[#27272A] rounded-xl animate-pulse" />
      ) : stats.length === 0 ? (
        <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-12 text-center">
          <p className="text-sm text-[#e5e1e4] font-medium mb-1">No campaign data yet</p>
          <p className="text-xs text-[#A1A1AA]">Launch a campaign to see analytics here</p>
        </div>
      ) : (
        <>
          <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#e5e1e4] mb-4">Campaign Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#201f22", borderColor: "#27272A", borderRadius: "6px" }} labelStyle={{ color: "#e5e1e4", fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#A1A1AA" }} />
                  <Bar dataKey="Delivery %" fill="#c0c1ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Read %" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Click %" fill="#a6d38a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] text-[#A1A1AA] text-[10px] uppercase font-mono tracking-wider">
                  <th className="px-5 py-3">Campaign</th>
                  <th className="px-5 py-3">Segment</th>
                  <th className="px-5 py-3 text-right">Sent</th>
                  <th className="px-5 py-3 text-right">Delivery %</th>
                  <th className="px-5 py-3 text-right">Read %</th>
                  <th className="px-5 py-3 text-right">Click %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/50">
                {stats.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors text-[#e5e1e4]">
                    <td className="px-5 py-3 font-medium">{s.name}</td>
                    <td className="px-5 py-3 text-[#A1A1AA]">{s.segment}</td>
                    <td className="px-5 py-3 text-right font-mono">{s.sent}</td>
                    <td className="px-5 py-3 text-right font-mono text-[#c0c1ff]">{s.deliveryRate}%</td>
                    <td className="px-5 py-3 text-right font-mono text-[#8B5CF6]">{s.readRate}%</td>
                    <td className="px-5 py-3 text-right font-mono text-[#a6d38a]">{s.clickRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
