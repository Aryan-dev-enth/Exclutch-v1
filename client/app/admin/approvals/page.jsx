"use client"

import { useState } from "react"
import Link from "next/link"
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
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Clock, Download, Eye, FileText, Search, XCircle } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"

// Mock data for pending approvals
const pendingNotes = [
  {
    id: 1,
    title: "Advanced Database Management Systems",
    subject: "Computer Science",
    uploader: "Alex Johnson",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    date: "2 hours ago",
    status: "pending",
    description:
      "Comprehensive notes on advanced database concepts including distributed databases, query optimization, and transaction management.",
    fileUrl: "#",
  },
  {
    id: 2,
    title: "Modern Web Development Techniques",
    subject: "Information Technology",
    uploader: "Emma Davis",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    date: "5 hours ago",
    status: "pending",
    description:
      "Notes covering modern web development frameworks, responsive design principles, and performance optimization techniques.",
    fileUrl: "#",
  },
  {
    id: 3,
    title: "Neural Networks and Deep Learning",
    subject: "Artificial Intelligence",
    uploader: "Michael Chen",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    date: "1 day ago",
    status: "pending",
    description:
      "Detailed notes on neural network architectures, backpropagation, convolutional networks, and practical applications in AI.",
    fileUrl: "#",
  },
  {
    id: 4,
    title: "Advanced Calculus: Integration Methods",
    subject: "Mathematics",
    uploader: "Sarah Williams",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    date: "1 day ago",
    status: "pending",
    description:
      "Comprehensive guide to advanced integration techniques including substitution, parts, partial fractions, and improper integrals.",
    fileUrl: "#",
  },
]

const approvedNotes = [
  {
    id: 5,
    title: "Operating Systems: Process Scheduling Algorithms",
    subject: "Computer Science",
    uploader: "David Wilson",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    date: "2 days ago",
    status: "approved",
    approvedBy: "Admin",
    approvedDate: "1 day ago",
    description:
      "Notes on various process scheduling algorithms including FCFS, SJF, Priority, and Round Robin with examples.",
    fileUrl: "#",
  },
  {
    id: 6,
    title: "Organic Chemistry: Reaction Mechanisms",
    subject: "Chemistry",
    uploader: "Jessica Brown",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    date: "3 days ago",
    status: "approved",
    approvedBy: "Moderator",
    approvedDate: "2 days ago",
    description:
      "Detailed notes on organic chemistry reaction mechanisms including substitution, elimination, and addition reactions.",
    fileUrl: "#",
  },
]

const rejectedNotes = [
  {
    id: 7,
    title: "Introduction to Psychology",
    subject: "Psychology",
    uploader: "Ryan Thomas",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    date: "4 days ago",
    status: "rejected",
    rejectedBy: "Admin",
    rejectedDate: "3 days ago",
    rejectionReason:
      "Content appears to be copied from a textbook without proper attribution. Please revise and resubmit with original content or proper citations.",
    description: "Basic introduction to psychology concepts and theories.",
    fileUrl: "#",
  },
]

