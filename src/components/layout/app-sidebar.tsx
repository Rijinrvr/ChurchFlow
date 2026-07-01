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
  Hammer,
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
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"

// ─── Nav Structure ────────────────────────────────────────────────────────────

const navGroups = [
  {
    label: null, // top-level, no group header
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ],
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
      { title: "New Project", url: "/collections/new-project", icon: Hammer },
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
    // Plain items with no header
    return (
      <div className="px-3 pt-2">
        {group.items.map((item) => (
          <NavItem key={item.url} item={item} pathname={pathname} />
        ))}
      </div>
    )
  }

  if (isCollapsed) {
    // When sidebar is icon-only, show items directly without header
    return (
      <div className="px-2 py-1">
        {group.items.map((item) => (
          <NavItem key={item.url} item={item} pathname={pathname} />
        ))}
      </div>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger
        className={cn(
          "group flex w-full items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
          isAnyActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {group.icon && (
          <group.icon
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-colors",
              isAnyActive ? "text-primary" : "text-muted-foreground"
            )}
          />
        )}
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 duration-150">
        <div className="px-3 pb-1 pt-0.5">
          {group.items.map((item) => (
            <NavItem key={item.url} item={item} pathname={pathname} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ─── Single Nav Item ──────────────────────────────────────────────────────────

function NavItem({
  item,
  pathname,
}: {
  item: { title: string; url: string; icon: React.ElementType }
  pathname: string
}) {
  const isActive = pathname === item.url

  return (
    <Link
      href={item.url}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all duration-150 my-0.5",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      )}
    >
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all duration-150",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
            : "bg-muted group-hover:bg-muted/80"
        )}
      >
        <item.icon className="h-3.5 w-3.5" />
      </div>
      <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
      {isActive && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary group-data-[collapsible=icon]:hidden" />
      )}
    </Link>
  )
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25">
            <Church className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight leading-tight">ChurchFlow</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Management System</span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="py-3 gap-0">
        <div className="flex flex-col gap-4">
          {navGroups.map((group, i) => (
            <NavGroup key={i} group={group} pathname={pathname} />
          ))}
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60 cursor-pointer",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          )}
        >
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-bold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium leading-tight truncate">Admin</span>
            <span className="text-[10px] text-muted-foreground leading-tight truncate">
              admin@church.org
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
