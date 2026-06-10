"use client"

import { useEffect, useState } from "react"
import { Filter, Plus, Sparkles, Loader2, Users, X, Trash2 } from "lucide-react"

interface Segment {
  id: string
  name: string
  description: string
  memberCount: number
  campaignCount: number
  createdAt: string
}

interface Rule {
  field: string
  op: string
  value: string
}

interface PreviewCustomer {
  id: string
  name: string
  email: string
  totalSpend: number
  orderCount: number
  daysSinceLastOrder: number
}

const FIELDS = [
  { value: "totalSpend", label: "Total Spend (₹)" },
  { value: "orderCount", label: "Order Count" },
  { value: "daysSinceLastOrder", label: "Days Since Last Order" },
]

const OPS = [
  { value: "gt", label: "greater than (>)" },
  { value: "lt", label: "less than (<)" },
  { value: "gte", label: "at least (≥)" },
  { value: "lte", label: "at most (≤)" },
  { value: "eq", label: "equals (=)" },
]

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState("")
  const [logic, setLogic] = useState<"AND" | "OR">("AND")
  const [rules, setRules] = useState<Rule[]>([{ field: "totalSpend", op: "gt", value: "" }])
  const [aiText, setAiText] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<{ count: number; customers: PreviewCustomer[]; allIds: string[] } | null>(null)
  const [mode, setMode] = useState<"builder" | "ai">("builder")

  const fetchSegments = () => {
    fetch("/api/segments")
      .then((r) => r.json())
      .then((data) => { setSegments(data); setLoading(false) })
  }

  useEffect(() => { fetchSegments() }, [])

  const addRule = () => setRules([...rules, { field: "totalSpend", op: "gt", value: "" }])
  const removeRule = (i: number) => setRules(rules.filter((_, idx) => idx !== i))
  const updateRule = (i: number, key: keyof Rule, val: string) => {
    const updated = [...rules]
    updated[i] = { ...updated[i], [key]: val }
    setRules(updated)
  }

  const handlePreview = async (rulesToPreview: Rule[]) => {
    setPreviewing(true)
    setPreview(null)
    const res = await fetch("/api/segments/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules: rulesToPreview, logic }),
    })
    const data = await res.json()
    setPreview(data)
    setPreviewing(false)
  }

  const handleAIParse = async () => {
    if (!aiText.trim()) return
    setAiLoading(true)
    const res = await fetch("/api/ai/parse-segment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: aiText }),
    })
    const data = await res.json()
    if (data.rules?.length > 0) {
      setRules(data.rules.map((r: any) => ({ ...r, value: String(r.value) })))
      setMode("builder")
      await handlePreview(data.rules)
    }
    setAiLoading(false)
  }

  const handleSave = async () => {
    if (!name.trim() || !preview) return
    setSaving(true)
    await fetch("/api/segments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: `${logic} logic: ${rules.map(r => `${r.field} ${r.op} ${r.value}`).join(`, ${logic} `)}`,
        rules: rules.map(r => ({ ...r, value: r.value })),
        customerIds: preview.allIds,
      }),
    })
    setSaving(false)
    setShowModal(false)
    resetModal()
    fetchSegments()
  }

  const resetModal = () => {
    setName("")
    setLogic("AND")
    setRules([{ field: "totalSpend", op: "gt", value: "" }])
    setAiText("")
    setPreview(null)
    setMode("builder")
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  const canPreview = rules.every(r => r.value !== "")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e5e1e4]">Segments</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">AI-powered audience segmentation with flexible rule logic</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#c0c1ff] text-[#1000a9] text-xs font-semibold rounded-lg hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" />
          Create Segment
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-[#0C0C0E] border border-[#27272A] rounded-xl animate-pulse" />)}
        </div>
      ) : segments.length === 0 ? (
        <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-12 text-center">
          <Filter className="w-8 h-8 text-[#A1A1AA] mx-auto mb-3" />
          <p className="text-sm text-[#e5e1e4] font-medium mb-1">No segments yet</p>
          <p className="text-xs text-[#A1A1AA]">Create your first AI-powered segment above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {segments.map((s) => (
            <div key={s.id} className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5 hover:border-[#c0c1ff]/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-[#c0c1ff]/10 rounded-lg">
                  <Filter className="w-4 h-4 text-[#c0c1ff]" />
                </div>
                <span className="text-[9px] font-mono text-[#A1A1AA] bg-[#201f22] px-2 py-0.5 rounded-full border border-[#27272A]">
                  {s.campaignCount} campaigns
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#e5e1e4] mb-1">{s.name}</h3>
              <p className="text-[11px] text-[#A1A1AA] mb-3 line-clamp-2">{s.description}</p>
              <div className="flex items-center gap-1 text-[11px] text-[#c0c1ff]">
                <Users className="w-3 h-3" />
                <span>{s.memberCount} customers</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0C0C0E] border border-[#27272A] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#c0c1ff]" />
                <h2 className="text-sm font-semibold text-[#e5e1e4]">Create Segment</h2>
              </div>
              <button onClick={() => { setShowModal(false); resetModal() }} className="text-[#A1A1AA] hover:text-[#e5e1e4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Name */}
              <div>
                <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Segment Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. High Value At-Risk Customers"
                  className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c0c1ff] transition-all" />
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2">
                <button onClick={() => setMode("builder")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === "builder" ? "bg-[#c0c1ff] text-[#1000a9]" : "bg-[#131315] border border-[#27272A] text-[#A1A1AA] hover:text-[#e5e1e4]"}`}>
                  Rule Builder
                </button>
                <button onClick={() => setMode("ai")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === "ai" ? "bg-[#8B5CF6] text-white" : "bg-[#131315] border border-[#27272A] text-[#A1A1AA] hover:text-[#e5e1e4]"}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Natural Language
                </button>
              </div>

              {/* AI Mode */}
              {mode === "ai" && (
                <div className="space-y-3">
                  <textarea value={aiText} onChange={(e) => setAiText(e.target.value)}
                    placeholder="e.g. Customers who spent over ₹10000 but haven't ordered in 90 days"
                    className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#8B5CF6] transition-all resize-none min-h-[80px]" />
                  <div className="flex flex-wrap gap-2">
                    {[
                      "High spenders inactive 90 days",
                      "More than 5 orders total",
                      "Spent under 2000 rupees",
                    ].map((t) => (
                      <button key={t} onClick={() => setAiText(t)}
                        className="text-[9px] text-[#A1A1AA] bg-[#201f22] border border-[#27272A] px-2 py-0.5 rounded-full hover:text-[#e5e1e4] transition-colors">
                        {t}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleAIParse} disabled={aiLoading || !aiText.trim()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#8B5CF6] text-white text-xs font-semibold rounded-lg hover:brightness-110 disabled:opacity-40 transition-all">
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {aiLoading ? "Parsing with AI..." : "Parse with AI → Build Rules"}
                  </button>
                </div>
              )}

              {/* Builder Mode */}
              {mode === "builder" && (
                <div className="space-y-3">
                  {/* AND/OR Toggle */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#A1A1AA]">Match</span>
                    <div className="flex gap-1 bg-[#131315] border border-[#27272A] rounded-lg p-0.5">
                      {(["AND", "OR"] as const).map((l) => (
                        <button key={l} onClick={() => setLogic(l)}
                          className={`px-3 py-1 text-[11px] font-mono font-bold rounded-md transition-all ${logic === l ? "bg-[#c0c1ff] text-[#1000a9]" : "text-[#A1A1AA] hover:text-[#e5e1e4]"}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-[#A1A1AA]">of the following conditions</span>
                  </div>

                  {/* Rules */}
                  <div className="space-y-2">
                    {rules.map((rule, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {i > 0 && (
                          <span className="text-[10px] font-mono font-bold text-[#c0c1ff] w-8 text-center shrink-0">{logic}</span>
                        )}
                        {i === 0 && <div className="w-8 shrink-0" />}

                        <select value={rule.field} onChange={(e) => updateRule(i, "field", e.target.value)}
                          className="flex-1 bg-[#131315] border border-[#27272A] rounded-lg px-2 py-2 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#c0c1ff] transition-all">
                          {FIELDS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>

                        <select value={rule.op} onChange={(e) => updateRule(i, "op", e.target.value)}
                          className="flex-1 bg-[#131315] border border-[#27272A] rounded-lg px-2 py-2 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#c0c1ff] transition-all">
                          {OPS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>

                        <input type="number" value={rule.value} onChange={(e) => updateRule(i, "value", e.target.value)}
                          placeholder="Value"
                          className="w-24 bg-[#131315] border border-[#27272A] rounded-lg px-2 py-2 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c0c1ff] transition-all" />

                        {rules.length > 1 && (
                          <button onClick={() => removeRule(i)} className="text-[#A1A1AA] hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button onClick={addRule}
                    className="text-[11px] text-[#c0c1ff] hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add condition
                  </button>

                  <button onClick={() => handlePreview(rules.map(r => ({ ...r, value: r.value })))}
                    disabled={previewing || !canPreview}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#131315] border border-[#c0c1ff]/50 text-[#c0c1ff] text-xs font-semibold rounded-lg hover:bg-[#c0c1ff]/10 disabled:opacity-40 transition-all">
                    {previewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                    {previewing ? "Finding matches..." : "Preview Matching Customers"}
                  </button>
                </div>
              )}

              {/* Preview Results */}
              {preview && (
                <div className="bg-[#131315] border border-[#a6d38a]/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider">Preview</p>
                    <span className="text-xs font-bold text-[#a6d38a]">{preview.count} customers matched</span>
                  </div>
                  {preview.count === 0 ? (
                    <p className="text-xs text-[#A1A1AA]">No customers match these conditions. Try adjusting your rules.</p>
                  ) : (
                    <div className="space-y-2">
                      {preview.customers.map((c) => (
                        <div key={c.id} className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[#e5e1e4] font-medium">{c.name}</span>
                            <span className="text-[#A1A1AA] ml-2">{c.orderCount} orders · {c.daysSinceLastOrder}d ago</span>
                          </div>
                          <span className="text-[#a6d38a] font-mono">{formatCurrency(c.totalSpend)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {preview && preview.count > 0 && (
                <button onClick={handleSave} disabled={saving || !name.trim()}
                  className="w-full py-2.5 bg-[#c0c1ff] text-[#1000a9] text-xs font-semibold rounded-lg hover:brightness-110 disabled:opacity-40 transition-all">
                  {saving ? "Saving..." : `Save Segment (${preview.count} customers)`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
