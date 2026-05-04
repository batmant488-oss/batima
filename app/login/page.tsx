"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Building2, CheckCircle, Lock, Mail, ShieldAlert, User, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [adminPin, setAdminPin] = useState("")
  const [adminPinError, setAdminPinError] = useState(false)

  const ADMIN_PIN = "admin2024"

  const completeLogin = (role: "Admin" | "Resident") => {
    document.cookie = `mockRole=${role}; path=/`
    toast({
      title: "Welcome back",
      description: `You are signed in as ${role === "Admin" ? "Administrator" : "Resident"}.`,
    })
    router.push(role === "Admin" ? "/admin" : "/dashboard")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password) {
      toast({
        title: "Missing details",
        description: "Enter your email and password to continue.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const role = email.toLowerCase().includes("admin") ? "Admin" : "Resident"
    completeLogin(role)
    setLoading(false)
  }

  const handleDemoLogin = (role: "Admin" | "Resident") => {
    setLoading(true)
    setEmail(role === "Admin" ? "admin@batima-gest.demo" : "resident@batima-gest.demo")
    setPassword("demo123")

    toast({
      title: "Demo mode",
      description: `Loading ${role === "Admin" ? "administrator" : "resident"} dashboard...`,
    })

    window.setTimeout(() => {
      completeLogin(role)
      setLoading(false)
    }, 800)
  }

  const handleAdminClick = () => {
    setAdminPin("")
    setAdminPinError(false)
    setAdminDialogOpen(true)
  }

  const handleAdminPinSubmit = () => {
    if (adminPin === ADMIN_PIN) {
      setAdminDialogOpen(false)
      handleDemoLogin("Admin")
    } else {
      setAdminPinError(true)
    }
  }

  return (
    <div className="min-h-screen bg-background neo-theme text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2 relative z-10">
        {/* Background ambient light */}
        <div className="absolute inset-0 z-[-1] pointer-events-none opacity-40">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full" />
        </div>
        
        <section className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between bg-slate-900/50 border-r border-white/10 glass-effect">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,245,255,0.1),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(138,44,226,0.2),_transparent_34%)]" />

          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 shadow-[0_0_15px_rgba(0,245,255,0.2)] border border-primary/30 backdrop-blur-xl">
                <span className="text-3xl font-bold text-primary">L</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-primary/80 font-medium">Batima Gest Platform</p>
                <h1 className="text-3xl font-bold tracking-tight">Property Management</h1>
              </div>
            </div>

            <div className="max-w-xl space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent/80">Premium operations hub</p>
              <h2 className="text-5xl font-semibold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                Elegant building management with a faster, calmer workflow.
              </h2>
              <p className="max-w-lg text-lg leading-8 text-muted-foreground">
                Keep announcements, requests, documents, and resident communication in one polished interface.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid max-w-xl grid-cols-2 gap-4">
            {[
              { value: "156", label: "Units managed" },
              { value: "24/7", label: "Support visibility" },
              { value: "4.8", label: "Resident rating" },
              { value: "99.9%", label: "Uptime mindset" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl hover:bg-white/10 transition-colors">
                <p className="text-3xl font-bold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-lg"
          >
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/20 shadow-[0_0_20px_rgba(0,245,255,0.2)] border border-primary/30">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-primary">Sign in</p>
              <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Access your resident or administrator workspace with a premium, streamlined experience.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 glass-effect p-6 shadow-2xl sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 className="h-32 w-32 text-primary" />
              </div>
              <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white/90">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 text-base text-white focus:border-primary focus:ring-1 focus:ring-primary"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-white/90">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 text-base text-white focus:border-primary focus:ring-1 focus:ring-primary"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-black/20 text-primary focus:ring-primary focus:ring-offset-0" />
                    Remember me
                  </label>
                  <Link href="/forgot-password" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" disabled={loading} className="btn-gradient border-0 h-12 w-full rounded-xl text-base font-bold shadow-xl transition-all hover:scale-[1.02]">
                  {loading ? "Signing in..." : (
                    <span className="inline-flex items-center">
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="rounded-full bg-[#0f1423] border border-white/10 px-4 py-1 text-muted-foreground shadow-sm">Try the demo</span>
                  </div>
                </div>

                <div className="mt-6">
                  {/* Admin Demo Only */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleAdminClick}
                    className="group w-full flex items-center gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-left transition-all hover:bg-amber-500/10 hover:border-amber-500/40 disabled:opacity-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30">
                      <ShieldAlert className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-amber-300 text-sm">Admin Access</p>
                      <p className="text-xs text-amber-400/50">Requires administrator PIN</p>
                    </div>
                    <Lock className="h-4 w-4 text-amber-500/60 shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>
        </section>
      </div>

      {/* Admin PIN Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={(open) => { setAdminDialogOpen(open); if (!open) { setAdminPin(""); setAdminPinError(false) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              <span>Admin Access — Enter PIN</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-white/50">This area is restricted to administrators. Enter the admin PIN to continue.</p>
            <Input
              type="password"
              placeholder="Enter admin PIN"
              value={adminPin}
              onChange={e => { setAdminPin(e.target.value); setAdminPinError(false) }}
              onKeyDown={e => e.key === "Enter" && handleAdminPinSubmit()}
              className="h-12 text-base tracking-widest"
              autoFocus
            />
            {adminPinError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Incorrect PIN. Please try again.
              </div>
            )}
            <Button
              onClick={handleAdminPinSubmit}
              className="w-full h-11 bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 font-semibold"
            >
              <Lock className="mr-2 h-4 w-4" />
              Unlock Admin Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
