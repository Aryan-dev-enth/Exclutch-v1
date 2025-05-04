"use client";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload } from "lucide-react";
import { TrendingNote } from "@/components/trending-note";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotes } from "@/context/NotesContext.js";
import { motion } from "framer-motion";

export default function Home() {
  const { notes } = useNotes();

  const [sortBy, setSortBy] = useState("trending");

  // Memoize sorted notes to avoid mutating the original notes array
  const sortedNotes = useMemo(() => {
    const notesCopy = [...notes];
    switch (sortBy) {
      case "trending":
        notesCopy.sort((a, b) => {
          if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
          if (a.trending !== b.trending) return b.trending ? 1 : -1;
          return (
            b.likeCount +
            b.viewCount +
            b.downloadsCount -
            (a.likeCount + a.viewCount + a.downloadsCount)
          );
        });
        break;
      case "most-viewed":
        notesCopy.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "most-downloaded":
        notesCopy.sort((a, b) => b.downloadsCount - a.downloadsCount);
        break;
      default:
        break;
    }
    return notesCopy;
  }, [notes, sortBy]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative mx-auto px-4 md:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-background to-background dark:from-brand/5 z-0" />

        <div className="container relative flex flex-col items-center justify-center text-center py-20 md:py-32 z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-secondary text-background text-sm font-medium shadow">
              🚀 Ace Your Exams with Peer-Powered Knowledge
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
              <span className="block">
                Share <span className="text-secondary">Knowledge</span>,
              </span>
              <span className="block">
                Ace <span className="text-secondary">Exams</span>
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-muted-foreground md:text-xl">
              Discover high-quality study notes shared by students around the
              globe, designed to help you succeed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex w-full max-w-md flex-col gap-4 md:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for notes..."
                className="w-full pl-10"
              />
            </div>
            <Button asChild>
              <Link href="/notes">Browse Notes</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Notes
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Notes */}
      <section className="container mx-auto py-12 md:py-16">
        <Tabs defaultValue="trending" className="w-full">
          <div className="flex flex-col gap-4 lg:flex-row items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Discover Study Notes
            </h2>
            <TabsList>
              <TabsTrigger
                value="trending"
                onClick={() => setSortBy("trending")}
              >
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="most-viewed"
                onClick={() => setSortBy("most-viewed")}
              >
                Most Viewed
              </TabsTrigger>
              <TabsTrigger
                value="most-downloaded"
                onClick={() => setSortBy("most-downloaded")}
              >
                Most Downloaded
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="trending" className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedNotes.slice(0, 3).map((note, index) => (
                <TrendingNote
                  key={index}
                  title={note.title}
                  subject={note.subject}
                  uploader={note.author}
                  likes={note.likes?.length}
                  views={note.viewCount}
                  image={`https://drive.google.com/file/d/${note.gapis_file_id}/preview#page=1`}
                  href={`/notes/${note._id}`}
                  badge="Trending"
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="most-viewed" className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedNotes.slice(0, 3).map((note, index) => (
                <TrendingNote
                  key={index}
                  title={note.title}
                  subject={note.subject}
                  uploader={note.author}
                  likes={note.likeCount}
                  views={note.viewCount}
                  image={`https://drive.google.com/file/d/${note.gapis_file_id}/preview#page=1`}
                  href={`/notes/${note._id}`}
                  badge="Trending"
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="most-downloaded" className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedNotes.slice(0, 3).map((note, index) => (
                <TrendingNote
                  key={index}
                  title={note.title}
                  subject={note.subject}
                  uploader={note.author}
                  likes={note.likeCount}
                  views={note.viewCount}
                  image={`https://drive.google.com/file/d/${note.gapis_file_id}/preview#page=1`}
                  href={`/notes/${note._id}`}
                  badge="Trending"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex mt-4 lg:mt-8 justify-center">
          <Button variant="outline" asChild>
            <Link href="/notes">View All Notes</Link>
          </Button>
        </div>
      </section>

      {/* Feature Section */}
      <section className="container py-12 w-10/12 lg:w-full mx-auto md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Organize by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find notes categorized by subject, semester, branch, and
                university with our comprehensive filtering system.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contribute & Earn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share your knowledge by uploading notes and earn reputation
                badges as you help others succeed.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Study Better</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access high-quality study material, save for offline use, and
                track your learning progress all in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
