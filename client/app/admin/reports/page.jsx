"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, Eye, FileText, Flag, MessageSquare, Search, Shield } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"

// Mock data for content reports
const noteReports = [
  {
    id: 1,
    contentType: "note",
    contentId: 101,
    contentTitle: "Operating Systems: Process Scheduling Algorithms",
    reportedBy: "Sarah Williams",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    reason: "copyright",
    description: "This content appears to be copied directly from a textbook without proper attribution or permission.",
    date: "2 hours ago",
    status: "pending",
    uploader: "Alex Johnson",
  },
  {
    id: 2,
    contentType: "note",
    contentId: 102,
    contentTitle: "Advanced Database Management Systems",
    reportedBy: "James Lee",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    reason: "inappropriate",
    description: "The content contains inappropriate language that violates community guidelines.",
    date: "1 day ago",
    status: "pending",
    uploader: "Emma Davis",
  },
  {
    id: 3,
    contentType: "note",
    contentId: 103,
    contentTitle: "Introduction to Machine Learning",
    reportedBy: "Michael Chen",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    reason: "plagiarism",
    description: "This content is plagiarized from another user's notes that were uploaded earlier.",
    date: "2 days ago",
    status: "resolved",
    uploader: "David Wilson",
    resolution: "Content was removed for violating our plagiarism policy.",
    resolvedBy: "Admin",
    resolvedDate: "1 day ago",
  },
]

const commentReports = [
  {
    id: 4,
    contentType: "comment",
    contentId: 201,
    contentTitle: "Comment on 'Operating Systems: Process Scheduling Algorithms'",
    commentText:
      "This is completely wrong information. The author clearly doesn't understand the basics of operating systems.",
    reportedBy: "Emma Davis",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    reason: "harassment",
    description:
      "This comment is unnecessarily rude and attacks the author rather than providing constructive criticism.",
    date: "3 hours ago",
    status: "pending",
    commenter: "Ryan Thomas",
  },
  {
    id: 5,
    contentType: "comment",
    contentId: 202,
    contentTitle: "Comment on 'Advanced Calculus: Integration Techniques'",
    commentText: "Don't waste your time with these notes, they're useless. Check out my notes instead at [spam link]",
    reportedBy: "Alex Johnson",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    reason: "spam",
    description: "This comment contains spam links and self-promotion.",
    date: "1 day ago",
    status: "resolved",
    commenter: "Jessica Brown",
    resolution: "Comment was removed for containing spam.",
    resolvedBy: "Moderator",
    resolvedDate: "12 hours ago",
  },
]

// Combine all reports
const allReports = [...noteReports, ...commentReports]

