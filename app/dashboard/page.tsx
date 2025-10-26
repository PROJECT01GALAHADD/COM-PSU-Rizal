"use client"

import { Sidebar, MobileSidebar } from "@/components/sidebar"
import { DashboardContent } from "@/components/dashboard/content"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export default function DashboardPage() {
  return (
    <div className="min-h-[100dvh] text-white">
      <SiteHeader />
      <div className="flex">
        <Sidebar />
        <div className="md:hidden fixed top-4 right-4 z-50">
          <MobileSidebar />
        </div>
        <main className="flex-1 md:ml-0 p-4">
          <DashboardContent />
        </main>
      </div>
      <AppverseFooter />
    </div>
  )
}