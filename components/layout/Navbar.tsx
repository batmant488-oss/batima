"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  Bell,
  ChevronDown,
  Globe,
  Home,
  LifeBuoy,
  LogOut,
  Menu,
  Megaphone,
  Settings,
  Search,
  Wrench,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
]

interface NavbarProps {
  onSidebarToggle?: () => void
  showSidebarToggle?: boolean
}

export function Navbar({ onSidebarToggle, showSidebarToggle = true }: NavbarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [languageOpen, setLanguageOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@batima-gest.com",
    notifications: 3,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      return
    }
  }

  const handleLogout = () => {
    document.cookie = "mockRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/login"
  }

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Megaphone, label: "Announcements", href: "/announcements" },
    { icon: Wrench, label: "Maintenance", href: "/maintenance" },
    { icon: LifeBuoy, label: "Help", href: "/help" },
    { icon: User, label: "Profile", href: "/profile" },
  ]

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-slate-950/65 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            {showSidebarToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl border border-white/15 bg-slate-900/75 text-cyan-200 hover:bg-slate-800 lg:hidden"
                onClick={onSidebarToggle}
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}

            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/35 bg-gradient-to-br from-cyan-400/20 via-sky-400/20 to-fuchsia-500/20 shadow-[0_0_25px_rgba(0,245,255,0.25)]">
                <span className="font-[var(--font-orbitron)] text-lg font-bold text-cyan-200">L</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text font-[var(--font-orbitron)] text-xl font-bold text-transparent">
                  Batima Gest
                </h1>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ops Console</p>
              </div>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="relative hidden flex-1 px-6 xl:block">
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search properties, announcements, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-2xl border border-cyan-300/20 bg-slate-900/65 pl-12 pr-12 text-base text-slate-200 shadow-[0_0_0_1px_rgba(0,245,255,0.06)] transition-all placeholder:text-slate-500 focus-visible:border-cyan-300/50 focus-visible:ring-cyan-300/25"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguageOpen((value) => !value)}
                className="gap-2 rounded-2xl border border-white/15 bg-slate-900/70 px-3 text-slate-200 hover:bg-slate-800"
              >
                <Globe className="h-4 w-4" />
                <span>{selectedLanguage.flag}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              <AnimatePresence>
                {languageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-900/95 shadow-[0_20px_45px_rgba(2,6,23,0.65)]"
                  >
                    <div className="p-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setSelectedLanguage(lang)
                            setLanguageOpen(false)
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-slate-300 transition-colors hover:bg-white/10 ${
                            selectedLanguage.code === lang.code ? "bg-cyan-400/15 text-cyan-200" : ""
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-2xl border border-white/15 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
            >
              <Bell className="h-5 w-5" />
              {user.notifications > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-500 text-xs font-bold text-slate-950">
                  {user.notifications}
                </span>
              )}
            </Button>

            <div className="relative hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProfileOpen((value) => !value)}
                className="gap-2 rounded-2xl border border-white/15 bg-slate-900/70 px-3 text-slate-200 hover:bg-slate-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-fuchsia-400 font-semibold text-slate-950">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-400">Resident</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-900/95 shadow-[0_20px_45px_rgba(2,6,23,0.65)]"
                  >
                    <div className="bg-gradient-to-r from-cyan-400/20 via-sky-400/20 to-fuchsia-500/25 p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/55 text-2xl font-bold text-cyan-200 backdrop-blur">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-100">{user.name}</h3>
                          <p className="text-sm text-slate-300">{user.email}</p>
                          <p className="mt-1 text-xs text-slate-400">Unit A-101</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false)
                          router.push("/profile")
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-200 transition-colors hover:bg-white/10"
                      >
                        <User className="h-5 w-5 text-cyan-300" />
                        <div>
                          <p className="font-medium">My Profile</p>
                          <p className="text-xs text-slate-400">Manage your account</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false)
                          router.push("/maintenance")
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-200 transition-colors hover:bg-white/10"
                      >
                        <Wrench className="h-5 w-5 text-cyan-300" />
                        <div>
                          <p className="font-medium">My Requests</p>
                          <p className="text-xs text-slate-400">View maintenance requests</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false)
                          router.push("/documents")
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-200 transition-colors hover:bg-white/10"
                      >
                        <LifeBuoy className="h-5 w-5 text-cyan-300" />
                        <div>
                          <p className="font-medium">Saved Documents</p>
                          <p className="text-xs text-slate-400">Get help quickly</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false)
                          router.push("/settings")
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-200 transition-colors hover:bg-white/10"
                      >
                        <Settings className="h-5 w-5 text-cyan-300" />
                        <div>
                          <p className="font-medium">Settings</p>
                          <p className="text-xs text-slate-400">Preferences and options</p>
                        </div>
                      </button>

                      <div className="my-2 border-t border-white/10" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-300 transition-colors hover:bg-red-500/15"
                      >
                        <LogOut className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Sign Out</p>
                          <p className="text-xs text-red-200/70">Log out of your account</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl border border-white/15 bg-slate-900/70 text-slate-200 hover:bg-slate-800 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed bottom-0 left-0 top-0 w-80 border-r border-white/10 bg-slate-950/95 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="font-[var(--font-orbitron)] text-xl font-bold text-cyan-200">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-2xl text-slate-200 hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleSearch} className="mb-6">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 rounded-2xl border border-white/10 bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
                  />
                </form>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-200 transition-colors hover:bg-white/10"
                    >
                      <item.icon className="h-5 w-5 text-cyan-300" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
