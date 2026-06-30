"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Download, FileText, FileSpreadsheet, BarChart3, Trophy } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  getMonthlyIncome, getCategoryTotals, getTopContributors, getPendingMonthlyContributions,
} from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

export default function ReportsPage() {
  const monthlyIncome = useMemo(() => getMonthlyIncome(), [])
  const categoryTotals = useMemo(() => getCategoryTotals(), [])
  const topContributors = useMemo(() => getTopContributors(), [])
  const pending = useMemo(() => getPendingMonthlyContributions(), [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Analytics, charts, and exportable reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><FileText className="h-4 w-4" /> PDF</Button>
          <Button variant="outline" size="sm" className="gap-2"><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> CSV</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Monthly Income Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" /> Monthly Income vs Expenses
                </CardTitle>
                <CardDescription>Last 12 months overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyIncome} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                    <YAxis className="text-xs" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }}
                    />
                    <Bar dataKey="income" fill="#6366f1" radius={[6, 6, 0, 0]} name="Income" />
                    <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-base">Category-wise Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={categoryTotals.filter((c) => c.value > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {categoryTotals.filter((c) => c.value > 0).map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }} />
                      <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", paddingTop: "16px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-base">Category Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs">Category</TableHead>
                        <TableHead className="text-xs text-right">Amount</TableHead>
                        <TableHead className="text-xs text-right">Share</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryTotals.filter(c => c.value > 0).sort((a, b) => b.value - a.value).map((cat) => {
                        const total = categoryTotals.reduce((s, c) => s + c.value, 0)
                        return (
                          <TableRow key={cat.name}>
                            <TableCell className="flex items-center gap-2 text-sm">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.name}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-sm">{formatCurrency(cat.value)}</TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">
                              {total > 0 ? ((cat.value / total) * 100).toFixed(1) : 0}%
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="contributors" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" /> Top Contributors
                </CardTitle>
                <CardDescription>Families with highest total contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topContributors.map((contributor, i) => (
                    <div key={contributor.familyId} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" :
                        i === 1 ? "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300" :
                        i === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {contributor.houseName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{contributor.houseName}</p>
                      </div>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(contributor.total)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Pending Monthly Contributions</CardTitle>
                <CardDescription>Families who haven&apos;t paid this month&apos;s contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Family No</TableHead>
                      <TableHead className="text-xs">House Name</TableHead>
                      <TableHead className="text-xs">Head of Family</TableHead>
                      <TableHead className="text-xs">Phone</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell><Badge variant="secondary" className="font-mono text-xs">{f.familyNo}</Badge></TableCell>
                        <TableCell className="text-sm">{f.houseName}</TableCell>
                        <TableCell className="text-sm">{f.headOfFamily}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{f.phone}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-7 text-xs">Send Reminder</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
