"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Search, MoreHorizontal, Edit, Trash2,
  CheckCircle2, TrendingUp, PauseCircle, Target,
  Calendar, User, X, AlertCircle, Wallet,
  FolderKanban, Flag, Users, PiggyBank, ArrowUpRight, ArrowDownRight, Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { useData } from "@/lib/data-context"
import { type Project } from "@/lib/data"
import Link from "next/link"

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active: {
    label: "Active",
    Icon: TrendingUp,
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    Icon: CheckCircle2,
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  "on-hold": {
    label: "On Hold",
    Icon: PauseCircle,
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    dot: "bg-amber-500",
  },
} as const

const PRIORITY_CONFIG = {
  high: { label: "High", className: "text-red-600 dark:text-red-400" },
  medium: { label: "Medium", className: "text-amber-600 dark:text-amber-400" },
  low: { label: "Low", className: "text-slate-500 dark:text-slate-400" },
} as const

// ─── Empty form ───────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  description: "",
  status: "active" as Project["status"],
  priority: "medium" as Project["priority"],
  budget: "",
  spent: "",
  progress: "0",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  lead: "",
  tags: "",
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const { projects, setProjects, transactions } = useData()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Project["status"]>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  // Details sheet states
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null)
  const [contribSearch, setContribSearch] = useState("")

  // Sync details sheet with updated project data if it changes in list
  const activeDetailsProject = useMemo(() => {
    if (!selectedProjectForDetails) return null
    return projects.find((p) => p.id === selectedProjectForDetails.id) || null
  }, [projects, selectedProjectForDetails])

  // Reset contribution search when project changes
  useEffect(() => {
    setContribSearch("")
  }, [selectedProjectForDetails])

  // ── Contributions statistics ──
  const projectContributions = useMemo(() => {
    if (!activeDetailsProject) return []
    return transactions.filter(
      (t) => t.category === "new-project" && t.projectId === activeDetailsProject.id && t.type === "income"
    )
  }, [transactions, activeDetailsProject])

  const totalFundRaised = useMemo(() => {
    return projectContributions.reduce((sum, t) => sum + t.amount, 0)
  }, [projectContributions])

  const uniqueContributorsCount = useMemo(() => {
    const uniqueIds = new Set(projectContributions.map((t) => t.familyId || t.memberName))
    return uniqueIds.size
  }, [projectContributions])

  const filteredContributions = useMemo(() => {
    const q = contribSearch.toLowerCase()
    return projectContributions.filter(
      (t) =>
        !q ||
        t.memberName.toLowerCase().includes(q) ||
        t.houseName.toLowerCase().includes(q) ||
        t.receiptNo.toLowerCase().includes(q)
    )
  }, [projectContributions, contribSearch])

  // ── Stats ──
  const stats = useMemo(() => {
    const totalBudget = projects.reduce((s, p) => s + p.budget, 0)
    const totalSpent = projects.reduce((s, p) => s + p.spent, 0)
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === "active").length,
      completed: projects.filter((p) => p.status === "completed").length,
      onHold: projects.filter((p) => p.status === "on-hold").length,
      totalBudget,
      totalSpent,
    }
  }, [projects])

  // ── Filter ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return projects.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.lead.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      const matchStatus = statusFilter === "all" || p.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [projects, search, statusFilter])

  // ── CRUD ──
  function openCreate() {
    setEditProject(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  function openEdit(project: Project) {
    setEditProject(project)
    setForm({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      budget: String(project.budget),
      spent: String(project.spent),
      progress: String(project.progress),
      startDate: project.startDate,
      endDate: project.endDate,
      lead: project.lead,
      tags: project.tags.join(", "),
    })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) return
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    const budget = Number(form.budget) || 0
    const spent = Number(form.spent) || 0
    const progress = Math.min(100, Math.max(0, Number(form.progress) || 0))

    if (editProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editProject.id
            ? { ...p, ...form, budget, spent, progress, tags }
            : p
        )
      )
    } else {
      const next: Project = {
        id: `p-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        budget,
        spent,
        progress,
        startDate: form.startDate,
        endDate: form.endDate,
        lead: form.lead.trim(),
        tags,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setProjects((prev) => [next, ...prev])
    }
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setDeleteId(null)
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage church construction and development projects
          </p>
        </div>
        <Button
          id="new-project-btn"
          onClick={openCreate}
          className="gap-2 shadow-sm shadow-primary/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          {
            label: "Total Projects",
            value: stats.total,
            Icon: FolderKanban,
            color: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
            isNum: true,
          },
          {
            label: "Active",
            value: stats.active,
            Icon: TrendingUp,
            color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
            isNum: true,
          },
          {
            label: "Total Budget",
            value: formatCurrency(stats.totalBudget),
            Icon: Wallet,
            color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
            isNum: false,
          },
          {
            label: "Total Spent",
            value: formatCurrency(stats.totalSpent),
            Icon: Target,
            color: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
            isNum: false,
          },
        ] as const).map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                      s.color
                    )}
                  >
                    <s.Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground truncate">{s.label}</p>
                    <p className="text-xl font-bold leading-tight">{s.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Status filter pills */}
        <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1 text-xs shrink-0">
          {(
            [
              { key: "all", label: `All (${projects.length})` },
              { key: "active", label: `Active (${stats.active})` },
              { key: "completed", label: `Done (${stats.completed})` },
              { key: "on-hold", label: `Paused (${stats.onHold})` },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              id={`filter-${key}`}
              onClick={() => setStatusFilter(key)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-all",
                statusFilter === key
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="project-search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-background border-border/60 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid / Empty State */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FolderKanban className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold">No projects found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {search
              ? "Try a different search term"
              : "Create your first project to get started"}
          </p>
          {!search && (
            <Button onClick={openCreate} size="sm" className="mt-4 gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const sc = STATUS_CONFIG[project.status]
              const pc = PRIORITY_CONFIG[project.priority]
              const pctSpent =
                project.budget > 0
                  ? Math.round((project.spent / project.budget) * 100)
                  : 0
              const overBudget = pctSpent > 100

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="h-full"
                >
                  <Card
                    onClick={() => setSelectedProjectForDetails(project)}
                    className="group cursor-pointer border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col"
                  >
                    <CardHeader className="pb-3 flex-none">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px] font-medium gap-1 py-0.5 px-2",
                                sc.badge
                              )}
                            >
                              <div className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                              {sc.label}
                            </Badge>
                            <span
                              className={cn(
                                "text-[10px] font-medium flex items-center gap-0.5",
                                pc.className
                              )}
                            >
                              <Flag className="h-2.5 w-2.5" />
                              {pc.label}
                            </span>
                          </div>
                          <h3 className="font-semibold text-sm leading-snug">{project.name}</h3>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center rounded-lg hover:bg-accent outline-none"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                openEdit(project)
                              }}
                            >
                              <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteId(project.id)
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {project.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3 flex-1 flex flex-col justify-end">
                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] text-muted-foreground">Progress</span>
                          <span className="text-[10px] font-semibold tabular-nums">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>

                      {/* Budget grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-muted/50 p-2.5">
                          <p className="text-[10px] text-muted-foreground mb-0.5">Budget</p>
                          <p className="text-xs font-semibold tabular-nums">
                            {formatCurrency(project.budget)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2.5">
                          <p className="text-[10px] text-muted-foreground mb-0.5">
                            Spent ({pctSpent}%)
                          </p>
                          <p
                            className={cn(
                              "text-xs font-semibold tabular-nums",
                              overBudget && "text-red-600 dark:text-red-400"
                            )}
                          >
                            {formatCurrency(project.spent)}
                          </p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                        {project.lead && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {project.lead}
                          </span>
                        )}
                        {project.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.startDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── Project Contributor Details Sheet ── */}
      <Sheet open={!!activeDetailsProject} onOpenChange={(open) => !open && setSelectedProjectForDetails(null)}>
        <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl flex flex-col h-full p-0 bg-background overflow-hidden">
          {activeDetailsProject && (() => {
            const budget = activeDetailsProject.budget
            const spent = activeDetailsProject.spent
            const spentPct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0
            const fundedPct = budget > 0 ? Math.min(100, Math.round((totalFundRaised / budget) * 100)) : 0
            const overBudget = spentPct > 100

            return (
              <>
                {/* Sheet Header with gradient accent */}
                <div className="relative px-6 pt-6 pb-5 border-b bg-gradient-to-br from-background to-muted/20 shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={cn("text-[10px] font-medium gap-1.5 py-0.5 px-2.5", STATUS_CONFIG[activeDetailsProject.status].badge)}>
                      <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", STATUS_CONFIG[activeDetailsProject.status].dot)} />
                      {STATUS_CONFIG[activeDetailsProject.status].label}
                    </Badge>
                    <span className={cn("text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full border",
                      activeDetailsProject.priority === "high" ? "border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400" :
                        activeDetailsProject.priority === "medium" ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400" :
                          "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
                    )}>
                      <Flag className="h-2.5 w-2.5" />
                      {PRIORITY_CONFIG[activeDetailsProject.priority].label}
                    </span>
                  </div>

                  <SheetHeader className="p-0">
                    <SheetTitle className="text-2xl font-bold tracking-tight">{activeDetailsProject.name}</SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
                    {activeDetailsProject.lead && (
                      <span className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-2.5 w-2.5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{activeDetailsProject.lead}</span>
                      </span>
                    )}
                    {activeDetailsProject.startDate && (
                      <span className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                          <Calendar className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                        {formatDate(activeDetailsProject.startDate)}
                        {activeDetailsProject.endDate && <span className="text-muted-foreground/50">→ {formatDate(activeDetailsProject.endDate)}</span>}
                      </span>
                    )}
                    {activeDetailsProject.tags.length > 0 && activeDetailsProject.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Project progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">Overall Progress</span>
                      <span className="text-xs font-bold tabular-nums">{activeDetailsProject.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${activeDetailsProject.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Cards — 2×2 grid */}
                <div className="grid grid-cols-2 gap-3 px-6 py-5 border-b shrink-0">
                  {/* Budget */}
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Wallet className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Budget</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold tabular-nums leading-none">{formatCurrency(budget)}</p>
                      <p className="text-[11px] text-muted-foreground mt-1.5">Total project budget</p>
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className={cn(
                    "rounded-2xl border p-4 flex flex-col gap-3",
                    overBudget
                      ? "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20"
                      : "border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20"
                  )}>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-7 w-7 rounded-xl flex items-center justify-center shrink-0",
                        overBudget ? "bg-red-100 dark:bg-red-900" : "bg-amber-100 dark:bg-amber-900"
                      )}>
                        {overBudget
                          ? <ArrowUpRight className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          : <ArrowDownRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        }
                      </div>
                      <span className={cn(
                        "text-xs font-semibold uppercase tracking-wide",
                        overBudget ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                      )}>Expenses</span>
                    </div>
                    <div>
                      <p className={cn(
                        "text-xl font-bold tabular-nums leading-none",
                        overBudget ? "text-red-600 dark:text-red-400" : "text-amber-700 dark:text-amber-300"
                      )}>{formatCurrency(spent)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, spentPct)}%` }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className={cn("h-full rounded-full", overBudget ? "bg-red-500" : "bg-amber-500")}
                          />
                        </div>
                        <span className={cn(
                          "text-[11px] font-bold tabular-nums shrink-0",
                          overBudget ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                        )}>{spentPct}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Funding Raised */}
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <PiggyBank className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-primary/80 uppercase tracking-wide">Funding Raised</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold tabular-nums leading-none text-primary">{formatCurrency(totalFundRaised)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 rounded-full bg-primary/15 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fundedPct}%` }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                        <span className="text-[11px] font-bold tabular-nums text-primary shrink-0">{fundedPct}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Contributors */}
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                        <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Contributors</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold tabular-nums leading-none text-emerald-600 dark:text-emerald-400">
                        {uniqueContributorsCount} <span className="text-sm font-medium text-muted-foreground">people</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        {projectContributions.length} transaction{projectContributions.length !== 1 ? "s" : ""} recorded
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contributions Section */}
                <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                  {/* Contributions Header & Search */}
                  <div className="px-6 pt-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b shrink-0">
                    <div>
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                        Contributions
                        <span className="inline-flex items-center justify-center h-4.5 min-w-[1.25rem] px-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {filteredContributions.length}
                        </span>
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Individual donor details for this project</p>
                    </div>
                    <div className="relative w-full sm:w-56">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search contributors..."
                        value={contribSearch}
                        onChange={(e) => setContribSearch(e.target.value)}
                        className="pl-8 h-8 bg-muted/30 border-border/50 text-xs rounded-lg"
                      />
                      {contribSearch && (
                        <button
                          onClick={() => setContribSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="flex-1">
                    {filteredContributions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                          <PiggyBank className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-semibold">No contributions found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {contribSearch ? "Try a different search query" : "No contributions have been recorded yet for this project"}
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="text-[10px] font-semibold h-9 py-0 pl-6">Date</TableHead>
                            <TableHead className="text-[10px] font-semibold h-9 py-0">Contributor</TableHead>
                            <TableHead className="text-[10px] font-semibold h-9 py-0 text-right">Amount</TableHead>
                            <TableHead className="text-[10px] font-semibold h-9 py-0">Method</TableHead>
                            <TableHead className="text-[10px] font-semibold h-9 py-0 text-right pr-6">Receipt</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredContributions.map((t) => (
                            <TableRow key={t.id} className="hover:bg-muted/30 transition-colors text-xs group/row">
                              <TableCell className="py-3 text-muted-foreground pl-6">
                                {new Date(t.date).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "2-digit",
                                })}
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                                    <span className="text-[9px] font-bold text-primary">
                                      {t.memberName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium">{t.memberName}</div>
                                    <div className="text-[10px] text-muted-foreground">{t.houseName} · #{t.familyNo}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-3 text-right">
                                <span className="inline-flex items-center justify-end font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                  {formatCurrency(t.amount)}
                                </span>
                              </TableCell>
                              <TableCell className="py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium capitalize">
                                  {t.paymentMethod.replace("-", " ")}
                                </span>
                              </TableCell>
                              <TableCell className="py-3 text-right pr-6">
                                <Link
                                  href={`/receipts/${t.id}`}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono text-primary hover:underline group-hover/row:opacity-100 opacity-70 transition-opacity"
                                >
                                  {t.receiptNo}
                                  <ArrowUpRight className="h-2.5 w-2.5" />
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center",
                editProject ? "bg-amber-100 dark:bg-amber-950" : "bg-primary/10"
              )}>
                {editProject
                  ? <Edit className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  : <FolderKanban className="h-4 w-4 text-primary" />
                }
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">{editProject ? "Edit Project" : "New Project"}</DialogTitle>
                <DialogDescription className="text-xs mt-0">
                  {editProject
                    ? "Update the project details below."
                    : "Fill in the details to create a new project."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="proj-name">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="proj-name"
                placeholder="e.g. Church Hall Renovation"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea
                id="proj-desc"
                placeholder="Brief description of the project…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="resize-none"
                rows={2}
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as Project["status"] }))
                  }
                >
                  <SelectTrigger id="proj-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, priority: v as Project["priority"] }))
                  }
                >
                  <SelectTrigger id="proj-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget + Spent */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="proj-budget">Budget (₹)</Label>
                <Input
                  id="proj-budget"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="proj-spent">Spent (₹)</Label>
                <Input
                  id="proj-spent"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.spent}
                  onChange={(e) => setForm((f) => ({ ...f, spent: e.target.value }))}
                />
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <Label htmlFor="proj-progress">Progress (0 – 100 %)</Label>
              <Input
                id="proj-progress"
                type="number"
                min={0}
                max={100}
                placeholder="0"
                value={form.progress}
                onChange={(e) => setForm((f) => ({ ...f, progress: e.target.value }))}
              />
            </div>

            {/* Lead */}
            <div className="space-y-1.5">
              <Label htmlFor="proj-lead">Project Lead</Label>
              <Input
                id="proj-lead"
                placeholder="e.g. Fr. Thomas"
                value={form.lead}
                onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="proj-start">Start Date</Label>
                <Input
                  id="proj-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="proj-end">End Date</Label>
                <Input
                  id="proj-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label htmlFor="proj-tags">Tags</Label>
              <Input
                id="proj-tags"
                placeholder="construction, renovation, community (comma separated)"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button id="save-project-btn" onClick={handleSave} disabled={!form.name.trim()}>
              {editProject ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Project
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The project will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              id="confirm-delete-btn"
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
