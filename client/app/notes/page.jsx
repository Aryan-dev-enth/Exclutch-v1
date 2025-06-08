"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { NoteCard } from "@/components/note-card";
import {
  Grid3X3,
  List,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";

import { useNotes } from "@/context/NotesContext";

// Mock constants - replace with your actual constants
const DOCUMENT_TYPES = ["notes", "assignments", "papers", "presentations"];
const SUBJECTS = [
  "Operating Systems",
  "Data Structures",
  "Computer Networks",
  "Database Systems",
];
const BRANCHES = [
  "B.Tech. CSE",
  "B.Tech. CSE DSAI",
  "B.Tech. IT",
  "M.Tech. CSE",
];
const COLLEGES = [
  "SRM University, Delhi-NCR, Sonepat",
  "IIT Delhi",
  "BITS Pilani",
];

const NOTES_PER_PAGE = 12;

export default function NotesPage() {
  const { notes } = useNotes();
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    subject: "",
    subject_code: "",
    branch: "",
    college: "",
    document_type: "",
    tags: "",
  });

  // Mock notes data
  // const [notes] = useState([
  //   {
  //     _id: "6661c50ab3e43c84f6c6e760",
  //     gapis_file_id: "1TeXicNzkaNyY9ZOqERJC6hluIpwXHvAC",
  //     title: "Operating System complete Notes",
  //     content: "Process Scheduling, CPU scheduling, memory management and more.",
  //     file_url: {
  //       webContentLink: "https://drive.google.com/uc?id=1TeXicNzkaNyY9ZOqERJC6hluIpwXHvAC&export=download",
  //       webViewLink: "https://drive.google.com/file/d/1TeXicNzkaNyY9ZOqERJC6hluIpwXHvAC/view?usp=drivesdk",
  //     },
  //     verified: true,
  //     document_type: "notes",
  //     subject: "Operating Systems",
  //     subject_code: "CS301",
  //     branch: "B.Tech. CSE DSAI",
  //     college: "SRM University, Delhi-NCR, Sonepat",
  //     author: "Aryan Singh",
  //     likeCount: 45,
  //     downloadsCount: 234,
  //     viewCount: 1250,
  //     published: "2024-06-06T14:17:46.158Z",
  //     pinned: true,
  //     trending: true,
  //     tags: ["exam", "midterm", "processes", "scheduling"],
  //   },
  // ])

  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(searchLower) ||
          note.subject?.toLowerCase().includes(searchLower) ||
          note.content?.toLowerCase().includes(searchLower) ||
          
          note.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply each filter
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        if (key === "tags") {
          result = result.filter((note) =>
            note.tags?.some((tag) =>
              tag.toLowerCase().includes(value.toLowerCase())
            )
          );
        } else if (key === "subject_code") {
          result = result.filter((note) =>
            note.subject_code.toLowerCase().includes(value.toLowerCase())
          );
        } else {
          result = result.filter((note) => note[key] === value);
        }
      }
    });

    // Sort
    result.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      switch (sortBy) {
        case "trending":
          if (a.trending !== b.trending) return b.trending ? 1 : -1;
          return (
            b.likeCount +
            b.viewCount +
            b.downloadsCount -
            (a.likeCount + a.viewCount + a.downloadsCount)
          );
        case "most-viewed":
          return b.viewCount - a.viewCount;
        case "most-downloaded":
          return b.downloadsCount - a.downloadsCount;
        case "most-liked":
          return b.likeCount - a.likeCount;
        case "recent":
          return new Date(b.published) - new Date(a.published);
        default:
          return 0;
      }
    });

    return result;
  }, [notes, searchTerm, filters, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedNotes.length / NOTES_PER_PAGE);
  const currentNotes = filteredAndSortedNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      subject_code: "",
      branch: "",
      college: "",
      document_type: "",
      tags: "",
    });
    setSearchTerm("");
  };

  const activeFiltersCount =
    Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className="min-w-[40px]"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Notes</h1>
        <p className="text-muted-foreground">
          Discover and download high-quality study notes from students
          worldwide.
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes, subjects, or tags..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterOpen(!filterOpen)}
              className="relative"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="most-viewed">Most Viewed</SelectItem>
                <SelectItem value="most-downloaded">Most Downloaded</SelectItem>
                <SelectItem value="most-liked">Most Liked</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 ${viewMode === "grid" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 ${viewMode === "list" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              </Badge>
            )}
            {Object.entries(filters).map(
              ([key, value]) =>
                value && (
                  <Badge key={key} variant="secondary" className="gap-1">
                    {key}: {value}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange(key, "")}
                    />
                  </Badge>
                )
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {filterOpen && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select
                value={filters.subject}
                onValueChange={(value) => handleFilterChange("subject", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Document Type
              </label>
              <Select
                value={filters.document_type}
                onValueChange={(value) =>
                  handleFilterChange("document_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Branch</label>
              <Select
                value={filters.branch}
                onValueChange={(value) => handleFilterChange("branch", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {BRANCHES.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">College</label>
              <Select
                value={filters.college}
                onValueChange={(value) => handleFilterChange("college", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Colleges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges</SelectItem>
                  {COLLEGES.map((college) => (
                    <SelectItem key={college} value={college}>
                      {college}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Subject Code
              </label>
              <Input
                placeholder="e.g. CS301"
                value={filters.subject_code}
                onChange={(e) =>
                  handleFilterChange("subject_code", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <Input
                placeholder="e.g. exam, midterm"
                value={filters.tags}
                onChange={(e) => handleFilterChange("tags", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {currentNotes.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Results Info */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {(currentPage - 1) * NOTES_PER_PAGE + 1} to{" "}
            {Math.min(
              currentPage * NOTES_PER_PAGE,
              filteredAndSortedNotes.length
            )}{" "}
            of {filteredAndSortedNotes.length} notes
          </div>

          {/* Notes Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            }
          >
            {currentNotes
              .filter((note) => note.verified) // Only include verified notes
              .map((note) => (
                <NoteCard key={note._id} note={note} viewMode={viewMode} />
              ))}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
}
