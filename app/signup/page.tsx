"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Building2, Check, CheckCircle, Lock, Mail, Shield, User, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [buildings, setBuildings] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    building: "",
    unitNumber: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const fetchBuildings = async () => {
      const { data } = await supabase.from('buildings').select('*').order('name')
      if (data) setBuildings(data)
    }
    fetchBuildings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.name || !formData.email || !formData.building || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing details",
        description: "Veuillez sélectionner un bâtiment et remplir tous les champs.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both password fields are identical.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Vérification manuelle de l'email dans la table profiles
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', formData.email.toLowerCase())
      .maybeSingle()

    if (existingUser) {
      toast({
        title: "Email déjà utilisé",
        description: "Un compte existe déjà avec cette adresse email. Veuillez vous connecter.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          name: formData.name,
          building: formData.building,
          unit: formData.unitNumber,
        }
      }
    })

    // Also insert into profiles table
    if (!error && data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: formData.name,
        unit: `${formData.building}${formData.unitNumber ? " – Apt " + formData.unitNumber : ""}`,
        email: formData.email,
      })
    }

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (data.user && !data.session) {
      setIsEmailSent(true)
      toast({
        title: "Verification email sent",
        description: "Please check your inbox to verify your account.",
      })
    } else {
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please sign in.",
      })
      router.push("/login")
    }
    setLoading(false)
  }

  const handleResend = async () => {
    setLoading(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: formData.email,
    })
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Verification email resent.",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background neo-theme text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2 relative z-10">
        {/* Background ambient light */}
        <div className="absolute inset-0 z-[-1] pointer-events-none opacity-40">
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-accent/20 blur-[120px] rounded-full" />
        </div>

        <section className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between bg-slate-900/50 border-r border-white/10 glass-effect">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,245,255,0.1),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(138,44,226,0.2),_transparent_34%)]" />

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
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent/80">Create your workspace</p>
              <h2 className="text-5xl font-semibold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                Join a refined, responsive, and intuitive property management experience.
              </h2>
              <p className="max-w-lg text-lg leading-8 text-muted-foreground">
                Residents and administrators share one calm, elegant interface with smart navigation and strong clarity.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid max-w-xl grid-cols-2 gap-4">
            {[
              { value: "Secure", label: "Access-first design" },
              { value: "Fast", label: "Responsive interactions" },
              { value: "Clean", label: "Low cognitive load" },
              { value: "Modern", label: "Premium feel" },
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
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-primary">Create account</p>
              <h2 className="text-3xl font-bold tracking-tight text-white">Build your profile</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Set up your account to access your workspace with a polished onboarding flow.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 glass-effect p-6 shadow-2xl sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <User className="h-32 w-32 text-primary" />
              </div>
              {isEmailSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 py-8 text-center"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/20 border border-primary/30 shadow-[0_0_30px_rgba(0,245,255,0.15)]">
                    <Mail className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Vérifiez votre boîte mail</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Nous avons envoyé un lien de confirmation à <br />
                      <span className="font-semibold text-white/90">{formData.email}</span>
                    </p>
                  </div>
                  <div className="pt-4 space-y-4">
                    <Button 
                      onClick={() => router.push('/login')} 
                      className="w-full h-12 btn-gradient border-0 font-bold shadow-lg"
                    >
                      Aller à la connexion
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Vous n&apos;avez rien reçu ?{" "}
                      <button 
                        onClick={handleResend} 
                        disabled={loading}
                        className="font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Envoi..." : "Renvoyer le mail"}
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-semibold text-white/90">Full name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 text-base text-white focus:border-primary focus:ring-1 focus:ring-primary"
                          autoComplete="name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white/90">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 text-base text-white focus:border-primary focus:ring-1 focus:ring-primary"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/90">Votre bâtiment</label>
                      <div className="grid grid-cols-2 gap-2">
                        {buildings.map(b => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, building: b.name })}
                            className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                              formData.building === b.name
                                ? "border-primary/50 bg-primary/10 text-primary"
                                : "border-white/10 bg-black/20 text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-semibold text-sm">
                              <Home className="h-3.5 w-3.5 shrink-0" />
                              {b.name}
                            </span>
                            <span className="text-xs mt-0.5 opacity-60">{b.info}</span>
                          </button>
                        ))}
                      </div>
                      {formData.building && (
                        <div className="mt-2 relative">
                          <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Numéro d'appartement (ex: 302)"
                            value={formData.unitNumber}
                            onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                            className="h-11 rounded-xl border-white/10 bg-black/20 pl-10 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="mb-2 block text-sm font-semibold text-white/90">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 text-base text-white focus:border-primary focus:ring-1 focus:ring-primary"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-white/90">Confirm password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 text-base text-white focus:border-primary focus:ring-1 focus:ring-primary"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/90">
                      <Shield className="h-4 w-4 text-primary" />
                      Password requirements
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> At least 8 characters</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Mix of letters and numbers</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> At least one special character</div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-black/20 text-primary focus:ring-primary focus:ring-offset-0" required />
                    <span>
                      I agree to the <Link href="/terms" className="font-semibold text-primary hover:text-primary/80 transition-colors">Terms of Service</Link> and <Link href="/privacy" className="font-semibold text-primary hover:text-primary/80 transition-colors">Privacy Policy</Link>.
                    </span>
                  </label>

                  <Button type="submit" disabled={loading} className="btn-gradient border-0 h-12 w-full rounded-xl text-base font-bold shadow-xl transition-all hover:scale-[1.02]">
                    {loading ? "Creating account..." : (
                      <span className="inline-flex items-center">
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">Sign in</Link>
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
