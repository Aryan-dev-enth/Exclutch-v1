"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart4,
  Bell,
  CheckCircle,
  Download,
  FileText,
  Upload,
  Users,
  UserCog,
  AlertCircle,
  Megaphone,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useNotes } from "@/context/NotesContext"
import { useUsers } from "@/context/UsersContext"





// Mock data for exam alerts
const examAlerts = [
  {
    id: 1,
    title: "Final Exams Schedule Published",
    content:
      "The final examination schedule for the Spring 2025 semester has been published. Please check your university portal for details.",
    date: "March 10, 2025",
    active: true,
  },
  {
    id: 2,
    title: "Mid-Term Examination Notice",
    content:
      "Mid-term examinations for all engineering branches will begin on April 15, 2025. Timetables are available on the university website.",
    date: "April 1, 2025",
    active: true,
  },
  {
    id: 3,
    title: "Entrance Exam Preparation Session",
    content:
      "A free preparation session for upcoming entrance exams will be held online on March 20, 2025. Registration is required.",
    date: "March 20, 2025",
    active: false,
  },
]

// Mock data for recent users


export default function AdminDashboardPage() {

  const [alertsList, setAlertsList] = useState(examAlerts)
  const [newAlertTitle, setNewAlertTitle] = useState("")
  const [newAlertContent, setNewAlertContent] = useState("")
  const [newAlertDate, setNewAlertDate] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const {notes}= useNotes();
  const {users} =useUsers();
  // Handle approval

  const recentUsers = users.slice(0,5);
  const pendingApprovals = notes.filter(note => !note.verified);



  const [pendingList, setPendingList] = useState(pendingApprovals)

  


  const handleApprove = (id) => {
    setPendingList(pendingList.filter((item) => item.id !== id))
  }

  // Handle rejection
  const handleReject = (id) => {
    setPendingList(pendingList.filter((item) => item.id !== id))
  }

  // Handle new alert
  const handleAddAlert = () => {
    if (newAlertTitle && newAlertContent && newAlertDate) {
      setAlertsList([
        ...alertsList,
        {
          id: alertsList.length + 1,
          title: newAlertTitle,
          content: newAlertContent,
          date: newAlertDate,
          active: true,
        },
      ])
      setNewAlertTitle("")
      setNewAlertContent("")
      setNewAlertDate("")
      setDialogOpen(false)
    }
  }

  // Toggle alert active status
  const toggleAlertStatus = (id) => {
    setAlertsList(alertsList.map((alert) => (alert.id === id ? { ...alert, active: !alert.active } : alert)))
  }

  // Delete alert
  const deleteAlert = (id) => {
    setAlertsList(alertsList.filter((alert) => alert.id !== id))
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage content, users, and platform settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{notes.length}</p>
                <p className="text-sm text-muted-foreground">Total Notes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-200">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4 rounded-full bg-orange-100 p-3 text-orange-600 dark:bg-orange-900 dark:text-orange-200">
                <Download className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{notes.reduce((sum, note) => sum + (note.downloadsCount || 0), 0)}</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4 rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
                <Upload className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{notes.reduce((sum, note) => sum + (note.viewCount || 0), 0)}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Users */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>New user registrations</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/users">
                  <UserCog className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        user.status === "Active"
                          ? "border-green-500 text-green-500"
                          : "border-yellow-500 text-yellow-500"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/users">View All Users</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pending Approvals */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Notes awaiting review</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/approvals">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals && pendingApprovals.slice(0,4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{item.subject}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/approvals">Review Approvals</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Announcements */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Platform announcements</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/alerts">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Manage
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertsList.slice(0, 3).map((alert, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{alert.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{alert.date}</span>
                          <Badge
                            variant={alert.active ? "default" : "outline"}
                            className={alert.active ? "bg-brand" : ""}
                          >
                            {alert.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/alerts">Manage Announcements</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Analytics Overview */}
       

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/admin/users">
                  <UserCog className="h-6 w-6" />
                  <span>Manage Users</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/admin/approvals">
                  <CheckCircle className="h-6 w-6" />
                  <span>Review Approvals</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/admin/alerts">
                  <Bell className="h-6 w-6" />
                  <span>Create Announcement</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/admin/reports">
                  <AlertCircle className="h-6 w-6" />
                  <span>View Reports</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

