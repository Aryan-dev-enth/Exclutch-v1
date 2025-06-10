"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Upload, Users } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useNotes } from "@/context/NotesContext"
import { useUsers } from "@/context/UsersContext"
import { AnalyticsChart } from "@/components/analytics-chart"
import { TopPerformingNotes } from "@/components/top-performing-notes"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const { notes } = useNotes()
  const { users } = useUsers()

  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalUsers = users.length
    const totalNotes = notes.length
    const pendingApprovals = notes.filter((note) => !note.verified).length
    const totalDownloads = notes.reduce((sum, note) => sum + (note.downloadsCount || 0), 0)
    const totalViews = notes.reduce((sum, note) => sum + (note.viewCount || 0), 0)
    const totalLikes = notes.reduce((sum, note) => sum + (note.likes?.length || 0), 0)

    // Calculate growth percentages (mock for now)
    const userGrowth = totalUsers > 0 ? Math.round(totalUsers * 0.12) : 0
    const noteGrowth = totalNotes > 0 ? Math.round(totalNotes * 0.08) : 0
    const approvalGrowth = pendingApprovals > 0 ? Math.round(pendingApprovals * 0.23) : 0
    const downloadGrowth = totalDownloads > 0 ? Math.round(totalDownloads * 0.15) : 0

    return {
      totalUsers,
      totalNotes,
      pendingApprovals,
      totalDownloads,
      totalViews,
      totalLikes,
      userGrowth,
      noteGrowth,
      approvalGrowth,
      downloadGrowth,
    }
  }, [users, notes])

  // Generate user growth data
  const userGrowthData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentDate = new Date()
    const last6Months = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = monthNames[date.getMonth()]

      const usersInMonth = users.filter((user) => {
        if (!user.createdAt) return false
        const userDate = new Date(user.createdAt)
        return userDate.getMonth() === date.getMonth() && userDate.getFullYear() === date.getFullYear()
      }).length

      last6Months.push({
        period: monthName,
        value: usersInMonth,
        label: "Users",
      })
    }

    return last6Months
  }, [users])

  // Generate content uploads data
  const contentUploadsData = useMemo(() => {
    const subjects = {}
    notes.forEach((note) => {
      const subject = note.subject || "Other"
      subjects[subject] = (subjects[subject] || 0) + 1
    })

    return Object.entries(subjects)
      .map(([subject, count]) => ({
        period: subject,
        value: count,
        label: "Notes",
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [notes])

  // Generate user distribution data
  const userDistributionData = useMemo(() => {
    const roles = {}
    users.forEach((user) => {
      const role = user.role || "User"
      roles[role] = (roles[role] || 0) + 1
    })

    return Object.entries(roles).map(([role, count]) => ({
      period: role,
      value: count,
      label: "Users",
    }))
  }, [users])

  // Generate university distribution data
  const universityData = useMemo(() => {
    const universities = {}
    users.forEach((user) => {
      const university = user.university || user.college || "Other"
      universities[university] = (universities[university] || 0) + 1
    })

    return Object.entries(universities)
      .map(([university, count]) => ({
        period: university,
        value: count,
        label: "Users",
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [users])

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const newUsersThisWeek = users.filter((user) => user.createdAt && new Date(user.createdAt) > oneWeekAgo).length

    const newNotesThisWeek = notes.filter((note) => note.createdAt && new Date(note.createdAt) > oneWeekAgo).length

    const downloadsThisWeek = notes
      .filter((note) => note.createdAt && new Date(note.createdAt) > oneWeekAgo)
      .reduce((sum, note) => sum + (note.downloadsCount || 0), 0)

    return {
      newUsers: newUsersThisWeek,
      newNotes: newNotesThisWeek,
      downloads: downloadsThisWeek,
      activeUsers: Math.floor(analytics.totalUsers * 0.15), // Mock active users
    }
  }, [users, notes, analytics.totalUsers])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm lg:text-base text-muted-foreground">Monitor platform performance and user engagement</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <div className="mb-2 lg:mb-4 rounded-full bg-blue-100 p-2 lg:p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                <Users className="h-4 w-4 lg:h-6 lg:w-6" />
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-3xl font-bold">{analytics.totalUsers.toLocaleString()}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total Users</p>
                <p className="mt-1 text-xs text-green-500">+{analytics.userGrowth} this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <div className="mb-2 lg:mb-4 rounded-full bg-green-100 p-2 lg:p-3 text-green-600 dark:bg-green-900 dark:text-green-200">
                <FileText className="h-4 w-4 lg:h-6 lg:w-6" />
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-3xl font-bold">{analytics.totalNotes.toLocaleString()}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total Notes</p>
                <p className="mt-1 text-xs text-green-500">+{analytics.noteGrowth} this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <div className="mb-2 lg:mb-4 rounded-full bg-orange-100 p-2 lg:p-3 text-orange-600 dark:bg-orange-900 dark:text-orange-200">
                <Upload className="h-4 w-4 lg:h-6 lg:w-6" />
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-3xl font-bold">{analytics.pendingApprovals}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Pending Approvals</p>
                <p className="mt-1 text-xs text-red-500">+{analytics.approvalGrowth} this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <div className="mb-2 lg:mb-4 rounded-full bg-purple-100 p-2 lg:p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
                <Download className="h-4 w-4 lg:h-6 lg:w-6" />
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-3xl font-bold">{analytics.totalDownloads.toLocaleString()}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total Downloads</p>
                <p className="mt-1 text-xs text-green-500">+{analytics.downloadGrowth} this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none">
            <TabsTrigger value="overview" className="text-xs lg:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs lg:text-sm">
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs lg:text-sm">
              Content
            </TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs lg:text-sm">
              Engagement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={userGrowthData} type="line" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content by Subject</CardTitle>
                  <CardDescription>Note uploads by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={contentUploadsData} type="bar" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Roles</CardTitle>
                  <CardDescription>Distribution of user roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={userDistributionData} type="pie" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Universities</CardTitle>
                  <CardDescription>Users by institution</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={universityData} type="bar" />
                </CardContent>
              </Card>
            </div>

            {/* Weekly Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Performance</CardTitle>
                <CardDescription>Key metrics for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">New Users</div>
                      <div className="text-2xl font-bold">+{weeklyStats.newUsers}</div>
                      <div className="mt-1 text-xs text-green-500">This week</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">New Notes</div>
                      <div className="text-2xl font-bold">+{weeklyStats.newNotes}</div>
                      <div className="mt-1 text-xs text-green-500">This week</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Downloads</div>
                      <div className="text-2xl font-bold">{weeklyStats.downloads.toLocaleString()}</div>
                      <div className="mt-1 text-xs text-green-500">This week</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Active Users</div>
                      <div className="text-2xl font-bold">{weeklyStats.activeUsers.toLocaleString()}</div>
                      <div className="mt-1 text-xs text-blue-500">Today</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Growth Trend</CardTitle>
                  <CardDescription>Monthly user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={userGrowthData} type="line" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Users by Role</CardTitle>
                  <CardDescription>Distribution of user roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={userDistributionData} type="pie" />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Users by University</CardTitle>
                  <CardDescription>Top institutions by user count</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={universityData} type="bar" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes by Subject</CardTitle>
                    <CardDescription>Content distribution across subjects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart data={contentUploadsData} type="bar" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content Overview</CardTitle>
                    <CardDescription>Platform content statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Notes</span>
                        <span className="font-medium">{analytics.totalNotes}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Verified Notes</span>
                        <span className="font-medium">{notes.filter((n) => n.verified).length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pending Approval</span>
                        <span className="font-medium">{analytics.pendingApprovals}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Views</span>
                        <span className="font-medium">{analytics.totalViews.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Downloads</span>
                        <span className="font-medium">{analytics.totalDownloads.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <TopPerformingNotes notes={notes} />
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Views</div>
                    <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
                    <div className="mt-1 text-xs text-green-500">All time</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Downloads</div>
                    <div className="text-2xl font-bold">{analytics.totalDownloads.toLocaleString()}</div>
                    <div className="mt-1 text-xs text-green-500">All time</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Likes</div>
                    <div className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</div>
                    <div className="mt-1 text-xs text-green-500">All time</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Avg. Views/Note</div>
                    <div className="text-2xl font-bold">
                      {analytics.totalNotes > 0 ? Math.round(analytics.totalViews / analytics.totalNotes) : 0}
                    </div>
                    <div className="mt-1 text-xs text-blue-500">Average</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Engagement by Subject</CardTitle>
                  <CardDescription>Average views and downloads per subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={contentUploadsData} type="bar" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
