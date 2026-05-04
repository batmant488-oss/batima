import { Sidebar } from "@/components/layout/Sidebar"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const mockRole = cookieStore.get("mockRole")?.value || "Resident"
  const isAdmin = mockRole === "Admin"

  return (
    <div className="flex h-screen overflow-hidden bg-background neo-theme text-foreground">
      <Sidebar isAdmin={isAdmin} />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <main className="relative z-10 flex-1 overflow-y-auto px-3 pb-4 pt-3 md:px-5 md:pb-6 md:pt-5">
          {children}
        </main>
      </div>
    </div>
  )
}