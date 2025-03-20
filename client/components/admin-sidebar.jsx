"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AlertCircle, BarChart4, Bell, CheckCircle, FileText, Home, Settings, Shield, UserCog } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="hidden w-64 shrink-0 border-r bg-muted/10 md:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-brand">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
          <span>Admin Panel</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
            isActive("/admin") &&
              !isActive("/admin/users") &&
              !isActive("/admin/notes") &&
              !isActive("/admin/alerts") &&
              !isActive("/admin/analytics") &&
              "bg-muted text-primary",
          )}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>

        {/* User Management */}
        <Link
          href="/admin/users"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
            isActive("/admin/users") && "bg-muted text-primary",
          )}
        >
          <UserCog className="h-4 w-4" />
          <span>User Management</span>
        </Link>

        {/* Notes Management */}
        <Link
          href="/admin/notes"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
            isActive("/admin/notes") && "bg-muted text-primary",
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Notes Management</span>
        </Link>

        {/* Approvals */}
        <Link
          href="/admin/approvals"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
            isActive("/admin/approvals") && "bg-muted text-primary",
          )}
        >
          <CheckCircle className="h-4 w-4" />
          <span>Approvals</span>
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white">
            4
          </span>
        </Link>

        {/* Announcements & Alerts */}
        <Link
          href="/admin/alerts"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
            isActive("/admin/alerts") && "bg-muted text-primary",
          )}
        >
          <Bell className="h-4 w-4" />
          <span>Announcements</span>
        </Link>

        {/* Content Reports */}
        <Link
          href="/admin/reports"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
            isActive("/admin/reports") && "bg-muted text-primary",
          )}
        >
          <AlertCircle className="h-4 w-4" />
          <span>Content Reports</span>
        </Link>

        {/* Analytics */}
        <Link
          href="/admin/analytics"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
            isActive("/admin/analytics") && "bg-muted text-primary",
          )}
        >
          <BarChart4 className="h-4 w-4" />
          <span>Analytics</span>
        </Link>

       

      
      </nav>
      <div className="mt-auto p-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <span>Return to Exclutch</span>
        </Link>
      </div>
    </div>
  )
}

