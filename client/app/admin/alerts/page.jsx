"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, CheckCircle, Edit, Megaphone, Plus, Trash2, XCircle } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"

// Mock data for announcements
const announcements = [
  {
    id: 1,
    title: "Platform Maintenance",
    content:
      "Exclutch will be undergoing scheduled maintenance on July 15, 2023, from 2:00 AM to 4:00 AM UTC. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience.",
    date: "July 10, 2023",
    active: true,
    type: "maintenance",
    audience: "all",
  },
  {
    id: 2,
    title: "New Feature: AI-Generated Descriptions",
    content:
      "We're excited to announce a new feature that uses AI to automatically generate descriptions for your uploaded notes. This feature is now available to all users when uploading new content.",
    date: "June 25, 2023",
    active: true,
    type: "feature",
    audience: "all",
  },
  {
    id: 3,
    title: "Community Guidelines Update",
    content:
      "We've updated our community guidelines to better protect intellectual property. Please review the new guidelines to ensure your uploads comply with our policies.",
    date: "June 15, 2023",
    active: false,
    type: "policy",
    audience: "all",
  },
]

// Mock data for exam alerts
const examAlerts = [
  {
    id: 1,
    title: "Final Exams Schedule Published",
    content:
      "The final examination schedule for the Spring 2023 semester has been published. Please check your university portal for details.",
    date: "March 10, 2023",
    active: true,
    universities: ["MIT", "Stanford", "Harvard"],
    subjects: ["All"],
  },
  {
    id: 2,
    title: "Mid-Term Examination Notice",
    content:
      "Mid-term examinations for all engineering branches will begin on April 15, 2023. Timetables are available on the university website.",
    date: "April 1, 2023",
    active: true,
    universities: ["MIT"],
    subjects: ["Engineering"],
  },
  {
    id: 3,
    title: "Entrance Exam Preparation Session",
    content:
      "A free preparation session for upcoming entrance exams will be held online on March 20, 2023. Registration is required.",
    date: "March 20, 2023",
    active: false,
    universities: ["All"],
    subjects: ["All"],
  },
]

