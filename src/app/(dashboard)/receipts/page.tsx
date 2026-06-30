"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Receipt, Eye, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { useData } from "@/lib/data-context"
import { formatDate, formatCurrency, getCategoryByValue } from "@/lib/utils"

export default function ReceiptsPage() {
  const { transactions } = useData()
  const [search, setSearch] = useState("")

  const incomeTransactions = useMemo(
    () => transactions.filter((t) => t.type === "income"),
    [transactions]
  )

  const filtered = useMemo(
    () =>
      incomeTransactions.filter(
        (t) =>
          t.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
          t.memberName.toLowerCase().includes(search.toLowerCase()) ||
          t.houseName.toLowerCase().includes(search.toLowerCase())
      ),
    [incomeTransactions, search]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Receipts</h1>
        <p className="text-sm text-muted-foreground mt-1">View and print all generated receipts</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">All Receipts ({filtered.length})</CardTitle>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search receipts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 bg-muted/50 border-0" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Receipt No</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Member</TableHead>
                  <TableHead className="text-xs">Family</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs">Method</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 30).map((t) => {
                  const cat = getCategoryByValue(t.category)
                  return (
                    <TableRow key={t.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs font-medium">{t.receiptNo}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(t.date)}</TableCell>
                      <TableCell className="text-xs">{t.memberName}</TableCell>
                      <TableCell className="text-xs">{t.houseName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] gap-1">{cat?.emoji} {cat?.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(t.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] capitalize">{t.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/receipts/${t.id}`}>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                          </Link>
                          <Link href={`/receipts/${t.id}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Printer className="h-3.5 w-3.5" /></Button>
                          </Link>
                        </div>
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
  )
}
