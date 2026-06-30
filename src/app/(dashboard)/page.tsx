"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users,
  UserCheck,
  Cake,
  Heart,
  Home,
  Hammer,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Minus,
  FileText,
  UserPlus,
  Printer,
  Download,
  Gift,
  ArrowRight,
  Clock,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatCard } from "@/components/cards/stat-card"
import { useData } from "@/lib/data-context"
import {
  getStats,
  getCategoryTotals,
  getUpcomingBirthdays,
  getPendingMonthlyContributions,
} from "@/lib/data"
import { formatCurrency, formatDate, getCategoryByValue } from "@/lib/utils"

export default function DashboardPage() {
  const { transactions } = useData()

  const stats = useMemo(() => getStats(), [])
  const categoryTotals = useMemo(() => getCategoryTotals(), [])
  const upcomingBirthdays = useMemo(() => getUpcomingBirthdays(), [])
  const pendingContributions = useMemo(() => getPendingMonthlyContributions(), [])
  const recentTransactions = useMemo(
    () => transactions.filter((t) => t.type === "income").slice(0, 8),
    [transactions]
  )

  const statCards = [
    { title: "Total Families", value: stats.totalFamilies, icon: Users, trend: 4.2, href: "/families", color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400", isCurrency: false },
    { title: "Total Members", value: stats.totalMembers, icon: UserCheck, trend: 3.1, href: "/members", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400", isCurrency: false },
    { title: "Birthday Fund", value: stats.birthdayFund, icon: Cake, trend: 12.5, href: "/collections/birthday", color: "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400" },
    { title: "Wedding Fund", value: stats.weddingFund, icon: Heart, trend: 8.3, href: "/collections/wedding", color: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400" },
    { title: "Monthly Fund", value: stats.monthlyFund, icon: Home, trend: 5.7, href: "/collections/monthly", color: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400" },
    { title: "New Project Fund", value: stats.projectFund, icon: Hammer, trend: 18.2, href: "/collections/new-project", color: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
    { title: "Total Income", value: stats.totalIncome, icon: TrendingUp, trend: 9.4, href: "/daybook", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
    { title: "Total Expenses", value: stats.totalExpenses, icon: TrendingDown, trend: -3.2, href: "/daybook", color: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400" },
    { title: "Current Balance", value: stats.currentBalance, icon: Wallet, trend: 15.6, href: "/reports", color: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your church management system
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <StatCard key={card.title} {...card} index={index} />
        ))}
      </div>

      {/* Main Content: Table + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Collections Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Recent Collections</CardTitle>
                <CardDescription>Latest income transactions</CardDescription>
              </div>
              <Link href="/daybook">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
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
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-xs text-right">Amount</TableHead>
                      <TableHead className="text-xs">Mode</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((t) => {
                      const cat = getCategoryByValue(t.category)
                      return (
                        <TableRow key={t.id} className="text-sm">
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDate(t.date)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{t.receiptNo}</TableCell>
                          <TableCell className="text-xs">{t.houseName}</TableCell>
                          <TableCell className="text-xs">{t.memberName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[10px] font-normal gap-1">
                              {cat?.emoji} {cat?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs">
                            {formatCurrency(t.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {t.paymentMethod}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Income Distribution</CardTitle>
              <CardDescription>Category-wise breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryTotals.filter((c) => c.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryTotals
                      .filter((c) => c.value > 0)
                      .map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", paddingTop: "16px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Birthdays */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Gift className="h-4 w-4 text-pink-500" />
                  Upcoming Birthdays
                </CardTitle>
                <Link href="/collections/birthday">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingBirthdays.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400 text-xs font-medium">
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.houseName}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] shrink-0 ${
                      m.daysUntil <= 7
                        ? "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400"
                        : ""
                    }`}
                  >
                    {m.daysUntil === 0
                      ? "Today!"
                      : m.daysUntil === 1
                      ? "Tomorrow"
                      : `${m.daysUntil} days`}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Monthly Contributions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  Pending Contributions
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {pendingContributions.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingContributions.slice(0, 5).map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-xs font-medium">
                      {f.familyNo}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.houseName}</p>
                    <p className="text-xs text-muted-foreground">{f.headOfFamily}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Remind
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Add Income", icon: Plus, href: "#", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
                  { label: "Add Expense", icon: Minus, href: "#", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" },
                  { label: "New Family", icon: Users, href: "/families", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" },
                  { label: "New Member", icon: UserPlus, href: "/members", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400" },
                  { label: "Day Book", icon: FileText, href: "/daybook", color: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400" },
                  { label: "Reports", icon: Download, href: "/reports", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400" },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <Button
                      variant="ghost"
                      className="w-full h-auto flex-col gap-2 py-4 hover:bg-muted/80 rounded-xl"
                    >
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${action.color}`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
