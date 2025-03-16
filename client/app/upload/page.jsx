"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Upload, AlertCircle, FileText, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("idle")
  const [aiDescription, setAiDescription] = useState("")
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    semester: "",
    branch: "",
    university: "",
    subjectCode: "",
    title: "",
    description: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    setUploadStatus("uploading")

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          // Generate AI description after successful upload
          setTimeout(() => {
            setAiDescription(
              "These notes provide a comprehensive overview of process scheduling algorithms in operating systems. The document covers First-Come, First-Served (FCFS), Shortest Job First (SJF), Priority Scheduling, and Round Robin algorithms with detailed explanations, examples, and performance comparisons."
            )
          }, 1000)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    // Handle form submission
    alert("Notes uploaded successfully!")
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Upload Study Notes</h1>
          <p className="mt-2 text-muted-foreground">Share your knowledge with the Exclutch community</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep >= 1 ? "border-brand bg-brand text-white" : "border-muted-foreground"}`}
              >
                1
              </div>
              <span className="mt-2 text-sm">Upload File</span>
            </div>
            <div className="relative flex-1">
              <div className="absolute left-0 top-5 w-full">
                <div className={`h-1 ${currentStep >= 2 ? "bg-brand" : "bg-muted"}`}></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep >= 2 ? "border-brand bg-brand text-white" : "border-muted-foreground"}`}
              >
                2
              </div>
              <span className="mt-2 text-sm">Details</span>
            </div>
            <div className="relative flex-1">
              <div className="absolute left-0 top-5 w-full">
                <div className={`h-1 ${currentStep >= 3 ? "bg-brand" : "bg-muted"}`}></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep >= 3 ? "border-brand bg-brand text-white" : "border-muted-foreground"}`}
              >
                3
              </div>
              <span className="mt-2 text-sm">Review</span>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Document</CardTitle>
              <CardDescription>We support PDF, DOCX, and PPT files up to 20MB</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10">
                <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                <div className="mb-4 text-center">
                  <p className="text-lg font-medium">Drag and drop your files here</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                </div>
                <Input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileUpload}
                />
                <Button size="lg" onClick={() => document.getElementById("fileUpload")?.click()}>
                  Select Files
                </Button>
              </div>

              {uploadStatus !== "idle" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Operating Systems.pdf</span>
                    </div>
                    <span className="text-sm">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />

                  {uploadStatus === "success" && (
                    <Alert className="bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Upload successful!</AlertTitle>
                      <AlertDescription>Your file has been uploaded successfully.</AlertDescription>
                    </Alert>
                  )}

                  {uploadStatus === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Upload failed</AlertTitle>
                      <AlertDescription>There was an error uploading your file. Please try again.</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setCurrentStep(2)} disabled={uploadStatus !== "success"}>
                Next Step
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>Provide information about your document to help others find it</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="type">
                      Note Type
                    </label>
                    <Select onValueChange={(value) => handleSelectChange("type", value)} value={formData.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lecture">Lecture Notes</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="solution">Solution</SelectItem>
                        <SelectItem value="exam">Past Exam</SelectItem>
                        <SelectItem value="cheatsheet">Cheat Sheet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="subject">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="e.g. Operating Systems"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="semester">
                      Semester
                    </label>
                    <Select onValueChange={(value) => handleSelectChange("semester", value)} value={formData.semester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Semester</SelectItem>
                        <SelectItem value="2">2nd Semester</SelectItem>
                        <SelectItem value="3">3rd Semester</SelectItem>
                        <SelectItem value="4">4th Semester</SelectItem>
                        <SelectItem value="5">5th Semester</SelectItem>
                        <SelectItem value="6">6th Semester</SelectItem>
                        <SelectItem value="7">7th Semester</SelectItem>
                        <SelectItem value="8">8th Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="branch">
                      Branch
                    </label>
                    <Select onValueChange={(value) => handleSelectChange("branch", value)} value={formData.branch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="ee">Electrical Engineering</SelectItem>
                        <SelectItem value="me">Mechanical Engineering</SelectItem>
                        <SelectItem value="ce">Civil Engineering</SelectItem>
                        <SelectItem value="che">Chemical Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="university">
                      University
                    </label>
                    <Input
                      id="university"
                      name="university"
                      placeholder="e.g. MIT"
                      value={formData.university}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="subjectCode">
                      Subject Code (Optional)
                    </label>
                    <Input
                      id="subjectCode"
                      name="subjectCode"
                      placeholder="e.g. CS601"
                      value={formData.subjectCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="title">
                    Document Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Give your document a descriptive title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Tabs defaultValue="manual">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="manual">Manual Description</TabsTrigger>
                      <TabsTrigger value="ai" disabled={!aiDescription}>
                        AI-Generated
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="manual">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="description">
                          Description
                        </label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe what this document contains..."
                          className="min-h-32 resize-none"
                          value={formData.description}
                          onChange={handleChange}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Provide details about the content, topics covered, and why it's useful.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="ai">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="ai-description">
                          AI-Generated Description
                        </label>
                        <Textarea
                          id="ai-description"
                          name="description"
                          value={aiDescription}
                          onChange={(e) => {
                            setAiDescription(e.target.value)
                            handleChange(e)
                          }}
                          className="min-h-32 resize-none"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Our AI has generated this description based on your document. Feel free to edit it.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)}>Next Step</Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review and Submit</CardTitle>
              <CardDescription>Review your upload details before submitting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-brand" />
                    <div>
                      <p className="font-medium">Operating Systems.pdf</p>
                      <p className="text-sm text-muted-foreground">1.2 MB • Uploaded successfully</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Note Type</p>
                    <p>Lecture Notes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject</p>
                    <p>Operating Systems</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Semester</p>
                    <p>5th Semester</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Branch</p>
                    <p>Computer Science</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">University</p>
                    <p>MIT</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject Code</p>
                    <p>CS601</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p>Process Scheduling Algorithms in Operating Systems</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="whitespace-pre-line">
                    {aiDescription ||
                      "These notes provide a comprehensive overview of operating systems concepts, focusing on scheduling algorithms. They include detailed explanations and examples."}
                  </p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important Information</AlertTitle>
                  <AlertDescription>
                    By submitting this document, you confirm that you have the right to share it and that it does not
                    violate our content policy or copyright laws.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button>Submit Notes</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

