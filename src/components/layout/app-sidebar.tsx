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
  ChevronDown,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Master",
    icon: Users,
    items: [
      { title: "Families", url: "/families", icon: Users },
      { title: "Members", url: "/members", icon: UserCheck },
    ],
  },
  {
    title: "Collections",
    icon: BookOpen,
    items: [
      { title: "Birthday Collection", url: "/collections/birthday", icon: Cake },
      { title: "Wedding Anniversary", url: "/collections/wedding", icon: Heart },
      { title: "Monthly Contribution", url: "/collections/monthly", icon: Home },
      { title: "New Project", url: "/collections/new-project", icon: Hammer },
      { title: "Donations", url: "/collections/donations", icon: HeartHandshake },
      { title: "Day Book", url: "/daybook", icon: BookOpen },
      { title: "Receipts", url: "/receipts", icon: Receipt },
      { title: "Reports", url: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "Users", url: "/settings/users", icon: Shield },
      { title: "Backup", url: "/settings/backup", icon: Database },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Church className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight">Church Admin</span>
            <span className="text-[10px] text-muted-foreground">Management System</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {navItems.map((item) =>
          item.items ? (
            <SidebarGroup key={item.title}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroupLabel render={<CollapsibleTrigger className="flex w-full items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground" />}>
                    <item.icon className="h-3.5 w-3.5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform group-data-[state=closed]/collapsible:rotate-[-90deg] group-data-[collapsible=icon]:hidden" />
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton
                            render={<Link href={subItem.url} />}
                            isActive={pathname === subItem.url}
                            className={cn(
                              "transition-all duration-200",
                              pathname === subItem.url &&
                                "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                            )}
                          >
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          ) : (
            <SidebarGroup key={item.title}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href={item.url!} />}
                      isActive={pathname === item.url}
                      className={cn(
                        "transition-all duration-200",
                        pathname === item.url &&
                          "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                      )}
                    >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">Admin</span>
            <span className="text-[10px] text-muted-foreground">admin@church.org</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
