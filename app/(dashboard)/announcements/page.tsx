"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Megaphone, Calendar, Clock, AlertCircle, CheckCircle, Plus, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

const announcements = [
  { id: "1", title: "Elevator Maintenance Scheduled", content: "Elevator will be under maintenance on April 22nd from 8am to 12pm. Please use the stairs during this time.", date: "2024-04-20T09:00:00Z", urgent: true, author: "Building Management", category: "Maintenance" },
  { id: "2", title: "Water Shutoff Notice", content: "Temporary water shutoff for building B to repair main pipe. Will last around 2 hours.", date: "2024-04-19T14:30:00Z", urgent: false, author: "Building Management", category: "Utilities" },
  { id: "3", title: "Community Meeting", content: "Monthly community meeting this Saturday at 10am in the main lobby. All residents welcome to attend.", date: "2024-04-18T16:00:00Z", urgent: false, author: "Resident Council", category: "Community" },
  { id: "4", title: "Pool Maintenance Complete", content: "The pool maintenance has been completed successfully. The pool is now open for all residents.", date: "2024-04-15T11:00:00Z", urgent: false, author: "Building Management", category: "Facilities" },
  { id: "5", title: "Parking Lot Resurfacing", content: "Parking lot B will be resurfaced next week. Please use alternative parking during this time.", date: "2024-04-12T09:00:00Z", urgent: true, author: "Building Management", category: "Maintenance" }
]

const categories = ["All", "Maintenance", "Utilities", "Community", "Facilities"]

export default function AnnouncementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [readAnnouncements, setReadAnnouncements] = useState<Set<string>>(new Set())

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = selectedCategory === "All" || announcement.category === selectedCategory
    const matchesUrgent = !showUrgentOnly || announcement.urgent
    return matchesCategory && matchesUrgent
  })

  const handleMarkAsRead = (id: string) => {
    setReadAnnouncements(prev => new Set([...prev, id]))
  }

  const handleShare = (id: string) => {
    const announcement = announcements.find(a => a.id === id)
    if (announcement) {
      alert(`Sharing announcement: ${announcement.title}`)
    }
  }

  const handleNewAnnouncement = () => {
    alert("Opening new announcement form...")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-600">Stay updated with building news and notifications</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter Bar */}
        <Card className="mb-6 border-slate-200">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex gap-1 rounded-lg border border-slate-200 p-1 bg-slate-50">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      selectedCategory === category
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-600 hover:bg-white/50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <Button
                variant={showUrgentOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUrgentOnly(!showUrgentOnly)}
                className={cn(
                  "h-10",
                  showUrgentOnly ? "bg-red-500 hover:bg-red-600" : "border-slate-200"
                )}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Urgent Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">{filteredAnnouncements.length}</span> of <span className="font-semibold">{announcements.length}</span> announcements
          </p>
          <Button onClick={handleNewAnnouncement} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        </div>

        {/* Announcements Grid */}
        <div className="grid gap-4">
          {filteredAnnouncements.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Megaphone className="h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No announcements found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your filter criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}>
                <Card className={cn(
                  "border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all",
                  announcement.urgent && "border-l-4 border-l-red-500"
                )}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{announcement.title}</h3>
                          {announcement.urgent && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                              <AlertCircle className="inline mr-1 h-3 w-3" />
                              Urgent
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                            {announcement.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(announcement.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(announcement.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div>•</div>
                          <div className="font-medium">{announcement.author}</div>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{announcement.content}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(announcement.id)}
                        disabled={readAnnouncements.has(announcement.id)}
                        className={cn(
                          "text-xs border-slate-200",
                          readAnnouncements.has(announcement.id) && "opacity-50"
                        )}>
                        {readAnnouncements.has(announcement.id) ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Read
                          </>
                        ) : (
                          "Mark as Read"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(announcement.id)}
                        className="text-xs border-slate-200">
                        <Share2 className="mr-1 h-3 w-3" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
