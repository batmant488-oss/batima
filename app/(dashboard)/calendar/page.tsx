"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Bell,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  Wrench,
  Megaphone,
  PartyPopper,
  GraduationCap,
} from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  type: "meeting" | "maintenance" | "announcement" | "social" | "training" | "inspection"
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  attendees: number
  maxAttendees?: number
  reminder: boolean
  createdBy: string
  building?: string
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Building Safety Inspection",
    description: "Annual safety inspection for all units. Please ensure your unit is accessible.",
    date: "2024-05-10",
    startTime: "09:00",
    endTime: "17:00",
    location: "All Units",
    type: "inspection",
    status: "upcoming",
    attendees: 120,
    reminder: true,
    createdBy: "Building Management",
    building: "Sunset Tower",
  },
  {
    id: "2",
    title: "Resident Town Hall Meeting",
    description: "Monthly meeting to discuss building updates and resident feedback.",
    date: "2024-05-15",
    startTime: "18:00",
    endTime: "20:00",
    location: "Community Room",
    type: "meeting",
    status: "upcoming",
    attendees: 45,
    maxAttendees: 60,
    reminder: true,
    createdBy: "John Smith",
    building: "Sunset Tower",
  },
  {
    id: "3",
    title: "Pool Maintenance",
    description: "Scheduled pool maintenance and cleaning. Pool will be closed during this time.",
    date: "2024-05-08",
    startTime: "08:00",
    endTime: "12:00",
    location: "Pool Area",
    type: "maintenance",
    status: "upcoming",
    attendees: 0,
    reminder: true,
    createdBy: "Maintenance Team",
    building: "Sunset Tower",
  },
  {
    id: "4",
    title: "Summer BBQ Party",
    description: "Annual summer BBQ party for all residents. Food and drinks provided!",
    date: "2024-05-20",
    startTime: "16:00",
    endTime: "21:00",
    location: "Rooftop Terrace",
    type: "social",
    status: "upcoming",
    attendees: 35,
    maxAttendees: 100,
    reminder: true,
    createdBy: "Social Committee",
    building: "Sunset Tower",
  },
  {
    id: "5",
    title: "Fire Safety Training",
    description: "Mandatory fire safety training for all residents. Certificate provided upon completion.",
    date: "2024-05-12",
    startTime: "10:00",
    endTime: "12:00",
    location: "Community Room",
    type: "training",
    status: "upcoming",
    attendees: 28,
    maxAttendees: 40,
    reminder: true,
    createdBy: "Safety Officer",
    building: "Sunset Tower",
  },
]

const eventTypes = [
  { value: "meeting", label: "Meeting", icon: Briefcase, color: "bg-blue-100 text-blue-600" },
  { value: "maintenance", label: "Maintenance", icon: Wrench, color: "bg-amber-100 text-amber-600" },
  { value: "announcement", label: "Announcement", icon: Megaphone, color: "bg-purple-100 text-purple-600" },
  { value: "social", label: "Social Event", icon: PartyPopper, color: "bg-pink-100 text-pink-600" },
  { value: "training", label: "Training", icon: GraduationCap, color: "bg-emerald-100 text-emerald-600" },
  { value: "inspection", label: "Inspection", icon: CheckCircle, color: "bg-red-100 text-red-600" },
]

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false)
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")

  const filteredEvents = events.filter((event) => {
    const matchesType = typeFilter === "all" || event.type === typeFilter
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    return matchesType && matchesStatus
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming: "bg-blue-100 text-blue-700",
      ongoing: "bg-emerald-100 text-emerald-700",
      completed: "bg-slate-100 text-slate-700",
      cancelled: "bg-red-100 text-red-700",
    }
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getEventTypeIcon = (type: string) => {
    const eventType = eventTypes.find((et) => et.value === type)
    if (!eventType) return Calendar
    return eventType.icon
  }

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find((et) => et.value === type)
    if (!eventType) return "bg-slate-100 text-slate-600"
    return eventType.color
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== eventId))
    }
  }

  const handleCancelEvent = (eventId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, status: "cancelled" as const } : e
      )
    )
  }

  const handleAddEvent = () => {
    alert("Creating event...")
    setIsAddEventDialogOpen(false)
  }

  const handleEditEvent = () => {
    alert("Updating event...")
    setIsEditEventDialogOpen(false)
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const daysInMonth = getDaysInMonth(currentDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar & Events</h1>
          <p className="text-slate-600 mt-1">
            Schedule and manage building events
          </p>
        </div>
        <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Schedule a new event for the building
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Event Title
                </label>
                <Input placeholder="Building Safety Inspection" className="border-slate-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Description
                </label>
                <textarea
                  placeholder="Describe the event..."
                  className="w-full h-24 px-3 py-2 rounded-md border border-slate-200 bg-white resize-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Date
                  </label>
                  <Input type="date" className="border-slate-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Event Type
                  </label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white">
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Start Time
                  </label>
                  <Input type="time" className="border-slate-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    End Time
                  </label>
                  <Input type="time" className="border-slate-200" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Location
                </label>
                <Input placeholder="Community Room" className="border-slate-200" />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddEventDialogOpen(false)}
                className="border-slate-200"
              >
                Cancel
              </Button>
              <Button onClick={handleAddEvent} className="bg-emerald-600 hover:bg-emerald-700">
                Create Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Calendar Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="border-slate-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold text-slate-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="border-slate-200"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex gap-2">
          {["month", "week", "day"].map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(mode as "month" | "week" | "day")}
              className={viewMode === mode ? "bg-emerald-600 hover:bg-emerald-700" : "border-slate-200"}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-slate-200">
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-slate-600 text-sm py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="h-20" />
                }

                const dayEvents = getEventsForDate(date)
                const isToday = date.toDateString() === new Date().toDateString()
                const isSelected = selectedDate?.toDateString() === date.toDateString()

                return (
                  <motion.div
                  key={date.toDateString()}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.01 }}
                  onClick={() => setSelectedDate(date)}
                  className={`h-20 p-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                    isToday
                      ? "border-emerald-500 bg-emerald-50"
                      : isSelected
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-medium ${
                        isToday ? "text-emerald-600" : "text-slate-900"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {isToday && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                        Today
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs px-2 py-0.5 rounded truncate ${getEventTypeColor(
                            event.type
                          )}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-slate-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
          <div className="flex gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-200 bg-white"
            >
              <option value="all">All Types</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-200 bg-white"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredEvents.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">No events found matching your filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event, index) => {
              const EventIcon = getEventTypeIcon(event.type)
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <Card className="border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg ${getEventTypeColor(
                              event.type
                          )} flex-shrink-0`}
                        >
                          <EventIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 mb-1">
                                {event.title}
                              </h3>
                              <p className="text-slate-600 text-sm">{event.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(event.status)}
                              {event.reminder && (
                                <Badge className="bg-amber-100 text-amber-700">
                                  <Bell className="h-3 w-3 mr-1" />
                                  Reminder
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Users className="h-4 w-4" />
                              <span>
                                {event.attendees}
                                {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
                              </span>
                            </div>
                          </div>

                          {event.building && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <p className="text-sm text-slate-500">
                                Building: <span className="font-medium text-slate-900">{event.building}</span>
                              </p>
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Event
                            </DropdownMenuItem>
                            {event.status !== "cancelled" && (
                              <DropdownMenuItem
                                onClick={() => handleCancelEvent(event.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Event
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
    </div>
  )
}
