"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CheckCircle,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"

// Mock data for notes
const notes = [
  {
    id: 1,
    title: "Operating Systems: Process Scheduling Algorithms",
    subject: "Computer Science",
    uploader: "Alex Johnson",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    status: "approved",
    date: "July 15, 2023",
    views: 2897,
    downloads: 543,
    likes: 354,
    featured: true,
  },
  {
    id: 2,
    title: "Organic Chemistry: Reaction Mechanisms",
    subject: "Chemistry",
    uploader: "Emma Davis",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    status: "approved",
    date: "August 5, 2023",
    views: 1823,
    downloads: 421,
    likes: 289,
    featured: false,
  },
  {
    id: 3,
    title: "Advanced Calculus: Integration Techniques",
    subject: "Mathematics",
    uploader: "Michael Chen",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    status: "approved",
    date: "August 12, 2023",
    views: 1654,
    downloads: 387,
    likes: 276,
    featured: false,
  },
  {
    id: 4,
    title: "Introduction to Machine Learning",
    subject: "Computer Science",
    uploader: "Sarah Williams",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    status: "approved",
    date: "September 3, 2023",
    views: 5423,
    downloads: 892,
    likes: 423,
    featured: true,
  },
  {
    id: 5,
    title: "Quantum Mechanics Fundamentals",
    subject: "Physics",
    uploader: "James Lee",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    status: "approved",
    date: "September 18, 2023",
    views: 4721,
    downloads: 756,
    likes: 354,
    featured: false,
  },
  {
    id: 6,
    title: "Advanced Database Management Systems",
    subject: "Computer Science",
    uploader: "Alex Johnson",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    status: "pending",
    date: "October 5, 2023",
    views: 0,
    downloads: 0,
    likes: 0,
    featured: false,
  },
  {
    id: 7,
    title: "Modern Web Development Techniques",
    subject: "Information Technology",
    uploader: "Emma Davis",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    status: "pending",
    date: "October 8, 2023",
    views: 0,
    downloads: 0,
    likes: 0,
    featured: false,
  },
  {
    id: 8,
    title: "Introduction to Psychology",
    subject: "Psychology",
    uploader: "Ryan Thomas",
    uploaderAvatar: "/placeholder.svg?height=40&width=40",
    status: "rejected",
    date: "September 25, 2023",
    views: 0,
    downloads: 0,
    likes: 0,
    featured: false,
  },
]

// Mock data for featured notes
const featuredNotes = notes.filter((note) => note.featured)

// Mock data for trending notes
const trendingNotes = [
  {
    id: 1,
    title: "Operating Systems: Process Scheduling Algorithms",
    subject: "Computer Science",
    uploader: "Alex Johnson",
    views: 2897,
    downloads: 543,
    likes: 354,
  },
  {
    id: 4,
    title: "Introduction to Machine Learning",
    subject: "Computer Science",
    uploader: "Sarah Williams",
    views: 5423,
    downloads: 892,
    likes: 423,
  },
  {
    id: 5,
    title: "Quantum Mechanics Fundamentals",
    subject: "Physics",
    uploader: "James Lee",
    views: 4721,
    downloads: 756,
    likes: 354,
  },
]

export default function NotesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)

  // Filter notes based on search term, status, and subject
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.uploader.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || note.status === statusFilter
    const matchesSubject = subjectFilter === "all" || note.subject === subjectFilter

    return matchesSearch && matchesStatus && matchesSubject
  })

  // Get unique subjects for filter
  const subjects = Array.from(new Set(notes.map((note) => note.subject)))

  // Handle note deletion
  const handleDeleteNote = (note) => {
    setSelectedNote(note)
    setDeleteDialogOpen(true)
  }

  // Confirm note deletion
  const confirmDelete = () => {
    // In a real application, this would make an API call to delete the note
    alert(`Note "${selectedNote?.title}" has been deleted.`)
    setDeleteDialogOpen(false)
  }

  // Toggle featured status
  const toggleFeatured = (id) => {
    // In a real application, this would make an API call to update the note
    alert(`Featured status toggled for note ID: ${id}`)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Notes Management</h1>
          <p className="text-muted-foreground">Manage all notes across the platform</p>
        </div>

        <Tabs defaultValue="all-notes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-notes">All Notes</TabsTrigger>
            <TabsTrigger value="featured">Featured Notes</TabsTrigger>
            <TabsTrigger value="trending">Trending Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="all-notes">
            <Card>
              <CardHeader>
                <CardTitle>All Notes</CardTitle>
                <CardDescription>View and manage all notes on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 items-center gap-2">
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
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((subject, index) => (
                          <SelectItem key={index} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Uploader</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Stats</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNotes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No notes found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNotes.map((note) => (
                          <TableRow key={note.id}>
                            <TableCell>
                              <div className="font-medium">{note.title}</div>
                              {note.featured && <Badge className="mt-1 bg-brand text-white">Featured</Badge>}
                            </TableCell>
                            <TableCell>{note.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{note.uploader}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  note.status === "approved"
                                    ? "border-green-500 text-green-500"
                                    : note.status === "pending"
                                      ? "border-yellow-500 text-yellow-500"
                                      : "border-red-500 text-red-500"
                                }
                              >
                                {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{note.date}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{note.views} views</span>
                                <span>•</span>
                                <span>{note.downloads} downloads</span>
                                <span>•</span>
                                <span>{note.likes} likes</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/notes/${note.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/notes/${note.id}/edit`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleFeatured(note.id)}>
                                    {note.featured ? (
                                      <>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Remove from Featured
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Add to Featured
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteNote(note)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{filteredNotes.length}</strong> of <strong>{notes.length}</strong> notes
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="featured">
            <Card>
              <CardHeader>
                <CardTitle>Featured Notes</CardTitle>
                <CardDescription>Notes that are featured on the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                {featuredNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No featured notes</h3>
                    <p className="text-sm text-muted-foreground">
                      You haven't featured any notes yet. Feature notes to highlight them on the homepage.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {featuredNotes.map((note) => (
                      <div key={note.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                            <FileText className="h-6 w-6 text-brand" />
                          </div>
                          <div>
                            <h3 className="font-medium">{note.title}</h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{note.subject}</Badge>
                              <span>•</span>
                              <span>{note.uploader}</span>
                              <span>•</span>
                              <span>{note.views} views</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/notes/${note.id}`}>
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => toggleFeatured(note.id)}>
                            <XCircle className="mr-1 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trending">
            <Card>
              <CardHeader>
                <CardTitle>Trending Notes</CardTitle>
                <CardDescription>Most popular notes based on views, downloads, and likes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingNotes.map((note, index) => (
                    <div key={note.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{note.title}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{note.subject}</Badge>
                            <span>•</span>
                            <span>{note.uploader}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{note.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span>{note.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{note.likes}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/notes/${note.id}`}>
                            <Eye className="mr-1 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="py-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">{selectedNote.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{selectedNote.subject}</Badge>
                  <span>•</span>
                  <span>Uploaded by {selectedNote.uploader}</span>
                  <span>•</span>
                  <span>{selectedNote.date}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

