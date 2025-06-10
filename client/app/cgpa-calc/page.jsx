"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit, Info, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { subjectDetails } from "@/subjectDetails"
import {
  calculateSGPA,
  calculateCGPA,
  cgpaToPercentage,
  getGradeColor,
  getSgpaColor,
  gradeLabels,
} from "../../components/utils/calculations.js"
import { EditSubjectDialog } from "@/components/edit-subject-dialog"

export default function CGPACalculator() {
  const [subjects, setSubjects] = useState(subjectDetails)
  const [selectedSemester, setSelectedSemester] = useState(1)
  const [completedSemesters, setCompletedSemesters] = useState([])
  const [showGradeInfo, setShowGradeInfo] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editSubject, setEditSubject] = useState(null)
  const [isNewSubject, setIsNewSubject] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Get unique semesters from your data
  const semesters = [...new Set(subjects.map((subject) => subject.semester))].sort((a, b) => a - b)

  // Filter subjects for the selected semester
  const semesterSubjects = subjects.filter((subject) => subject.semester === selectedSemester)

  // Calculate SGPA for the selected semester
  const sgpa = calculateSGPA(semesterSubjects)

  // Calculate CGPA for all completed semesters
  const completedSubjects = subjects.filter(
    (subject) => completedSemesters.includes(subject.semester) && subject.grade && subject.grade !== "NA",
  )
  const cgpaCalc = calculateCGPA(completedSubjects)
  const percentage = cgpaToPercentage(cgpaCalc)

  // Handle grade change
  const handleGradeChange = (subjectName, grade) => {
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.name === subjectName && subject.semester === selectedSemester) {
          return { ...subject, grade }
        }
        return subject
      }),
    )
  }

  // Handle semester completion toggle
  const handleSemesterCompletion = (completed) => {
    if (completed) {
      setCompletedSemesters((prev) => [...prev, selectedSemester].sort((a, b) => a - b))
    } else {
      setCompletedSemesters((prev) => prev.filter((sem) => sem !== selectedSemester))
    }
  }

  // Edit subject
  const handleEditSubject = (subject) => {
    setEditSubject(subject)
    setIsNewSubject(false)
    setShowEditDialog(true)
  }

  // Add new subject
  const handleAddSubject = () => {
    setEditSubject({ name: "", credits: 3, semester: selectedSemester })
    setIsNewSubject(true)
    setShowEditDialog(true)
  }

  // Save edited subject
  const handleSaveSubject = (editedSubject) => {
    if (isNewSubject) {
      setSubjects((prev) => [...prev, editedSubject])
    } else {
      setSubjects((prev) =>
        prev.map((subject) => {
          if (subject.name === editSubject?.name && subject.semester === editSubject?.semester) {
            return editedSubject
          }
          return subject
        }),
      )
    }
  }

  // Delete subject
  const handleDeleteSubject = () => {
    if (editSubject) {
      setSubjects((prev) =>
        prev.filter((subject) => !(subject.name === editSubject.name && subject.semester === editSubject.semester)),
      )
      setShowEditDialog(false)
    }
  }

  // Save data to local storage
  const saveData = () => {
    localStorage.setItem("cgpaCalculatorSubjects", JSON.stringify(subjects))
    localStorage.setItem("cgpaCalculatorCompletedSemesters", JSON.stringify(completedSemesters))
    alert("Data saved successfully!")
  }

  // Load data from local storage
  useEffect(() => {
    const savedSubjects = localStorage.getItem("cgpaCalculatorSubjects")
    const savedCompletedSemesters = localStorage.getItem("cgpaCalculatorCompletedSemesters")

    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects))
    }

    if (savedCompletedSemesters) {
      setCompletedSemesters(JSON.parse(savedCompletedSemesters))
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">SGPA & CGPA Calculator</h1>
        <p className="mt-2 text-muted-foreground">Calculate your expected SGPA and track your CGPA</p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Semester Selection</CardTitle>
                  <CardDescription>Choose a semester to calculate SGPA</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowGradeInfo(true)}>
                    <Info className="mr-2 h-4 w-4" />
                    Grading System
                  </Button>
                  <Button variant="outline" size="sm" onClick={saveData}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Data
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="semester-select">Select Semester</Label>
                  <Select
                    value={selectedSemester.toString()}
                    onValueChange={(value) => setSelectedSemester(Number(value))}
                  >
                    <SelectTrigger id="semester-select" className="mt-2">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester.toString()}>
                          Semester {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="semester-completed"
                      checked={completedSemesters.includes(selectedSemester)}
                      onCheckedChange={handleSemesterCompletion}
                    />
                    <Label htmlFor="semester-completed">Mark semester as completed</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Semester {selectedSemester} Subjects</CardTitle>
                  <CardDescription>Assign grades to calculate your SGPA</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {editMode ? "Done" : "Edit Subjects"}
                  </Button>
                  {editMode && (
                    <Button size="sm" onClick={handleAddSubject}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Subject
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Subject Name</th>
                      <th className="text-center p-3 font-medium">Credits</th>
                      <th className="text-center p-3 font-medium">Grade</th>
                      {editMode && <th className="text-center p-3 font-medium w-16">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {semesterSubjects.length > 0 ? (
                      semesterSubjects.map((subject, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="p-3">{subject.name}</td>
                          <td className="p-3 text-center">{subject.credits}</td>
                          <td className="p-3 text-center">
                            <Select
                              value={subject.grade || "NA"}
                              onValueChange={(value) => handleGradeChange(subject.name, value)}
                            >
                              <SelectTrigger className="w-32 mx-auto">
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NA">Not Assigned</SelectItem>
                                {Object.entries(gradeLabels).map(([grade, label]) => (
                                  <SelectItem key={grade} value={grade} className={getGradeColor(grade)}>
                                    {grade} - {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          {editMode && (
                            <td className="p-3 text-center">
                              <Button variant="ghost" size="sm" onClick={() => handleEditSubject(subject)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={editMode ? 4 : 3} className="p-6 text-center text-muted-foreground">
                          No subjects found for this semester. {editMode && "Click 'Add Subject' to add one."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Total Credits:</span>
                <Badge variant="outline">
                  {semesterSubjects.reduce((total, subject) => total + subject.credits, 0)}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">Semester GPA:</span>
                <Badge variant="secondary" className={`text-lg px-3 py-1 ${getSgpaColor(sgpa)}`}>
                  {sgpa}
                </Badge>
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-muted/10">
            <CardHeader>
              <CardTitle>CGPA Summary</CardTitle>
              <CardDescription>
                Based on {completedSemesters.length} completed semester{completedSemesters.length !== 1 && "s"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-background">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-sm font-medium text-muted-foreground">CGPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <span className={`text-4xl font-bold ${getSgpaColor(cgpaCalc)}`}>{cgpaCalc}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-sm font-medium text-muted-foreground">Percentage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <span className={`text-4xl font-bold ${getSgpaColor(cgpaCalc)}`}>{percentage}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-sm font-medium text-muted-foreground">
                      Total Credits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <span className="text-4xl font-bold">
                        {completedSubjects.reduce((total, subject) => total + subject.credits, 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Semester-wise Performance</CardTitle>
              <CardDescription>Overview of your academic performance by semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {semesters.map((semester) => {
                  const semSubjects = subjects.filter((s) => s.semester === semester)
                  const semSGPA = calculateSGPA(semSubjects)
                  const isCompleted = completedSemesters.includes(semester)

                  return (
                    <div key={semester} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/30 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">Semester {semester}</h3>
                          {isCompleted ? (
                            <Badge variant="default" className="bg-green-500">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">SGPA:</span>
                          <Badge variant="secondary" className={getSgpaColor(semSGPA)}>
                            {semSGPA}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {semSubjects.map((subject, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center p-2 border rounded-md bg-background"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium truncate">{subject.name}</p>
                                <p className="text-xs text-muted-foreground">{subject.credits} credits</p>
                              </div>
                              {subject.grade && subject.grade !== "NA" ? (
                                <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                              ) : (
                                <Badge variant="outline">Not Graded</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CGPA to Percentage Conversion</CardTitle>
              <CardDescription>Convert your CGPA to percentage using the formula: CGPA × 9.5</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <span className="font-medium">Your CGPA</span>
                    <span className={`font-bold ${getSgpaColor(cgpaCalc)}`}>{cgpaCalc}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <span className="font-medium">Your Percentage</span>
                    <span className={`font-bold ${getSgpaColor(cgpaCalc)}`}>{percentage}%</span>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Common Conversions</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">CGPA</th>
                        <th className="text-right py-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[10, 9, 8, 7, 6, 5].map((gpa) => (
                        <tr key={gpa} className="border-b last:border-0">
                          <td className="py-2">{gpa.toFixed(1)}</td>
                          <td className="py-2 text-right">{(gpa * 9.5).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Grade Info Dialog */}
      <Dialog open={showGradeInfo} onOpenChange={setShowGradeInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grading System</DialogTitle>
            <DialogDescription>The following grading system is used for GPA calculation</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border p-2 text-left">Grade</th>
                  <th className="border p-2 text-left">Points</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">S</td>
                  <td className="border p-2">10</td>
                  <td className="border p-2">Outstanding</td>
                </tr>
                <tr>
                  <td className="border p-2">A</td>
                  <td className="border p-2">9</td>
                  <td className="border p-2">Excellent</td>
                </tr>
                <tr>
                  <td className="border p-2">B</td>
                  <td className="border p-2">8</td>
                  <td className="border p-2">Very Good</td>
                </tr>
                <tr>
                  <td className="border p-2">C</td>
                  <td className="border p-2">7</td>
                  <td className="border p-2">Good</td>
                </tr>
                <tr>
                  <td className="border p-2">D</td>
                  <td className="border p-2">6</td>
                  <td className="border p-2">Average</td>
                </tr>
                <tr>
                  <td className="border p-2">E</td>
                  <td className="border p-2">5</td>
                  <td className="border p-2">Pass</td>
                </tr>
                <tr>
                  <td className="border p-2">F</td>
                  <td className="border p-2">0</td>
                  <td className="border p-2">Fail</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-muted-foreground mt-4">
              SGPA = Sum(Credit × Grade Point) ÷ Sum(Credit)
              <br />
              CGPA = Sum(Credit × Grade Point for all semesters) ÷ Sum(Credit for all semesters)
              <br />
              Percentage = CGPA × 9.5
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <EditSubjectDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        subject={editSubject}
        onSave={handleSaveSubject}
        onDelete={handleDeleteSubject}
        isNew={isNewSubject}
      />
    </div>
  )
}
