"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { TrendingNote } from "@/components/trending-note"
import { Grid3X3, List, Search, SlidersHorizontal, Heart, Eye, ChevronLeft, ChevronRight, Calendar } from "lucide-react"

const mockNotes = [
  {
    id: 1,
    title: "Operating Systems: Process Scheduling Algorithms",
    subject: "Computer Science",
    uploader: "Alex Johnson",
    likes: 354,
    views: 2897,
    date: "2023-08-12",
    semester: "5th",
    branch: "Computer Science",
    university: "MIT",
    subjectCode: "CS601",
    image: "/placeholder.svg?height=220&width=360",
  },
  {
    id: 2,
    title: "Organic Chemistry: Reaction Mechanisms",
    subject: "Chemistry",
    uploader: "Emma Davis",
    likes: 289,
    views: 1823,
    date: "2023-09-05",
    semester: "4th",
    branch: "Chemical Engineering",
    university: "Stanford",
    subjectCode: "CHEM302",
    image: "/placeholder.svg?height=220&width=360",
  },
  {
    id: 3,
    title: "Advanced Calculus: Integration Techniques",
    subject: "Mathematics",
    uploader: "Michael Chen",
    likes: 276,
    views: 1654,
    date: "2023-07-28",
    semester: "3rd",
    branch: "Mathematics",
    university: "Harvard",
    subjectCode: "MATH401",
    image: "/placeholder.svg?height=220&width=360",
  },
  {
    id: 4,
    title: "Introduction to Machine Learning",
    subject: "Computer Science",
    uploader: "Sarah Williams",
    likes: 245,
    views: 5423,
    date: "2023-10-01",
    semester: "6th",
    branch: "Computer Science",
    university: "Oxford",
    subjectCode: "CS701",
    image: "/placeholder.svg?height=220&width=360",
  },
  {
    id: 5,
    title: "Quantum Mechanics Fundamentals",
    subject: "Physics",
    uploader: "James Lee",
    likes: 192,
    views: 4721,
    date: "2023-09-18",
    semester: "5th",
    branch: "Physics",
    university: "Cambridge",
    subjectCode: "PHY502",
    image: "/placeholder.svg?height=220&width=360",
  },
  {
    id: 6,
    title: "Microeconomics: Supply and Demand",
    subject: "Economics",
    uploader: "Olivia Garcia",
    likes: 187,
    views: 3982,
    date: "2023-08-20",
    semester: "2nd",
    branch: "Economics",
    university: "Princeton",
    subjectCode: "ECON201",
    image: "/placeholder.svg?height=220&width=360",
  },
  {
    id: 7,
    title: "Data Structures and Algorithms",
    subject: "Computer Science",
    uploader: "David Wilson",
    likes: 321,
    views: 3245,
    date: "2023-10-10",
    semester: "4th",
    branch: "Computer Science",
    university: "MIT",
    subjectCode: "CS402",
    image: "/placeholder.svg?height=220&width=360",
  },
  {
    id: 8,
    title: "Human Anatomy: Nervous System",
    subject: "Biology",
    uploader: "Jessica Brown",
    likes: 278,
    views: 2987,
    date: "2023-09-29",
    semester: "3rd",
    branch: "Medical Sciences",
    university: "Harvard",
    subjectCode: "BIO301",
    image: "/placeholder.svg?height=220&width=360",
  },
  {
    id: 9,
    title: "Literary Criticism: Modern Theories",
    subject: "Literature",
    uploader: "Ryan Thomas",
    likes: 265,
    views: 2765,
    date: "2023-08-05",
    semester: "5th",
    branch: "English Literature",
    university: "Oxford",
    subjectCode: "ENG404",
    image: "/placeholder.svg?height=220&width=360",
  },
]

export default function NotesPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Browse Notes</h1>
          <p className="mt-2 text-muted-foreground">
            Discover and download high-quality study notes from students around the world.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-1 items-center gap-2 sm:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search notes..." className="w-full pl-10" />
            </div>
            <Button variant="outline" size="icon" onClick={() => setFilterOpen(!filterOpen)}>
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Select defaultValue="trending">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="most-viewed">Most Viewed</SelectItem>
                <SelectItem value="recent">Recently Uploaded</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${viewMode === "grid" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${viewMode === "list" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>

        {filterOpen && (
          <div className="mb-8 grid gap-4 rounded-lg border p-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Subject</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="economics">Economics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Semester</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1st Semester</SelectItem>
                  <SelectItem value="2nd">2nd Semester</SelectItem>
                  <SelectItem value="3rd">3rd Semester</SelectItem>
                  <SelectItem value="4th">4th Semester</SelectItem>
                  <SelectItem value="5th">5th Semester</SelectItem>
                  <SelectItem value="6th">6th Semester</SelectItem>
                  <SelectItem value="7th">7th Semester</SelectItem>
                  <SelectItem value="8th">8th Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Branch</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="electrical">Electrical Engineering</SelectItem>
                  <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                  <SelectItem value="civil">Civil Engineering</SelectItem>
                  <SelectItem value="chemical">Chemical Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">University</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mit">MIT</SelectItem>
                  <SelectItem value="stanford">Stanford</SelectItem>
                  <SelectItem value="harvard">Harvard</SelectItem>
                  <SelectItem value="oxford">Oxford</SelectItem>
                  <SelectItem value="cambridge">Cambridge</SelectItem>
                  <SelectItem value="princeton">Princeton</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Subject Code</label>
              <Input placeholder="e.g. CS101" />
            </div>
          </div>
        )}

        {viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockNotes.map((note) => (
              <TrendingNote
                key={note.id}
                title={note.title}
                subject={note.subject}
                uploader={note.uploader}
                likes={note.likes}
                views={note.views}
                date={note.date}
                image={note.image}
                href={`/notes/${note.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mockNotes.map((note) => (
              <Card key={note.id} className="flex flex-col overflow-hidden sm:flex-row">
                <div className="aspect-video sm:w-1/3 md:w-1/4">
                  <img src={note.image || "/placeholder.svg"} alt={note.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <Link href={`/notes/${note.id}`} className="hover:text-brand">
                      <h3 className="text-xl font-bold">{note.title}</h3>
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {note.subject} • {note.university} • {note.semester} Semester
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium">{note.uploader}</span>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{note.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{note.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{note.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-brand text-white">
              1
            </Button>
            <Button variant="outline" size="icon">
              2
            </Button>
            <Button variant="outline" size="icon">
              3
            </Button>
            <span className="px-2">...</span>
            <Button variant="outline" size="icon">
              10
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

