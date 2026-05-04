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
  CreditCard,
  Plus,
  Download,
  MoreVertical,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Wallet,
  ArrowUpRight,
} from "lucide-react"

interface Payment {
  id: string
  tenant: string
  unit: string
  building: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: "paid" | "pending" | "overdue" | "cancelled"
  method: "credit_card" | "debit_card" | "bank_transfer" | "check"
  description: string
  invoiceNumber: string
}

interface PaymentMethod {
  id: string
  type: "credit_card" | "debit_card" | "bank_transfer"
  lastFour: string
  expiryDate: string
  isDefault: boolean
  cardholder: string
}

const mockPayments: Payment[] = [
  {
    id: "1",
    tenant: "John Smith",
    unit: "A-101",
    building: "Sunset Tower",
    amount: 2500,
    dueDate: "2024-05-01",
    paidDate: "2024-04-28",
    status: "paid",
    method: "credit_card",
    description: "Monthly Rent - May 2024",
    invoiceNumber: "INV-2024-05-001",
  },
  {
    id: "2",
    tenant: "Sarah Johnson",
    unit: "A-205",
    building: "Sunset Tower",
    amount: 2800,
    dueDate: "2024-05-01",
    paidDate: null,
    status: "pending",
    method: "bank_transfer",
    description: "Monthly Rent - May 2024",
    invoiceNumber: "INV-2024-05-002",
  },
  {
    id: "3",
    tenant: "Michael Brown",
    unit: "B-301",
    building: "Mountain View",
    amount: 3200,
    dueDate: "2024-04-01",
    paidDate: null,
    status: "overdue",
    method: "debit_card",
    description: "Monthly Rent - April 2024",
    invoiceNumber: "INV-2024-04-003",
  },
  {
    id: "4",
    tenant: "Emily Davis",
    unit: "C-102",
    building: "Urban Loft",
    amount: 4500,
    dueDate: "2024-05-01",
    paidDate: "2024-04-30",
    status: "paid",
    method: "credit_card",
    description: "Monthly Rent - May 2024",
    invoiceNumber: "INV-2024-05-004",
  },
  {
    id: "5",
    tenant: "David Wilson",
    unit: "A-305",
    building: "Sunset Tower",
    amount: 2600,
    dueDate: "2024-05-01",
    paidDate: null,
    status: "pending",
    method: "check",
    description: "Monthly Rent - May 2024",
    invoiceNumber: "INV-2024-05-005",
  },
]

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "credit_card",
    lastFour: "4242",
    expiryDate: "12/25",
    isDefault: true,
    cardholder: "John Smith",
  },
  {
    id: "2",
    type: "debit_card",
    lastFour: "8888",
    expiryDate: "08/24",
    isDefault: false,
    cardholder: "John Smith",
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false)
  const [isAddMethodDialogOpen, setIsAddMethodDialogOpen] = useState(false)

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-amber-100 text-amber-700",
      overdue: "bg-red-100 text-red-700",
      cancelled: "bg-slate-100 text-slate-700",
    }
    const icons = {
      paid: <CheckCircle className="h-3 w-3 mr-1" />,
      pending: <Clock className="h-3 w-3 mr-1" />,
      overdue: <AlertCircle className="h-3 w-3 mr-1" />,
      cancelled: <XCircle className="h-3 w-3 mr-1" />,
    }
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getMethodBadge = (method: string) => {
    const styles = {
      credit_card: "bg-blue-100 text-blue-700",
      debit_card: "bg-purple-100 text-purple-700",
      bank_transfer: "bg-emerald-100 text-emerald-700",
      check: "bg-amber-100 text-amber-700",
    }
    return (
      <Badge className={styles[method as keyof typeof styles]}>
        {method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    )
  }

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingRevenue = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((sum, p) => sum + p.amount, 0)

  const overdueCount = payments.filter((p) => p.status === "overdue").length

  const handleMarkAsPaid = (paymentId: string) => {
    setPayments(
      payments.map((p) =>
        p.id === paymentId
          ? { ...p, status: "paid" as const, paidDate: new Date().toISOString().split("T")[0] }
          : p
      )
    )
  }

  const handleCancelPayment = (paymentId: string) => {
    setPayments(
      payments.map((p) =>
        p.id === paymentId ? { ...p, status: "cancelled" as const } : p
      )
    )
  }

  const handleDeletePayment = (paymentId: string) => {
    if (confirm("Are you sure you want to delete this payment?")) {
      setPayments(payments.filter((p) => p.id !== paymentId))
    }
  }

  const handleSetDefaultMethod = (methodId: string) => {
    setPaymentMethods(
      paymentMethods.map((m) => ({
        ...m,
        isDefault: m.id === methodId,
      }))
    )
  }

  const handleDeleteMethod = (methodId: string) => {
    if (confirm("Are you sure you want to remove this payment method?")) {
      setPaymentMethods(paymentMethods.filter((m) => m.id !== methodId))
    }
  }

  const handleAddPayment = () => {
    alert("Recording payment...")
    setIsAddPaymentDialogOpen(false)
  }

  const handleAddMethod = () => {
    alert("Adding payment method...")
    setIsAddMethodDialogOpen(false)
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
          <h1 className="text-2xl font-bold text-slate-900">Payments & Billing</h1>
          <p className="text-slate-600 mt-1">
            Manage payments, invoices, and billing information
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAddMethodDialogOpen} onOpenChange={setIsAddMethodDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-200">
                <Wallet className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new payment method to your account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Cardholder Name
                  </label>
                  <Input placeholder="John Smith" className="border-slate-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Card Number
                  </label>
                  <Input placeholder="4242 4242 4242 4242" className="border-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Expiry Date
                    </label>
                    <Input placeholder="MM/YY" className="border-slate-200" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      CVV
                    </label>
                    <Input placeholder="123" className="border-slate-200" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddMethodDialogOpen(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddMethod} className="bg-emerald-600 hover:bg-emerald-700">
                  Add Payment Method
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddPaymentDialogOpen} onOpenChange={setIsAddPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>
                  Record a new payment transaction
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Tenant
                  </label>
                  <Input placeholder="John Smith" className="border-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Building
                    </label>
                    <Input placeholder="Sunset Tower" className="border-slate-200" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Unit
                    </label>
                    <Input placeholder="A-101" className="border-slate-200" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Amount
                  </label>
                  <Input type="number" placeholder="2500.00" className="border-slate-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Payment Method
                  </label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white">
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddPaymentDialogOpen(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPayment} className="bg-emerald-600 hover:bg-emerald-700">
                  Record Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  ${totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center text-xs text-emerald-600 mt-2">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>+12.5% from last month</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
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
                  ${pendingRevenue.toLocaleString()}
                </p>
                <div className="flex items-center text-xs text-amber-600 mt-2">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Awaiting payment</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Overdue</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {overdueCount}
                </p>
                <div className="flex items-center text-xs text-red-600 mt-2">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  <span>Requires attention</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Payments</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {payments.length}
                </p>
                <div className="flex items-center text-xs text-blue-600 mt-2">
                  <span>This month</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          {method.cardholder}
                        </p>
                        <p className="text-sm text-slate-500">
                          •••• {method.lastFour}
                        </p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Expires {method.expiryDate}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!method.isDefault && (
                          <DropdownMenuItem
                            onClick={() => handleSetDefaultMethod(method.id)}
                          >
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteMethod(method.id)}
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
              <Button
                variant="outline"
                className="w-full border-slate-200 border-dashed"
                onClick={() => setIsAddMethodDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Payment History</CardTitle>
                <Button variant="outline" size="sm" className="border-slate-200">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Invoice</TableHead>
                    <TableHead className="font-semibold text-slate-700">Tenant</TableHead>
                    <TableHead className="font-semibold text-slate-700">Unit</TableHead>
                    <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700">Due Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Method</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-900 text-sm">
                            {payment.invoiceNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {payment.tenant}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-slate-900">
                            {payment.unit}
                          </p>
                          <p className="text-slate-500">{payment.building}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-900">
                          ${payment.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getMethodBadge(payment.method)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
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
                            {payment.status !== "paid" && (
                              <DropdownMenuItem
                                onClick={() => handleMarkAsPaid(payment.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {payment.status !== "cancelled" && (
                              <DropdownMenuItem
                                onClick={() => handleCancelPayment(payment.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Payment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeletePayment(payment.id)}
                            >
                              Delete
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
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </motion.div>
    </div>
  )
}
