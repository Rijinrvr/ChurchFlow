"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Bell,
  Search,
  Sun,
  Moon,
  Plus,
  LogOut,
  Settings,
  User,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AddIncomeDialog } from "@/components/dialogs/add-income-dialog"
import { cn } from "@/lib/utils"

// ─── Breadcrumb map ───────────────────────────────────────────────────────────

type Crumb = { title: string; parent?: { label: string; url?: string } }

const ROUTE_MAP: Record<string, Crumb> = {
  "/": { title: "Dashboard" },
  "/families": { title: "Families" },
  "/members": { title: "Members" },
  "/projects": { title: "Projects" },
  "/collections/birthday": { title: "Birthday", parent: { label: "Collections" } },
  "/collections/wedding": {
    title: "Wedding Anniversary",
    parent: { label: "Collections" },
  },
  "/collections/monthly": {
    title: "Monthly Contribution",
    parent: { label: "Collections" },
  },
  "/collections/new-project": {
    title: "Projects Fund",
    parent: { label: "Collections" },
  },
  "/collections/donations": { title: "Donations", parent: { label: "Collections" } },
  "/daybook": { title: "Day Book", parent: { label: "Finance" } },
  "/receipts": { title: "Receipts", parent: { label: "Finance" } },
  "/reports": { title: "Reports", parent: { label: "Finance" } },
  "/settings": { title: "Settings" },
  "/settings/users": {
    title: "Users & Roles",
    parent: { label: "Settings", url: "/settings" },
  },
  "/settings/backup": {
    title: "Backup",
    parent: { label: "Settings", url: "/settings" },
  },
}

function getBreadcrumb(pathname: string): Crumb {
  if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname]
  if (pathname.startsWith("/families/"))
    return { title: "Family Details", parent: { label: "Families", url: "/families" } }
  if (pathname.startsWith("/members/"))
    return { title: "Member Details", parent: { label: "Members", url: "/members" } }
  if (pathname.startsWith("/receipts/"))
    return { title: "Receipt Details", parent: { label: "Receipts", url: "/receipts" } }
  return { title: "Dashboard" }
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

export function Topbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { isMobile } = useSidebar()
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)

  const crumb = getBreadcrumb(pathname)

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur-md px-4 md:px-5">

        {/* Mobile sidebar trigger — hidden on desktop */}
        <SidebarTrigger className="md:hidden shrink-0 h-8 w-8" />

        {/* Breadcrumb / Page title */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 min-w-0 flex-1 md:flex-none"
        >
          {crumb.parent ? (
            <>
              <span className="hidden sm:block text-sm text-muted-foreground shrink-0">
                {crumb.parent.url ? (
                  <Link
                    href={crumb.parent.url}
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb.parent.label}
                  </Link>
                ) : (
                  crumb.parent.label
                )}
              </span>
              <ChevronRight className="hidden sm:block h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              <span className="text-sm font-semibold truncate">{crumb.title}</span>
            </>
          ) : (
            <span className="text-sm font-semibold truncate">{crumb.title}</span>
          )}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search — desktop */}
        <div className="relative hidden md:block w-52 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="global-search"
            placeholder="Search…"
            className="pl-9 h-8 bg-muted/50 border-0 focus-visible:ring-1 text-sm rounded-lg"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Mobile search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 rounded-lg"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme toggle */}
          <Button
            id="theme-toggle"
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-lg"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-lg"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          </Button>

          {/* Separator */}
          <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

          {/* Add Income — hidden on mobile (in user menu instead) */}
          <Button
            id="add-income-btn"
            onClick={() => setIncomeDialogOpen(true)}
            size="sm"
            className="h-8 gap-1.5 rounded-lg text-xs px-3 shadow-sm shadow-primary/20 hidden sm:flex"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Income
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              id="user-menu-trigger"
              className="ml-1 relative h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-accent transition-colors outline-none"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@church.org</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Mobile: Add Income in dropdown */}
              <DropdownMenuItem
                className="sm:hidden"
                onClick={() => setIncomeDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Income
              </DropdownMenuItem>
              <DropdownMenuSeparator className="sm:hidden" />

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <AddIncomeDialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen} />
    </>
  )
}
