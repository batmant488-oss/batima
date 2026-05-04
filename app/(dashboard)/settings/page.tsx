"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Bell, Shield, Globe, Save } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Batima Gest",
    supportEmail: "support@batima-gest.com",
    maintenanceMode: false,
    enableNotifications: true,
    enableEmailAlerts: true,
    enableSMSAlerts: false
  })

  const handleSave = () => {
    alert("Settings saved successfully!")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-600">Manage system settings and preferences</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* General Settings */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-600" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Site Name</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="h-10 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Support Email</label>
                  <Input
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="h-10 border-slate-200"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Maintenance Mode</p>
                    <p className="text-xs text-slate-500">Disable access for non-admin users</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-emerald-600" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Enable Notifications", description: "Show in-app notifications", checked: settings.enableNotifications },
                  { label: "Email Alerts", description: "Send email notifications", checked: settings.enableEmailAlerts },
                  { label: "SMS Alerts", description: "Send SMS notifications", checked: settings.enableSMSAlerts }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => {
                        if (item.label === "Enable Notifications") setSettings({ ...settings, enableNotifications: e.target.checked })
                        else if (item.label === "Email Alerts") setSettings({ ...settings, enableEmailAlerts: e.target.checked })
                        else setSettings({ ...settings, enableSMSAlerts: e.target.checked })
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  Localization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Default Language</label>
                  <Input defaultValue="English" className="h-10 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Default Timezone</label>
                  <Input defaultValue="UTC+01:00" className="h-10 border-slate-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    defaultValue="30"
                    className="h-10 border-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Password Requirements</label>
                  <div className="space-y-2">
                    {[
                      "Minimum 8 characters",
                      "Include uppercase letters",
                      "Include numbers",
                      "Include special characters"
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-sm text-slate-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="mr-2 h-4 w-4" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
