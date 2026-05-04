"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ShieldAlert, Users, Wrench, Megaphone, TrendingUp, CheckCircle, Clock, Activity, Zap, Server, Database } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnnouncements: 0,
    urgentAnnouncements: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    const [profilesRes, announcementsRes, urgentRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('announcements').select('id', { count: 'exact', head: true }),
      supabase.from('announcements').select('id', { count: 'exact', head: true }).eq('urgent', true),
    ])
    setStats({
      totalUsers: profilesRes.count ?? 0,
      totalAnnouncements: announcementsRes.count ?? 0,
      urgentAnnouncements: urgentRes.count ?? 0,
    })
    setLoading(false)
  }

  const systemMetrics = [
    { label: "Server Status", value: "Online", icon: Server, color: "text-green-400", bgColor: "bg-green-500/10 border-green-500/20" },
    { label: "Database", value: "Healthy", icon: Database, color: "text-green-400", bgColor: "bg-green-500/10 border-green-500/20" },
    { label: "Response Time", value: "~45ms", icon: Zap, color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20" },
    { label: "Uptime", value: "99.9%", icon: Activity, color: "text-primary", bgColor: "bg-primary/10 border-primary/20" },
  ]

  return (
    <div className="space-y-6 neo-theme text-foreground">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-amber-400" />
            Admin Overview
          </h1>
          <p className="text-white/50 mt-1">Monitor and manage building operations</p>
        </div>
        <Button onClick={() => router.push('/admin/users')} className="bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30">
          <Users className="mr-2 h-4 w-4" />
          Manage Users
        </Button>
      </motion.div>

      {/* Live Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Total Residents", value: loading ? "…" : stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", trend: "From Supabase" },
          { title: "Announcements", value: loading ? "…" : stats.totalAnnouncements, icon: Megaphone, color: "text-primary", bg: "bg-primary/10 border-primary/20", trend: "All time" },
          { title: "Urgent Alerts", value: loading ? "…" : stats.urgentAnnouncements, icon: Activity, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", trend: "Requires attention" },
        ].map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card className="glass-effect border-white/10">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-white/50">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} border flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center text-xs text-white/40">
                  <TrendingUp className="mr-1 h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* System Metrics */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white">System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {systemMetrics.map((metric, i) => (
                <motion.div key={metric.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + i * 0.05 }}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${metric.bgColor}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.bgColor} border`}>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">{metric.label}</p>
                    <p className={`text-base font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Users", icon: Users, href: "/admin/users", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                { label: "Announcements", icon: Megaphone, href: "/announcements", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
                { label: "Maintenance", icon: Wrench, href: "/maintenance", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                { label: "Settings", icon: CheckCircle, href: "/settings", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              ].map(action => (
                <button key={action.label} onClick={() => router.push(action.href)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${action.bg} hover:opacity-80 transition-opacity`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                  <span className="text-sm font-medium text-white">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
