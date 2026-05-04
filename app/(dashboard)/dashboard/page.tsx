"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    announcements: { total: 0, urgent: 0 },
    maintenance: { total: 0, inProgress: 0 },
    documents: { total: 0 },
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Fetch stats
    const [announcementsRes, urgentRes, maintenanceRes] = await Promise.all([
      supabase.from('announcements').select('id', { count: 'exact', head: true }),
      supabase.from('announcements').select('id', { count: 'exact', head: true }).eq('urgent', true),
      supabase.from('announcements').select('*').order('date', { ascending: false }).limit(3),
    ]);

    // For now we don't have a maintenance table yet, so we keep mock or 0
    // But we fetch real announcements
    setStats({
      announcements: { 
        total: announcementsRes.count ?? 0, 
        urgent: urgentRes.count ?? 0 
      },
      maintenance: { total: 0, inProgress: 0 }, // Placeholder until maintenance table exists
      documents: { total: 12 }, // Static for now
    });

    setRecentAnnouncements(announcementsRes.data || []);
    
    // Fetch real recent announcements
    const { data: latestAnnouncements } = await supabase
      .from('announcements')
      .select('*')
      .order('date', { ascending: false })
      .limit(3);
    
    if (latestAnnouncements) {
      setRecentAnnouncements(latestAnnouncements);
    }

    setLoading(false);
  };

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
              value: loading ? "…" : stats.announcements.total,
              subtitle: `${stats.announcements.urgent} urgent`,
              color: "bg-emerald-500",
            },
            {
              title: "Maintenance",
              value: stats.maintenance.total,
              subtitle: `${stats.maintenance.inProgress} in progress`,
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
                  <Button variant="ghost" size="sm" onClick={() => router.push('/announcements')} className="text-primary hover:text-primary/80 hover:bg-white/5 transition-colors">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {loading ? (
                   <div className="text-center py-8 text-white/20">Loading...</div>
                ) : recentAnnouncements.length === 0 ? (
                   <div className="text-center py-8 text-white/20">No announcements yet.</div>
                ) : recentAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={cn(
                      "p-5 rounded-xl border border-white/5 transition-all duration-300 cursor-pointer group",
                      announcement.urgent
                        ? "bg-destructive/10 hover:bg-destructive/20 hover:border-destructive/30"
                        : "bg-white/5 hover:bg-white/10 hover:border-white/20",
                    )}
                    onClick={() => router.push('/announcements')}>
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
                            {new Date(announcement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Maintenance (Static for now) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            <Card className="glass-effect border-white/10 h-full">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-white">Maintenance Requests</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => router.push('/maintenance')} className="text-primary hover:text-primary/80 hover:bg-white/5 transition-colors">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-center py-12 text-white/20">
                 <Wrench className="h-12 w-12 mx-auto mb-3 opacity-20" />
                 <p>Maintenance tracking system coming soon.</p>
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
                  <p className="text-muted-foreground mt-1">Manage your residential details and facilities.</p>
                </div>
                <Button onClick={() => router.push('/buildings')} className="btn-gradient border-0 font-semibold shadow-xl">
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
