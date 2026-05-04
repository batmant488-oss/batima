"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Shield, Bell, Key, Building2, CheckCircle, X } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@batima-gest.com",
    phone: "+1 (555) 123-4567",
    unit: "A-101",
    moveInDate: "2023-01-15",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543"
  })

  const handleSave = () => {
    setIsEditing(false)
    alert("Profile saved successfully!")
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSecuritySettings = () => {
    alert("Opening security settings...")
  }

  const handleChangePassword = () => {
    alert("Opening password change form...")
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
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
                      <span className="text-3xl font-bold text-emerald-700">{formData.name.charAt(0)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => alert("Upload photo...")}
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
                <div className="mt-6 space-y-2">
                  <Button
                    variant="outline"
                    onClick={handleSecuritySettings}
                    className="w-full justify-start border-slate-200">
                    <Shield className="mr-2 h-4 w-4" />
                    Security Settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleChangePassword}
                    className="w-full justify-start border-slate-200">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Unit</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={formData.unit}
                        disabled
                        className="pl-10 h-10 border-slate-200 bg-slate-50"
                      />
                    </div>
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
    </div>
  )
}
