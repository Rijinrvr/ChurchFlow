"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft, Phone, Calendar, Home, Cake, Heart, CreditCard, Gift, User,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useData } from "@/lib/data-context"
import { formatDate, formatCurrency, getAge, getCategoryByValue } from "@/lib/utils"

export default function MemberDetailPage() {
  const params = useParams()
  const { members, transactions } = useData()

  const member = members.find((m) => m.id === params.id)

  const memberTransactions = useMemo(
    () => transactions.filter((t) => t.memberId === params.id),
    [transactions, params.id]
  )

  const stats = useMemo(() => {
    const mt = memberTransactions.filter((t) => t.type === "income")
    return {
      birthday: mt.filter((t) => t.category === "birthday").reduce((s, t) => s + t.amount, 0),
      wedding: mt.filter((t) => t.category === "wedding").reduce((s, t) => s + t.amount, 0),
      monthly: mt.filter((t) => t.category === "monthly").reduce((s, t) => s + t.amount, 0),
      donations: mt.reduce((s, t) => s + t.amount, 0),
    }
  }, [memberTransactions])

  if (!member) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">Member not found</p>
          <Link href="/members"><Button variant="outline">Go Back</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/members">
        <Button variant="ghost" className="gap-2 -ml-2"><ArrowLeft className="h-4 w-4" /> Back to Members</Button>
      </Link>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/30" />
          <CardContent className="p-6 -mt-12">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{member.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="font-mono">{member.memberId}</Badge>
                  <span className="flex items-center gap-1"><Home className="h-3.5 w-3.5" />
                    <Link href={`/families/${member.familyId}`} className="hover:text-primary">{member.houseName}</Link>
                  </span>
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{member.phone}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(member.dob)} ({getAge(member.dob)} yrs)</span>
                  <Badge variant="outline" className="capitalize">{member.gender}</Badge>
                  <Badge>{member.role}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Birthday Contributions", value: stats.birthday, icon: Cake, color: "text-pink-600 bg-pink-100 dark:bg-pink-950 dark:text-pink-400" },
          { label: "Wedding Contributions", value: stats.wedding, icon: Heart, color: "text-rose-600 bg-rose-100 dark:bg-rose-950 dark:text-rose-400" },
          { label: "Monthly Contributions", value: stats.monthly, icon: CreditCard, color: "text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400" },
          { label: "Total Donations", value: stats.donations, icon: Gift, color: "text-violet-600 bg-violet-100 dark:bg-violet-950 dark:text-violet-400" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(stat.value)}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contribution Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Contribution History</CardTitle>
            <CardDescription>Timeline of all contributions</CardDescription>
          </CardHeader>
          <CardContent>
            {memberTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No contributions recorded yet</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {memberTransactions.slice(0, 15).map((t, i) => {
                    const cat = getCategoryByValue(t.category)
                    return (
                      <div key={t.id} className="relative pl-10">
                        <div
                          className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-background"
                          style={{ backgroundColor: cat?.color || "#6366f1" }}
                        />
                        <div className="flex items-start justify-between gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="text-sm font-medium">{t.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-[10px]">
                                {cat?.emoji} {cat?.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{t.receiptNo}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(t.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{formatDate(t.date)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