export default function ContentReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [reasonFilter, setReasonFilter] = useState("all")
  const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [resolution, setResolution] = useState("")
  const [resolutionAction, setResolutionAction] = useState("no_action")

  // Filter reports based on search term, status, and reason
  const filterReports = (reports) => {
    return reports.filter((report) => {
      const matchesSearch =
        report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "all" || report.status === statusFilter
      const matchesReason = reasonFilter === "all" || report.reason === reasonFilter

      return matchesSearch && matchesStatus && matchesReason
    })
  }

  const filteredNoteReports = filterReports(noteReports)
  const filteredCommentReports = filterReports(commentReports)
  const filteredAllReports = filterReports(allReports)

  // Handle view report
  const handleViewReport = (report) => {
    setSelectedReport(report)
    setViewReportDialogOpen(true)
  }

  // Handle resolve report
  const handleResolveReport = (report) => {
    setSelectedReport(report)
    setResolution("")
    setResolutionAction("no_action")
    setResolveDialogOpen(true)
  }

  // Submit resolution
  const submitResolution = () => {
    if (!resolution.trim()) {
      alert("Please provide a resolution note.")
      return
    }

    // In a real application, this would make an API call to resolve the report
    let actionMessage = ""
    switch (resolutionAction) {
      case "remove_content":
        actionMessage = "Content has been removed"
        break
      case "warn_user":
        actionMessage = "User has been warned"
        break
      case "ban_user":
        actionMessage = "User has been banned"
        break
      default:
        actionMessage = "No action taken"
    }

    alert(`Report for "${selectedReport?.contentTitle}" has been resolved. ${actionMessage}.`)
    setResolveDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Content Reports</h1>
          <p className="text-muted-foreground">Review and manage reported content</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="copyright">Copyright</SelectItem>
                <SelectItem value="inappropriate">Inappropriate</SelectItem>
                <SelectItem value="plagiarism">Plagiarism</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              <span>All Reports</span>
              <Badge variant="secondary" className="ml-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                {filteredAllReports.filter((r) => r.status === "pending").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Note Reports</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Comment Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Reports</CardTitle>
                <CardDescription>Review all reported content across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAllReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Shield className="mb-2 h-10 w-10 text-green-500" />
                    <h3 className="text-lg font-medium">No reports found</h3>
                    <p className="text-sm text-muted-foreground">There are no reports matching your filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAllReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="mb-4 flex items-start gap-3 sm:mb-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                            {report.contentType === "note" ? (
                              <FileText className="h-5 w-5" />
                            ) : (
                              <MessageSquare className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{report.contentTitle}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="capitalize">
                                {report.reason}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={report.reporterAvatar} alt={report.reportedBy} />
                                  <AvatarFallback>{report.reportedBy[0]}</AvatarFallback>
                                </Avatar>
                                <span>Reported by {report.reportedBy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{report.date}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  report.status === "pending"
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-green-500 text-green-500"
                                }
                              >
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                          {report.status === "pending" && (
                            <Button size="sm" onClick={() => handleResolveReport(report)}>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Note Reports</CardTitle>
                <CardDescription>Reports related to uploaded notes</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNoteReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Shield className="mb-2 h-10 w-10 text-green-500" />
                    <h3 className="text-lg font-medium">No note reports found</h3>
                    <p className="text-sm text-muted-foreground">There are no note reports matching your filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNoteReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="mb-4 flex items-start gap-3 sm:mb-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{report.contentTitle}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="capitalize">
                                {report.reason}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={report.reporterAvatar} alt={report.reportedBy} />
                                  <AvatarFallback>{report.reportedBy[0]}</AvatarFallback>
                                </Avatar>
                                <span>Reported by {report.reportedBy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{report.date}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  report.status === "pending"
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-green-500 text-green-500"
                                }
                              >
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                          {report.status === "pending" && (
                            <Button size="sm" onClick={() => handleResolveReport(report)}>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Comment Reports</CardTitle>
                <CardDescription>Reports related to user comments</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredCommentReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Shield className="mb-2 h-10 w-10 text-green-500" />
                    <h3 className="text-lg font-medium">No comment reports found</h3>
                    <p className="text-sm text-muted-foreground">There are no comment reports matching your filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCommentReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="mb-4 flex items-start gap-3 sm:mb-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{report.contentTitle}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="capitalize">
                                {report.reason}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={report.reporterAvatar} alt={report.reportedBy} />
                                  <AvatarFallback>{report.reportedBy[0]}</AvatarFallback>
                                </Avatar>
                                <span>Reported by {report.reportedBy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{report.date}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  report.status === "pending"
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-green-500 text-green-500"
                                }
                              >
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                          {report.status === "pending" && (
                            <Button size="sm" onClick={() => handleResolveReport(report)}>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Resolve
                            </Button>
                          )}
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

      {/* View Report Dialog */}
      <Dialog open={viewReportDialogOpen} onOpenChange={setViewReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Detailed information about the reported content</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{selectedReport.contentTitle}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {selectedReport.contentType}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedReport.reason}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      selectedReport.status === "pending"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-green-500 text-green-500"
                    }
                  >
                    {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {selectedReport.contentType === "comment" && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm italic">"{selectedReport.commentText}"</p>
                  <p className="mt-2 text-xs text-muted-foreground">Comment by {selectedReport.commenter}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium">Report Description</h4>
                <p className="mt-1 text-sm">{selectedReport.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedReport.reporterAvatar} alt={selectedReport.reportedBy} />
                  <AvatarFallback>{selectedReport.reportedBy[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Reported by {selectedReport.reportedBy}</p>
                  <p className="text-xs text-muted-foreground">{selectedReport.date}</p>
                </div>
              </div>

              {selectedReport.status === "resolved" && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                  <h4 className="font-medium text-green-800 dark:text-green-300">Resolution</h4>
                  <p className="mt-1 text-sm text-green-800 dark:text-green-300">{selectedReport.resolution}</p>
                  <p className="mt-2 text-xs text-green-700 dark:text-green-400">
                    Resolved by {selectedReport.resolvedBy} • {selectedReport.resolvedDate}
                  </p>
                </div>
              )}

              {selectedReport.status === "pending" && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setViewReportDialogOpen(false)
                      handleResolveReport(selectedReport)
                    }}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Resolve Report
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Report Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>Take action on this report and provide a resolution note.</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium">{selectedReport.contentTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  Reported for <span className="capitalize">{selectedReport.reason}</span> by{" "}
                  {selectedReport.reportedBy}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Action to Take</h4>
                <Select value={resolutionAction} onValueChange={setResolutionAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_action">No Action Required</SelectItem>
                    <SelectItem value="remove_content">Remove Content</SelectItem>
                    <SelectItem value="warn_user">Warn User</SelectItem>
                    <SelectItem value="ban_user">Ban User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Resolution Note</h4>
                <Textarea
                  placeholder="Provide details about how this report was resolved..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  This note will be visible to the reporting user and internal staff.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitResolution} disabled={!resolution.trim()}>
              Resolve Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

