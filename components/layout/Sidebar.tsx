"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Megaphone,
  Wrench,
  FileText,
  Settings,
  User,
  ShieldAlert,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isAdmin?: boolean
  isCollapsed?: boolean
  onToggle?: () => void
}

const navigation = {
  resident: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
    { name: "My Requests", href: "/maintenance", icon: Wrench },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Profile", href: "/profile", icon: User },
  ],
  admin: [
    { name: "Admin Overview", href: "/admin", icon: ShieldAlert },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
    { name: "Maintenance", href: "/maintenance", icon: Wrench },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
}

export function Sidebar({ isAdmin = false, isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = isAdmin ? navigation.admin : navigation.resident

  const handleLogout = () => {
    document.cookie = "mockRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/login"
  }

  const handleNavigate = () => {
    setMobileOpen(false)
    onToggle?.()
  }

  const aside = (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-white/10 glass-effect transition-all z-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!isCollapsed ? (
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Batima Gest</h1>
            <p className="text-xs text-primary font-medium">Property Control</p>
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 border border-primary/30 text-lg font-bold text-primary shadow-[0_0_15px_rgba(0,245,255,0.2)]">
            B
          </div>
        )}

        <div className="flex items-center gap-2">
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hidden rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white lg:inline-flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,245,255,0.1)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300",
                  active ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,245,255,0.2)]" : "bg-white/5 group-hover:bg-white/10"
                )}
              >
                <Icon
                  className={cn("h-5 w-5 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-white")}
                />
              </span>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary border border-primary/30 shadow-[0_0_10px_rgba(0,245,255,0.1)]">
            {isAdmin ? "A" : "R"}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{isAdmin ? "Administrator" : "Resident"}</p>
              <p className="truncate text-xs text-muted-foreground font-medium">{isAdmin ? "admin@batima-gest.com" : "resident@batima-gest.com"}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-white/10 glass-effect text-white shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden lg:block">{aside}</div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="h-full w-64"
              onClick={(e) => e.stopPropagation()}
            >
              {aside}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
