"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Wrench, Calendar, Clock, AlertTriangle, CheckCircle, Building2, X, ArrowLeft, Plus, Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  status: string
  priority: string
  unit: string
  created_at: string
  notes?: string
}

const statuses = ["All", "Pending", "In Progress", "Resolved"]
const priorities = ["All", "High", "Medium", "Low"]

export default function MaintenancePage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // New Request Form
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    priority: "Medium",
    unit: ""
  })

  useEffect(() => {
    checkRole()
    fetchRequests()
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

  const fetchRequests = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setRequests(data)
    setLoading(false)
  }

  const handleCreateRequest = async () => {
    if (!newRequest.title || !newRequest.unit) {
      toast({ title: "Error", description: "Title and Unit are required.", variant: "destructive" })
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('maintenance_requests').insert({
      ...newRequest,
      user_id: user?.id,
      status: 'pending'
    })

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Request submitted successfully." })
      setIsNewRequestOpen(false)
      setNewRequest({ title: "", description: "", priority: "Medium", unit: "" })
      fetchRequests()
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    if (status === 'Resolved') {
      if (!confirm("Is this job finished? The ticket will be removed from the list.")) return
      await handleDeleteRequest(null as any, id)
      return
    }

    const { error } = await supabase
      .from('maintenance_requests')
      .update({ status })
      .eq('id', id)
    
    if (!error) {
      toast({
        title: "Status updated",
        description: `Request marked as ${status}.`,
      })
      if (selectedRequest) setSelectedRequest({ ...selectedRequest, status })
      fetchRequests()
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteRequest = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm("Is this job done? The request will be removed from the list.")) return

    const { error } = await supabase.from('maintenance_requests').delete().eq('id', id)
    
    if (!error) {
      toast({
        title: "Success",
        description: "Job marked as done and ticket removed.",
      })
      if (selectedRequest?.id === id) setSelectedRequest(null)
      fetchRequests()
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === "All" || request.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "All" || request.priority.toLowerCase() === priorityFilter.toLowerCase()
    return matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default: return "bg-white/10 text-white/60 border-white/10"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-white/10 text-white/60 border-white/10"
    }
  }

  return (
    <div className="min-h-screen neo-theme text-foreground relative z-10 pt-4">
      {/* Background ambient light */}
      <div className="absolute inset-0 z-[-1] pointer-events-none opacity-40">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {!selectedRequest ? (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white"
                >
                  Maintenance Requests
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/50 text-lg"
                >
                  Track and manage building maintenance issues
                </motion.p>
              </div>
              <Button 
                onClick={() => setIsNewRequestOpen(true)}
                className="btn-gradient border-0 font-bold shadow-xl shadow-primary/20 h-12 px-6 rounded-xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Request
              </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex gap-1 rounded-xl border border-white/10 p-1 bg-white/5 backdrop-blur-md">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider",
                      statusFilter === status
                        ? "bg-white text-black shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 rounded-xl border border-white/10 p-1 bg-white/5 backdrop-blur-md">
                {priorities.map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                    className={cn(
                      "px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider",
                      priorityFilter === priority
                        ? "bg-white text-black shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-white/40 font-medium">
                Showing <span className="text-white font-bold">{filteredRequests.length}</span> requests
              </p>
            </div>

            {/* Requests List */}
            <div className="grid gap-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                  <Loader2 className="h-10 w-10 animate-spin mb-4" />
                  <p>Loading requests...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <Card className="glass-effect border-white/10">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <Wrench className="h-16 w-16 text-white/10 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No maintenance requests found</h3>
                    <p className="text-white/40">Adjust your filters or create a new request.</p>
                  </CardContent>
                </Card>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="glass-effect border-white/10 hover:border-primary/30 card-hover cursor-pointer group"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="font-bold text-white text-xl group-hover:text-primary transition-colors">{request.title}</h3>
                                <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border", getPriorityColor(request.priority))}>
                                  {request.priority}
                                </span>
                                {isAdmin && request.status.toLowerCase() === 'resolved' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => handleDeleteRequest(e, request.id)}
                                    className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 ml-auto font-bold text-[10px] uppercase tracking-wider h-8 px-3 rounded-lg"
                                  >
                                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                                    Job Done
                                  </Button>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs font-semibold text-white/30">
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="h-4 w-4" />
                                  <span>Unit {request.unit}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{request.description}</p>
                            </div>
                            <div className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-2xl border flex-shrink-0 shadow-lg transition-transform group-hover:scale-110",
                              getStatusColor(request.status)
                            )}>
                              {request.status.toLowerCase() === "resolved" ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : (
                                <Clock className="h-6 w-6" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </>
        ) : (
          /* Request Details View (Full Screen Style) */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                onClick={() => setSelectedRequest(null)}
                className="text-white/60 hover:text-white hover:bg-white/5 h-12 px-6 rounded-xl font-bold"
              >
                <ArrowLeft className="mr-3 h-5 w-5" />
                Back to List
              </Button>
              {isAdmin && selectedRequest.status.toLowerCase() === 'resolved' && (
                <Button
                  onClick={(e) => handleDeleteRequest(e, selectedRequest.id)}
                  className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-green-500/20"
                >
                  <CheckCircle className="mr-3 h-5 w-5" />
                  Mark as Job Done
                </Button>
              )}
            </div>

            <Card className="glass-effect border-white/10 overflow-hidden">
              <div className={cn("h-2 w-full", getPriorityColor(selectedRequest.priority).split(' ')[0])} />
              <CardContent className="p-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border", getStatusColor(selectedRequest.status))}>
                        {selectedRequest.status}
                      </span>
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border", getPriorityColor(selectedRequest.priority))}>
                        {selectedRequest.priority} Priority
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tight">{selectedRequest.title}</h2>
                    <div className="flex items-center gap-6 text-sm font-semibold text-white/30">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        <span>Unit {selectedRequest.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>Submitted on {new Date(selectedRequest.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-3xl border flex-shrink-0 shadow-2xl",
                    getStatusColor(selectedRequest.status)
                  )}>
                    {selectedRequest.status.toLowerCase() === "resolved" ? (
                      <CheckCircle className="h-10 w-10" />
                    ) : (
                      <Clock className="h-10 w-10" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Problem Description
                  </h4>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 leading-relaxed text-white/70 text-lg">
                    {selectedRequest.description}
                  </div>
                </div>

                {isAdmin && (
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Admin Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedRequest.status.toLowerCase() !== 'in progress' && selectedRequest.status.toLowerCase() !== 'resolved' && (
                        <Button
                          onClick={() => handleUpdateStatus(selectedRequest.id, 'In Progress')}
                          className="bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 font-bold"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Start Work
                        </Button>
                      )}
                      {selectedRequest.status.toLowerCase() !== 'resolved' && (
                        <Button
                          onClick={() => handleUpdateStatus(selectedRequest.id, 'Resolved')}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-500/20"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Job Done
                        </Button>
                      )}
                      {selectedRequest.status.toLowerCase() === 'resolved' && (
                        <p className="text-sm text-green-400/60 italic">
                          Ticket is resolved. You can now mark it as "Job Done" to remove it.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* New Request Dialog */}
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="glass-effect border-white/10 text-white max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">New Maintenance Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Title</label>
              <Input 
                placeholder="Ex: Leaking pipe in bathroom" 
                value={newRequest.title}
                onChange={e => setNewRequest({...newRequest, title: e.target.value})}
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Unit</label>
                <Input 
                  placeholder="Ex: A-302" 
                  value={newRequest.unit}
                  onChange={e => setNewRequest({...newRequest, unit: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Priority</label>
                <select 
                  value={newRequest.priority}
                  onChange={e => setNewRequest({...newRequest, priority: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-white focus:border-primary outline-none appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Description</label>
              <Textarea 
                placeholder="Describe the issue in detail..." 
                value={newRequest.description}
                onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                className="bg-white/5 border-white/10 min-h-[120px] rounded-2xl focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setIsNewRequestOpen(false)} className="h-12 px-6 rounded-xl font-bold text-white/60">
              Cancel
            </Button>
            <Button onClick={handleCreateRequest} className="btn-gradient border-0 h-12 px-8 rounded-xl font-bold shadow-xl shadow-primary/20">
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
