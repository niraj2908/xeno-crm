"use client"

import { useEffect, useState } from "react"
import { Sparkles, Loader2, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface Segment {
  id: string
  name: string
  memberCount: number
}

export default function NewCampaignPage() {
  const router = useRouter()
  const [segments, setSegments] = useState<Segment[]>([])
  const [name, setName] = useState("")
  const [segmentId, setSegmentId] = useState("")
  const [goal, setGoal] = useState("")
  const [message, setMessage] = useState("")
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/segments")
      .then((r) => r.json())
      .then(setSegments)
  }, [])

  const handleGenerate = async () => {
    if (!goal.trim()) return
    setGenerating(true)
    const res = await fetch("/api/ai/draft-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: goal }),
    })
    const data = await res.json()
    setMessage(data.draft || "")
    setGenerating(false)
  }

  const handleLaunch = async () => {
    if (!name || !segmentId || !message) return
    setSaving(true)
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, segmentId, message }),
    })
    setSaving(false)
    router.push("/campaigns")
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#e5e1e4]">New Campaign</h1>
        <p className="text-xs text-[#A1A1AA] mt-1">AI-generated WhatsApp campaign</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Campaign Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Win-back Campaign"
            className="w-full bg-[#0C0C0E] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c0c1ff] transition-all" />
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Target Segment</label>
          <select value={segmentId} onChange={(e) => setSegmentId(e.target.value)}
            className="w-full bg-[#0C0C0E] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#c0c1ff] transition-all">
            <option value="">Select a segment...</option>
            {segments.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.memberCount} customers)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Campaign Goal</label>
          <div className="flex gap-2">
            <input value={goal} onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Win back inactive customers with 20% discount"
              className="flex-1 bg-[#0C0C0E] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c0c1ff] transition-all" />
            <button onClick={handleGenerate} disabled={generating || !goal.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#8B5CF6] text-white text-xs font-semibold rounded-lg hover:brightness-110 disabled:opacity-40 transition-all">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {message && (
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider block">AI Generated WhatsApp Message</label>
            <div className="bg-[#131315] border border-[#8B5CF6]/30 rounded-xl p-4">
              <div className="bg-[#1a1a2e] rounded-lg p-3 max-w-xs">
                <p className="text-[11px] text-[#e5e1e4] leading-relaxed">{message}</p>
                <p className="text-[9px] text-[#A1A1AA] mt-1 text-right">✓✓ Delivered</p>
              </div>
            </div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#0C0C0E] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#c0c1ff] transition-all resize-none min-h-[80px]" />
          </div>
        )}

        <button onClick={handleLaunch} disabled={saving || !name || !segmentId || !message}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#c0c1ff] text-[#1000a9] text-xs font-semibold rounded-lg hover:brightness-110 disabled:opacity-40 transition-all">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {saving ? "Launching..." : "Launch Campaign"}
        </button>
      </div>
    </div>
  )
}
