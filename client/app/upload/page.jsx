"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  Brain,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStorage } from "firebase/storage";
import {
  getPublicFileUrl,
  uploadFile,
  removeFile,
} from "@/components/utils/uploadToSupabase";
import { postNotes } from "@/notes_api";
import { UserAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateTitleAndDescriptionFromPDF } from "@/components/utils/helpergemini";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { sendEmail } from "@/components/utils/emailService";
import { getUserByUID } from "@/user_api";

export default function UploadPage() {
  const storage = getStorage();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [aiDescription, setAiDescription] = useState("");
  const [currentFile, setCurrentFile] = useState(null);
  const { user } = UserAuth();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentProcessStep, setCurrentProcessStep] = useState("");

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
    userId: null,
  });

  // Function to check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = ["document_type", "title", "content"];
    const allFieldsFilled = requiredFields.every(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    );
    const fileUploaded = uploadStatus === "success" && formData.supabase_path;
    return allFieldsFilled && fileUploaded;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(10);
    setCurrentProcessStep("Uploading file...");

    const file = e.target.files[0];
    setCurrentFile(file);

    try {
      const response = await uploadFile(file);
      setUploadProgress(40);
      setCurrentProcessStep("Processing file...");

      

      formData.supabase_path = response;

      const responseUrl = await getPublicFileUrl(response.path);
      setUploadProgress(50);
      setCurrentProcessStep("Generating AI insights...");

      setIsGeneratingAI(true);
      const aitext = await generateTitleAndDescriptionFromPDF(
        responseUrl.publicUrl
      );
      setIsGeneratingAI(false);
      setUploadProgress(90);
      setCurrentProcessStep("Finalizing...");

      formData.url = responseUrl.publicUrl;
      if (formData.supabase_path && formData.url) {
        formData.content = aitext;
        setAiDescription(aitext);

        setUploadProgress(100);
        setUploadStatus("success");
        setCurrentProcessStep("Complete!");

        

       

        return;
      }
      setUploadStatus("error");
    } catch (error) {
      console.error("File upload failed:", error);
      setUploadStatus("error");
      setIsGeneratingAI(false);
      setCurrentProcessStep("Error occurred");
      toast.error("File upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.supabase_path) {
      toast.error("Please upload a file first");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadStatus("uploading");
      setCurrentProcessStep("Submitting your notes...");

      const response = await postNotes(formData, user.uid);
      

       

      setUploadStatus("success");
      setCurrentProcessStep("Success!");

      toast.success("Notes uploaded successfully!");
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const emailContent = {
          title: "Upload Successful - Exclutch",
          user_name: currentUser.name,
          actionType: "uploading your study notes",
          custom_message:
            "Thanks for contributing! Your notes have been uploaded and are now pending review.",
          ctaText: "Visit Exclutch",
          ctaLink: "https://exclutch.vercel.app/",
          name:"Exclutch",
          email:"exclutch.help@gmail.com",
          from_email: currentUser.email,
        };

        await sendEmail(emailContent);

      setTimeout(() => {
        router.push("/");
      }, 500);

      setCurrentFile(null);
    } catch (error) {
      console.error("Failed to post notes:", error);
      setUploadStatus("error");
      setCurrentProcessStep("Submission failed");
      toast.error("Failed to upload notes. Please try again.");

      if (formData.supabase_path && formData.supabase_path.path) {
        try {
          await removeFile(formData.supabase_path.path);
        } catch (cleanupError) {
          console.error("Failed to remove file from Supabase:", cleanupError);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
      {/* Floating Progress Overlay */}
      {(uploadStatus === "uploading" || isSubmitting) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border/50 backdrop-blur-sm max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
                  {isGeneratingAI ? (
                    <Brain className="w-8 h-8 text-white animate-bounce" />
                  ) : (
                    <Zap className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full opacity-20 animate-ping"></div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isGeneratingAI
                    ? "AI is analyzing your document..."
                    : currentProcessStep}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isGeneratingAI
                    ? "Our AI is reading and understanding your content"
                    : "Please wait while we process your request"}
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-gray-500">
                  {uploadProgress}% complete
                </p>
              </div>

              {isGeneratingAI && (
                <div className="flex items-center justify-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Generating insights with AI</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-10">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium rounded-full border shadow-sm mb-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Document Analysis
              </Badge>
            </motion.div>
            <div className="inline-flex items-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Upload Study Notes
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your knowledge with the Exclutch community using AI-powered
              insights
            </p>
          </div>

          {/* Modern Step Indicator */}
          <div className="mb-12">
            <div className="relative">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`relative w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                      currentStep >= 1
                        ? "border-primary bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : "border-muted-foreground bg-background text-muted-foreground"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center font-semibold">
                      {uploadStatus === "success" && currentStep === 1 ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        "1"
                      )}
                    </div>
                    {currentStep === 1 && uploadStatus === "uploading" && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full opacity-30 animate-ping"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      currentStep >= 1 ? "text-orange-600" : "text-gray-500"
                    }`}
                  >
                    Upload & Details
                  </span>
                </div>

                <div className="flex-1 mx-8">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      currentStep >= 2
                        ? "bg-gradient-to-r from-orange-500 to-red-600"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`relative w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                      currentStep >= 2
                        ? "border-blue-500 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center font-semibold">
                      {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        "2"
                      )}
                    </div>
                    {currentStep === 2 && isSubmitting && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-30 animate-ping"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      currentStep >= 2 ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    Review & Submit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">Upload Study Notes</CardTitle>
                <CardDescription className="text-base">
                  Upload your document and let our AI help you create the
                  perfect description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-10">
                  {/* Enhanced File Upload Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                      <Upload className="w-5 h-5 text-orange-600" />
                      <span>Upload Your Document</span>
                    </h3>
                    <div
                      className={`relative group transition-all duration-300 ${
                        uploadStatus === "uploading" ? "scale-105" : ""
                      }`}
                    >
                      <div
                        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300 ${
                          uploadStatus === "uploading"
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-muted-foreground hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                        }`}
                      >
                        <div
                          className={`mb-6 p-4 rounded-full transition-all duration-300 ${
                            uploadStatus === "uploading"
                              ? "bg-orange-100 dark:bg-orange-900"
                              : "bg-gray-100 dark:bg-gray-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900"
                          }`}
                        >
                          <Upload
                            className={`h-8 w-8 transition-colors ${
                              uploadStatus === "uploading"
                                ? "text-orange-600"
                                : "text-gray-400 group-hover:text-orange-600"
                            }`}
                          />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            Drag and drop your files here
                          </p>
                          <p className="text-gray-500">
                            or click to browse files • PDF, DOC, DOCX, PPT, PPTX
                            up to 50MB
                          </p>
                        </div>
                        <Input
                          type="file"
                          id="fileUpload"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                          onChange={handleFileUpload}
                        />
                        <Button
                          onClick={() =>
                            document.getElementById("fileUpload")?.click()
                          }
                          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={uploadStatus === "uploading"}
                        >
                          {uploadStatus === "uploading" ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Select Files"
                          )}
                        </Button>
                      </div>
                    </div>

                    {uploadStatus && currentFile && (
                      <div className="mt-6 space-y-4 animate-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                              <FileText className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {currentFile.name}
                              </span>
                              <p className="text-sm text-gray-500">
                                {currentProcessStep}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-orange-600">
                              {uploadProgress}%
                            </span>
                          </div>
                        </div>

                        <Progress
                          value={uploadProgress}
                          className="h-3 bg-gray-200 dark:bg-gray-700"
                        />

                        {uploadStatus === "success" && (
                          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 animate-in slide-in-from-bottom-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <AlertTitle className="text-green-800 dark:text-green-200">
                              Upload successful!
                            </AlertTitle>
                            <AlertDescription className="text-green-700 dark:text-green-300">
                              Your file has been uploaded and analyzed by our
                              AI.
                            </AlertDescription>
                          </Alert>
                        )}

                        {uploadStatus === "error" && (
                          <Alert
                            variant="destructive"
                            className="animate-in slide-in-from-bottom-2"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Upload failed</AlertTitle>
                            <AlertDescription>
                              There was an error uploading your file. Please try
                              again.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Document Details Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`transition-all duration-500 ${
                      uploadStatus === "success"
                        ? "opacity-100"
                        : "opacity-50 pointer-events-none"
                    }`}
                  >
                    <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-red-600" />
                      <span>Document Details</span>
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="type"
                          >
                            Note Type
                          </label>
                          <Select
                            onValueChange={(value) =>
                              handleSelectChange("document_type", value)
                            }
                            value={formData.document_type}
                          >
                            <SelectTrigger className="h-12 rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Notes">
                                📚 Lecture Notes
                              </SelectItem>
                              <SelectItem value="Assignment">
                                📝 Assignment
                              </SelectItem>
                              <SelectItem value="Exam">🎯 Past Exam</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="subject"
                          >
                            Subject
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="e.g. Operating Systems"
                            value={formData.subject}
                            onChange={handleChange}
                            className="h-12 rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="semester"
                          >
                            Semester
                          </label>
                          <Select
                            onValueChange={(value) =>
                              handleSelectChange("semester", value)
                            }
                            value={formData.semester}
                          >
                            <SelectTrigger className="h-12 rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                <SelectItem key={sem} value={sem.toString()}>
                                  {sem}
                                  {sem === 1
                                    ? "st"
                                    : sem === 2
                                    ? "nd"
                                    : sem === 3
                                    ? "rd"
                                    : "th"}{" "}
                                  Semester
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="branch"
                          >
                            Branch
                          </label>
                          <Select
                            onValueChange={(value) =>
                              handleSelectChange("branch", value)
                            }
                            value={formData.branch}
                          >
                            <SelectTrigger className="h-12 rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cs">
                                💻 Computer Science
                              </SelectItem>
                              <SelectItem value="ee">
                                ⚡ Electrical Engineering
                              </SelectItem>
                              <SelectItem value="me">
                                ⚙️ Mechanical Engineering
                              </SelectItem>
                              <SelectItem value="ce">
                                🏗️ Civil Engineering
                              </SelectItem>
                              <SelectItem value="che">
                                🧪 Chemical Engineering
                              </SelectItem>
                              <SelectItem value="oth">📋 Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="university"
                          >
                            Institute
                          </label>
                          <Input
                            id="college"
                            name="college"
                            placeholder="SRM University Delhi-NCR, Sonepat, Haryana"
                            value={formData.college}
                            onChange={handleChange}
                            className="h-12 rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="subjectCode"
                          >
                            Subject Code (Optional)
                          </label>
                          <Input
                            id="subjectCode"
                            name="subjectCode"
                            placeholder="e.g. CS601"
                            value={formData.subjectCode}
                            onChange={handleChange}
                            className="h-12 rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="title"
                        >
                          Document Title
                        </label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Give your document a descriptive title"
                          value={formData.title}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <Tabs defaultValue="manual" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                            <TabsTrigger value="manual" className="rounded-lg">
                              ✍️ Manual Description
                            </TabsTrigger>
                            <TabsTrigger
                              value="ai"
                              disabled={!aiDescription && !isGeneratingAI}
                              className="rounded-lg"
                            >
                              {isGeneratingAI ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  AI-Generated
                                </>
                              )}
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="manual" className="mt-6">
                            <div>
                              <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="content"
                              >
                                Content Description
                              </label>
                              <Textarea
                                id="content"
                                name="content"
                                placeholder="Describe what this document contains..."
                                className="min-h-32 resize-none rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                                value={formData.content}
                                onChange={handleChange}
                              />
                              <p className="text-sm text-muted-foreground mt-2">
                                Provide details about the content, topics
                                covered, and why it's useful.
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="ai" className="mt-6">
                            <div>
                              <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="ai-description"
                              >
                                AI-Generated Description
                              </label>
                              <div className="relative">
                                <Textarea
                                  id="ai-description"
                                  name="description"
                                  value={aiDescription}
                                  onChange={(e) => {
                                    setAiDescription(e.target.value);
                                    handleChange(e);
                                  }}
                                  className="min-h-32 resize-none rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 pr-12"
                                />
                                <div className="absolute top-3 right-3">
                                  <div className="flex items-center space-x-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                                    <Brain className="w-3 h-3" />
                                    <span>AI</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2 flex items-center space-x-1">
                                <Sparkles className="w-4 h-4 text-orange-500" />
                                <span>
                                  Our AI has analyzed your document and
                                  generated this description. Feel free to edit
                                  it.
                                </span>
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter className="pt-8">
                <div className="flex justify-end w-full">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!isFormValid()}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Review & Submit
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm animate-in slide-in-from-right-4">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <span>Review and Submit</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Review your upload details before submitting to the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="rounded-2xl border-2 border-dashed border-primary/20 p-6 bg-primary/5 dark:bg-primary/10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900 dark:text-white">
                          {formData.title}
                        </p>
                        {currentFile && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {[
                      { label: "Document Type", value: formData.document_type },
                      { label: "Subject", value: formData.subject },
                      { label: "Semester", value: formData.semester },
                      { label: "Branch", value: formData.branch },
                      { label: "College", value: formData.college },
                      {
                        label: "Subject Code",
                        value: formData.subjectCode || "Not specified",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                      >
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {item.label}
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Title
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {formData.title}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center space-x-2">
                        <span>Description</span>
                        {aiDescription && (
                          <div className="flex items-center space-x-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                            <Brain className="w-3 h-3" />
                            <span>AI Generated</span>
                          </div>
                        )}
                      </p>
                      <p className="text-gray-900 dark:text-white whitespace-pre-line">
                        {aiDescription || formData.content}
                      </p>
                    </div>
                  </div>

                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <AlertTitle className="text-amber-800 dark:text-amber-200">
                      Important Information
                    </AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-300">
                      By submitting this document, you confirm that you have the
                      right to share it and that it does not violate our content
                      policy or copyright laws.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter className="pt-8">
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Notes
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