export default function AnnouncementsPage() {
  const [announceList, setAnnounceList] = useState(announcements)
  const [alertsList, setAlertsList] = useState(examAlerts)
  const [newAnnouncementDialogOpen, setNewAnnouncementDialogOpen] = useState(false)
  const [newExamAlertDialogOpen, setNewExamAlertDialogOpen] = useState(false)

  // New announcement form state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "general",
    audience: "all",
  })

  // New exam alert form state
  const [newExamAlert, setNewExamAlert] = useState({
    title: "",
    content: "",
    date: "",
    universities: "all",
    subjects: "all",
  })

  // Toggle announcement active status
  const toggleAnnouncementStatus = (id) => {
    setAnnounceList(
      announceList.map((announcement) =>
        announcement.id === id ? { ...announcement, active: !announcement.active } : announcement,
      ),
    )
  }

  // Delete announcement
  const deleteAnnouncement = (id) => {
    setAnnounceList(announceList.filter((announcement) => announcement.id !== id))
  }

  // Toggle exam alert active status
  const toggleExamAlertStatus = (id) => {
    setAlertsList(alertsList.map((alert) => (alert.id === id ? { ...alert, active: !alert.active } : alert)))
  }

  // Delete exam alert
  const deleteExamAlert = (id) => {
    setAlertsList(alertsList.filter((alert) => alert.id !== id))
  }

  // Handle new announcement submission
  const handleNewAnnouncementSubmit = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert("Please fill in all required fields.")
      return
    }

    const newId = Math.max(...announceList.map((a) => a.id), 0) + 1

    setAnnounceList([
      {
        id: newId,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        active: true,
        type: newAnnouncement.type,
        audience: newAnnouncement.audience,
      },
      ...announceList,
    ])

    setNewAnnouncement({
      title: "",
      content: "",
      type: "general",
      audience: "all",
    })

    setNewAnnouncementDialogOpen(false)
  }

  // Handle new exam alert submission
  const handleNewExamAlertSubmit = () => {
    if (!newExamAlert.title || !newExamAlert.content || !newExamAlert.date) {
      alert("Please fill in all required fields.")
      return
    }

    const newId = Math.max(...alertsList.map((a) => a.id), 0) + 1

    setAlertsList([
      {
        id: newId,
        title: newExamAlert.title,
        content: newExamAlert.content,
        date: newExamAlert.date,
        active: true,
        universities: newExamAlert.universities === "all" ? ["All"] : [newExamAlert.universities],
        subjects: newExamAlert.subjects === "all" ? ["All"] : [newExamAlert.subjects],
      },
      ...alertsList,
    ])

    setNewExamAlert({
      title: "",
      content: "",
      date: "",
      universities: "all",
      subjects: "all",
    })

    setNewExamAlertDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Announcements & Alerts</h1>
          <p className="text-muted-foreground">Manage platform announcements and exam alerts</p>
        </div>

        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span>Platform Announcements</span>
            </TabsTrigger>
            <TabsTrigger value="exam-alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Exam Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <Card>
              <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Platform Announcements</CardTitle>
                  <CardDescription>Create and manage announcements for all users</CardDescription>
                </div>
                <Dialog open={newAnnouncementDialogOpen} onOpenChange={setNewAnnouncementDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Announcement</DialogTitle>
                      <DialogDescription>
                        Create a new announcement to notify users about platform updates, maintenance, or other
                        important information.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="announcement-title">Announcement Title</Label>
                        <Input
                          id="announcement-title"
                          placeholder="Enter announcement title"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="announcement-content">Announcement Content</Label>
                        <Textarea
                          id="announcement-content"
                          placeholder="Enter announcement content"
                          className="min-h-[100px]"
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="announcement-type">Type</Label>
                          <Select
                            value={newAnnouncement.type}
                            onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}
                          >
                            <SelectTrigger id="announcement-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="feature">New Feature</SelectItem>
                              <SelectItem value="policy">Policy Update</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="announcement-audience">Audience</Label>
                          <Select
                            value={newAnnouncement.audience}
                            onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, audience: value })}
                          >
                            <SelectTrigger id="announcement-audience">
                              <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="admins">Admins Only</SelectItem>
                              <SelectItem value="moderators">Moderators</SelectItem>
                              <SelectItem value="contributors">Contributors</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewAnnouncementDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleNewAnnouncementSubmit}>Create Announcement</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {announceList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Megaphone className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No Announcements</h3>
                    <p className="text-sm text-muted-foreground">Create your first announcement to notify users.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announceList.map((announcement) => (
                      <div key={announcement.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{announcement.title}</h3>
                            <Badge
                              variant={announcement.active ? "default" : "outline"}
                              className={announcement.active ? "bg-brand" : ""}
                            >
                              {announcement.active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleAnnouncementStatus(announcement.id)}
                              title={announcement.active ? "Deactivate" : "Activate"}
                            >
                              {announcement.active ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteAnnouncement(announcement.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <p className="mb-2 text-sm">{announcement.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{announcement.date}</span>
                          </div>
                          <div>
                            Audience:{" "}
                            {announcement.audience === "all"
                              ? "All Users"
                              : announcement.audience.charAt(0).toUpperCase() + announcement.audience.slice(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exam-alerts">
            <Card>
              <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Exam Alerts</CardTitle>
                  <CardDescription>Create and manage exam alerts for students</CardDescription>
                </div>
                <Dialog open={newExamAlertDialogOpen} onOpenChange={setNewExamAlertDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Exam Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Exam Alert</DialogTitle>
                      <DialogDescription>
                        Create a new alert to notify students about upcoming exams or important announcements.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="alert-title">Alert Title</Label>
                        <Input
                          id="alert-title"
                          placeholder="Enter alert title"
                          value={newExamAlert.title}
                          onChange={(e) => setNewExamAlert({ ...newExamAlert, title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alert-content">Alert Content</Label>
                        <Textarea
                          id="alert-content"
                          placeholder="Enter alert content"
                          className="min-h-[100px]"
                          value={newExamAlert.content}
                          onChange={(e) => setNewExamAlert({ ...newExamAlert, content: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alert-date">Alert Date</Label>
                        <Input
                          id="alert-date"
                          type="date"
                          value={newExamAlert.date}
                          onChange={(e) => setNewExamAlert({ ...newExamAlert, date: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="alert-universities">Universities</Label>
                          <Select
                            value={newExamAlert.universities}
                            onValueChange={(value) => setNewExamAlert({ ...newExamAlert, universities: value })}
                          >
                            <SelectTrigger id="alert-universities">
                              <SelectValue placeholder="Select universities" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Universities</SelectItem>
                              <SelectItem value="MIT">MIT</SelectItem>
                              <SelectItem value="Stanford">Stanford</SelectItem>
                              <SelectItem value="Harvard">Harvard</SelectItem>
                              <SelectItem value="Oxford">Oxford</SelectItem>
                              <SelectItem value="Cambridge">Cambridge</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="alert-subjects">Subjects</Label>
                          <Select
                            value={newExamAlert.subjects}
                            onValueChange={(value) => setNewExamAlert({ ...newExamAlert, subjects: value })}
                          >
                            <SelectTrigger id="alert-subjects">
                              <SelectValue placeholder="Select subjects" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Subjects</SelectItem>
                              <SelectItem value="Computer Science">Computer Science</SelectItem>
                              <SelectItem value="Engineering">Engineering</SelectItem>
                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Chemistry">Chemistry</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewExamAlertDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleNewExamAlertSubmit}>Create Alert</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {alertsList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No Exam Alerts</h3>
                    <p className="text-sm text-muted-foreground">Create your first exam alert to notify students.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alertsList.map((alert) => (
                      <div key={alert.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{alert.title}</h3>
                            <Badge
                              variant={alert.active ? "default" : "outline"}
                              className={alert.active ? "bg-brand" : ""}
                            >
                              {alert.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleExamAlertStatus(alert.id)}
                              title={alert.active ? "Deactivate" : "Activate"}
                            >
                              {alert.active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteExamAlert(alert.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <p className="mb-2 text-sm">{alert.content}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{alert.date}</span>
                          </div>
                          <div>Universities: {alert.universities.join(", ")}</div>
                          <div>Subjects: {alert.subjects.join(", ")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

