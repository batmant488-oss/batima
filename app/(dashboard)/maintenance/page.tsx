"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Wrench, Calendar, Clock, AlertTriangle, CheckCircle, Building2, X, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const maintenanceRequests = [
  { id: "m1", title: "Leaking Faucet in Kitchen", description: "Kitchen sink faucet has been leaking for 2 days. Water is dripping constantly.", status: "In Progress", priority: "Medium", date: "2024-04-18T10:00:00Z", unit: "A-101", notes: "Technician assigned. Parts ordered." },
  { id: "m2", title: "AC Unit Output is Weak", description: "Air conditioning unit is not cooling properly. Output is significantly weaker than usual.", status: "Resolved", priority: "Low", date: "2024-04-10T12:00:00Z", unit: "B-205", notes: "Refrigerant topped up. Working normally." },
  { id: "m3", title: "Broken Window Seal", description: "Window seal in bedroom is broken, causing drafts and energy loss.", status: "Pending", priority: "High", date: "2024-04-15T08:30:00Z", unit: "A-304", notes: "" },
  { id: "m4", title: "Electrical Outlet Not Working", description: "Multiple outlets in living room are not functioning. Need urgent inspection.", status: "In Progress", priority: "High", date: "2024-04-16T14:00:00Z", unit: "C-102", notes: "Electrician scheduled for tomorrow." },
  { id: "m5", title: "Door Handle Loose", description: "Front door handle is loose and difficult to operate. Security concern.", status: "Pending", priority: "Medium", date: "2024-04-17T09:00:00Z", unit: "A-201", notes: "" }
]

const statuses = ["All", "Pending", "In Progress", "Resolved"]
const priorities = ["All", "High", "Medium", "Low"]

export default function MaintenancePage() {
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editNotes, setEditNotes] = useState("")
  const [editStatus, setEditStatus] = useState("")

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesStatus = statusFilter === "All" || request.status === statusFilter
    const matchesPriority = priorityFilter === "All" || request.priority === priorityFilter
    return matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-green-100 text-green-600"
      case "In Progress": return "bg-blue-100 text-blue-600"
      case "Pending": return "bg-amber-100 text-amber-600"
      default: return "bg-slate-100 text-slate-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-600"
      case "Medium": return "bg-amber-100 text-amber-600"
      case "Low": return "bg-green-100 text-green-600"
      default: return "bg-slate-100 text-slate-600"
    }
  }

  const handleViewDetails = (id: string) => {
    const request = maintenanceRequests.find(r => r.id === id)
    if (request) {
      setSelectedRequest(id)
      setEditNotes(request.notes || "")
      setEditStatus(request.status)
      setIsEditing(false)
    }
  }

  const handleUpdate = () => {
    alert(`Updated request ${selectedRequest} with status: ${editStatus} and notes: ${editNotes}`)
    setIsEditing(false)
  }

  const handleBack = () => {
    setSelectedRequest(null)
    setIsEditing(false)
  }

  const request = selectedRequest ? maintenanceRequests.find(r => r.id === selectedRequest) : null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Maintenance Requests</h1>
          <p className="text-slate-600">Track and manage building maintenance issues</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {!selectedRequest ? (
          <>
            {/* Filter Bar */}
            <Card className="mb-6 border-slate-200">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex gap-1 rounded-lg border border-slate-200 p-1 bg-slate-50">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                          statusFilter === status
                            ? "bg-white text-emerald-600 shadow-sm"
                            : "text-slate-600 hover:bg-white/50"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1 rounded-lg border border-slate-200 p-1 bg-slate-50">
                    {priorities.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setPriorityFilter(priority)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                          priorityFilter === priority
                            ? "bg-white text-emerald-600 shadow-sm"
                            : "text-slate-600 hover:bg-white/50"
                        )}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold">{filteredRequests.length}</span> of <span className="font-semibold">{maintenanceRequests.length}</span> requests
              </p>
            </div>

            {/* Requests Grid */}
            <div className="grid gap-4">
              {filteredRequests.length === 0 ? (
                <Card className="border-slate-200">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Wrench className="h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">No maintenance requests found</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your filter criteria</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}>
                    <Card
                      className="border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => handleViewDetails(request.id)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900">{request.title}</h3>
                              <span className={cn("text-xs px-2 py-0.5 rounded-full", getPriorityColor(request.priority))}>
                                {request.priority}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                <span>Unit {request.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(request.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">{request.description}</p>
                          </div>
                          <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0",
                            getStatusColor(request.status)
                          )}>
                            {request.status === "Resolved" ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : request.status === "In Progress" ? (
                              <Clock className="h-5 w-5" />
                            ) : (
                              <AlertTriangle className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Request Details View */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Requests
            </Button>

            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <CardTitle className="text-xl">{request?.title}</CardTitle>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", getPriorityColor(request?.priority || ""))}>
                        {request?.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>Unit {request?.unit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(request?.date || "").toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg",
                    getStatusColor(request?.status || "")
                  )}>
                    {request?.status === "Resolved" ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : request?.status === "In Progress" ? (
                      <Clock className="h-6 w-6" />
                    ) : (
                      <AlertTriangle className="h-6 w-6" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                  <p className="text-slate-600">{request?.description}</p>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-700">Status & Notes</h3>
                    {!isEditing && request?.status !== "Resolved" && (
                      <Button
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Update
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Notes</label>
                        <Textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add notes about this request..."
                          className="min-h-[100px] border-slate-200"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdate} className="bg-emerald-600 hover:bg-emerald-700">
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="border-slate-200">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full", getStatusColor(request?.status || ""))}>
                          {request?.status}
                        </span>
                      </div>
                      {request?.notes ? (
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">{request.notes}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No notes added yet</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
