"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { TrendingNote } from "@/components/trending-note"
import { Grid3X3, List, Search, SlidersHorizontal, Heart, Eye, ChevronLeft, ChevronRight, Calendar, Download, Tag } from "lucide-react"
import { useNotes } from "@/context/NotesContext"
import { DOCUMENT_TYPES, SUBJECTS, BRANCHES, COLLEGES } from "../../constant.js"

export default function NotesPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("trending")
  const [filters, setFilters] = useState({
    subject: "",
    subject_code: "",
    branch: "",
    college: "",
    document_type: "",
    tags: ""
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const notesPerPage = 9

  const { notes } = useNotes()
  const [filteredNotes, setFilteredNotes] = useState([])

  useEffect(() => {
    let result = [...notes]

    // Apply search
    if (searchTerm) {
      result = result.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply filters
    if (filters.subject) {
      result = result.filter(note => note.subject === filters.subject)
    }
    if (filters.subject_code) {
      result = result.filter(note => note.subject_code.includes(filters.subject_code))
    }
    if (filters.branch) {
      result = result.filter(note => note.branch === filters.branch)
    }
    if (filters.college) {
      result = result.filter(note => note.college === filters.college)
    }
    if (filters.document_type) {
      result = result.filter(note => note.document_type === filters.document_type)
    }
    if (filters.tags) {
      result = result.filter(note => 
        note.tags?.some(tag => tag.toLowerCase().includes(filters.tags.toLowerCase()))
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "trending":
        // First show pinned and trending notes, then sort by most engagement
        result.sort((a, b) => {
          if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
          if (a.trending !== b.trending) return b.trending ? 1 : -1;
          return (b.likeCount + b.viewCount + b.downloadsCount) - (a.likeCount + a.viewCount + a.downloadsCount);
        })
        break
      case "most-viewed":
        result.sort((a, b) => b.viewCount - a.viewCount)
        break
      case "most-downloaded":
        result.sort((a, b) => b.downloadsCount - a.downloadsCount)
        break
      case "most-liked":
        result.sort((a, b) => b.likeCount - a.likeCount)
        break
      case "recent":
        result.sort((a, b) => new Date(b.published) - new Date(a.published))
        break
      default:
        break
    }

    // Calculate total pages
    setTotalPages(Math.ceil(result.length / notesPerPage))
    setFilteredNotes(result)
    
    // Reset to first page when filters change
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [notes, searchTerm, filters, sortBy])

  // Get current page notes
  const getCurrentNotes = () => {
    const indexOfLastNote = currentPage * notesPerPage
    const indexOfFirstNote = indexOfLastNote - notesPerPage
    return filteredNotes.slice(indexOfFirstNote, indexOfLastNote)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0)
  }

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisibleButtons = 5
    
    // Always show first page
    buttons.push(
      <Button 
        key="page-1" 
        variant="outline" 
        size="icon" 
        className={currentPage === 1 ? "bg-brand text-white" : ""}
        onClick={() => handlePageChange(1)}
      >
        1
      </Button>
    )
    
    if (totalPages <= 1) return buttons
    
    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)
    
    // Adjust start and end to show up to maxVisibleButtons
    if (startPage > 2) {
      buttons.push(<span key="ellipsis-1" className="px-2">...</span>)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button 
          key={`page-${i}`}
          variant="outline" 
          size="icon" 
          className={currentPage === i ? "bg-brand text-white" : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      )
    }
    
    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis-2" className="px-2">...</span>)
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <Button 
          key={`page-${totalPages}`}
          variant="outline" 
          size="icon" 
          className={currentPage === totalPages ? "bg-brand text-white" : ""}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      )
    }
    
    return buttons
  }

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
              <Input 
                type="search" 
                placeholder="Search notes or tags..." 
                className="w-full pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setFilterOpen(!filterOpen)}>
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Select 
              value={sortBy} 
              onValueChange={value => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="most-viewed">Most Viewed</SelectItem>
                <SelectItem value="most-downloaded">Most Downloaded</SelectItem>
                <SelectItem value="most-liked">Most Liked</SelectItem>
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
          <div className="mb-8 grid gap-4 rounded-lg border p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Subject</label>
              <Select 
                value={filters.subject} 
                onValueChange={value => handleFilterChange("subject", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Document Type</label>
              <Select 
                value={filters.document_type} 
                onValueChange={value => handleFilterChange("document_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Branch</label>
              <Select 
                value={filters.branch} 
                onValueChange={value => handleFilterChange("branch", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">College</label>
              <Select 
                value={filters.college} 
                onValueChange={value => handleFilterChange("college", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Colleges" />
                </SelectTrigger>
                <SelectContent>
                  {COLLEGES.map(college => (
                    <SelectItem key={college} value={college}>{college}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Subject Code</label>
              <Input 
                placeholder="e.g. CS101" 
                value={filters.subject_code}
                onChange={e => handleFilterChange("subject_code", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tags</label>
              <Input 
                placeholder="e.g. exam, midterm" 
                value={filters.tags}
                onChange={e => handleFilterChange("tags", e.target.value)}
              />
            </div>
            <div className="flex items-end sm:col-span-2 md:col-span-3 lg:col-span-6">
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => setFilters({
                  subject: "",
                  subject_code: "",
                  branch: "",
                  college: "",
                  document_type: "",
                  tags: ""
                })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-xl font-medium">No notes found</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getCurrentNotes().map((note) => (
              <TrendingNote
                key={note._id}
                title={note.title}
                subject={note.subject}
                uploader={note.author}
                likes={note.likeCount}
                views={note.viewCount}
                downloads={note.downloadsCount}
                date={note.published}
                verified={note.verified}
                pinned={note.pinned}
                trending={note.trending}
                tags={note.tags}
                image={`https://drive.google.com/file/d/${note.gapis_file_id}/preview`}
                href={`/notes/${note._id}`}
                documentType={note.document_type}
                subjectCode={note.subject_code}
                college={note.college}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {getCurrentNotes().map((note) => (
              <Card key={note._id} className="flex flex-col overflow-hidden sm:flex-row">
                <div className="aspect-video sm:w-1/3 md:w-1/4 p-4">
                  <img 
                    src={`https://drive.google.com/file/d/${note.gapis_file_id}/preview`} 
                    alt={note.title} 
                    className="h-40 w-40 object-cover" 
                  />
                  {(note.trending || note.pinned) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {note.pinned && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          Pinned
                        </span>
                      )}
                      {note.trending && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Trending
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Link href={`/notes/${note._id}`} className="hover:text-brand">
                        <h3 className="text-xl font-bold">{note.title}</h3>
                      </Link>
                      {note.verified && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {note.content ? note.content.slice(0, 100) + "..." : "No content preview available"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {note.subject} • {note.subject_code} • {note.document_type} • {note.college} • {note.branch}
                    </p>
                    
                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium">{note.author || "Anonymous"}</span>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{note.likeCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{note.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" />
                        <span>{note.downloadsCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(note.published).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredNotes.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {renderPaginationButtons()}
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {filteredNotes.length > 0 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {(currentPage - 1) * notesPerPage + 1} to {Math.min(currentPage * notesPerPage, filteredNotes.length)} of {filteredNotes.length} notes
          </div>
        )}
      </div>
    </div>
  )
}