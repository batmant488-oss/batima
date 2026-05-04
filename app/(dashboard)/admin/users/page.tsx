"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Plus, MoreVertical, Shield, Phone, Building, Calendar, Edit, Trash2, CheckCircle, XCircle, RefreshCw, Search, Users } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface Profile {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  unit: string | null
  avatar_url: string | null
  created_at?: string
}

export default function UsersPage() {
  const { toast } = useToast()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editUnit, setEditUnit] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProfiles() }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, phone, unit, avatar_url')
    if (error) {
      toast({ title: "Failed to load users", description: error.message, variant: "destructive" })
    } else {
      setProfiles(data || [])
    }
    setLoading(false)
  }

  const handleEditOpen = (profile: Profile) => {
    setSelectedProfile(profile)
    setEditName(profile.name || "")
    setEditPhone(profile.phone || "")
    setEditUnit(profile.unit || "")
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedProfile) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      name: editName,
      phone: editPhone,
      unit: editUnit,
    }).eq('id', selectedProfile.id)
    setSaving(false)
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" })
    } else {
      setIsEditDialogOpen(false)
      toast({ title: "User updated ✓", description: "Profile has been saved." })
      fetchProfiles()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user profile? This cannot be undone.")) return
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Profile deleted" })
      setProfiles(prev => prev.filter(p => p.id !== id))
    }
  }

  const filtered = profiles.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.unit || "").toLowerCase().includes(search.toLowerCase())
  )

  const initials = (name: string | null) => {
    if (!name) return "?"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const avatarColors = ["bg-purple-500", "bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"]
  const colorFor = (id: string) => avatarColors[id.charCodeAt(0) % avatarColors.length]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> User Management
          </h1>
          <p className="text-white/50 mt-1">Manage all resident profiles from Supabase</p>
        </div>
        <Button onClick={fetchProfiles} variant="outline" className="border-white/10 text-white/60 hover:bg-white/5">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Profiles", value: profiles.length, icon: Users, color: "text-blue-400" },
          { label: "With Unit", value: profiles.filter(p => p.unit).length, icon: Building, color: "text-primary" },
          { label: "With Phone", value: profiles.filter(p => p.phone).length, icon: Phone, color: "text-emerald-400" },
        ].map((s, i) => (
          <Card key={s.label} className="glass-effect border-white/10">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">{s.label}</p>
                <p className="text-2xl font-bold text-white">{loading ? "…" : s.value}</p>
              </div>
              <s.icon className={`h-8 w-8 ${s.color} opacity-50`} />
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <Input
          placeholder="Search by name, email, or unit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 border-white/10 bg-white/5 text-white placeholder:text-white/30"
        />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-effect border-white/10">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-white/40">Loading users from Supabase…</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-white/40">
                <Users className="h-12 w-12 mb-3 opacity-20" />
                <p>{search ? "No users match your search" : "No profiles yet — users must sign up first"}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/50">User</TableHead>
                    <TableHead className="text-white/50">Contact</TableHead>
                    <TableHead className="text-white/50">Unit / Building</TableHead>
                    <TableHead className="text-white/50">Joined</TableHead>
                    <TableHead className="text-white/50 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(profile => (
                    <TableRow key={profile.id} className="border-white/5 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full ${colorFor(profile.id)} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                            {initials(profile.name)}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{profile.name || <span className="text-white/30 italic">No name</span>}</p>
                            <p className="text-xs text-white/40">{profile.email || "No email"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/60 text-sm">
                        {profile.phone ? (
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{profile.phone}</span>
                        ) : <span className="text-white/20 italic">—</span>}
                      </TableCell>
                      <TableCell className="text-white/60 text-sm">
                        {profile.unit ? (
                          <span className="flex items-center gap-1"><Building className="h-3 w-3" />{profile.unit}</span>
                        ) : <span className="text-white/20 italic">—</span>}
                      </TableCell>
                      <TableCell className="text-white/40 text-sm">
                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditOpen(profile)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-400" onClick={() => handleDelete(profile.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Profile
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile — {selectedProfile?.name || selectedProfile?.email}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Full Name</label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Phone</label>
              <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+213 ..." />
            </div>
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Building / Unit</label>
              <Input value={editUnit} onChange={e => setEditUnit(e.target.value)} placeholder="Tour A – Apt 302" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/10 text-white/60">Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
