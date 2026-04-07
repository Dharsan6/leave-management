"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  UserCog,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Student Dashboard",
    href: "/",
    icon: LayoutDashboard,
    role: "student",
  },
  {
    name: "Apply Leave",
    href: "/apply",
    icon: FileText,
    role: "student",
  },
  {
    name: "Staff Approval",
    href: "/staff",
    icon: UserCheck,
    role: "staff",
  },
  {
    name: "HOD Approval",
    href: "/hod",
    icon: UserCog,
    role: "hod",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Leave Portal</h1>
            <p className="text-xs text-sidebar-foreground/60">Management System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
            Student
          </p>
          {navigation
            .filter((item) => item.role === "student")
            .map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}

          <p className="mb-3 mt-6 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
            Staff & Administration
          </p>
          {navigation
            .filter((item) => item.role !== "student")
            .map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
              SJ
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium">Sarah Johnson</p>
              <p className="text-xs text-sidebar-foreground/60">Student</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
