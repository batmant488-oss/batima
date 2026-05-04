"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import {
  Building,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  MapPin,
  Users,
  DoorOpen,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Grid3x3,
  List,
} from "lucide-react"

interface Building {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  totalUnits: number
  occupiedUnits: number
  availableUnits: number
  yearBuilt: number
  floors: number
  amenities: string[]
  status: "active" | "maintenance" | "inactive"
  rating: number
  manager: string
  lastInspection: string
}

const mockBuildings: Building[] = [
  {
    id: "1",
    name: "Sunset Tower",
    address: "123 Ocean Boulevard",
    city: "Miami",
    state: "FL",
    zipCode: "33139",
    totalUnits: 120,
    occupiedUnits: 115,
    availableUnits: 5,
    yearBuilt: 2018,
    floors: 15,
    amenities: ["Pool", "Gym", "Parking", "Concierge", "Security"],
    status: "active",
    rating: 4.8,
    manager: "John Smith",
    lastInspection: "2024-04-15",
  },
  {
    id: "2",
    name: "Mountain View Apartments",
    address: "456 Highland Drive",
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    totalUnits: 85,
    occupiedUnits: 80,
    availableUnits: 5,
    yearBuilt: 2020,
    floors: 8,
    amenities: ["Gym", "Parking", "Security", "Rooftop"],
    status: "active",
    rating: 4.6,
    manager: "Sarah Johnson",
    lastInspection: "2024-04-20",
  },
  {
    id: "3",
    name: "Urban Loft Complex",
    address: "789 City Center",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    totalUnits: 200,
    occupiedUnits: 195,
    availableUnits: 5,
    yearBuilt: 2019,
    floors: 20,
    amenities: ["Pool", "Gym", "Parking", "Concierge", "Security", "Spa"],
    status: "active",
    rating: 4.9,
    manager: "Michael Brown",
    lastInspection: "2024-04-10",
  },
  {
    id: "4",
    name: "Garden Heights",
    address: "321 Green Valley Road",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    totalUnits: 60,
    occupiedUnits: 55,
    availableUnits: 5,
    yearBuilt: 2017,
    floors: 5,
    amenities: ["Pool", "Parking", "Security"],
    status: "maintenance",
    rating: 4.4,
    manager: "Emily Davis",
    lastInspection: "2024-03-25",
  },
  {
    id: "5",
    name: "Lakeside Residences",
    address: "555 Lake Shore Drive",
    city: "Chicago",
    state: "IL",
    zipCode: "60611",
    totalUnits: 150,
    occupiedUnits: 140,
    availableUnits: 10,
    yearBuilt: 2021,
    floors: 12,
    amenities: ["Pool", "Gym", "Parking", "Concierge", "Security", "Boat Dock"],
    status: "active",
    rating: 4.7,
    manager: "David Wilson",
    lastInspection: "2024-04-18",
  },
]

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>(mockBuildings)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const filteredBuildings = buildings.filter((building) => {
    const matchesStatus = statusFilter === "all" || building.status === statusFilter
    return matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      maintenance: "bg-amber-100 text-amber-700",
      inactive: "bg-slate-100 text-slate-700",
    }
    const icons = {
      active: <CheckCircle className="h-3 w-3 mr-1" />,
      maintenance: <AlertCircle className="h-3 w-3 mr-1" />,
      inactive: <XCircle className="h-3 w-3 mr-1" />,
    }
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getOccupancyRate = (building: Building) => {
    return Math.round((building.occupiedUnits / building.totalUnits) * 100)
  }

  const handleDeleteBuilding = (buildingId: string) => {
    if (confirm("Are you sure you want to delete this building?")) {
      setBuildings(buildings.filter((b) => b.id !== buildingId))
    }
  }

  const handleToggleStatus = (buildingId: string) => {
    setBuildings(
      buildings.map((b) =>
        b.id === buildingId
          ? {
              ...b,
              status: b.status === "active" ? "inactive" : "active",
            }
          : b
      )
    )
  }

  const handleAddBuilding = () => {
    alert("Adding new building...")
    setIsAddDialogOpen(false)
  }

  const handleEditBuilding = () => {
    alert("Updating building...")
    setIsEditDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Buildings</h1>
          <p className="text-slate-600 mt-1">
            Manage all properties and building information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Building
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Building</DialogTitle>
              <DialogDescription>
                Add a new property to your management portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Building Name
                </label>
                <Input placeholder="Sunset Tower" className="border-slate-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Street Address
                </label>
                <Input placeholder="123 Ocean Boulevard" className="border-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    City
                  </label>
                  <Input placeholder="Miami" className="border-slate-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    State
                  </label>
                  <Input placeholder="FL" className="border-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Total Units
                  </label>
                  <Input type="number" placeholder="120" className="border-slate-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Floors
                  </label>
                  <Input type="number" placeholder="15" className="border-slate-200" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-slate-200"
              >
                Cancel
              </Button>
              <Button onClick={handleAddBuilding} className="bg-emerald-600 hover:bg-emerald-700">
                Add Building
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Buildings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {buildings.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Units</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {buildings.reduce((sum, b) => sum + b.totalUnits, 0)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DoorOpen className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Occupied Units</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {buildings.reduce((sum, b) => sum + b.occupiedUnits, 0)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Rating</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {(buildings.reduce((sum, b) => sum + b.rating, 0) / buildings.length).toFixed(1)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3"
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 h-10 flex items-center gap-2 transition-colors ${
              viewMode === "grid"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Grid3x3 className="h-4 w-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 h-10 flex items-center gap-2 transition-colors ${
              viewMode === "table"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <List className="h-4 w-4" />
            Table
          </button>
        </div>
      </motion.div>

      {/* Buildings Grid */}
      {viewMode === "grid" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredBuildings.map((building, index) => (
            <motion.div
              key={building.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <Card className="border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {building.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {building.city}, {building.state}
                      </div>
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBuilding(building)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Building
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(building.id)}
                        >
                          {building.status === "active" ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteBuilding(building.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Building
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {getStatusBadge(building.status)}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Occupancy</span>
                      <span className="font-semibold text-slate-900">
                        {getOccupancyRate(building)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${getOccupancyRate(building)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <DoorOpen className="h-4 w-4" />
                      <span>{building.totalUnits} units</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="h-4 w-4" />
                      <span>{building.floors} floors</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-slate-900">
                      {building.rating}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {building.amenities.slice(0, 3).map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="text-xs bg-slate-50 border-slate-200"
                      >
                        {amenity}
                      </Badge>
                    ))}
                    {building.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                        +{building.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Manager</span>
                      <span className="font-medium text-slate-900">
                        {building.manager}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2"
                    onClick={() => { setSelectedBuilding(building); setIsDetailDialogOpen(true) }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Table View */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Building</TableHead>
                    <TableHead className="font-semibold text-slate-700">Location</TableHead>
                    <TableHead className="font-semibold text-slate-700">Units</TableHead>
                    <TableHead className="font-semibold text-slate-700">Occupancy</TableHead>
                    <TableHead className="font-semibold text-slate-700">Rating</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Manager</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuildings.map((building) => (
                    <TableRow
                      key={building.id}
                      className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">
                            {building.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            Built {building.yearBuilt}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-3 w-3" />
                          {building.city}, {building.state}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-slate-900">
                            {building.totalUnits}
                          </p>
                          <p className="text-slate-500">
                            {building.availableUnits} available
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${getOccupancyRate(building)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {getOccupancyRate(building)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-medium text-slate-900">
                            {building.rating}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(building.status)}</TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {building.manager}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBuilding(building)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Building
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(building.id)}
                            >
                              {building.status === "active" ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteBuilding(building.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Building
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Building Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Building className="h-5 w-5 text-primary" />
              {selectedBuilding?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedBuilding && (
            <div className="space-y-5 py-2">
              {/* Status + Rating */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedBuilding.status)}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-white">{selectedBuilding.rating}</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">{selectedBuilding.address}</p>
                  <p className="text-sm text-white/50">{selectedBuilding.city}, {selectedBuilding.state} {selectedBuilding.zipCode}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40 mb-1">Total Units</p>
                  <p className="text-2xl font-bold text-white">{selectedBuilding.totalUnits}</p>
                  <p className="text-xs text-white/40 mt-1">{selectedBuilding.occupiedUnits} occupied · {selectedBuilding.availableUnits} available</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40 mb-1">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-emerald-400">{getOccupancyRate(selectedBuilding)}%</p>
                  <div className="mt-2 h-1.5 bg-white/10 rounded-full">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${getOccupancyRate(selectedBuilding)}%` }} />
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40 mb-1">Floors</p>
                  <p className="text-2xl font-bold text-white">{selectedBuilding.floors}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40 mb-1">Year Built</p>
                  <p className="text-2xl font-bold text-white">{selectedBuilding.yearBuilt}</p>
                </div>
              </div>

              {/* Manager + Inspection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40 mb-1">Manager</p>
                  <p className="font-semibold text-white">{selectedBuilding.manager}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40 mb-1">Last Inspection</p>
                  <p className="font-semibold text-white">{new Date(selectedBuilding.lastInspection).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <p className="text-xs text-white/40 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBuilding.amenities.map(a => (
                    <span key={a} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/15 border border-primary/20 text-primary">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/10 text-white/60 hover:bg-white/5"
              onClick={() => { setIsDetailDialogOpen(false); setIsEditDialogOpen(true) }}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Building
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Building Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Building</DialogTitle>
          </DialogHeader>
          {selectedBuilding && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Building Name</label>
                <Input defaultValue={selectedBuilding.name} />
              </div>
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Street Address</label>
                <Input defaultValue={selectedBuilding.address} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">City</label>
                  <Input defaultValue={selectedBuilding.city} />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">State</label>
                  <Input defaultValue={selectedBuilding.state} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Total Units</label>
                  <Input type="number" defaultValue={selectedBuilding.totalUnits} />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Floors</label>
                  <Input type="number" defaultValue={selectedBuilding.floors} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/10 text-white/60">
              Cancel
            </Button>
            <Button onClick={handleEditBuilding} className="bg-emerald-600 hover:bg-emerald-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
