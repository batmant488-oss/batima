import type { Metadata } from "next"
import { JetBrains_Mono, Orbitron, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Batima Gest | Smart Property Operations",
  description: "High-performance property management platform for residents and administrators.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${orbitron.variable} ${jetBrainsMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
