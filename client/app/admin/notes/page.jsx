"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useNotes } from "@/context/NotesContext";
import { updateNote, rejectNotes } from "@/notes_api";

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
];

export default function NotesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(10); // Increased from 5 to 10

  const { notes } = useNotes();

  // Sort notes by creation date (latest first) and filter
  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.uploader?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && note.verified) ||
        (statusFilter === "not-verified" && !note.verified);

      const matchesSubject =
        subjectFilter === "all" || note.subject === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

  // Get featured notes
  const featuredNotes = notes.filter((note) => note.featured || note.pinned);

  // Pagination logic
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  const startIndex = (currentPage - 1) * notesPerPage;
  const endIndex = startIndex + notesPerPage;
  const currentNotes = filteredNotes.slice(startIndex, endIndex);

  // Get unique subjects for filter
  const subjects = Array.from(
    new Set(notes.map((note) => note.subject).filter(Boolean))
  );

  // Handle pagination
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle note deletion
  const handleDeleteNote = (note) => {
    setSelectedNote(note);
    setDeleteDialogOpen(true);
  };

  // Handle note update
  const handleUpdateNote = (note) => {
    setSelectedNote(note);
    setUpdateDialogOpen(true);
  };

  // Confirm note deletion
  const confirmDelete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await rejectNotes(selectedNote, user._id);
      alert(`Note "${selectedNote?.title}" has been deleted.`);
      setDeleteDialogOpen(false);
      setSelectedNote(null);
    } catch (error) {
      alert("Failed to delete note.");
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedNote((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Confirm note update
  const confirmUpdate = async () => {
    try {
      const updatedNoteData = {
        title: selectedNote.title,
        content: selectedNote.content,
        document_type: selectedNote.document_type,
        subject: selectedNote.subject,
        subject_code: selectedNote.subject_code,
        branch: selectedNote.branch,
        college: selectedNote.college,
        verified: selectedNote.verified,
        pinned: selectedNote.pinned,
        trending: selectedNote.trending,
      };

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const result = await updateNote(
        selectedNote?._id,
        updatedNoteData,
        user._id
      );

      if (result) {
        alert(`Note "${selectedNote.title}" has been updated.`);
        setUpdateDialogOpen(false);
        setSelectedNote(null);
      } else {
        alert("Failed to update the note.");
      }
    } catch (error) {
      console.error("Error updating note:", error.message);
      alert("An error occurred while updating the note.");
    }
  };

  // Toggle featured status
  const toggleFeatured = async (note) => {
    try {
      const updatedData = { ...note, pinned: !note.pinned };
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await updateNote(note._id, updatedData, user._id);
      alert(`Featured status toggled for "${note.title}"`);
    } catch (error) {
      alert("Failed to update featured status.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Notes Management
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Manage all notes across the platform
          </p>
        </div>

        <Tabs defaultValue="all-notes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none">
            <TabsTrigger value="all-notes" className="text-xs lg:text-sm">
              All Notes
            </TabsTrigger>
            <TabsTrigger value="featured" className="text-xs lg:text-sm">
              Featured
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-xs lg:text-sm">
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-notes">
            <Card>
              <CardHeader className="space-y-4">
                <div>
                  <CardTitle className="text-lg lg:text-xl">
                    All Notes
                  </CardTitle>
                  <CardDescription>
                    View and manage all notes on the platform
                  </CardDescription>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search notes..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[120px] lg:w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="not-verified">
                          Not Verified
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={subjectFilter}
                      onValueChange={setSubjectFilter}
                    >
                      <SelectTrigger className="w-[120px] lg:w-[140px]">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Notes Table */}
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Subject
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Uploader
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="hidden xl:table-cell">
                          Stats
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentNotes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No notes found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentNotes.map((note) => (
                          <TableRow key={note._id || note.id}>
                            <TableCell>
                              <div className="min-w-0">
                                <div className="text-xs lg:text-sm font-medium line-clamp-2">
                                  {note.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {formatDate(note.createdAt)}
                                </div>
                                {(note.featured || note.pinned) && (
                                  <Badge className="mt-1 bg-brand text-white text-xs">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge variant="outline" className="text-xs">
                                {note.subject.split(" ").slice(0, 2).join(" ") +
                                  (note.subject.split(" ").length > 2
                                    ? "..."
                                    : "")}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="text-xs lg:text-sm">
                                {note.author?.name ||
                                  note.uploader ||
                                  "Unknown"}
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  note.verified
                                    ? "border-green-500 text-green-500"
                                    : "border-red-500 text-red-500"
                                }`}
                              >
                                {note.verified ? "Verified" : "Not Verified"}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                <span>{note.viewCount || 0} views</span>
                                <span>
                                  {note.downloadsCount || 0} downloads
                                </span>
                                <span>{note.likes?.length || 0} likes</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/admin/notes/${
                                        note._id || note.id
                                      }`}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateNote(note)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => toggleFeatured(note)}
                                  >
                                    {note.featured || note.pinned ? (
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
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteNote(note)}
                                  >
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

                {/* Pagination */}
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs lg:text-sm text-muted-foreground">
                    Showing <strong>{startIndex + 1}</strong> to{" "}
                    <strong>{Math.min(endIndex, filteredNotes.length)}</strong>{" "}
                    of <strong>{filteredNotes.length}</strong> notes
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="text-xs lg:text-sm"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => goToPage(pageNum)}
                              className="h-8 w-8 p-0 text-xs"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="text-xs lg:text-sm"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="featured">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">
                  Featured Notes
                </CardTitle>
                <CardDescription>
                  Notes that are featured on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {featuredNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No featured notes</h3>
                    <p className="text-sm text-muted-foreground">
                      You haven't featured any notes yet. Feature notes to
                      highlight them on the homepage.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {featuredNotes.map((note) => (
                      <div
                        key={note._id || note.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                            <FileText className="h-6 w-6 text-brand" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium line-clamp-1">
                              {note.title}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {note.subject}
                              </Badge>
                              <span className="hidden sm:inline">•</span>
                              <span>{note.author?.name || note.uploader}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{note.viewCount || 0} views</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/notes/${note._id || note.id}`}>
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFeatured(note)}
                          >
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
                <CardTitle className="text-lg lg:text-xl">
                  Trending Notes
                </CardTitle>
                <CardDescription>
                  Most popular notes based on views, downloads, and likes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingNotes.map((note, index) => (
                    <div
                      key={note.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium">
                          #{index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium line-clamp-1">
                            {note.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {note.subject}
                            </Badge>
                            <span className="hidden sm:inline">•</span>
                            <span>{note.uploader}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
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
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="py-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">{selectedNote.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{selectedNote.subject}</Badge>
                  <span>•</span>
                  <span>
                    Uploaded by{" "}
                    {selectedNote.author?.name || selectedNote.uploader}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
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
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Note</DialogTitle>
            <DialogDescription>
              Make changes to the note details below.
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={selectedNote.title || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  id="subject"
                  value={selectedNote.subject || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="subject_code" className="text-sm font-medium">
                  Subject Code
                </label>
                <Input
                  type="text"
                  name="subject_code"
                  id="subject_code"
                  value={selectedNote.subject_code || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="document_type" className="text-sm font-medium">
                  Document Type
                </label>
                <Input
                  type="text"
                  name="document_type"
                  id="document_type"
                  value={selectedNote.document_type || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verified"
                    name="verified"
                    checked={selectedNote.verified || false}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <label htmlFor="verified" className="text-sm font-medium">
                    Verified
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    name="pinned"
                    checked={selectedNote.pinned || false}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <label htmlFor="pinned" className="text-sm font-medium">
                    Feature on homepage
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="trending"
                    name="trending"
                    checked={selectedNote.trending || false}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <label htmlFor="trending" className="text-sm font-medium">
                    Mark as trending
                  </label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
