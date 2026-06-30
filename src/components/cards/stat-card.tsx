"use client"

import { type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { motion } from "framer-motion"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: number
  href?: string
  color?: string
  isCurrency?: boolean
  index?: number
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend = 0,
  href,
  color = "bg-primary/10 text-primary",
  isCurrency = true,
  index = 0,
}: StatCardProps) {
  const isPositive = trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-card">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/[0.02] group-hover:to-primary/[0.05] transition-all duration-500" />

        <CardContent className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {title}
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {isCurrency ? formatCurrency(value) : value.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center gap-2">
                {trend !== 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md",
                      isPositive
                        ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50"
                        : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/50"
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(trend)}%
                  </span>
                )}
                {href && (
                  <Link
                    href={href}
                    className="text-xs text-primary hover:text-primary/80 font-medium hover:underline"
                  >
                    View Details →
                  </Link>
                )}
              </div>
            </div>

            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                color
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
