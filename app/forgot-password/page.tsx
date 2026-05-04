"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Input } from "@/components/ui"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle, Lock } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    setTimeout(() => {
      setSubmitted(true)
      toast({
        title: "Email sent!",
        description: "If an account exists with this email, you will receive password reset instructions.",
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side - Branding */}
        <div className="hidden flex-col justify-between border-r border-slate-200 bg-emerald-600 p-12 lg:flex lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-2xl backdrop-blur">
                <span className="text-3xl font-bold">L</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Batima Gest</h1>
                <p className="uppercase tracking-[0.18em] text-emerald-100">Property Management</p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight text-white">
                Reset Your Password
              </h2>
              <p className="text-xl text-emerald-100">
                We'll help you get back into your account securely.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/20">
                  <Lock className="h-6 w-6 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Secure Recovery</h3>
                  <p className="text-sm text-emerald-100">Bank-level security for your account</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {!submitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-500/25">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="mb-2 text-3xl font-bold text-slate-900">Forgot password?</h1>
                  <p className="text-slate-600">No worries, we'll send you reset instructions.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-semibold uppercase tracking-[0.1em] text-slate-500">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-700 h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      {loading ? "Sending..." : "Reset Password"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-emerald-600"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to login
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
                >
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </motion.div>
                <h2 className="mb-2 text-2xl font-bold text-slate-900">Check your email</h2>
                <p className="mb-6 text-slate-600">
                  We've sent password reset instructions to <span className="font-semibold">{email}</span>
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/login")}
                    className="bg-emerald-600 hover:bg-emerald-700 h-12 w-full rounded-xl"
                  >
                    Back to Login
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="h-12 w-full rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    Try another email
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
