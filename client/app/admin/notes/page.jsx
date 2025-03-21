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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useNotes } from "@/context/NotesContext"

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
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  const { notes } = useNotes()
  const featuredNotes = notes.filter((note) => note.featured)
  
  // Filter notes based on search term, status, and subject
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.uploader?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.author?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "verified" && note.verified) || 
      (statusFilter === "not-verified" && !note.verified)
      
    const matchesSubject = subjectFilter === "all" || note.subject === subjectFilter

    return matchesSearch && matchesStatus && matchesSubject
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage)
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get unique subjects for filter
  const subjects = Array.from(new Set(notes.map((note) => note.subject)))

  // Handle note deletion
  const handleDeleteNote = (note) => {
    setSelectedNote(note)
    setDeleteDialogOpen(true)
  }

  // Handle note update
  const handleUpdateNote = (note) => {
    setSelectedNote(note)
    setUpdateDialogOpen(true)
  }

  // Confirm note deletion
  const confirmDelete = () => {
    // In a real application, this would make an API call to delete the note
    alert(`Note "${selectedNote?.title}" has been deleted.`)
    setDeleteDialogOpen(false)
  }

  // Confirm note update
  const confirmUpdate = () => {
    // In a real application, this would make an API call to update the note
    alert(`Note "${selectedNote?.title}" has been updated.`)
    setUpdateDialogOpen(false)
  }

  // Toggle featured status
  const toggleFeatured = (id) => {
    // In a real application, this would make an API call to update the note
    alert(`Featured status toggled for note ID: ${id}`)
  }

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
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
                        <TableHead>Stats</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedNotes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No notes found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedNotes.map((note, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="font-medium">{note.title}</div>
                              {note.featured && <Badge className="mt-1 bg-brand text-white">Featured</Badge>}
                            </TableCell>
                            <TableCell>{note.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{note.author || note.uploader}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  note.verified
                                    ? "border-green-500 text-green-500"
                                    : "border-red-500 text-red-500"
                                }
                              >
                                {note.verified ? "Verified" : "Not Verified"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{note.viewCount || 0} views</span>
                                <span>•</span>
                                <span>{note.downloadsCount || 0} downloads</span>
                                <span>•</span>
                                <span>{(note.likes?.length || 0)} likes</span>
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
                                  <DropdownMenuItem onClick={() => handleUpdateNote(note)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
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
                    Showing <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, filteredNotes.length)}-{Math.min(currentPage * itemsPerPage, filteredNotes.length)}</strong> of <strong>{filteredNotes.length}</strong> notes
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToPreviousPage} 
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 px-2">
                      <span className="text-sm font-medium">{currentPage}</span>
                      <span className="text-sm text-muted-foreground">of</span>
                      <span className="text-sm font-medium">{totalPages || 1}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToNextPage} 
                      disabled={currentPage >= totalPages}
                    >
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
                    {featuredNotes.map((note, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                            <FileText className="h-6 w-6 text-brand" />
                          </div>
                          <div>
                            <h3 className="font-medium">{note.title}</h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{note.subject}</Badge>
                              <span>•</span>
                              <span>{note.author || note.uploader}</span>
                              <span>•</span>
                              <span>{note.viewCount || 0} views</span>
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
                    <div key={index} className="flex items-center justify-between rounded-lg border p-4">
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
                  <span>Uploaded by {selectedNote.author || selectedNote.uploader}</span>
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

      {/* Update Note Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Note</DialogTitle>
            <DialogDescription>
              Make changes to the note details below.
            </DialogDescription>
          </DialogHeader>
          
          {selectedNote && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  id="title"
                  defaultValue={selectedNote.title}
                />
              </div>
              
              <div className="grid gap-2">
                <FormLabel htmlFor="subject">Subject</FormLabel>
                <Select defaultValue={selectedNote.subject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject, index) => (
                      <SelectItem key={index} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="verified" 
                  defaultChecked={selectedNote.verified} 
                />
                <FormLabel htmlFor="verified" className="cursor-pointer">
                  Mark as verified
                </FormLabel>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  defaultChecked={selectedNote.featured} 
                />
                <FormLabel htmlFor="featured" className="cursor-pointer">
                  Feature on homepage
                </FormLabel>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}