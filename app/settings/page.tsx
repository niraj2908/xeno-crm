"use client"

import { useState } from "react"
import { Globe, Moon, Sun, Bell, Shield, Database, Zap, Check } from "lucide-react"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("Asia/Kolkata")
  const [emailNotif, setEmailNotif] = useState(true)
  const [whatsappNotif, setWhatsappNotif] = useState(true)
  const [campaignAlerts, setCampaignAlerts] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [aiModel, setAiModel] = useState("llama-3.3-70b")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-[#c0c1ff]" : "bg-[#27272A]"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  )

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#e5e1e4]">Settings</h1>
        <p className="text-xs text-[#A1A1AA] mt-1">Manage your CRM preferences</p>
      </div>

      {/* Appearance */}
      <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-4 h-4 text-[#c0c1ff]" />
          <h2 className="text-sm font-semibold text-[#e5e1e4]">Appearance</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#e5e1e4]">Dark Mode</p>
            <p className="text-[11px] text-[#A1A1AA]">Use dark theme across the app</p>
          </div>
          <Toggle value={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>

        <div className="border-t border-[#27272A] pt-4">
          <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-2 block">Theme Color</label>
          <div className="flex gap-2">
            {[
              { color: "bg-[#c0c1ff]", label: "Purple" },
              { color: "bg-blue-500", label: "Blue" },
              { color: "bg-emerald-500", label: "Green" },
              { color: "bg-orange-500", label: "Orange" },
            ].map((t) => (
              <button key={t.label} className={`w-8 h-8 rounded-full ${t.color} border-2 ${t.label === "Purple" ? "border-white" : "border-transparent"} transition-all hover:scale-110`} />
            ))}
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-[#c0c1ff]" />
          <h2 className="text-sm font-semibold text-[#e5e1e4]">Language & Region</h2>
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#c0c1ff] transition-all">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="bn">Bengali</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#c0c1ff] transition-all">
            <option value="Asia/Kolkata">IST — India Standard Time (UTC+5:30)</option>
            <option value="UTC">UTC — Coordinated Universal Time</option>
            <option value="America/New_York">EST — Eastern Standard Time (UTC-5)</option>
            <option value="Europe/London">GMT — Greenwich Mean Time (UTC+0)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Currency</label>
          <select className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#c0c1ff] transition-all">
            <option>₹ INR — Indian Rupee</option>
            <option>$ USD — US Dollar</option>
            <option>€ EUR — Euro</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-[#c0c1ff]" />
          <h2 className="text-sm font-semibold text-[#e5e1e4]">Notifications</h2>
        </div>

        {[
          { label: "Email Notifications", desc: "Receive updates via email", value: emailNotif, onChange: () => setEmailNotif(!emailNotif) },
          { label: "WhatsApp Alerts", desc: "Get campaign results on WhatsApp", value: whatsappNotif, onChange: () => setWhatsappNotif(!whatsappNotif) },
          { label: "Campaign Alerts", desc: "Notify when campaign completes", value: campaignAlerts, onChange: () => setCampaignAlerts(!campaignAlerts) },
          { label: "Weekly Report", desc: "Receive weekly performance digest", value: weeklyReport, onChange: () => setWeeklyReport(!weeklyReport) },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#e5e1e4]">{item.label}</p>
              <p className="text-[11px] text-[#A1A1AA]">{item.desc}</p>
            </div>
            <Toggle value={item.value} onChange={item.onChange} />
          </div>
        ))}
      </div>

      {/* AI Settings */}
      <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[#c0c1ff]" />
          <h2 className="text-sm font-semibold text-[#e5e1e4]">AI Configuration</h2>
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">AI Model</label>
          <select value={aiModel} onChange={(e) => setAiModel(e.target.value)}
            className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#c0c1ff] transition-all">
            <option value="llama-3.3-70b">Llama 3.3 70B — Recommended</option>
            <option value="llama-3.1-8b">Llama 3.1 8B — Faster</option>
            <option value="mixtral-8x7b">Mixtral 8x7B — Balanced</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Campaign Tone</label>
          <select className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#c0c1ff] transition-all">
            <option>Friendly & Casual</option>
            <option>Professional</option>
            <option>Urgent & Persuasive</option>
            <option>Festive & Celebratory</option>
          </select>
        </div>
      </div>

      {/* Data */}
      <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-[#c0c1ff]" />
          <h2 className="text-sm font-semibold text-[#e5e1e4]">Data & Privacy</h2>
        </div>
        <button className="w-full text-left text-xs text-[#A1A1AA] hover:text-[#e5e1e4] py-2 border-b border-[#27272A] transition-colors">
          Export all customer data (CSV)
        </button>
        <button className="w-full text-left text-xs text-[#A1A1AA] hover:text-[#e5e1e4] py-2 border-b border-[#27272A] transition-colors">
          Download campaign reports (PDF)
        </button>
        <button className="w-full text-left text-xs text-red-400 hover:text-red-300 py-2 transition-colors">
          Delete all data
        </button>
      </div>

      <button onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#c0c1ff] text-[#1000a9] text-xs font-semibold rounded-lg hover:brightness-110 transition-all">
        {saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Settings Saved!" : "Save Settings"}
      </button>
    </div>
  )
}
