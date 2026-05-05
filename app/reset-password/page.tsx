"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // On vérifie si on a bien une session de récupération
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== "PASSWORD_RECOVERY") {
        // Si on n'est pas en mode récupération, on redirige vers le login
        // Sauf si on vient de réussir le changement
      }
    })
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast({
        title: "Les mots de passe ne correspondent pas",
        description: "Veuillez vérifier votre saisie.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit faire au moins 6 caractères.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      toast({
        title: "Erreur lors de la mise à jour",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    setSuccess(true)
    toast({
      title: "Mot de passe mis à jour !",
      description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
    })
    
    setTimeout(() => {
      router.push("/login")
    }, 3000)
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background neo-theme text-foreground flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/20 shadow-[0_0_20px_rgba(0,245,255,0.2)] border border-primary/30">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Nouveau mot de passe</h1>
          <p className="mt-2 text-muted-foreground">Sécurisez votre compte avec un nouveau mot de passe.</p>
        </div>

        <div className="rounded-3xl border border-white/10 glass-effect p-6 shadow-2xl sm:p-8">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-white">Changement réussi !</h2>
              <p className="text-muted-foreground">Redirection vers la page de connexion...</p>
              <Button onClick={() => router.push("/login")} className="w-full btn-gradient">
                Se connecter maintenant
              </Button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 text-white focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">Confirmer le mot de passe</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-xl border-white/10 bg-black/20 pl-12 text-white focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 btn-gradient border-0 font-bold shadow-xl"
              >
                {loading ? "Mise à jour..." : "Enregistrer le mot de passe"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
