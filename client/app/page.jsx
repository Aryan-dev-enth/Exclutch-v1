"use client";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload, X, BookOpen, Users, Trophy, Sparkles, ArrowRight, Star } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotes } from "@/context/NotesContext.js";
import { UserAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { notes } = useNotes();
  const { user, googleSignIn, logout, setSavedUser } = UserAuth();
  
  const [sortBy, setSortBy] = useState("trending");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Show auth popup if user is not authenticated
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setShowAuthPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await googleSignIn();
      setShowAuthPopup(false);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

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
    <div className="flex flex-col relative min-h-screen">
      {/* Blur Overlay for Unauthenticated Users */}
      {!user && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-40" />
      )}

      {/* Auth Popup */}
      <AnimatePresence>
        {showAuthPopup && !user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-card rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-border/50 backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Welcome to StudyNotes</h2>
                  <p className="text-muted-foreground">Your gateway to academic success</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAuthPopup(false)}
                  className="h-9 w-9 rounded-full hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="grid gap-4">
                  {[
                    { icon: BookOpen, text: "Access premium study materials", color: "text-blue-500" },
                    { icon: Upload, text: "Upload and share your notes", color: "text-green-500" },
                    { icon: Trophy, text: "Earn reputation and badges", color: "text-yellow-500" },
                    { icon: Star, text: "Save notes for offline reading", color: "text-purple-500" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/30"
                    >
                      <div className={`p-2 rounded-lg bg-background ${feature.color}`}>
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full h-12 text-base font-medium rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="lg"
                >
                  {isSigningIn ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Signing you in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </div>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
                  By continuing, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`${!user ? 'filter blur-sm pointer-events-none' : ''}`}>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent)]" />
          
          <div className="container relative mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex flex-col items-center justify-center text-center py-20 md:py-32 space-y-12">
              
              {/* Announcement Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium rounded-full border shadow-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ace Your Exams with Peer-Powered Knowledge
                </Badge>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6 max-w-4xl"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9]">
                  <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Share Knowledge,
                  </span>
                  <span className="block mt-2">
                    Ace <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Exams</span>
                  </span>
                </h1>

                <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Discover high-quality study notes shared by students around the globe, 
                  designed to help you succeed in your academic journey.
                </p>
              </motion.div>

             

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
              >
                <div className="flex flex-col sm:flex-row gap-4 w-full">
  <Button
    variant="outline"
    size="lg"
    className="w-full sm:flex-1 h-12 rounded-xl border-2"
    asChild
  >
    <Link href="/upload" className="flex items-center justify-center gap-2">
      <Upload className="h-4 w-4" />
      Upload Notes
    </Link>
  </Button>

  <Button
    size="lg"
    className="w-full sm:flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
    onClick={() => !user && setShowAuthPopup(true)}
  >
    {user ? (
      <span className="flex items-center justify-center gap-2">
        Welcome Back! <ArrowRight className="h-4 w-4" />
      </span>
    ) : (
      'Get Started'
    )}
  </Button>
</div>

              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="grid grid-cols-3 gap-8 pt-8"
              >
                {[
                  { number: "100+", label: "Study Notes" },
                  { number: "500+", label: "Students" },
                  { number: "10+", label: "Universities" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Notes Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Discover Popular Study Notes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore trending notes from top students and boost your academic performance
              </p>
            </motion.div>

            <Tabs defaultValue="trending" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3 h-12 p-1 bg-background border">
                  <TabsTrigger
                    value="trending"
                    onClick={() => setSortBy("trending")}
                    className="rounded-lg font-medium"
                  >
                    🔥 Trending
                  </TabsTrigger>
                  <TabsTrigger
                    value="most-viewed"
                    onClick={() => setSortBy("most-viewed")}
                    className="rounded-lg font-medium"
                  >
                    👁️ Most Viewed
                  </TabsTrigger>
                  <TabsTrigger
                    value="most-downloaded"
                    onClick={() => setSortBy("most-downloaded")}
                    className="rounded-lg font-medium"
                  >
                    📥 Downloaded
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="trending" className="mt-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {sortedNotes.slice(0, 8).map((note, index) => (
                    <motion.div
                      key={note._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NoteCard 
                        note={{
                          ...note,
                          trending: true,
                          likes: note.likes || [],
                          likeCount: note.likeCount || 0
                        }} 
                        viewMode="grid" 
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="most-viewed" className="mt-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {sortedNotes.slice(0, 8).map((note, index) => (
                    <motion.div
                      key={note._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NoteCard 
                        note={{
                          ...note,
                          verified: note.viewCount > 1000,
                          likes: note.likes || [],
                          likeCount: note.likeCount || 0
                        }} 
                        viewMode="grid" 
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="most-downloaded" className="mt-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {sortedNotes.slice(0, 8).map((note, index) => (
                    <motion.div
                      key={note._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NoteCard 
                        note={{
                          ...note,
                          pinned: note.downloadsCount > 500,
                          likes: note.likes || [],
                          likeCount: note.likeCount || 0
                        }} 
                        viewMode="grid" 
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center mt-12">
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl" asChild>
                <Link href="/notes" className="flex items-center gap-2">
                  View All Notes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Why Choose StudyNotes?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to excel in your studies, all in one place
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: "Smart Organization",
                  description: "Find notes categorized by subject, semester, branch, and university with our comprehensive filtering system.",
                  color: "from-blue-500/10 to-blue-600/10 border-blue-200/20"
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  description: "Share your knowledge by uploading notes and earn reputation badges as you help others succeed.",
                  color: "from-green-500/10 to-green-600/10 border-green-200/20"
                },
                {
                  icon: Trophy,
                  title: "Enhanced Learning",
                  description: "Access high-quality study material, save for offline use, and track your learning progress all in one place.",
                  color: "from-purple-500/10 to-purple-600/10 border-purple-200/20"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className={`group hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br ${feature.color} h-full`}>
                    <CardHeader className="pb-4">
                      <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to Transform Your Study Experience?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of students who are already using StudyNotes to ace their exams
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button 
                  size="lg" 
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  onClick={() => !user && setShowAuthPopup(true)}
                >
                  {user ? 'Start Exploring' : 'Join Now'}
                </Button>
                <Button variant="outline" size="lg" className="flex-1 h-12 rounded-xl" asChild>
                  <Link href="/notes">Browse Notes</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}