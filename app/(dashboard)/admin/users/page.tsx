"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MoreVertical, Shield, Phone, Building, Calendar, Edit, Trash2, CheckCircle, XCircle, RefreshCw, Search, Users, AlertTriangle, ShieldCheck, User as UserIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface Profile {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  unit: string | null
  role: string | null
  avatar_url: string | null
  created_at: string | null
}

export default function UsersPage() {
  const { toast } = useToast()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editUnit, setEditUnit] = useState("")
  const [editRole, setEditRole] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchProfiles() }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, phone, unit, role, avatar_url, created_at')
      .order('created_at', { ascending: false })
    
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
    setEditRole(profile.role || "Resident")
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedProfile) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      name: editName,
      phone: editPhone,
      unit: editUnit,
      role: editRole,
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

  const handleDeleteOpen = (profile: Profile) => {
    setSelectedProfile(profile)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProfile) return
    setDeleting(true)
    
    try {
      // First, try to call the RPC function for full deletion (auth + profile)
      // This requires the SQL function 'delete_user_full' to be created in Supabase
      const { error: rpcError } = await supabase.rpc('delete_user_full', {
        user_id: selectedProfile.id
      })

      if (rpcError) {
        console.warn("RPC deletion failed, falling back to profile deletion:", rpcError)
        // Fallback: just delete the profile row (won't delete auth user)
        const { error: deleteError } = await supabase.from('profiles').delete().eq('id', selectedProfile.id)
        
        if (deleteError) throw deleteError
      }

      toast({ 
        title: "User deleted", 
        description: `${selectedProfile.name || selectedProfile.email} has been removed.` 
      })
      setProfiles(prev => prev.filter(p => p.id !== selectedProfile.id))
      setIsDeleteDialogOpen(false)
    } catch (error: any) {
      toast({ 
        title: "Deletion failed", 
        description: error.message, 
        variant: "destructive" 
      })
    } finally {
      setDeleting(false)
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
          <p className="text-white/50 mt-1">Monitor and manage all system users and residents</p>
        </div>
        <Button onClick={fetchProfiles} variant="outline" className="border-white/10 text-white/60 hover:bg-white/5">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Profiles", value: profiles.length, icon: Users, color: "text-blue-400" },
          { label: "Admins", value: profiles.filter(p => p.role === 'Admin').length, icon: ShieldCheck, color: "text-amber-400" },
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
        <Card className="glass-effect border-white/10 overflow-hidden">
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
                    <TableHead className="text-white/50">Role</TableHead>
                    <TableHead className="text-white/50">Contact</TableHead>
                    <TableHead className="text-white/50">Unit / Building</TableHead>
                    <TableHead className="text-white/50">Joined</TableHead>
                    <TableHead className="text-white/50 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filtered.map((profile, idx) => (
                      <TableRow key={profile.id} className="border-white/5 hover:bg-white/5 group transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-full ${colorFor(profile.id)} flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-lg shadow-black/20`}>
                              {initials(profile.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-white text-sm truncate">{profile.name || <span className="text-white/30 italic">No name</span>}</p>
                              <p className="text-xs text-white/40 truncate">{profile.email || "No email"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={profile.role === 'Admin' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}>
                            {profile.role === 'Admin' ? <Shield className="mr-1 h-3 w-3" /> : <UserIcon className="mr-1 h-3 w-3" />}
                            {profile.role || 'Resident'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/60 text-sm">
                          {profile.phone ? (
                            <span className="flex items-center gap-1"><Phone className="h-3 w-3 opacity-40" />{profile.phone}</span>
                          ) : <span className="text-white/20 italic">—</span>}
                        </TableCell>
                        <TableCell className="text-white/60 text-sm">
                          {profile.unit ? (
                            <span className="flex items-center gap-1"><Building className="h-3 w-3 opacity-40" />{profile.unit}</span>
                          ) : <span className="text-white/20 italic">—</span>}
                        </TableCell>
                        <TableCell className="text-white/40 text-sm">
                          {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-effect border-white/10 text-white">
                              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer" onClick={() => handleEditOpen(profile)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer" onClick={() => handleDeleteOpen(profile)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-effect border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit User Profile</DialogTitle>
            <DialogDescription className="text-white/50">Update resident information and access level.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Full Name</label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-white/5 border-white/10 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Role</label>
                <select 
                  value={editRole} 
                  onChange={e => setEditRole(e.target.value)}
                  className="w-full h-10 rounded-md bg-white/5 border border-white/10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Resident">Resident</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Phone Number</label>
              <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="bg-white/5 border-white/10 focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Building / Unit</label>
              <Input value={editUnit} onChange={e => setEditUnit(e.target.value)} className="bg-white/5 border-white/10 focus:border-primary" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/10 text-white/60 hover:bg-white/5">Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving} className="bg-primary hover:bg-primary/80 text-black font-bold">
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-effect border-red-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Delete User?
            </DialogTitle>
            <DialogDescription className="text-white/60 pt-2">
              Are you sure you want to delete <strong>{selectedProfile?.name || selectedProfile?.email}</strong>? 
              This will remove their profile and, if configured, their authentication account.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-300/80 mt-2">
            <strong>Warning:</strong> This action is irreversible. All data associated with this user will be permanently removed.
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-white/10 text-white/60 hover:bg-white/5">Cancel</Button>
            <Button onClick={handleDeleteConfirm} disabled={deleting} className="bg-red-500 hover:bg-red-600 text-white font-bold">
              {deleting ? "Deleting…" : "Yes, Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
