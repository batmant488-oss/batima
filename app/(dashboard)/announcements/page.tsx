"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Megaphone, Calendar, Clock, AlertCircle, CheckCircle, Plus, Share2, Trash2, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

const categories = ["All", "Maintenance", "Utilities", "Community", "Facilities"]

export default function AnnouncementsPage() {
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [readAnnouncements, setReadAnnouncements] = useState<Set<string>>(new Set())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", urgent: false, category: "Maintenance" })
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null)

  useEffect(() => {
    checkRole()
    fetchAnnouncements()
  }, [])

  const checkRole = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (
        profile?.role === 'Admin' || 
        user.email?.toLowerCase().includes('admin') || 
        user.email?.toLowerCase() === 'batmant488@gmail.com'
      ) {
        setIsAdmin(true)
      }
    }
  }

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending: false })
    if (data) setAnnouncements(data)
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (!error) {
      toast({
        title: "Announcement deleted",
        description: "The announcement has been removed successfully.",
      })
      fetchAnnouncements()
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (announcement: any) => {
    setEditingAnnouncement({ ...announcement })
    setIsEditOpen(true)
  }

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement) return

    const { error } = await supabase
      .from('announcements')
      .update({
        title: editingAnnouncement.title,
        content: editingAnnouncement.content,
        category: editingAnnouncement.category,
        urgent: editingAnnouncement.urgent,
      })
      .eq('id', editingAnnouncement.id)

    if (!error) {
      setIsEditOpen(false)
      setEditingAnnouncement(null)
      toast({
        title: "Annonce mise à jour",
        description: "Les modifications ont été enregistrées.",
      })
      fetchAnnouncements()
    } else {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleNewAnnouncement = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const authorName = userData?.user?.email || "Admin" // Defaulting to Admin for demo

    const { error } = await supabase.from('announcements').insert([{
      ...newAnnouncement,
      author: authorName
    }])

    if (!error) {
      setIsDialogOpen(false)
      setNewAnnouncement({ title: "", content: "", urgent: false, category: "Maintenance" })
      fetchAnnouncements()
    } else {
      alert("Error creating announcement: " + error.message)
    }
  }

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
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.filter(c => c !== "All").map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNewAnnouncement({...newAnnouncement, category: c})}
                          className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                            newAnnouncement.category === c
                              ? "bg-primary/20 border-primary/50 text-primary"
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="urgent" checked={newAnnouncement.urgent} onChange={e => setNewAnnouncement({...newAnnouncement, urgent: e.target.checked})} />
                    <Label htmlFor="urgent">Mark as urgent</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleNewAnnouncement}>Publish Announcement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
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
                          {isAdmin && (
                            <div className="flex items-center gap-1 ml-auto">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(announcement)}
                                className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;annonce</DialogTitle>
          </DialogHeader>
          {editingAnnouncement && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input 
                  value={editingAnnouncement.title} 
                  onChange={e => setEditingAnnouncement({...editingAnnouncement, title: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea 
                  value={editingAnnouncement.content} 
                  onChange={e => setEditingAnnouncement({...editingAnnouncement, content: e.target.value})} 
                  className="min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.filter(c => c !== "All").map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditingAnnouncement({...editingAnnouncement, category: c})}
                      className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                        editingAnnouncement.category === c
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : "bg-black/20 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="edit-urgent" 
                  checked={editingAnnouncement.urgent} 
                  onChange={e => setEditingAnnouncement({...editingAnnouncement, urgent: e.target.checked})} 
                />
                <Label htmlFor="edit-urgent">Marquer comme urgent</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateAnnouncement} className="btn-gradient border-0">Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
