"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Info, Save, Share2, Calculator, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

// Define grade point values
const gradePoints = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  P: 4,
  F: 0,
}

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([
    {
      id: 1,
      name: "Semester 1",
      subjects: [{ id: 1, name: "", credits: 3, grade: "A" }],
      sgpa: 0,
    },
  ])
  const [cgpa, setCgpa] = useState(0)
  const [activeTab, setActiveTab] = useState("calculator")
  const [showGradeInfo, setShowGradeInfo] = useState(false)
  const [targetCGPA, setTargetCGPA] = useState(8.5)
  const [remainingCredits, setRemainingCredits] = useState(60)
  const [requiredGPA, setRequiredGPA] = useState(0)

  // Calculate SGPA for a semester
  const calculateSGPA = (subjects) => {
    if (subjects.length === 0) return 0

    let totalCredits = 0
    let totalPoints = 0

    subjects.forEach((subject) => {
      if (subject.name && subject.credits && subject.grade) {
        const credits = Number.parseFloat(subject.credits)
        const points = gradePoints[subject.grade]

        totalCredits += credits
        totalPoints += credits * points
      }
    })

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0
  }

  // Calculate CGPA across all semesters
  const calculateCGPA = (semesters) => {
    let totalCredits = 0
    let totalPoints = 0

    semesters.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        if (subject.name && subject.credits && subject.grade) {
          const credits = Number.parseFloat(subject.credits)
          const points = gradePoints[subject.grade]

          totalCredits += credits
          totalPoints += credits * points
        }
      })
    })

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0
  }

  // Calculate required GPA for remaining courses to achieve target CGPA
  const calculateRequiredGPA = () => {
    let currentTotalCredits = 0
    let currentTotalPoints = 0

    semesters.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        if (subject.name && subject.credits && subject.grade) {
          const credits = Number.parseFloat(subject.credits)
          const points = gradePoints[subject.grade]

          currentTotalCredits += credits
          currentTotalPoints += credits * points
        }
      })
    })

    const targetPoints = targetCGPA * (currentTotalCredits + Number.parseFloat(remainingCredits))
    const requiredPoints = targetPoints - currentTotalPoints
    const requiredGPA = requiredPoints / Number.parseFloat(remainingCredits)

    return requiredGPA > 0 ? requiredGPA.toFixed(2) : 0
  }

  // Add a new semester
  const addSemester = () => {
    const newId = semesters.length > 0 ? Math.max(...semesters.map((s) => s.id)) + 1 : 1
    setSemesters([
      ...semesters,
      {
        id: newId,
        name: `Semester ${newId}`,
        subjects: [{ id: 1, name: "", credits: 3, grade: "A" }],
        sgpa: 0,
      },
    ])
  }

  // Remove a semester
  const removeSemester = (semesterId) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter((semester) => semester.id !== semesterId))
    }
  }

  // Add a new subject to a semester
  const addSubject = (semesterId) => {
    setSemesters(
      semesters.map((semester) => {
        if (semester.id === semesterId) {
          const newId = semester.subjects.length > 0 ? Math.max(...semester.subjects.map((s) => s.id)) + 1 : 1
          return {
            ...semester,
            subjects: [...semester.subjects, { id: newId, name: "", credits: 3, grade: "A" }],
          }
        }
        return semester
      }),
    )
  }

  // Remove a subject from a semester
  const removeSubject = (semesterId, subjectId) => {
    setSemesters(
      semesters.map((semester) => {
        if (semester.id === semesterId) {
          if (semester.subjects.length > 1) {
            return {
              ...semester,
              subjects: semester.subjects.filter((subject) => subject.id !== subjectId),
            }
          }
        }
        return semester
      }),
    )
  }

  // Update subject details
  const updateSubject = (semesterId, subjectId, field, value) => {
    setSemesters(
      semesters.map((semester) => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            subjects: semester.subjects.map((subject) => {
              if (subject.id === subjectId) {
                return { ...subject, [field]: value }
              }
              return subject
            }),
          }
        }
        return semester
      }),
    )
  }

  // Update semester name
  const updateSemesterName = (semesterId, name) => {
    setSemesters(
      semesters.map((semester) => {
        if (semester.id === semesterId) {
          return { ...semester, name }
        }
        return semester
      }),
    )
  }

  // Update SGPAs and CGPA whenever subjects or semesters change
  useEffect(() => {
    // Create a new array with updated SGPAs
    const updatedSemesters = semesters.map((semester) => ({
      ...semester,
      sgpa: calculateSGPA(semester.subjects),
    }))
    
    // Only update state if SGPAs have actually changed
    const sgpasChanged = updatedSemesters.some(
      (updatedSem, index) => updatedSem.sgpa !== semesters[index].sgpa
    )
    
    if (sgpasChanged) {
      setSemesters(updatedSemesters)
    }
    
    // Calculate CGPA separately
    const calculatedCGPA = calculateCGPA(semesters)
    if (calculatedCGPA !== cgpa) {
      setCgpa(calculatedCGPA)
    }
  }, [semesters]) // Only depend on semesters

  // Update required GPA when target CGPA, remaining credits, or CGPA changes
  useEffect(() => {
    setRequiredGPA(calculateRequiredGPA())
  }, [targetCGPA, remainingCredits, cgpa])

  // Get color based on GPA value
  const getGpaColor = (gpa) => {
    const numGpa = Number.parseFloat(gpa)
    if (numGpa >= 8.5) return "text-green-500"
    if (numGpa >= 7) return "text-blue-500"
    if (numGpa >= 5.5) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">CGPA Calculator</h1>
        <p className="mt-2 text-muted-foreground">Calculate your Semester GPA and Cumulative GPA</p>
      </div>

      <Tabs defaultValue="calculator" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="target">Target CGPA</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">Your Semesters</h2>
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => setShowGradeInfo(true)}>
                <Info className="h-4 w-4" />
                <span className="sr-only">Grade Information</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addSemester}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Semester
              </Button>
              <Button variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {semesters.map((semester) => (
              <Card key={semester.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Input
                        className="font-semibold bg-transparent border-0 p-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"
                        value={semester.name}
                        onChange={(e) => updateSemesterName(semester.id, e.target.value)}
                      />
                      <Badge variant="outline" className={`${getGpaColor(semester.sgpa)}`}>
                        SGPA: {semester.sgpa}
                      </Badge>
                    </div>
                    {semesters.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeSemester(semester.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Semester</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Subject Name</th>
                          <th className="text-center p-3 font-medium">Credits</th>
                          <th className="text-center p-3 font-medium">Grade</th>
                          <th className="text-center p-3 font-medium w-16">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.subjects.map((subject) => (
                          <tr key={subject.id} className="border-b last:border-0">
                            <td className="p-3">
                              <Input
                                placeholder="Subject Name"
                                value={subject.name}
                                onChange={(e) => updateSubject(semester.id, subject.id, "name", e.target.value)}
                                className="w-full"
                              />
                            </td>
                            <td className="p-3">
                              <Select
                                value={subject.credits.toString()}
                                onValueChange={(value) => updateSubject(semester.id, subject.id, "credits", value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Credits" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-3">
                              <Select
                                value={subject.grade}
                                onValueChange={(value) => updateSubject(semester.id, subject.id, "grade", value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="O">O (10)</SelectItem>
                                  <SelectItem value="A+">A+ (9)</SelectItem>
                                  <SelectItem value="A">A (8)</SelectItem>
                                  <SelectItem value="B+">B+ (7)</SelectItem>
                                  <SelectItem value="B">B (6)</SelectItem>
                                  <SelectItem value="C">C (5)</SelectItem>
                                  <SelectItem value="P">P (4)</SelectItem>
                                  <SelectItem value="F">F (0)</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-3 text-center">
                              {semester.subjects.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSubject(semester.id, subject.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Remove Subject</span>
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between py-4">
                  <Button variant="ghost" size="sm" onClick={() => addSubject(semester.id)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Subject
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Your calculated GPA results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">Semester GPAs</h3>
                  <div className="space-y-2">
                    {semesters.map((semester) => (
                      <div key={semester.id} className="flex justify-between items-center">
                        <span>{semester.name}</span>
                        <span className={`font-semibold ${getGpaColor(semester.sgpa)}`}>{semester.sgpa}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator orientation="vertical" className="hidden md:block" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">Cumulative GPA</h3>
                  <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-background">
                    <span
                      className="text-4xl font-bold mb-2 tracking-tight"
                      style={{ color: `var(--${getGpaColor(cgpa).split("-")[1]})` }}
                    >
                      {cgpa}
                    </span>
                    <span className="text-muted-foreground">Overall CGPA</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="target" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target CGPA Calculator</CardTitle>
              <CardDescription>
                Calculate the GPA you need in your remaining courses to achieve your target CGPA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-cgpa">Current CGPA</Label>
                    <div className="flex items-center mt-1.5">
                      <Input id="current-cgpa" value={cgpa} disabled className="bg-muted" />
                      <Button variant="ghost" size="sm" className="ml-2" onClick={() => setActiveTab("calculator")}>
                        <Calculator className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Based on your calculator input</p>
                  </div>

                  <div>
                    <Label htmlFor="target-cgpa">Target CGPA</Label>
                    <Input
                      id="target-cgpa"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={targetCGPA}
                      onChange={(e) => setTargetCGPA(Number.parseFloat(e.target.value))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="remaining-credits">Remaining Credits</Label>
                    <Input
                      id="remaining-credits"
                      type="number"
                      min="1"
                      value={remainingCredits}
                      onChange={(e) => setRemainingCredits(e.target.value)}
                      className="mt-1.5"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Total credits for your upcoming courses</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="p-6 border rounded-lg bg-muted/30">
                    <h3 className="text-lg font-medium mb-4 text-center">Required GPA</h3>
                    <div className="text-center">
                      <span
                        className="text-4xl font-bold block mb-2"
                        style={{ color: `var(--${getGpaColor(requiredGPA).split("-")[1]})` }}
                      >
                        {requiredGPA}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        GPA needed in your remaining {remainingCredits} credits
                      </span>
                    </div>

                    {Number.parseFloat(requiredGPA) > 10 && (
                      <Alert className="mt-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                        <AlertDescription>
                          The required GPA exceeds 10.0, which is not possible to achieve. Consider adjusting your
                          target CGPA or taking more credits.
                        </AlertDescription>
                      </Alert>
                    )}

                    {Number.parseFloat(requiredGPA) <= 10 &&
                      Number.parseFloat(requiredGPA) >= 9 && (
                        <Alert className="mt-4 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
                          <AlertDescription>
                            This is a challenging target that will require mostly O grades in your remaining courses.
                          </AlertDescription>
                        </Alert>
                      )}

                    {Number.parseFloat(requiredGPA) < 4 && Number.parseFloat(requiredGPA) > 0 && (
                      <Alert className="mt-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                        <AlertDescription>
                          This target is easily achievable with passing grades in your remaining courses.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Recommended grade distribution to achieve your target CGPA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-distribute">Auto-distribute grades</Label>
                  <Switch id="auto-distribute" />
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium">Grade</th>
                        <th className="text-center p-3 font-medium">Points</th>
                        <th className="text-center p-3 font-medium">Courses</th>
                        <th className="text-center p-3 font-medium">Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3">O</td>
                        <td className="p-3 text-center">10</td>
                        <td className="p-3 text-center">2</td>
                        <td className="p-3 text-center">8</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">A+</td>
                        <td className="p-3 text-center">9</td>
                        <td className="p-3 text-center">3</td>
                        <td className="p-3 text-center">9</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">A</td>
                        <td className="p-3 text-center">8</td>
                        <td className="p-3 text-center">4</td>
                        <td className="p-3 text-center">12</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">B+</td>
                        <td className="p-3 text-center">7</td>
                        <td className="p-3 text-center">3</td>
                        <td className="p-3 text-center">9</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">B</td>
                        <td className="p-3 text-center">6</td>
                        <td className="p-3 text-center">2</td>
                        <td className="p-3 text-center">6</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t bg-muted/30">
                        <td className="p-3 font-medium">Total</td>
                        <td className="p-3 text-center">-</td>
                        <td className="p-3 text-center font-medium">14</td>
                        <td className="p-3 text-center font-medium">44</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <p className="text-sm text-muted-foreground">
                  This is a suggested distribution of grades to achieve your target CGPA. You can adjust the number of
                  courses for each grade.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                  <td className="border p-2">O</td>
                  <td className="border p-2">10</td>
                  <td className="border p-2">Outstanding</td>
                </tr>
                <tr>
                  <td className="border p-2">A+</td>
                  <td className="border p-2">9</td>
                  <td className="border p-2">Excellent</td>
                </tr>
                <tr>
                  <td className="border p-2">A</td>
                  <td className="border p-2">8</td>
                  <td className="border p-2">Very Good</td>
                </tr>
                <tr>
                  <td className="border p-2">B+</td>
                  <td className="border p-2">7</td>
                  <td className="border p-2">Good</td>
                </tr>
                <tr>
                  <td className="border p-2">B</td>
                  <td className="border p-2">6</td>
                  <td className="border p-2">Above Average</td>
                </tr>
                <tr>
                  <td className="border p-2">C</td>
                  <td className="border p-2">5</td>
                  <td className="border p-2">Average</td>
                </tr>
                <tr>
                  <td className="border p-2">P</td>
                  <td className="border p-2">4</td>
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
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
