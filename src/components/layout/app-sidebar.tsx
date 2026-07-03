"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Cake,
  Heart,
  Home,
  FolderKanban,
  HeartHandshake,
  BookOpen,
  Receipt,
  BarChart3,
  Settings,
  Database,
  Shield,
  Church,
  ChevronRight,
  Wallet,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"

// ─── Nav Structure ────────────────────────────────────────────────────────────

const navGroups = [
  {
    label: null,
    items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
  },
  {
    label: "People",
    icon: Users,
    defaultOpen: true,
    items: [
      { title: "Families", url: "/families", icon: Users },
      { title: "Members", url: "/members", icon: UserCheck },
    ],
  },
  {
    label: "Collections",
    icon: BookOpen,
    defaultOpen: true,
    items: [
      { title: "Birthday", url: "/collections/birthday", icon: Cake },
      { title: "Wedding Anniversary", url: "/collections/wedding", icon: Heart },
      { title: "Monthly Contribution", url: "/collections/monthly", icon: Home },
      { title: "Projects", url: "/projects", icon: FolderKanban },
      { title: "Donations", url: "/collections/donations", icon: HeartHandshake },
    ],
  },
  {
    label: "Finance",
    icon: Wallet,
    defaultOpen: false,
    items: [
      { title: "Day Book", url: "/daybook", icon: BookOpen },
      { title: "Receipts", url: "/receipts", icon: Receipt },
      { title: "Reports", url: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    defaultOpen: false,
    items: [
      { title: "Users & Roles", url: "/settings/users", icon: Shield },
      { title: "Backup", url: "/settings/backup", icon: Database },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
]

// ─── Single Nav Item ──────────────────────────────────────────────────────────

function NavItem({
  item,
  pathname,
  collapsed,
}: {
  item: { title: string; url: string; icon: React.ElementType }
  pathname: string
  collapsed: boolean
}) {
  const isActive = pathname === item.url

  return (
    <Link
      href={item.url}
      title={item.title}
      className={cn(
        "group flex items-center gap-3 rounded-lg text-sm transition-all duration-150 relative",
        collapsed
          ? "justify-center p-1.5 my-0"
          : "px-2.5 py-2 my-0.5",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md transition-all duration-150",
          collapsed ? "h-6 w-6" : "h-7 w-7",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
            : "bg-muted group-hover:bg-accent"
        )}
      >
        <item.icon className="h-3.5 w-3.5" />
      </div>
      {!collapsed && (
        <>
          <span className="truncate">{item.title}</span>
          {isActive && (
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </>
      )}
      {/* Tooltip on collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
          {item.title}
        </span>
      )}
    </Link>
  )
}

// ─── Collapsible Group ────────────────────────────────────────────────────────

function NavGroup({
  group,
  pathname,
}: {
  group: (typeof navGroups)[number]
  pathname: string
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const isAnyActive = group.items.some((item) => pathname === item.url)
  const [open, setOpen] = useState(group.defaultOpen ?? isAnyActive)

  if (!group.label) {
    return (
      <div className={cn("pt-1", isCollapsed ? "px-2" : "px-3")}>
        {group.items.map((item) => (
          <NavItem key={item.url} item={item} pathname={pathname} collapsed={isCollapsed} />
        ))}
      </div>
    )
  }

  if (isCollapsed) {
    return (
      <div className="px-2">
        <div className="h-px bg-border/40 my-0.5 mx-1" />
        {group.items.map((item) => (
          <NavItem key={item.url} item={item} pathname={pathname} collapsed={true} />
        ))}
      </div>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer select-none",
          isAnyActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {group.icon && (
          <group.icon
            className={cn(
              "h-3 w-3 shrink-0",
              isAnyActive ? "text-primary" : "text-muted-foreground"
            )}
          />
        )}
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronRight
          className={cn(
            "h-3 w-3 shrink-0 text-muted-foreground/60 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 duration-150">
        <div className="px-3 pb-1 pt-0.5">
          {group.items.map((item) => (
            <NavItem key={item.url} item={item} pathname={pathname} collapsed={false} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {/* ── Header / Logo + Hamburger ── */}
      <SidebarHeader className="border-b border-sidebar-border/60 px-3 py-3">
        {isCollapsed ? (
          /* Collapsed: stack logo icon + hamburger vertically, centered */
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25"
            >
              <Church className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={toggleSidebar}
              title="Expand sidebar"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Expanded: logo left + X button right */
          <div className="flex items-center gap-3 justify-between">
            <Link href="/" className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25">
                <Church className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight leading-tight truncate">
                  ChurchFlow
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  Management System
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={toggleSidebar}
              title="Collapse sidebar"
              className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="py-2 gap-0 overflow-y-auto">
        <div className={cn("flex flex-col", isCollapsed ? "gap-0" : "gap-3")}>
          {navGroups.map((group, i) => (
            <NavGroup key={i} group={group} pathname={pathname} />
          ))}
        </div>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-3 gap-0">
        {/* User profile with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60 cursor-pointer w-full",
                  isCollapsed ? "justify-center" : "text-left"
                )}
              />
            }
          >
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-bold">
                AD
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium leading-tight truncate">Admin</span>
                <span className="text-[10px] text-muted-foreground leading-tight truncate">
                  admin@church.org
                </span>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52 mb-1">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@church.org</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
