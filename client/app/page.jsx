'use client'
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Upload } from "lucide-react";
import { TrendingNote } from "@/components/trending-note"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {


  return (
  <div className="flex flex-col">


    {/* Hero Section */}
    <section className="relative mx-auto px-16">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-background to-background dark:from-brand/5" />
        <div className="container relative flex flex-col items-center justify-center space-y-10 py-20 text-center md:py-32">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Share{" "}
              <span className="text-secondary">Knowledge</span>
              , Ace{" "}
              <span className="text-secondary">Exams</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover and share high-quality study notes from students around the world.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search for notes..." className="w-full pl-10" />
            </div>
            <Button asChild>
              <Link href="/notes">Browse Notes</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link href="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Notes
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

    {/* Featured Notes */}
      <section className="container mx-auto py-12 md:py-16">
        <Tabs defaultValue="trending" className="w-full">
          <div className="flex flex-col gap-4 lg:flex-row  items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Discover Study Notes</h2>
            <TabsList>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="most-viewed">Most Viewed</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="trending" className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <TrendingNote
                title="Operating Systems: Process Scheduling Algorithms"
                subject="Computer Science"
                uploader="Alex Johnson"
                likes={354}
                views={2897}
                image="/placeholder.svg?height=220&width=360"
                href="/notes/1"
                badge="Trending"
              />
              <TrendingNote
                title="Organic Chemistry: Reaction Mechanisms"
                subject="Chemistry"
                uploader="Emma Davis"
                likes={289}
                views={1823}
                image="/placeholder.svg?height=220&width=360"
                href="/notes/2"
                badge="Trending"
              />
              <TrendingNote
                title="Advanced Calculus: Integration Techniques"
                subject="Mathematics"
                uploader="Michael Chen"
                likes={276}
                views={1654}
                image="/placeholder.svg?height=220&width=360"
                href="/notes/3"
                badge="Trending"
              />
            </div>
          </TabsContent>
          <TabsContent value="most-viewed" className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <TrendingNote
                title="Introduction to Machine Learning"
                subject="Computer Science"
                uploader="Sarah Williams"
                likes={245}
                views={5423}
                image="/placeholder.svg?height=220&width=360"
                href="/notes/4"
                badge="Popular"
              />
              <TrendingNote
                title="Quantum Mechanics Fundamentals"
                subject="Physics"
                uploader="James Lee"
                likes={192}
                views={4721}
                image="/placeholder.svg?height=220&width=360"
                href="/notes/5"
                badge="Popular"
              />
              <TrendingNote
                title="Microeconomics: Supply and Demand"
                subject="Economics"
                uploader="Olivia Garcia"
                likes={187}
                views={3982}
                image="/placeholder.svg?height=220&width=360"
                href="/notes/6"
                badge="Popular"
              />
            </div>
          </TabsContent>
          <TabsContent value="featured" className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <TrendingNote
                title="Data Structures and Algorithms"
                subject="Computer Science"
                uploader="David Wilson"
                likes={321}
                views={3245}
                image="/placeholder.svg?height=220&width=360"
                href="/notes/7"
                badge="Featured"
              />
              <TrendingNote
                title="Human Anatomy: Nervous System"
                subject="Biology"
                uploader="Jessica Brown"
                likes={278}
                views={2987}
                image="/placeholder.svg?height=220&width=360"
                href="/notes/8"
                badge="Featured"
              />
              <TrendingNote
                title="Literary Criticism: Modern Theories"
                subject="Literature"
                uploader="Ryan Thomas"
                likes={265}
                views={2765}
                image="/placeholder.svg?height=220&width=360"
                href="/notes/9"
                badge="Featured"
              />
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
                Find notes categorized by subject, semester, branch, and university with our comprehensive filtering
                system.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contribute & Earn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share your knowledge by uploading notes and earn reputation badges as you help others succeed.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Study Better</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access high-quality study material, save for offline use, and track your learning progress all in one
                place.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* <section className="bg-secondary text-white">
        <div className="container mx-auto py-12 md:py-16">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-md space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Ready to share your knowledge?</h2>
              <p className="text-brand-foreground">
                Join thousands of students sharing and discovering quality study notes.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 ">
              <Button size="lg" variant="secondary" className="bg-background" asChild>
                <Link href="/notes">Browse Notes</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link href="/sign-up">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section> */}
  </div>
  );
}
