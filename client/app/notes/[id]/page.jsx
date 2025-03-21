"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookmarkIcon,
  Calendar,
  Download,
  Eye,
  MessageSquare,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { format } from "timeago.js";
import { fetchNoteById, likeNote, postComment } from "@/notes_api";
import { UserAuth } from "@/context/AuthContext";
import { useNotes } from "@/context/NotesContext";


export default function NoteDetailPage({ params }) {
  const { id } = use(params);
  const { user } = UserAuth();

  const {notes} = useNotes();
  const [note, setNote] = useState(null);
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");

 

 



  const relatedNotes = notes.slice(0,4)

  const handleLike = async () => {
    const response = await likeNote(user.uid, note._id)
    if (isLiked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setIsLiked((prev) => !prev)
  }

  const handleComment = async () => {
    if (comment.trim() === "") return;
    await postComment(comment.trim(), user.uid, id);
    setComment("");
  };

  // Handle save
  const handleSave = () => {
    setIsSaved((prev) => !prev);
  };

  
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const result = await fetchNoteById(id);
        const singlenote = result.data;
        setNote(singlenote);
        setLikeCount(singlenote.likes.length)
        const savedUser = JSON.parse(localStorage.getItem("user"));
  
        if (savedUser && singlenote.likes.includes(savedUser._id)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };
  
    if (id) {
      fetchNote();
    }
  }, [id]);  // Add `id` as a dependency
  

  if(!user || !note)
  {
    return <></>
  }

  console.log(note.url)
  const note_url =`https://drive.google.com/file/d/${note.gapis_file_id}/`;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-10">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 ">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link
              href="/notes"
              className="text-muted-foreground hover:text-brand"
            >
              ← Back to Notes
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="mb-2">
                  {note.subject}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{note.published.split("T")[0]}</span>
                </div>
              </div>
              <CardTitle className="text-2xl">{note.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {/* <Avatar className="h-6 w-6">
                      <AvatarImage src={note.uploaderAvatar} alt={note.uploader} />
                      <AvatarFallback>{note.uploader[0]}</AvatarFallback>
                    </Avatar> */}
                    <span className="font-medium">{note.author}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{note.viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{note.comments.length}</span>
                    </div>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <div className="rounded-lg border">
                  <div className="flex items-center justify-between bg-muted/50 p-2">
                    <div className="text-sm font-medium">{note.title}.pdf</div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`${note_url}download`} target="_blank">
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="aspect-video bg-black">
                    <iframe
                      src={ note.url || `${note_url}preview`}
                      className="h-full w-full"
                      title="PDF Preview"
                    ></iframe>
                  </div>
                </div>

                <Tabs defaultValue="description">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="pt-4">
                    <p>{note.description}</p>
                    <p className="mt-4">{note.content}</p>
                  </TabsContent>
                  <TabsContent value="details" className="pt-4">
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="w-1/3 font-medium">University:</span>
                        <span>{note.college}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 font-medium">Branch:</span>
                        <span>{note.branch}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 font-medium">Subject Code:</span>
                        <span>{note.subjectCode}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col items-start w-full sm:flex-row lg:items-center justify-between">
                <div className="flex items-center gap-2">
                <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={isLiked ? "text-blue-500" : "text-muted-foreground"}
    >
      <ThumbsUp className={`mr-1 h-4 w-4 ${isLiked ? "fill-blue-500" : ""}`} />
      {isLiked ? "Liked" : "Like"} ({likeCount})
    </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Comment ({note.comments.length})
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSave}>
                    <BookmarkIcon
                      className={`mr-1 h-4 w-4 ${
                        isSaved ? "fill-current text-brand" : ""
                      }`}
                    />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Comments ({note.comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {note.comments && note.comments.length > 0 ? (
                  note.comments.map((comment, index) => (
                    <div key={index} className="flex gap-4">
                      <Avatar>
                        <AvatarImage
                          src={
                            comment.user.profilePic ||
                            "/placeholder.png?height=40&width=40"
                          }
                        />
                        <AvatarFallback>
                          {comment.user.profilePic ? comment.user.profilePic: "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-medium">
                            {comment.user.name || "Unknown User"}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt
                              ? format(comment.createdAt)
                              : "Just now"}
                          </span>
                        </div>
                        <p className="text-sm">
                          {comment.text || "No comment provided."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No comments yet.
                  </p>
                )}

                <Separator />
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>{'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      className="mb-2 resize-none"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={handleComment}>Post Comment</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Related Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedNotes.map((relatedNote, index) => (
                <div key={relatedNote._id} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
                    <img
                      src={relatedNote.image || "/placeholder.png"}
                      alt={relatedNote.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/notes/${relatedNote._id}`}
                      className="line-clamp-2 font-medium hover:text-brand"
                    >
                      {relatedNote.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {relatedNote.subject}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/notes">View More Notes</Link>
              </Button>
            </CardContent>
          </Card>
        </div> 
      </div>
    </div>
  );
}
