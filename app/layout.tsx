import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/dashboard/sidebar"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Xeno CRM",
  description: "AI-Powered Customer Engagement CRM",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} bg-[#09090B] text-[#e5e1e4]`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="ml-60 flex-1 min-h-screen overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
