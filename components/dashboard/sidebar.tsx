"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Zap, LayoutDashboard, Users, Filter,
  Megaphone, BarChart3, ShoppingCart, Plus, Settings, HelpCircle,
} from "lucide-react"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "customers", label: "Customers", icon: Users, href: "/customers" },
  { id: "segments", label: "Segments", icon: Filter, href: "/segments" },
  { id: "campaigns", label: "Campaigns", icon: Megaphone, href: "/campaigns" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
  { id: "orders", label: "Orders", icon: ShoppingCart, href: "/orders" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#09090B] border-r border-[#27272A] flex flex-col py-6 z-50">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-[#c0c1ff] rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#1000a9] fill-[#1000a9]" />
          </div>
          <h1 className="text-lg font-bold text-[#e5e1e4] tracking-tight">Xeno CRM</h1>
        </div>
        <p className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-widest pl-1">
          AI-Powered CRM
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.id} href={item.href}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#c0c1ff]/10 text-[#c0c1ff] border-l-2 border-[#c0c1ff]"
                  : "text-[#A1A1AA] hover:bg-[#201f22] hover:text-[#e5e1e4]"
              }`}>
              <Icon className={`w-4 h-4 ${isActive ? "text-[#c0c1ff]" : "text-[#A1A1AA]/70"}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 mt-auto pt-6 border-t border-[#27272A] space-y-3">
        <Link href="/campaigns/new"
          className="w-full bg-[#c0c1ff] text-[#1000a9] py-2.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </Link>
        <div className="space-y-0.5 pt-2">
          <Link href="/settings"
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${pathname === "/settings" ? "text-[#c0c1ff]" : "text-[#A1A1AA]/80 hover:text-[#e5e1e4]"}`}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <Link href="/support"
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${pathname === "/support" ? "text-[#c0c1ff]" : "text-[#A1A1AA]/80 hover:text-[#e5e1e4]"}`}>
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
