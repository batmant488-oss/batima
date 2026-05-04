import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft, Shield, User, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="neo-theme min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,245,255,0.10),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(138,44,226,0.16),_transparent_30%),linear-gradient(180deg,_#090b12_0%,_#0d1120_100%)]">
      {/* Header */}
      <div className="rounded-b-[2rem] border-b border-white/10 bg-gradient-to-r from-cyan-500/25 via-sky-500/20 to-fuchsia-500/25 text-white shadow-[0_18px_45px_rgba(2,6,23,0.5)]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/login" className="text-white/80 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-xl text-slate-300">Last updated: May 3, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border border-white/10 bg-slate-900/70 shadow-[0_20px_50px_rgba(2,6,23,0.65)] backdrop-blur-xl">
          <CardContent className="p-8 space-y-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-6 w-6 text-cyan-300" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using Batima Gest Property Management Platform ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="h-6 w-6 text-cyan-300" />
                2. User Accounts
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lock className="h-6 w-6 text-cyan-300" />
                3. Privacy Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your use of our Service is subject to our Privacy Policy. Please review our Privacy Policy, which also governs the Service and informs users of our data collection practices.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-cyan-300" />
                4. Intellectual Property
              </h2>
              <p className="text-gray-600 leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Batima Gest and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>

              <h2 className="text-2xl font-bold text-gray-900">5. Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900">6. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900">7. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to check these Terms periodically for changes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900">8. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms, please contact us at support@batima-gest.com
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  By using Batima Gest, you agree to these terms and conditions.
                </p>
                <Button className="btn-gradient">
                  I Agree
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}