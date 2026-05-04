"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Wrench,
  CheckCircle,
  Clock,
  ArrowRight,
  Building2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = {
  announcements: { total: 12, urgent: 3 },
  maintenance: { total: 8, inProgress: 5 },
  documents: { total: 24 },
};

const recentAnnouncements = [
  {
    id: "1",
    title: "Elevator Maintenance Scheduled",
    content: "Elevator will be under maintenance on April 22nd from 8am to 12pm.",
    date: "2024-04-20T09:00:00Z",
    urgent: true,
  },
  {
    id: "2",
    title: "Water Shutoff Notice",
    content: "Temporary water shutoff for building B to repair main pipe.",
    date: "2024-04-19T14:30:00Z",
    urgent: false,
  },
];

const maintenanceRequests = [
  {
    id: "m1",
    title: "Leaking Faucet in Kitchen",
    status: "In Progress",
    priority: "Medium",
    date: "2024-04-18T10:00:00Z",
    unit: "A-101",
  },
  {
    id: "m2",
    title: "Broken Window Seal",
    status: "Pending",
    priority: "High",
    date: "2024-04-15T08:30:00Z",
    unit: "A-304",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full neo-theme text-foreground relative z-10 pt-4">
      {/* Background ambient light */}
      <div className="absolute inset-0 z-[-1] pointer-events-none opacity-40">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70"
          >
            Welcome back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Here's what's happening with your building
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {[
            {
              title: "Announcements",
              value: stats.announcements.total,
              subtitle: `${stats.announcements.urgent} urgent`,
              color: "bg-emerald-500",
            },
            {
              title: "Maintenance",
              value: stats.maintenance.inProgress,
              subtitle: `${stats.maintenance.total} total`,
              color: "bg-amber-500",
            },
            {
              title: "Documents",
              value: stats.documents.total,
              subtitle: "Available",
              color: "bg-blue-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}>
              <Card className="glass-effect border-white/10 card-hover overflow-hidden relative">
                {/* Subtle gradient overlay */}
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br from-${stat.color.replace('bg-', '')} to-transparent`} />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-4xl font-bold text-white mt-2 tracking-tight">{stat.value}</p>
                      <p className="text-xs text-muted-foreground/80 mt-2 font-medium bg-white/5 inline-flex px-2 py-1 rounded-full">{stat.subtitle}</p>
                    </div>
                    <div className={`h-14 w-14 rounded-2xl ${stat.color} bg-opacity-20 flex items-center justify-center border border-white/10 shadow-lg`}>
                      <div className={`h-7 w-7 rounded-full bg-white/40 backdrop-blur-md`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            <Card className="glass-effect border-white/10 h-full">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-white">Recent Announcements</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-white/5 transition-colors">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {recentAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={cn(
                      "p-5 rounded-xl border border-white/5 transition-all duration-300 cursor-pointer group",
                      announcement.urgent
                        ? "bg-destructive/10 hover:bg-destructive/20 hover:border-destructive/30"
                        : "bg-white/5 hover:bg-white/10 hover:border-white/20",
                    )}
                    onClick={() => alert(`Viewing: ${announcement.title}`)}>
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110",
                          announcement.urgent ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary",
                        )}>
                        <Megaphone className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-base">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{announcement.content}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <p className="text-xs text-muted-foreground/80 font-medium">
                            {new Date(announcement.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Maintenance Requests */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            <Card className="glass-effect border-white/10 h-full">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-white">Maintenance Requests</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-white/5 transition-colors">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {maintenanceRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                    onClick={() => alert(`Viewing: ${request.title}`)}>
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110",
                          request.status === "In Progress"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-amber-500/20 text-amber-400",
                        )}>
                        {request.status === "In Progress" ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <Wrench className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-base">{request.title}</h4>
                        <div className="flex items-center gap-3 mt-2.5">
                          <span
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-full font-medium shadow-sm",
                              request.status === "In Progress"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/20"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/20",
                            )}>
                            {request.status}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                            <Building2 className="h-3 w-3" />
                            Unit {request.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Building Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6">
          <Card className="glass-effect border-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Building2 className="h-40 w-40 text-primary" />
            </div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xl tracking-tight">Your Building</h3>
                  <p className="text-muted-foreground mt-1 flex items-center gap-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded-md text-white text-sm">Unit A-101</span> 
                    <span className="text-sm border-l border-white/20 pl-2">2BR, 2BA</span>
                  </p>
                </div>
                <Button className="btn-gradient border-0 font-semibold shadow-xl">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
