"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Upload, alertCircle, FileText, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStorage } from "firebase/storage"
import { getPublicFileUrl, uploadFile, removeFile } from "@/components/utils/uploadToSupabase"
import { postNotes } from "@/notes_api"
import { UserAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
export default function UploadPage() {
  const storage = getStorage()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("idle")
  const [aiDescription, setAiDescription] = useState("")
  const [currentFile, setCurrentFile] = useState(null)
  const {user} = UserAuth();

  const router = useRouter();

  const [formData, setFormData] = useState({
    supabase_path: null,
    document_type: "Notes",
    subject: "",
    semester: "",
    branch: "",
    url: "",
    college: "SRM University Delhi-NCR, Sonepat, Haryana",
    subjectCode: "",
    title: "",
    content: "",
    userId :null,
  })

  // Function to check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = [
      'document_type',
      'title',
      'content'
    ];
    
    const allFieldsFilled = requiredFields.every(field => 
      formData[field] && formData[field].toString().trim() !== ""
    );
    
    const fileUploaded = uploadStatus === "success" && formData.supabase_path;
    
    return allFieldsFilled && fileUploaded;
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    setUploadStatus("uploading")
    setUploadProgress(10) // Initial progress update

    const file = e.target.files[0]
    setCurrentFile(file)

    try {
      const response = await uploadFile(file)
      setUploadProgress(40) // Update progress after file upload

     
      formData.supabase_path = response

      const responseUrl = await getPublicFileUrl(response.path)
      setUploadProgress(70) 

      
      formData.url = responseUrl.publicUrl

      if(formData.supabase_path && formData.url)
      {
        setUploadProgress(100)
        setUploadStatus("success");
        
        return;
      }
      setUploadStatus("error")
      
    } catch (error) {
      console.error("File upload failed:", error)
      setUploadStatus("error")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.supabase_path) {
      toast("Please upload a file first")
      return
    }

    try {
      setUploadStatus("uploading")
      const response = await postNotes(formData, user.uid);
     
      setUploadStatus("success")
      toast("Notes uploaded successfully!");
      router.push("/")
      

      
      setCurrentFile(null)
      // Reset form or redirect to another page
    } catch (error) {
      console.error("Failed to post notes:", error)
      setUploadStatus("error")

      // Clean up the file from Supabase if API call fails
      if (formData.supabase_path && formData.supabase_path.path) {
        try {
          await removeFile(formData.supabase_path.path)
        
        } catch (cleanupError) {
          console.error("Failed to remove file from Supabase:", cleanupError)
        }
      }

      alert("Failed to upload notes. Please try again.")
    }
  }

  if(!user){ 
    <></>
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
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= 1 ? "border-brand bg-brand text-white" : "border-muted-foreground"
                }`}
              >
                1
              </div>
              <span className="mt-2 text-sm">Upload & Details</span>
            </div>
            <div className="relative flex-1">
              <div className="absolute left-0 top-5 w-full">
                <div className={`h-1 ${currentStep >= 2 ? "bg-brand" : "bg-muted"}`}></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= 2 ? "border-brand bg-brand text-white" : "border-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="mt-2 text-sm">Review</span>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Study Notes</CardTitle>
              <CardDescription>Upload your document and provide details to help others find it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* File Upload Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">1. Upload Your Document</h3>
                  <div className="mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6">
                    <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                    <div className="mb-4 text-center">
                      <p className="text-base font-medium">Drag and drop your files here</p>
                      <p className="text-sm text-muted-foreground">or click to browse files</p>
                    </div>
                    <Input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileUpload}
                    />
                    <Button onClick={() => document.getElementById("fileUpload")?.click()}>Select Files upto 50MB</Button>
                  </div>

                  {uploadStatus && currentFile && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{currentFile.name}</span>
                        </div>
                        <span className="text-sm">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />

                      {uploadStatus === "success" && (
                        <alert className="bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200">
                          <CheckCircle2 className="h-4 w-4" />
                          <alertTitle>Upload successful!</alertTitle>
                          <alertDescription>Your file has been uploaded successfully.</alertDescription>
                        </alert>
                      )}

                      {uploadStatus === "error" && (
                        <alert variant="destructive">
                          <alertCircle className="h-4 w-4" />
                          <alertTitle>Upload failed</alertTitle>
                          <alertDescription>There was an error uploading your file. Please try again.</alertDescription>
                        </alert>
                      )}
                    </div>
                  )}
                </div>

                {/* Document Details Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">2. Document Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="type">
                          Note Type
                        </label>
                        <Select onValueChange={(value) => handleSelectChange("document_type", value)} value={formData.document_type}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Notes">Lecture Notes</SelectItem>
                            <SelectItem value="Assignment">Assignment</SelectItem>
                            <SelectItem value="Exam">Past Exam</SelectItem>
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
                        <Select
                          onValueChange={(value) => handleSelectChange("semester", value)}
                          value={formData.semester}
                        >
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
                            <SelectItem value="oth">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="university">
                          Institute
                        </label>
                        <Input
                          id="university"
                          name="university"
                          placeholder="SRM University Delhi-NCR, Sonepat, Haryana"
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
                            <label className="block text-sm font-medium mb-1" htmlFor="content">
                              Content
                            </label>
                            <Textarea
                              id="content"
                              name="content"
                              placeholder="Describe what this document contains..."
                              className="min-h-32 resize-none"
                              value={formData.content}
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
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => setCurrentStep(2)} 
                disabled={!isFormValid()}
              >
                Review & Submit
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 2 && (
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
                      <p className="font-medium">{formData.title}</p>
                      {currentFile && <p className="text-sm text-muted-foreground">{currentFile.name}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Document Type</p>
                    <p>{formData.document_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject</p>
                    <p>{formData.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Semester</p>
                    <p>{formData.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Branch</p>
                    <p>{formData.branch}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">College</p>
                    <p>{formData.college}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject Code</p>
                    <p>{formData.subjectCode}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p>{formData.title}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="whitespace-pre-line">{aiDescription || formData.content}</p>
                </div>

                <alert>
                  <alertCircle className="h-4 w-4" />
                  <alertTitle>Important Information</alertTitle>
                  <alertDescription>
                    By submitting this document, you confirm that you have the right to share it and that it does not
                    violate our content policy or copyright laws.
                  </alertDescription>
                </alert>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit}>Submit Notes</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
