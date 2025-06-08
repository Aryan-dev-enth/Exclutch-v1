"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { isAfter, subDays, formatDistanceToNow, subHours } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [user, setUser] = useState(null)
  const [newRequest, setNewRequest] = useState({
    title: "",
    content: "",
  })
  const [showForm, setShowForm] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    setUser(user)
    if (user && user.role === "admin") {
      setIsAdmin(true)
    }

    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`)
        if (response.data.success) {
          const twoDaysAgo = subDays(new Date(), 2)
          const recentRequests = response.data.data.filter((request) => {
            const requestDate = new Date(request.createdAt)
            return isAfter(requestDate, twoDaysAgo)
          })
          setRequests(recentRequests)
        }
      } catch (error) {
        console.error("Failed to fetch requests", error)
      }
    }

    fetchRequests()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewRequest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newRequestObj = {
      title: newRequest.title,
      content: newRequest.content,
      postedBy: user?._id,
      createdAt: new Date(),
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`, newRequestObj)
      setRequests((prev) => [newRequestObj, ...prev])
      setNewRequest({ title: "", content: "" })
      setShowForm(false)
    } catch (error) {
      console.error("Failed to create request", error)
    }
  }

  const handleDeleteRequest = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this request?")
    if (!confirmDelete) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests/${id}`)
      setRequests((prev) => prev.filter((request) => request._id !== id))
    } catch (error) {
      console.error("Failed to delete request", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recent Note Requests</h1>
          <p className="text-muted-foreground mt-1">Showing requests from the last 2 days</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Request"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="title"
                name="title"
                placeholder="e.g. Does anyone have OS notes for Unit 3?"
                value={newRequest.title}
                onChange={handleInputChange}
                required
              />
              <Textarea
                id="content"
                name="content"
                placeholder="Describe what you're looking for..."
                value={newRequest.content}
                onChange={handleInputChange}
                required
              />
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmit}>Submit Request</Button>
          </CardFooter>
        </Card>
      )}

      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {requests.length === 0 ? (
            <Alert className="bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-950 dark:border-gray-900 dark:text-gray-300">
              <AlertTitle>No Recent Requests Found</AlertTitle>
              <AlertDescription>There are no requests from the last 2 days.</AlertDescription>
            </Alert>
          ) : (
            requests.map((request) => {
              const age = formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })
              const isNew = isAfter(new Date(request.createdAt), subHours(new Date(), 3))

              return (
                <Card
                  key={request._id}
                  className="w-full hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        {request.title}
                        {isNew && (
                          <Badge variant="outline" className="text-orange-500 border-orange-500">
                            New
                          </Badge>
                        )}
                      </CardTitle>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {age}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{request.content}</p>
                    <div className="flex items-center space-x-4">
                      <img
                        src={request.postedBy?.profilePic || "/placeholder.svg"}
                        alt={request.postedBy?.name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{request.postedBy?.name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.postedBy?.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  {isAdmin && (
                    <CardFooter>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteRequest(request._id)}
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
