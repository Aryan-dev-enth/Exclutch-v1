"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"

export default function RequestsPage() {
  const [requests, setRequests] = useState([])  // To store all the requests
  const [user, setUser] = useState(null)
  const [newRequest, setNewRequest] = useState({
    title: "",
    content: "",
  })
  const [showForm, setShowForm] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if the user is an admin from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user)
    setUser(user);
    if (user && user.role === "admin") {
      setIsAdmin(true)
    }

    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`) // API endpoint to fetch requests
      
        if(response.data.success)
        {
            setRequests(response.data.data)
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
      postedBy: user._id,
      createdAt: new Date(),
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`, newRequestObj) // API endpoint to create a new request
      setRequests((prev) => [newRequestObj, ...prev]) // Add new request to the state
      setNewRequest({ title: "", content: "" }) // Reset form fields
      setShowForm(false) // Hide form
    } catch (error) {
      console.error("Failed to create request", error)
    }
  }

  const handleDeleteRequest = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this request?")
    if (!confirmDelete) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests/${id}`) // API endpoint to delete a request
      setRequests((prev) => prev.filter((request) => request.id !== id)) // Remove deleted request from the list
    } catch (error) {
      console.error("Failed to delete request", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Note Requests</h1>
          <p className="text-muted-foreground mt-1">Request notes from the community or help others by sharing yours</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Request"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
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

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="open">Open Requests</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
  {requests.length === 0 ? (
    <Alert className="bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-950 dark:border-gray-900 dark:text-gray-300">
      <AlertTitle>No Requests Found</AlertTitle>
      <AlertDescription>There are no requests available.</AlertDescription>
    </Alert>
  ) : (
    requests.map((request) => (
      <Card key={request._id} className="mb-4">
        <CardHeader>
          <CardTitle>{request.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{request.content}</p>
          {/* Display the user's details */}
          <div className="flex items-center space-x-4 mt-4">
            <img
              src={request.postedBy?.profilePic || "placeholder.png"} // Fallback profile picture
              alt={request.postedBy?.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{request.postedBy?.name}</p>
              <p className="text-sm text-muted-foreground">{request.postedBy?.email}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {isAdmin && (
            <Button
              className="bg-red-500 text-white"
              onClick={() => handleDeleteRequest(request._id)}
            >
              Delete
            </Button>
          )}
        </CardFooter>
      </Card>
    ))
  )}
</TabsContent>

      </Tabs>
    </div>
  )
}
