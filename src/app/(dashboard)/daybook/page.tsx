"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Search, Filter, Download, FileText, Plus, Minus, Printer,
  TrendingUp, TrendingDown, Wallet, CalendarDays, IndianRupee,
  MoreHorizontal, Eye, Pencil, Trash2, ArrowUpRight,
} from "lucide-react"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { StatCard } from "@/components/cards/stat-card"
import { AddIncomeDialog } from "@/components/dialogs/add-income-dialog"
import { useData } from "@/lib/data-context"
import { getStats, getCategoryTotals } from "@/lib/data"
import { formatCurrency, formatDate, CATEGORIES, getCategoryByValue } from "@/lib/utils"

export default function DayBookPage() {
  const { transactions } = useData()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)

  const stats = useMemo(() => getStats(), [])
  const categoryTotals = useMemo(() => getCategoryTotals(), [])
  const totalCategoryIncome = useMemo(() => categoryTotals.reduce((s, c) => s + c.value, 0), [categoryTotals])

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.memberName.toLowerCase().includes(search.toLowerCase()) ||
        t.houseName.toLowerCase().includes(search.toLowerCase()) ||
        t.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter
      const matchesPayment = paymentFilter === "all" || t.paymentMethod === paymentFilter
      return matchesSearch && matchesCategory && matchesPayment
    })
  }, [transactions, search, categoryFilter, paymentFilter])

  const todayTransactions = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    return transactions.filter((t) => t.date === today)
  }, [transactions])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Day Book</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete accounting & transaction ledger</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" /> Export PDF
          </Button>
          <Button onClick={() => setIncomeDialogOpen(true)} size="sm" className="gap-2 shadow-md shadow-primary/20">
            <Plus className="h-4 w-4" /> Add Income
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: "Income Today", value: stats.todayIncome, icon: IndianRupee, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400", trend: 12 },
          { title: "Income This Month", value: stats.monthIncome, icon: TrendingUp, color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400", trend: 8.5 },
          { title: "Income This Year", value: stats.yearIncome, icon: ArrowUpRight, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400", trend: 15.3 },
          { title: "Expenses This Month", value: stats.monthExpense, icon: TrendingDown, color: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400", trend: -3.2 },
          { title: "Net Balance", value: stats.currentBalance, icon: Wallet, color: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400", trend: 18.7 },
        ].map((card, index) => (
          <StatCard key={card.title} {...card} index={index} />
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 bg-muted/50 border-0" />
            </div>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "all")}>
              <SelectTrigger className="w-[180px] h-9">
                <Filter className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={(v) => setPaymentFilter(v ?? "all")}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="h-9 px-3">
              {filtered.length} results
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Table */}
        <div className="xl:col-span-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Receipt</TableHead>
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-xs">Family</TableHead>
                      <TableHead className="text-xs">Member</TableHead>
                      <TableHead className="text-xs">Description</TableHead>
                      <TableHead className="text-xs text-right">Amount</TableHead>
                      <TableHead className="text-xs">Method</TableHead>
                      <TableHead className="text-xs">By</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.slice(0, 30).map((t) => {
                      const cat = getCategoryByValue(t.category)
                      return (
                        <TableRow key={t.id} className="text-sm hover:bg-muted/50">
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(t.date)}</TableCell>
                          <TableCell className="font-mono text-xs">{t.receiptNo}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[10px] gap-1 whitespace-nowrap">
                              {cat?.emoji} {cat?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{t.houseName || "—"}</TableCell>
                          <TableCell className="text-xs">{t.memberName}</TableCell>
                          <TableCell className="text-xs max-w-[120px] truncate">{t.description}</TableCell>
                          <TableCell className={`text-right font-semibold text-xs ${t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                            {t.type === "expense" ? "-" : "+"}{formatCurrency(t.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] capitalize">{t.paymentMethod}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{t.collectedBy}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Printer className="mr-2 h-3.5 w-3.5" /> Print</DropdownMenuItem>
                                <DropdownMenuItem><Pencil className="mr-2 h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Donut Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Income Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryTotals.filter((c) => c.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryTotals.filter((c) => c.value > 0).map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Progress */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryTotals.filter((c) => c.value > 0).map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="font-medium">{formatCurrency(cat.value)}</span>
                  </div>
                  <Progress
                    value={totalCategoryIncome > 0 ? (cat.value / totalCategoryIncome) * 100 : 0}
                    className="h-1.5"
                    style={{ "--progress-color": cat.color } as React.CSSProperties}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Collection */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Today&apos;s Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(stats.todayIncome)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{todayTransactions.length} transactions today</p>
              <Separator className="my-3" />
              <p className="text-sm font-medium mb-2">This Month</p>
              <p className="text-lg font-bold">{formatCurrency(stats.monthIncome)}</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Add Income", icon: Plus, variant: "default" as const, onClick: () => setIncomeDialogOpen(true) },
                { label: "Add Expense", icon: Minus, variant: "outline" as const, onClick: () => {} },
                { label: "Print Day Book", icon: Printer, variant: "outline" as const, onClick: () => window.print() },
                { label: "Download PDF", icon: FileText, variant: "outline" as const, onClick: () => {} },
                { label: "Download Excel", icon: Download, variant: "outline" as const, onClick: () => {} },
              ].map((action) => (
                <Button key={action.label} variant={action.variant} size="sm" className="w-full justify-start gap-2" onClick={action.onClick}>
                  <action.icon className="h-3.5 w-3.5" /> {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddIncomeDialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen} />
    </div>
  )
}
