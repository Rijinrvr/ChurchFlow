"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Plus, type LucideIcon } from "lucide-react"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { StatCard } from "@/components/cards/stat-card"
import { AddIncomeDialog } from "@/components/dialogs/add-income-dialog"
import { useData } from "@/lib/data-context"
import { formatCurrency, formatDate, getCategoryByValue } from "@/lib/utils"
import type { CategoryType } from "@/lib/utils"

interface CollectionPageProps {
  title: string
  description: string
  category: CategoryType
  icon: LucideIcon
  iconColor: string
}

export function CollectionPageContent({
  title,
  description,
  category,
  icon,
  iconColor,
}: CollectionPageProps) {
  const { transactions } = useData()
  const [search, setSearch] = useState("")
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)

  const filtered = useMemo(() => {
    const catTransactions = transactions.filter(
      (t) => t.category === category && t.type === "income"
    )
    if (!search) return catTransactions
    return catTransactions.filter(
      (t) =>
        t.memberName.toLowerCase().includes(search.toLowerCase()) ||
        t.houseName.toLowerCase().includes(search.toLowerCase()) ||
        t.receiptNo.toLowerCase().includes(search.toLowerCase())
    )
  }, [transactions, category, search])

  const totalAmount = useMemo(
    () => filtered.reduce((s, t) => s + t.amount, 0),
    [filtered]
  )

  const today = new Date().toISOString().split("T")[0]
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()

  const todayAmount = useMemo(
    () => filtered.filter((t) => t.date === today).reduce((s, t) => s + t.amount, 0),
    [filtered, today]
  )

  const monthAmount = useMemo(
    () =>
      filtered
        .filter((t) => {
          const d = new Date(t.date)
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear
        })
        .reduce((s, t) => s + t.amount, 0),
    [filtered, thisMonth, thisYear]
  )

  // Payment method breakdown for chart
  const paymentBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach((t) => {
      map[t.paymentMethod] = (map[t.paymentMethod] || 0) + t.amount
    })
    const colors: Record<string, string> = {
      cash: "#22c55e",
      upi: "#6366f1",
      "bank-transfer": "#f59e0b",
      cheque: "#ec4899",
    }
    return Object.entries(map).map(([method, value]) => ({
      name: method.charAt(0).toUpperCase() + method.slice(1).replace("-", " "),
      value,
      color: colors[method] || "#64748b",
    }))
  }, [filtered])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button onClick={() => setIncomeDialogOpen(true)} className="gap-2 shadow-md shadow-primary/20">
          <Plus className="h-4 w-4" /> Add Contribution
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Collection" value={totalAmount} icon={icon} color={iconColor} index={0} />
        <StatCard title="Today" value={todayAmount} icon={icon} color={iconColor} index={1} trend={todayAmount > 0 ? 100 : 0} />
        <StatCard title="This Month" value={monthAmount} icon={icon} color={iconColor} index={2} trend={5.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-base">Transactions ({filtered.length})</CardTitle>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 bg-muted/50 border-0" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Receipt</TableHead>
                      <TableHead className="text-xs">Family</TableHead>
                      <TableHead className="text-xs">Member</TableHead>
                      <TableHead className="text-xs text-right">Amount</TableHead>
                      <TableHead className="text-xs">Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.slice(0, 20).map((t) => (
                      <TableRow key={t.id} className="hover:bg-muted/50">
                        <TableCell className="text-xs text-muted-foreground">{formatDate(t.date)}</TableCell>
                        <TableCell className="font-mono text-xs">{t.receiptNo}</TableCell>
                        <TableCell className="text-xs">{t.houseName}</TableCell>
                        <TableCell className="text-xs">{t.memberName}</TableCell>
                        <TableCell className="text-right font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] capitalize">{t.paymentMethod}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={paymentBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                      {paymentBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
                  No data available
                </div>
              )}
              <div className="space-y-2 mt-2">
                {paymentBreakdown.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </span>
                    <span className="font-medium">{formatCurrency(p.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddIncomeDialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen} />
    </div>
  )
}
