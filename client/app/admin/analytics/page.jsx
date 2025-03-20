"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, BarChart4, Download, FileText, LineChart, PieChart, TrendingUp, Upload, Users } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform performance and user engagement</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">8,547</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="mt-1 text-xs text-green-500">+12% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-200">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Total Notes</p>
                <p className="mt-1 text-xs text-green-500">+8% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4 rounded-full bg-orange-100 p-3 text-orange-600 dark:bg-orange-900 dark:text-orange-200">
                <Upload className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">543</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="mt-1 text-xs text-red-500">+23% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4 rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
                <Download className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">45,621</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
                <p className="mt-1 text-xs text-green-500">+15% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mt-8 space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="content">Content Analytics</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <LineChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">User growth chart visualization</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Uploads</CardTitle>
                  <CardDescription>Note uploads by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <BarChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Content uploads chart visualization</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Daily active users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <LineChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">User activity chart visualization</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Distribution</CardTitle>
                  <CardDescription>Notes by subject area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <PieChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Content distribution chart visualization</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
                <CardDescription>Key performance indicators over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[21/9] w-full rounded-md border">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center">
                      <BarChart4 className="h-16 w-16 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Platform metrics visualization</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">New Users (This Week)</div>
                      <div className="text-2xl font-bold">+248</div>
                      <div className="mt-1 text-xs text-green-500">+12% from last week</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Note Uploads (This Week)</div>
                      <div className="text-2xl font-bold">+87</div>
                      <div className="mt-1 text-xs text-green-500">+5% from last week</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Downloads (This Week)</div>
                      <div className="text-2xl font-bold">3,427</div>
                      <div className="mt-1 text-xs text-green-500">+18% from last week</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Active Users (Today)</div>
                      <div className="text-2xl font-bold">1,245</div>
                      <div className="mt-1 text-xs text-red-500">-3% from yesterday</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>User distribution by university, role, and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <PieChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Users by university</p>
                      </div>
                    </div>
                  </div>

                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <PieChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Users by role</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 aspect-[21/9] w-full rounded-md border">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center">
                      <LineChart className="h-16 w-16 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">User retention over time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Analytics</CardTitle>
                <CardDescription>Analysis of uploaded content and user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <BarChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Notes by subject</p>
                      </div>
                    </div>
                  </div>

                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <BarChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Notes by university</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-4 font-medium">Top Performing Notes</h3>
                  <div className="rounded-md border">
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Table showing top performing notes by views, downloads, and likes would be displayed here
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Metrics on how users interact with the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[21/9] w-full rounded-md border">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-16 w-16 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">User engagement metrics visualization</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Avg. Session Duration</div>
                      <div className="text-2xl font-bold">8m 42s</div>
                      <div className="mt-1 text-xs text-green-500">+15% from last month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Pages Per Session</div>
                      <div className="text-2xl font-bold">4.3</div>
                      <div className="mt-1 text-xs text-green-500">+8% from last month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Bounce Rate</div>
                      <div className="text-2xl font-bold">32.4%</div>
                      <div className="mt-1 text-xs text-red-500">+2.1% from last month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Return Rate</div>
                      <div className="text-2xl font-bold">68.7%</div>
                      <div className="mt-1 text-xs text-green-500">+5.3% from last month</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <LineChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Daily active users</p>
                      </div>
                    </div>
                  </div>

                  <div className="aspect-[4/3] w-full rounded-md border">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <LineChart className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">User retention cohorts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

