"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Search, MoreHorizontal, Edit, Trash2,
  CheckCircle2, TrendingUp, PauseCircle, Target,
  Calendar, User, X, AlertCircle, Wallet,
  FolderKanban, Flag,
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
import { cn, formatCurrency } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  priority: "low" | "medium" | "high"
  budget: number
  spent: number
  progress: number
  startDate: string
  endDate: string
  lead: string
  tags: string[]
  createdAt: string
}

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Church Hall Renovation",
    description:
      "Complete renovation of the main church hall including flooring, walls, ceiling and lighting fixtures.",
    status: "active",
    priority: "high",
    budget: 500000,
    spent: 175000,
    progress: 35,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    lead: "Fr. Thomas",
    tags: ["construction", "renovation"],
    createdAt: "2026-01-01",
  },
  {
    id: "p2",
    name: "Parish Hall Construction",
    description:
      "Construction of a new multipurpose parish hall for community events, gatherings and celebrations.",
    status: "active",
    priority: "high",
    budget: 1200000,
    spent: 240000,
    progress: 20,
    startDate: "2026-03-01",
    endDate: "2027-06-30",
    lead: "Deacon Samuel",
    tags: ["construction", "community"],
    createdAt: "2026-03-01",
  },
  {
    id: "p3",
    name: "Sound System Upgrade",
    description:
      "Installation of a modern audio-visual system in the church for an enhanced worship experience.",
    status: "completed",
    priority: "medium",
    budget: 85000,
    spent: 82000,
    progress: 100,
    startDate: "2025-06-01",
    endDate: "2025-09-30",
    lead: "Admin",
    tags: ["equipment", "technology"],
    createdAt: "2025-06-01",
  },
  {
    id: "p4",
    name: "Garden & Landscaping",
    description:
      "Beautification of church grounds with plants, pathways, outdoor seating and lighting.",
    status: "on-hold",
    priority: "low",
    budget: 45000,
    spent: 8000,
    progress: 18,
    startDate: "2026-02-01",
    endDate: "2026-08-31",
    lead: "Fr. Joseph",
    tags: ["landscaping", "outdoor"],
    createdAt: "2026-02-01",
  },
]

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

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "churchflow_projects"

function loadProjects(): Project[] {
  if (typeof window === "undefined") return INITIAL_PROJECTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Project[]) : INITIAL_PROJECTS
  } catch {
    return INITIAL_PROJECTS
  }
}

function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch {}
}

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
  const [projects, setProjects] = useState<Project[]>(() => loadProjects())
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Project["status"]>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    saveProjects(projects)
  }, [projects])

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
                  <Card className="group border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
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
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => openEdit(project)}>
                              <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(project.id)}
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

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProject ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription>
              {editProject
                ? "Update the project details below."
                : "Fill in the details to create a new project."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
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
