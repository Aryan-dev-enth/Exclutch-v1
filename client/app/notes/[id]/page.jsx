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
import { DeleteIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import NoteAnalytics from "@/components/note-analytics";
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
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function NoteDetailPage({ params }) {
  const { id } = use(params);
  const { user } = UserAuth();
  const router = useRouter();

  const { notes } = useNotes();
  const [note, setNote] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  const [isCommenting, setIsCommenting] = useState(false);
  const [lastCommentTime, setLastCommentTime] = useState(0);
  const COMMENT_COOLDOWN = 5000; // 5 seconds

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const relatedNotes = notes?.slice(0, 4) || [];

  const handleShare = async () => {
    try {
      if (!note) return;
      
      const shareData = {
  title: "Exclutch – Smart Study Simplified",
  text:
    "📚 *Exclutch (Beta)* – Your one-stop platform for PYQs and Notes!\n" +
    "Built *by SRMUH students, for SRMUH students* ❤️\n\n" +
    "📝 *" + (note.title || "Untitled Note") + "*\n\n" +
    "Start preparing smarter, not harder! 👇\n" +
    currentUrl + "\n\n" +
    "👥 Join the Exclutch WhatsApp Community:\n" +
    "https://chat.whatsapp.com/ChPwEABIUbtEPqTHMH1KP4",
};



      await navigator.share(shareData);
      console.log("Shared successfully");
    } catch (err) {
      console.error("Sharing failed:", err);
      toast("Sharing failed or is not supported.");
    }
  };

  const handleLike = async () => {
    if (!user?.uid || !note?._id) return;
    
    try {
      const response = await likeNote(user.uid, note._id);
      if (isLiked) {
        setLikeCount((prev) => prev - 1);
      } else {
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error("Failed to like note:", error);
      toast("Failed to like note. Please try again.");
    }
  };

  const handleComment = async () => {
    const now = Date.now();

    if (now - lastCommentTime < COMMENT_COOLDOWN) {
      toast("Please wait a few seconds before commenting again.");
      return;
    }

    if (comment.trim() === "" || !user?.uid) return;

    setIsCommenting(true);

    const newComment = {
      _id: now.toString(),
      text: comment.trim(),
      createdAt: new Date().toISOString(),
      user: {
        profilePic: user.profilePic || null,
        name: user.name || "Anonymous User",
      },
    };

    setNote((prevNote) => {
      if (!prevNote) return prevNote;
      return {
        ...prevNote,
        comments: [...(prevNote.comments || []), newComment],
      };
    });

    setComment("");
    setLastCommentTime(now);

    try {
      await postComment(newComment.text, user.uid, id);
    } catch (error) {
      console.error("Failed to post comment:", error);
      setNote((prevNote) => {
        if (!prevNote) return prevNote;
        return {
          ...prevNote,
          comments: (prevNote.comments || []).filter(
            (comment) => comment._id !== newComment._id
          ),
        };
      });
      toast("Failed to post comment. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  // Handle save
  const handleSave = () => {
    setIsSaved((prev) => !prev);
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const result = await fetchNoteById(id);
        const singlenote = result?.data;
        
        if (!singlenote) {
          console.error("No note data received");
          return;
        }
        
        setNote(singlenote);
        setLikeCount(singlenote.likes?.length || 0);
        
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (savedUser?._id && singlenote.likes?.includes(savedUser._id)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        toast("Failed to load note. Please try again.");
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  if (!user || !note) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const note_url = note.gapis_file_id 
    ? `https://drive.google.com/file/d/${note.gapis_file_id}/`
    : null;

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
                  {note.subject || "No Subject"}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{note.published?.split("T")[0] || "No Date"}</span>
                </div>
              </div>
              <CardTitle className="text-2xl">{note.title || "Untitled Note"}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{note.author.name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{note.viewCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{note.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <div className="rounded-lg border">
                  <div className="flex items-center justify-between bg-muted/50 p-2">
                    <div className="text-sm font-medium">{note.title || "document"}.pdf</div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={note.file_url?.webContentLink || note.url || "#"}
                        target="_blank"
                      >
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="aspect-video bg-black">
                    <iframe
                      src={note.url || (note_url ? `${note_url}preview` : "")}
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
                    <p>{note.description || "No description available."}</p>
                    <p className="mt-4">{note.content || ""}</p>
                  </TabsContent>
                  <TabsContent value="details" className="pt-4">
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="w-1/3 font-medium">University:</span>
                        <span>{note.college || "Not specified"}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 font-medium">Branch:</span>
                        <span>{note.branch || "Not specified"}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 font-medium">Subject Code:</span>
                        <span>{note.subjectCode || "Not specified"}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-wrap gap-2">
                  {note.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  )) || <span className="text-muted-foreground text-sm">No tags</span>}
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
                    className={
                      isLiked ? "text-blue-500" : "text-muted-foreground"
                    }
                  >
                    <ThumbsUp
                      className={`mr-1 h-4 w-4 ${
                        isLiked ? "fill-blue-500" : ""
                      }`}
                    />
                    {isLiked ? "Liked" : "Like"} ({likeCount})
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Comment ({note.comments?.length || 0})
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
                  <Button onClick={handleShare} variant="ghost" size="sm">
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Comments ({note.comments?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {note.comments && note.comments.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto flex flex-col-reverse space-y-4 space-y-reverse">
                    {note.comments
                      .slice()
                      .reverse()
                      .map((comment, index) => {
                        const commentUser = comment?.user || {};
                        const userName = commentUser.name || "Anonymous User";
                        const userProfilePic = commentUser.profilePic;
                        const commentText = comment?.text || "No comment provided.";
                        const commentDate = comment?.createdAt;
                        
                        return (
                          <div key={comment?._id || index} className="flex gap-4">
                            <Avatar>
                              <AvatarImage
                                src={userProfilePic || "/placeholder.png?height=40&width=40"}
                                alt={userName}
                              />
                              <AvatarFallback>
                                {userName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="font-medium">{userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {commentDate ? format(commentDate) : "Just now"}
                                </span>
                              </div>
                              <p className="text-sm">{commentText}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                )}

                <Separator />
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage 
                      src={user?.profilePic} 
                      alt={user?.name || "User"} 
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      className="mb-2 resize-none"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      disabled={isCommenting}
                    />
                    <Button 
                      className="cursor-pointer" 
                      onClick={handleComment}
                      disabled={isCommenting || !comment.trim()}
                    >
                      {isCommenting ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="">
          <NoteAnalytics
            likeCount={likeCount}
            downloadsCount={note.downloadsCount || 0}
            viewCount={note.viewCount || 0}
            comments={note.comments || []}
            published={note.published || ""}
            subject={note.subject || ""}
            document_type={note.document_type || ""}
            college={note.college || ""}
            branch={note.branch || ""}
            author={note.author.name || ""}
            verified={note.verified || false}
            pinned={note.pinned || false}
            trending={note.trending || false}
            tags={note.tags || []}
          />
        </div>
      </div>
    </div>
  );
}
