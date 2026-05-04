import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Eye, Lock, Database, Cookie, Globe } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-xl text-slate-300">Last updated: May 3, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border border-white/10 bg-slate-900/70 shadow-[0_20px_50px_rgba(2,6,23,0.65)] backdrop-blur-xl">
          <CardContent className="p-8 space-y-8">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8 rounded-xl border border-cyan-300/25 bg-cyan-400/8 p-6">
                <div className="flex items-start gap-4">
                  <Shield className="mt-1 h-8 w-8 flex-shrink-0 text-cyan-300" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-cyan-200">Your Privacy Matters</h3>
                    <p className="text-slate-300">
                      We are committed to protecting your personal information and your right to privacy. This privacy policy explains how we collect, use, and protect your data.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Eye className="h-6 w-6 text-cyan-300" />
                1. Information We Collect
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We collect information you provide directly to us, including but not limited to: name, email address, phone number, property details, and any other information you choose to provide.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Database className="h-6 w-6 text-cyan-300" />
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lock className="h-6 w-6 text-cyan-300" />
                3. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Cookie className="h-6 w-6 text-cyan-300" />
                4. Cookies and Tracking
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar tracking technologies to collect information about your activities on our Service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Globe className="h-6 w-6 text-cyan-300" />
                5. Third-Party Services
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may employ third-party companies to facilitate our Service, provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used.
              </p>

              <h2 className="text-2xl font-bold text-gray-900">6. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your personal data.
              </p>

              <h2 className="text-2xl font-bold text-gray-900">7. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-gray-900">8. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@batima-gest.com
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  By using Batima Gest, you acknowledge that you have read and understood this Privacy Policy.
                </p>
                <Button className="btn-gradient">
                  I Understand
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}