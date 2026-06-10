"use client"

import { useState } from "react"
import { MessageCircle, Mail, BookOpen, Video, ChevronDown, ChevronUp, ExternalLink, Zap } from "lucide-react"

const faqs = [
  {
    q: "How does AI segmentation work?",
    a: "Our AI (powered by Llama 3.3 70B) converts your plain English description into database filter rules. For example, 'customers who spent over ₹5000 but haven't ordered in 30 days' gets parsed into structured rules that query your customer database in real time."
  },
  {
    q: "How do I import customers?",
    a: "Go to the Customers page and click 'Import CSV'. Your CSV must have columns: name, email, phone. Download our template to get started quickly."
  },
  {
    q: "What channels does Xeno support?",
    a: "Xeno supports WhatsApp, Email, SMS, and Push Notifications. The AI generates optimized messages for each channel based on your campaign goal."
  },
  {
    q: "How is campaign performance tracked?",
    a: "When you launch a campaign, Xeno tracks Sent, Delivered, Read, and Clicked metrics. The Analytics page shows these as rates and charts, and AI generates insights automatically."
  },
  {
    q: "Can I edit AI-generated messages?",
    a: "Yes! After the AI generates a WhatsApp message, you can edit it freely before launching. The AI output is a starting point, not final."
  },
  {
    q: "How do I create my first segment?",
    a: "Go to Segments → Create Segment. Enter a name, then describe your audience in plain English. Click 'Parse & Preview with AI' to see matching customers before saving."
  },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!name || !email || !message) return
    setSubmitted(true)
  }

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-[#e5e1e4]">Support Center</h1>
        <p className="text-xs text-[#A1A1AA] mt-1">Get help with Xeno CRM</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: "Documentation", desc: "Guides & tutorials", href: "https://xeno.in" },
          { icon: Video, label: "Video Tours", desc: "Watch walkthroughs", href: "https://xeno.in" },
          { icon: MessageCircle, label: "Live Chat", desc: "Chat with us", href: "https://xeno.in" },
          { icon: Mail, label: "Email Us", desc: "support@xeno.in", href: "mailto:support@xeno.in" },
        ].map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
            className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-4 hover:border-[#c0c1ff]/30 transition-all group">
            <item.icon className="w-5 h-5 text-[#c0c1ff] mb-2" />
            <p className="text-xs font-semibold text-[#e5e1e4]">{item.label}</p>
            <p className="text-[10px] text-[#A1A1AA] mt-0.5">{item.desc}</p>
          </a>
        ))}
      </div>

      {/* Status Banner */}
      <div className="bg-[#a6d38a]/10 border border-[#a6d38a]/30 rounded-xl p-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#a6d38a] animate-pulse" />
        <div>
          <p className="text-xs font-semibold text-[#a6d38a]">All Systems Operational</p>
          <p className="text-[11px] text-[#A1A1AA]">API, Dashboard, WhatsApp Gateway — all running normally</p>
        </div>
        <a href="https://status.xeno.in" target="_blank" rel="noopener noreferrer"
          className="ml-auto text-[10px] text-[#c0c1ff] hover:underline flex items-center gap-1">
          Status Page <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-sm font-semibold text-[#e5e1e4] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#0C0C0E] border border-[#27272A] rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
                <span className="text-xs font-medium text-[#e5e1e4]">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-[#A1A1AA] shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-[#A1A1AA] shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-[11px] text-[#A1A1AA] leading-relaxed border-t border-[#27272A] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-[#0C0C0E] border border-[#27272A] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#e5e1e4] mb-4">Contact Support</h2>
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-[#a6d38a]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-5 h-5 text-[#a6d38a]" />
            </div>
            <p className="text-sm font-semibold text-[#e5e1e4]">Message Sent!</p>
            <p className="text-xs text-[#A1A1AA] mt-1">Our team will respond within 24 hours.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c0c1ff] transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c0c1ff] transition-all" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5 block">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full bg-[#131315] border border-[#27272A] rounded-lg px-3 py-2.5 text-xs text-[#e5e1e4] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c0c1ff] transition-all resize-none min-h-[100px]" />
            </div>
            <button onClick={handleSubmit}
              className="w-full py-2.5 bg-[#c0c1ff] text-[#1000a9] text-xs font-semibold rounded-lg hover:brightness-110 transition-all">
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
