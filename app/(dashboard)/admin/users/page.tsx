"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Plus,
  MoreVertical,
  Shield,
  Phone,
  Building,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "admin" | "resident" | "manager"
  status: "active" | "inactive" | "pending"
  building: string
  unit: string
  joinedDate: string
  lastActive: string
  avatarColor: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@batima-gest.com",
    phone: "+1 234 567 8901",
    role: "admin",
    status: "active",
    building: "Building A",
    unit: "A-101",
    joinedDate: "2024-01-15",
    lastActive: "2024-05-03",
    avatarColor: "bg-purple-500",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@batima-gest.com",
    phone: "+1 234 567 8902",
    role: "resident",
    status: "active",
    building: "Building A",
    unit: "A-205",
    joinedDate: "2024-02-20",
    lastActive: "2024-05-02",
    avatarColor: "bg-emerald-500",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@batima-gest.com",
    phone: "+1 234 567 8903",
    role: "manager",
    status: "active",
    building: "Building B",
    unit: "B-301",
    joinedDate: "2024-03-10",
    lastActive: "2024-05-01",
    avatarColor: "bg-blue-500",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@batima-gest.com",
    phone: "+1 234 567 8904",
    role: "resident",
    status: "pending",
    building: "Building C",
    unit: "C-102",
    joinedDate: "2024-04-25",
    lastActive: "Never",
    avatarColor: "bg-amber-500",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@batima-gest.com",
    phone: "+1 234 567 8905",
    role: "resident",
    status: "inactive",
    building: "Building A",
    unit: "A-305",
    joinedDate: "2024-01-05",
    lastActive: "2024-04-15",
    avatarColor: "bg-rose-500",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: "bg-purple-100 text-purple-700",
      manager: "bg-blue-100 text-blue-700",
      resident: "bg-emerald-100 text-emerald-700",
    }
    return (
      <Badge className={styles[role as keyof typeof styles]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-slate-100 text-slate-700",
      pending: "bg-amber-100 text-amber-700",
    }
    const icons = {
      active: <CheckCircle className="h-3 w-3 mr-1" />,
      inactive: <XCircle className="h-3 w-3 mr-1" />,
      pending: <Calendar className="h-3 w-3 mr-1" />,
    }
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    )
  }

  const handleAddUser = () => {
    alert("Creating new user...")
    setIsAddDialogOpen(false)
  }

  const handleEditUser = () => {
    alert("Updating user...")
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
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">
            Manage all users, roles, and permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with appropriate permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Full Name
                </label>
                <Input placeholder="John Doe" className="border-slate-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Email Address
                </label>
                <Input type="email" placeholder="john@example.com" className="border-slate-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Phone Number
                </label>
                <Input placeholder="+1 234 567 8900" className="border-slate-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Role
                </label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white">
                  <option value="resident">Resident</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Building
                  </label>
                  <Input placeholder="Building A" className="border-slate-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Unit
                  </label>
                  <Input placeholder="A-101" className="border-slate-200" />
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
              <Button onClick={handleAddUser} className="bg-emerald-600 hover:bg-emerald-700">
                Create User
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
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {users.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Admins</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {users.filter((u) => u.status === "pending").length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="resident">Resident</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </motion.div>

      {/* Users Table */}
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
                  <TableHead className="font-semibold text-slate-700">User</TableHead>
                  <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                  <TableHead className="font-semibold text-slate-700">Role</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Location</TableHead>
                  <TableHead className="font-semibold text-slate-700">Joined</TableHead>
                  <TableHead className="font-semibold text-slate-700">Last Active</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-semibold text-sm`}>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Building className="h-3 w-3" />
                        {user.building}, {user.unit}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {user.lastActive === "Never"
                        ? "Never"
                        : new Date(user.lastActive).toLocaleDateString()}
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
                              setSelectedUser(user)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status === "active" ? (
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
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Full Name
                </label>
                <Input defaultValue={selectedUser.name} className="border-slate-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Email Address
                </label>
                <Input type="email" defaultValue={selectedUser.email} className="border-slate-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Phone Number
                </label>
                <Input defaultValue={selectedUser.phone} className="border-slate-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Role
                </label>
                <select
                  defaultValue={selectedUser.role}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
                >
                  <option value="resident">Resident</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Building
                  </label>
                  <Input defaultValue={selectedUser.building} className="border-slate-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Unit
                  </label>
                  <Input defaultValue={selectedUser.unit} className="border-slate-200" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser} className="bg-emerald-600 hover:bg-emerald-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
