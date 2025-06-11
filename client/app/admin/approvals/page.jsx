"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sendEmail } from "@/components/utils/emailService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useNotes } from "@/context/NotesContext";
import { noteApproval, rejectNotes } from "@/notes_api";

export default function NotesApprovalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pendingNotes, setPendingNotes] = useState([]);
  const [editedNote, setEditedNote] = useState(null);

  const { notes } = useNotes();

  // Load notes when component mounts or notes context changes
  useEffect(() => {
    if (notes && notes.length > 0) {
      // Filter only pending notes if needed
      setPendingNotes(notes.filter((note) => !note.verified));
    }
  }, [notes]);

  // Filter notes based on search term
  const filteredPendingNotes = pendingNotes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.uploader?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle note preview
  const handlePreview = (note) => {
    setSelectedNote(note);
    setEditedNote({ ...note });
    setPreviewDialogOpen(true);
  };

  // Handle note rejection
  const handleReject = (note) => {
    setSelectedNote(note);
    setRejectDialogOpen(true);
  };

  // Handle note approval
  const handleApprove = async (note) => {
    const response = await noteApproval(
      note._id,
      JSON.parse(localStorage.getItem("user"))._id
    );

    const emailContent = {
      title: "Your Notes Are Now Live - Exclutch",
      user_name: selectedNote.author.name,
      actionType: "uploading your study notes",
      custom_message:
        "Great news! Your notes have been reviewed and approved. They are now live and accessible to the community. Thanks for making a valuable contribution!",
      ctaText: "View Your Published Notes",
      ctaLink: "https://exclutch.vercel.app/notes/" + note._id,
      name: "Exclutch",
      email: "exclutch.help@gmail.com",
      from_email: selectedNote.author.email,
    };

    await sendEmail(emailContent);

    alert(
      `Note "${note.title}" has been approved and the user has been notified.`
    );

    // Update local state (in a real app, this would happen after API returns success)
    setPendingNotes(pendingNotes.filter((n) => n._id !== note._id));
  };

  // Handle note update
  const handleUpdate = () => {
    if (!editedNote) return;

    alert(`Note "${editedNote.title}" has been updated and approved.`);

    // Update local state (in a real app, this would happen after API returns success)
    setPendingNotes(pendingNotes.filter((n) => n._id !== editedNote._id));
    setPreviewDialogOpen(false);
  };

  // Submit rejection
  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    const emailContent = {
      title: "Note Upload Rejected - Exclutch",
      user_name: selectedNote.author.name,
      actionType: "submitting your study notes",
      custom_message:
        "Unfortunately, your uploaded notes did not meet our quality guidelines. Please review and make the necessary improvements before trying again." +
        "\nRejection Reason: " +
        rejectionReason,
      ctaText: "Visit Exclutch",
      ctaLink: "https://exclutch.vercel.app/",
      name: "Exclutch",
      email: "exclutch.help@gmail.com",
      from_email: selectedNote.author.email,
    };

    await sendEmail(emailContent);

    const response = await rejectNotes(
      selectedNote,
      JSON.parse(localStorage.getItem("user"))._id
    );

    alert(
      `Note "${selectedNote?.title}" has been rejected and the user has been notified of the reason.`
    );

    // Update local state (in a real app, this would happen after API returns success)
    setPendingNotes(pendingNotes.filter((n) => n._id !== selectedNote._id));
    setRejectDialogOpen(false);
    setRejectionReason("");
  };

  // Handle input change for edited note
  const handleEditChange = (field, value) => {
    setEditedNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Notes Approval System
          </h1>
          <p className="text-muted-foreground">
            Review, approve, or reject user-submitted notes
          </p>
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

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Review and approve user-submitted notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!filteredPendingNotes || filteredPendingNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="mb-2 h-10 w-10 text-green-500" />
                <h3 className="text-lg font-medium">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  There are no pending approvals at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPendingNotes.map((note) => (
                  <div
                    key={note._id}
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
                              <AvatarFallback>
                                {note.uploader ? note.uploader[0] : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span>{note.uploader}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{note.date || "Recently"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(note)}
                      >
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
      </div>

      {/* Preview Dialog with Edit Capability */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Note Preview & Edit</DialogTitle>
            <DialogDescription>
              Review and edit the note content before approval
            </DialogDescription>
          </DialogHeader>

          {editedNote && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedNote.title || ""}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={editedNote.subject || ""}
                  onChange={(e) => handleEditChange("subject", e.target.value)}
                />
              </div>

              <div className="rounded-lg border">
                <div className="flex items-center justify-between bg-muted/50 p-2">
                  <div className="text-sm font-medium">
                    {editedNote.title || "Document"}.pdf
                  </div>
                  {editedNote.fileUrl && (
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={editedNote.url} target="_blank">
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
                <div className="aspect-video relative w-full h-full">
                  <iframe
                    src={editedNote.url}
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedNote.content || ""}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPreviewDialogOpen(false);
                    handleReject(selectedNote);
                  }}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={handleUpdate}>
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Update & Approve
                </Button>
              </div>
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
              Provide a reason for rejecting this note. This will be sent to the
              user.
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium">{selectedNote.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Uploaded by {selectedNote.uploader}
                </p>
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
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitRejection}
              disabled={!rejectionReason.trim()}
            >
              Reject Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
