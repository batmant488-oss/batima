"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Users, Wrench, Megaphone, FileText, TrendingUp, CheckCircle, Clock, Activity, Zap, Server, Database } from "lucide-react"

const adminStats = {
  totalUsers: 156,
  activeRequests: 23,
  pendingApprovals: 8,
  systemHealth: "98%",
  uptime: "99.9%",
  responseTime: "45ms"
}

const systemMetrics = [
  { label: "Server Status", value: "Online", icon: Server, color: "text-green-600", bgColor: "bg-green-100" },
  { label: "Database", value: "Healthy", icon: Database, color: "text-green-600", bgColor: "bg-green-100" },
  { label: "Response Time", value: "45ms", icon: Zap, color: "text-blue-600", bgColor: "bg-blue-100" },
  { label: "Uptime", value: "99.9%", icon: Activity, color: "text-green-600", bgColor: "bg-green-100" }
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-slate-600">Monitor and manage building operations</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Admin Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {[
            { title: "Total Users", value: adminStats.totalUsers, icon: Users, trend: "+12 this week", color: "bg-blue-100 text-blue-600" },
            { title: "Active Requests", value: adminStats.activeRequests, icon: Wrench, trend: "+3 today", color: "bg-amber-100 text-amber-600" },
            { title: "Pending Approvals", value: adminStats.pendingApprovals, icon: Clock, trend: "Requires attention", color: "bg-red-100 text-red-600" },
            { title: "System Health", value: adminStats.systemHealth, icon: Activity, trend: "Excellent", color: "bg-green-100 text-green-600" }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* System Metrics */}
        <Card className="mb-6 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {systemMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">{metric.label}</p>
                    <p className={`text-base font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
