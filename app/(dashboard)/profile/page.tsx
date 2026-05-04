"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Shield, Bell, Key, Building2, CheckCircle, X, LogOut, Lock, AlertTriangle, Home } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [buildings, setBuildings] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [passwordMsg, setPasswordMsg] = useState<{text: string, ok: boolean} | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    unit: "",
    moveInDate: "",
    emergencyContact: "",
    emergencyPhone: "",
    avatar_url: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Fetch buildings list
    const { data: bData } = await supabase.from('buildings').select('*').order('name')
    if (bData) setBuildings(bData)

    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setFormData({
          name: data.name || "",
          email: user.email || "",
          phone: data.phone || "",
          unit: data.unit || "",
          moveInDate: data.move_in_date || "",
          emergencyContact: data.emergency_contact || "",
          emergencyPhone: data.emergency_phone || "",
          avatar_url: data.avatar_url || ""
        })
      } else {
        setFormData(prev => ({ ...prev, email: user.email || "" }))
      }
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in with a real account (not demo) to save changes.",
        variant: "destructive",
      })
      setSaving(false)
      return
    }

    // Try full upsert first
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: formData.name,
      phone: formData.phone,
      unit: formData.unit,
      emergency_contact: formData.emergencyContact,
      emergency_phone: formData.emergencyPhone,
      move_in_date: formData.moveInDate || null,
    })

    if (error) {
      // Fallback: save only name (guaranteed to exist after initial schema)
      const { error: fallbackError } = await supabase.from('profiles').upsert({
        id: user.id,
        name: formData.name,
      })

      setSaving(false)
      if (fallbackError) {
        toast({
          title: "Save failed",
          description: fallbackError.message + "\n\nRun the ALTER TABLE SQL in Supabase to fix missing columns.",
          variant: "destructive",
        })
      } else {
        setIsEditing(false)
        toast({
          title: "Partial save",
          description: "Name saved. Run ALTER TABLE SQL in Supabase to enable full profile saving.",
          variant: "default",
        })
      }
      return
    }

    // Try saving avatar_url separately (optional column)
    if (formData.avatar_url) {
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: formData.avatar_url })
    }

    setSaving(false)
    setIsEditing(false)
    toast({
      title: "Profile saved ✓",
      description: "All your changes have been saved successfully.",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }))
      
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
         await supabase.from('profiles').upsert({ id: user.id, avatar_url: data.publicUrl })
      }
      alert("Avatar updated successfully!")
    } catch (error: any) {
      alert("Error uploading avatar: " + error.message)
    }
  }

  const handleChangePasswordSubmit = async () => {
    setPasswordMsg(null)
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ text: "Password must be at least 6 characters.", ok: false })
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ text: "Passwords do not match.", ok: false })
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordMsg({ text: error.message, ok: false })
    } else {
      setPasswordMsg({ text: "Password changed successfully!", ok: true })
      setNewPassword("")
      setConfirmNewPassword("")
      setTimeout(() => {
        setIsPasswordDialogOpen(false)
        setPasswordMsg(null)
      }, 1500)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleSecuritySettings = () => {
    setIsSecurityDialogOpen(true)
  }

  const handleChangePassword = () => {
    setIsPasswordDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600">Manage your personal information and preferences</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 overflow-hidden">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-emerald-700">{formData.name ? formData.name.charAt(0) : "U"}</span>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">{formData.name}</h3>
                    <p className="text-sm text-slate-500">{formData.unit}</p>
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Unit</p>
                      <p className="font-medium text-slate-900">{formData.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Move-in Date</p>
                      <p className="font-medium text-slate-900">{formData.moveInDate}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={handleSecuritySettings}
                    className="w-full justify-start border-slate-200">
                    <Shield className="mr-2 h-4 w-4" />
                    Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Information */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Update your personal details</p>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 h-10 border-slate-200 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 h-10 border-slate-200 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 h-10 border-slate-200 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Building / Unit</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          {buildings.map(b => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                const [, aptPart] = formData.unit.split(" – Apt ")
                                setFormData({ ...formData, unit: b.name + (aptPart ? " – Apt " + aptPart : "") })
                              }}
                              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                                formData.unit.startsWith(b.name)
                                  ? "border-emerald-500/50 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:text-slate-900"
                              }`}
                            >
                              <Home className="h-3.5 w-3.5 shrink-0" />
                              {b.name}
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Numéro d'appartement (ex: 302)"
                            value={formData.unit.includes(" – Apt ") ? formData.unit.split(" – Apt ")[1] : ""}
                            onChange={(e) => {
                              const building = buildings.find(b => formData.unit.startsWith(b.name))?.name || ""
                              setFormData({ ...formData, unit: building + (e.target.value ? " – Apt " + e.target.value : "") })
                            }}
                            className="pl-10 h-10 border-slate-200"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          value={formData.unit}
                          disabled
                          className="pl-10 h-10 border-slate-200 bg-slate-50"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    Emergency Contact
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Contact Name</label>
                      <Input
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        disabled={!isEditing}
                        className="h-10 border-slate-200 disabled:bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Contact Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          value={formData.emergencyPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10 h-10 border-slate-200 disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="border-slate-200">
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-emerald-600" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Email notifications for announcements", checked: true, description: "Receive email updates for new announcements" },
                  { label: "SMS alerts for urgent maintenance", checked: true, description: "Get SMS notifications for urgent maintenance issues" },
                  { label: "Weekly building updates", checked: false, description: "Weekly summary of building activities" },
                  { label: "Payment reminders", checked: true, description: "Reminders before payment due dates" },
                  { label: "Community event notifications", checked: false, description: "Updates about community events and activities" }
                ].map((pref, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{pref.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{pref.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={pref.checked}
                      onChange={() => alert(`Toggled: ${pref.label}`)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-1"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={(open) => { setIsPasswordDialogOpen(open); if (!open) { setPasswordMsg(null); setNewPassword(""); setConfirmNewPassword("") } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="At least 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="Repeat your password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            </div>
            {passwordMsg && (
              <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${passwordMsg.ok ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                {passwordMsg.ok ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
                {passwordMsg.text}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleChangePasswordSubmit} className="bg-emerald-600 hover:bg-emerald-700 w-full">
              <Lock className="mr-2 h-4 w-4" />
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Settings Dialog */}
      <Dialog open={isSecurityDialogOpen} onOpenChange={setIsSecurityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {/* Change Password */}
            <button
              onClick={() => { setIsSecurityDialogOpen(false); setIsPasswordDialogOpen(true) }}
              className="w-full flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 border border-primary/20">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-white">Change Password</p>
                <p className="text-sm text-white/50">Update your account password</p>
              </div>
            </button>

            {/* Active Sessions info */}
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Current Session</p>
                <p className="text-sm text-white/50">You are logged in on this device</p>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 hover:bg-red-500/15 transition-colors text-left group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 border border-red-500/20">
                <LogOut className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-red-400">Sign Out</p>
                <p className="text-sm text-red-400/60">Log out of your account</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
