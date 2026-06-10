"use client"

import { useEffect, useState } from "react"
import { Megaphone, Plus, Users, BarChart2 } from "lucide-react"
import Link from "next/link"

interface Campaign {
  id: string
  name: string
  message: string
  status: string
  segmentName: string
  audienceSize: number
  stats: { sent: number; delivered: number; read: number; clicked: number } | null
  createdAt: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((data) => { setCampaigns(data); setLoading(false) })
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e5e1e4]">Campaigns</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">{campaigns.length} total campaigns</p>
        </div>
        <Link href="/campaigns/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#c0c1ff] text-[#1000a9] text-xs font-semibold rounded-lg hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-[#0C0C0E] border border-[#27272A] rounded-xl animate-pulse" />)}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-12 text-center">
          <Megaphone className="w-8 h-8 text-[#A1A1AA] mx-auto mb-3" />
          <p className="text-sm text-[#e5e1e4] font-medium mb-1">No campaigns yet</p>
          <p className="text-xs text-[#A1A1AA] mb-4">Create your first AI-powered campaign</p>
          <Link href="/campaigns/new" className="text-xs text-[#c0c1ff] hover:underline">Create Campaign →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5 hover:border-[#c0c1ff]/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#c0c1ff]/10 rounded-lg">
                    <Megaphone className="w-4 h-4 text-[#c0c1ff]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#e5e1e4]">{c.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Users className="w-3 h-3 text-[#A1A1AA]" />
                      <span className="text-[11px] text-[#A1A1AA]">{c.segmentName} · {c.audienceSize} customers</span>
                    </div>
                  </div>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                  c.status === "active"
                    ? "bg-[#2a5016]/20 text-[#a6d38a] border-[#2a5016]/50"
                    : "bg-[#201f22] text-[#A1A1AA] border-[#27272A]"
                }`}>
                  {c.status}
                </span>
              </div>

              <p className="text-[11px] text-[#A1A1AA] mb-4 bg-[#131315] px-3 py-2 rounded-lg border border-[#27272A]">
                {c.message}
              </p>

              {c.stats && (
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Sent", value: c.stats.sent, color: "text-[#e5e1e4]" },
                    { label: "Delivered", value: c.stats.delivered, color: "text-[#c0c1ff]" },
                    { label: "Read", value: c.stats.read, color: "text-[#8B5CF6]" },
                    { label: "Clicked", value: c.stats.clicked, color: "text-[#a6d38a]" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#131315] border border-[#27272A] rounded-lg p-3 text-center">
                      <div className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</div>
                      <div className="text-[10px] text-[#A1A1AA] mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