export default function NotesApprovalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // Filter notes based on search term
  const filterNotes = (notes) => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.uploader.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const filteredPendingNotes = filterNotes(pendingNotes)
  const filteredApprovedNotes = filterNotes(approvedNotes)
  const filteredRejectedNotes = filterNotes(rejectedNotes)

  // Handle note preview
  const handlePreview = (note) => {
    setSelectedNote(note)
    setPreviewDialogOpen(true)
  }

  // Handle note rejection
  const handleReject = (note) => {
    setSelectedNote(note)
    setRejectDialogOpen(true)
  }

  // Handle note approval
  const handleApprove = (note) => {
    // In a real application, this would make an API call to approve the note
    alert(`Note "${note.title}" has been approved and the user has been notified.`)
  }

  // Submit rejection
  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.")
      return
    }

    // In a real application, this would make an API call to reject the note
    alert(`Note "${selectedNote?.title}" has been rejected and the user has been notified of the reason.`)
    setRejectDialogOpen(false)
    setRejectionReason("")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Notes Approval System</h1>
          <p className="text-muted-foreground">Review, approve, or reject user-submitted notes</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Pending</span>
              <Badge
                variant="secondary"
                className="ml-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              >
                {filteredPendingNotes.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Approved</span>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <span>Rejected</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve user-submitted notes</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPendingNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="mb-2 h-10 w-10 text-green-500" />
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-sm text-muted-foreground">There are no pending approvals at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPendingNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="mb-4 flex items-start gap-3 sm:mb-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">{note.title}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="secondary">{note.subject}</Badge>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={note.uploaderAvatar} alt={note.uploader} />
                                  <AvatarFallback>{note.uploader[0]}</AvatarFallback>
                                </Avatar>
                                <span>{note.uploader}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{note.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handlePreview(note)}>
                            <Eye className="mr-1 h-4 w-4" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                            onClick={() => handleReject(note)}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleApprove(note)}>
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Notes</CardTitle>
                <CardDescription>Notes that have been reviewed and approved</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredApprovedNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No approved notes found</h3>
                    <p className="text-sm text-muted-foreground">No notes match your search criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApprovedNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="mb-4 flex items-start gap-3 sm:mb-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{note.title}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="secondary">{note.subject}</Badge>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={note.uploaderAvatar} alt={note.uploader} />
                                  <AvatarFallback>{note.uploader[0]}</AvatarFallback>
                                </Avatar>
                                <span>{note.uploader}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Uploaded {note.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>
                                  Approved {note.approvedDate} by {note.approvedBy}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handlePreview(note)}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Notes</CardTitle>
                <CardDescription>Notes that have been reviewed and rejected</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRejectedNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No rejected notes found</h3>
                    <p className="text-sm text-muted-foreground">No notes match your search criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRejectedNotes.map((note) => (
                      <div key={note.id} className="flex flex-col justify-between rounded-lg border p-4">
                        <div className="mb-4 flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                            <XCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{note.title}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="secondary">{note.subject}</Badge>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={note.uploaderAvatar} alt={note.uploader} />
                                  <AvatarFallback>{note.uploader[0]}</AvatarFallback>
                                </Avatar>
                                <span>{note.uploader}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Uploaded {note.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <XCircle className="h-3 w-3 text-red-500" />
                                <span>
                                  Rejected {note.rejectedDate} by {note.rejectedBy}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
                          <p className="font-medium">Rejection Reason:</p>
                          <p>{note.rejectionReason}</p>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handlePreview(note)}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
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

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Note Preview</DialogTitle>
            <DialogDescription>Review the note content before making a decision</DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{selectedNote.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{selectedNote.subject}</Badge>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={selectedNote.uploaderAvatar} alt={selectedNote.uploader} />
                      <AvatarFallback>{selectedNote.uploader[0]}</AvatarFallback>
                    </Avatar>
                    <span>{selectedNote.uploader}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{selectedNote.date}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border">
                <div className="flex items-center justify-between bg-muted/50 p-2">
                  <div className="text-sm font-medium">{selectedNote.title}.pdf</div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={selectedNote.fileUrl} target="_blank">
                      <Download className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="aspect-video bg-black">
                  <div className="flex h-full items-center justify-center bg-muted/20 p-4 text-center">
                    <p className="text-muted-foreground">PDF Preview would be displayed here</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Description</h4>
                <p className="mt-1 text-sm">{selectedNote.description}</p>
              </div>

              {selectedNote.status === "pending" && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPreviewDialogOpen(false)
                      handleReject(selectedNote)
                    }}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setPreviewDialogOpen(false)
                      handleApprove(selectedNote)
                    }}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Note</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this note. This will be sent to the user.
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium">{selectedNote.title}</h3>
                <p className="text-sm text-muted-foreground">Uploaded by {selectedNote.uploader}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitRejection} disabled={!rejectionReason.trim()}>
              Reject Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

