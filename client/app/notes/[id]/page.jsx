"use client"

import { useState, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { BookmarkIcon, Calendar, Download, Eye, MessageSquare, Share2, ThumbsUp } from "lucide-react"

export default function NoteDetailPage({ params }) {
    const {id} = use(params);
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(354)
  const [isSaved, setIsSaved] = useState(false)

  // Mock note data based on ID
  const note = {
    id: id,
    title: "Operating Systems: Process Scheduling Algorithms",
    subject: "Computer Science",
    description:
      "Comprehensive notes on process scheduling algorithms including FCFS, SJF, Priority Scheduling, and Round Robin. Includes examples, comparisons, and implementation details.",
    uploader: "Alex Johnson",
    uploaderAvatar: "/placeholder.png?height=40&width=40",
    likes: likeCount,
    views: 2897,
    comments: 42,
    date: "August 12, 2023",
    pdfUrl: "#",
    semester: "5th",
    branch: "Computer Science",
    university: "MIT",
    subjectCode: "CS601",
    content:
      "This PDF contains detailed explanations of various process scheduling algorithms used in operating systems, with practical examples and performance comparisons.",
    tags: ["Operating Systems", "Process Scheduling", "Algorithms", "Computer Science"],
  }

  // Mock related notes
  const relatedNotes = [
    {
      id: 2,
      title: "Memory Management in Operating Systems",
      subject: "Computer Science",
      uploader: "Emma Davis",
      likes: 289,
      views: 1823,
      image: "/placeholder.png?height=220&width=360",
      href: "/notes/2",
    },
    {
      id: 3,
      title: "Concurrency and Deadlocks",
      subject: "Computer Science",
      uploader: "Michael Chen",
      likes: 276,
      views: 1654,
      image: "/placeholder.png?height=220&width=360",
      href: "/notes/3",
    },
    {
      id: 4,
      title: "File Systems Implementation",
      subject: "Computer Science",
      uploader: "Sarah Williams",
      likes: 245,
      views: 5423,
      image: "/placeholder.png?height=220&width=360",
      href: "/notes/4",
    },
  ]

  // Handle like
  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setIsLiked((prev) => !prev)
  }

  // Handle save
  const handleSave = () => {
    setIsSaved((prev) => !prev)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-10">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 ">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link href="/notes" className="text-muted-foreground hover:text-brand">
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
                  <span>{note.date}</span>
                </div>
              </div>
              <CardTitle className="text-2xl">{note.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={note.uploaderAvatar} alt={note.uploader} />
                      <AvatarFallback>{note.uploader[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{note.uploader}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{note.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{note.comments}</span>
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
                      <Link href={note.pdfUrl} target="_blank">
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="aspect-video bg-black">
                    <iframe
                      src="https://docs.google.com/viewer?embedded=true&url=https://example.com/sample.pdf"
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
                        <span>{note.university}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 font-medium">Branch:</span>
                        <span>{note.branch}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 font-medium">Semester:</span>
                        <span>{note.semester}</span>
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
                  <Button variant="ghost" size="sm" className={isLiked ? "text-brand" : ""} onClick={handleLike}>
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    Like ({likeCount})
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Comment ({note.comments})
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSave}>
                    <BookmarkIcon className={`mr-1 h-4 w-4 ${isSaved ? "fill-current text-brand" : ""}`} />
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
              <CardTitle>Comments ({note.comments})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.png?height=40&width=40" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm">
                      These notes were extremely helpful for my exam preparation. Thanks for sharing!
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.png?height=40&width=40" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-medium">Sarah Miller</span>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      Could you also share some practice problems related to Round Robin scheduling?
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea placeholder="Add a comment..." className="mb-2 resize-none" />
                    <Button>Post Comment</Button>
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
              {relatedNotes.map((relatedNote) => (
                <div key={relatedNote.id} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
                    <img
                      src={relatedNote.image || "/placeholder.png"}
                      alt={relatedNote.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <Link href={relatedNote.href} className="line-clamp-2 font-medium hover:text-brand">
                      {relatedNote.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{relatedNote.subject}</p>
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
  )
}

