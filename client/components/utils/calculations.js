// Grade points mapping
export const gradePoints = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
}

export const gradeLabels = {
  S: "Outstanding (10)",
  A: "Excellent (9)",
  B: "Very Good (8)",
  C: "Good (7)",
  D: "Average (6)",
  E: "Pass (5)",
  F: "Fail (0)",
}

export const calculateSGPA = (subjects) => {
  let totalCredits = 0
  let totalPoints = 0

  subjects.forEach((subject) => {
    if (subject.grade && subject.grade !== "NA") {
      const credits = subject.credits
      const points = gradePoints[subject.grade] || 0

      totalCredits += credits
      totalPoints += credits * points
    }
  })

  return totalCredits > 0 ? Number.parseFloat((totalPoints / totalCredits).toFixed(2)) : 0
}

export const calculateCGPA = (allSubjects) => {
  let totalCredits = 0
  let totalPoints = 0

  allSubjects.forEach((subject) => {
    if (subject.grade && subject.grade !== "NA") {
      const credits = subject.credits
      const points = gradePoints[subject.grade] || 0

      totalCredits += credits
      totalPoints += credits * points
    }
  })

  return totalCredits > 0 ? Number.parseFloat((totalPoints / totalCredits).toFixed(2)) : 0
}

export const cgpaToPercentage = (cgpa) => {
  return Number.parseFloat((cgpa * 9.5).toFixed(2))
}

export const getGradeColor = (grade) => {
  switch (grade) {
    case "S":
      return "text-emerald-500"
    case "A":
      return "text-green-500"
    case "B":
      return "text-blue-500"
    case "C":
      return "text-yellow-500"
    case "D":
      return "text-orange-500"
    case "E":
      return "text-red-400"
    case "F":
      return "text-red-600"
    default:
      return "text-gray-500"
  }
}

export const getSgpaColor = (sgpa) => {
  if (sgpa >= 9) return "text-emerald-500"
  if (sgpa >= 8) return "text-green-500"
  if (sgpa >= 7) return "text-blue-500"
  if (sgpa >= 6) return "text-yellow-500"
  if (sgpa >= 5) return "text-orange-500"
  return "text-red-500"
}
