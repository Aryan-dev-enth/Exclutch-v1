"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, CheckCircle, Download, FileText, Upload, Users, UserCog, AlertCircle, Megaphone } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useNotes } from "@/context/NotesContext"
import { useUsers } from "@/context/UsersContext"
import { UserGrowthChart } from "@/components/user-growth-chart"

// Mock data for exam alerts
const examAlerts = [
  {
    id: 1,
    title: "Final Exams Schedule Published",
    content: "The final examination schedule for the Spring 2025 semester has been published.",
    date: "March 10, 2025",
    active: true,
  },
  {
    id: 2,
    title: "Mid-Term Examination Notice",
    content: "Mid-term examinations for all engineering branches will begin on April 15, 2025.",
    date: "April 1, 2025",
    active: true,
  },
  {
    id: 3,
    title: "Entrance Exam Preparation Session",
    content: "A free preparation session for upcoming entrance exams will be held online on March 20, 2025.",
    date: "March 20, 2025",
    active: false,
  },
]

export default function AdminDashboardPage() {
  const [alertsList, setAlertsList] = useState(examAlerts)
  const { notes } = useNotes()
  const { users } = useUsers()

  // Calculate real statistics from live data
  const totalNotes = notes.length
  const totalUsers = users.length
  const totalDownloads = notes.reduce((sum, note) => sum + (note.downloadsCount || 0), 0)
  const totalViews = notes.reduce((sum, note) => sum + (note.viewCount || 0), 0)

  // Get recent users (last 5)
  const recentUsers = users.slice(-5).reverse()

  // Get pending approvals
  const pendingApprovals = notes.filter((note) => !note.verified)

  // Generate user growth data from actual user registration dates
  const generateUserGrowthData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentDate = new Date()
    const last6Months = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = monthNames[date.getMonth()]

      // Count users registered in this month
      const usersInMonth = users.filter((user) => {
        if (!user.createdAt) return false
        const userDate = new Date(user.createdAt)
        return userDate.getMonth() === date.getMonth() && userDate.getFullYear() === date.getFullYear()
      }).length

      last6Months.push({
        month: monthName,
        users: usersInMonth,
      })
    }

    return last6Months
  }

  const userGrowthData = generateUserGrowthData()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm lg:text-base text-muted-foreground">Manage content, users, and platform settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <div className="mb-2 lg:mb-4 rounded-full bg-blue-100 p-2 lg:p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                <FileText className="h-4 w-4 lg:h-6 lg:w-6" />
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-3xl font-bold">{totalNotes}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total Notes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <div className="mb-2 lg:mb-4 rounded-full bg-green-100 p-2 lg:p-3 text-green-600 dark:bg-green-900 dark:text-green-200">
                <Users className="h-4 w-4 lg:h-6 lg:w-6" />
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-3xl font-bold">{totalUsers}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <div className="mb-2 lg:mb-4 rounded-full bg-orange-100 p-2 lg:p-3 text-orange-600 dark:bg-orange-900 dark:text-orange-200">
                <Download className="h-4 w-4 lg:h-6 lg:w-6" />
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-3xl font-bold">{totalDownloads}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Downloads</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <div className="mb-2 lg:mb-4 rounded-full bg-purple-100 p-2 lg:p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
                <Upload className="h-4 w-4 lg:h-6 lg:w-6" />
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-3xl font-bold">{totalViews}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total Views</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">User Growth</CardTitle>
            <CardDescription>User registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <UserGrowthChart data={userGrowthData} users={users} />
          </CardContent>
        </Card>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base lg:text-lg">Recent Users</CardTitle>
                <CardDescription className="text-xs lg:text-sm">New registrations</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="text-xs lg:text-sm">
                <Link href="/admin/users">
                  <UserCog className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Manage</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.slice(0, 5).map((user, index) => (
                  <div key={user.id || index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <Avatar className="h-6 w-6 lg:h-9 lg:w-9">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-xs lg:text-sm">{user.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs lg:text-sm font-medium truncate">{user.name || "Unknown User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email || "No email"}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                      {user.status || "Active"}
                    </Badge>
                  </div>
                ))}
                {recentUsers.length === 0 && (
                  <p className="text-xs lg:text-sm text-muted-foreground text-center py-4">No users found</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs lg:text-sm" asChild>
                <Link href="/admin/users">View All Users</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base lg:text-lg">Pending Approvals</CardTitle>
                <CardDescription className="text-xs lg:text-sm">Notes awaiting review</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="text-xs lg:text-sm">
                <Link href="/admin/approvals">
                  <CheckCircle className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Review</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingApprovals.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 lg:gap-3">
                    <div className="flex h-6 w-6 lg:h-9 lg:w-9 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-3 w-3 lg:h-5 lg:w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs lg:text-sm font-medium line-clamp-1">{item.title}</p>
                      <div className="flex items-center gap-1 lg:gap-2 text-xs text-muted-foreground">
                        <span>{item.subject}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingApprovals.length === 0 && (
                  <p className="text-xs lg:text-sm text-muted-foreground text-center py-4">No pending approvals</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs lg:text-sm" asChild>
                <Link href="/admin/approvals">Review All ({pendingApprovals.length})</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base lg:text-lg">Announcements</CardTitle>
                <CardDescription className="text-xs lg:text-sm">Platform alerts</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="text-xs lg:text-sm">
                <Link href="/admin/alerts">
                  <Megaphone className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Manage</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertsList.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center gap-2 lg:gap-3">
                    <div className="flex h-6 w-6 lg:h-9 lg:w-9 items-center justify-center rounded-full bg-muted">
                      <Bell className="h-3 w-3 lg:h-5 lg:w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs lg:text-sm font-medium line-clamp-1">{alert.title}</p>
                      <div className="flex items-center gap-1 lg:gap-2 text-xs text-muted-foreground">
                        <span>{alert.date}</span>
                        <Badge variant={alert.active ? "default" : "outline"} className="text-xs">
                          {alert.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs lg:text-sm" asChild>
                <Link href="/admin/alerts">Manage All</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-3 lg:p-4" asChild>
                <Link href="/admin/users">
                  <UserCog className="h-5 w-5 lg:h-6 lg:w-6" />
                  <span className="text-xs lg:text-sm">Manage Users</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-3 lg:p-4" asChild>
                <Link href="/admin/approvals">
                  <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6" />
                  <span className="text-xs lg:text-sm">Review Approvals</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-3 lg:p-4" asChild>
                <Link href="/admin/alerts">
                  <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
                  <span className="text-xs lg:text-sm">Announcements</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-3 lg:p-4" asChild>
                <Link href="/admin/reports">
                  <AlertCircle className="h-5 w-5 lg:h-6 lg:w-6" />
                  <span className="text-xs lg:text-sm">View Reports</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
