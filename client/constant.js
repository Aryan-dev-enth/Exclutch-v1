export const navLinks = [
    {
        title: "Browse Notes",
        href: "/notes"
    },
    {
        title: "Request",
        href: "/requests"
    },{
        title: "Upload",
        href: "/upload"
    }
    ,{
        title: "MyCGPA",
        href: "/cgpa-calc"
    }
]


// constants.js

export const DOCUMENT_TYPES = [
    "notes",
    "question_paper",
    "assignment"
  ];
  
  export const SUBJECTS = [
    "Operating System",
    "TOC"
  ];
  
  export const BRANCHES = [
    "Computer Science Engineering",
    "Electrical Engineering",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Information Technology",
    "Biotechnology",
    "Aerospace Engineering",
    "Biomedical Engineering",
    "Environmental Engineering",
    "Industrial Engineering",
    "Material Science",
    "Metallurgical Engineering",
    "Mining Engineering",
    "Petroleum Engineering"
  ];
  
  export const COLLEGES = [
   "SRM University Delhi-NCR, Sonepat, Haryana"
  ];
  
  export const SEMESTERS = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th"
  ];
  
  // Common tags for study notes
  export const COMMON_TAGS = [
    "midterm",
    "finals",
    "exam-prep",
    "comprehensive",
    "tutorial",
    "lab",
    "assignment",
    "lecture",
    "project",
    "research",
    "important",
    "hand-written",
    "typed",
    "illustrated",
    "beginner",
    "advanced",
    "reference",
    "formula-sheet",
    "problem-solving",
    "theory",
    "practical"
  ];

  export const dummyRequests = [
    {
      id: "1",
      title: "Does someone have OS notes for Unit 3?",
      description: "I'm looking for detailed notes on Process Scheduling and Memory Management for my upcoming exam.",
      subject: "Operating Systems",
      branch: "Computer Science",
      semester: "5",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      user: {
        id: "user1",
        name: "Rahul Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      upvotes: 12,
      comments: 3,
      status: "open",
    },
    {
      id: "2",
      title: "Need Database Management System notes",
      description:
        "Looking for comprehensive notes on Normalization and Transaction Processing. Any help would be appreciated!",
      subject: "DBMS",
      branch: "Computer Science",
      semester: "4",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      user: {
        id: "user2",
        name: "Priya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      upvotes: 8,
      comments: 5,
      status: "open",
    },
    {
      id: "3",
      title: "Machine Learning algorithms cheat sheet",
      description: "Does anyone have a cheat sheet for ML algorithms? Need it for my project presentation next week.",
      subject: "Machine Learning",
      branch: "Computer Science",
      semester: "7",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
      user: {
        id: "user3",
        name: "Amit Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      upvotes: 15,
      comments: 7,
      status: "open",
    },
    {
      id: "4",
      title: "Digital Electronics lecture notes needed",
      description: "I missed a few classes and need notes on Boolean Algebra and Logic Gates. Can anyone help?",
      subject: "Digital Electronics",
      branch: "Electrical Engineering",
      semester: "3",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      user: {
        id: "user4",
        name: "Sneha Gupta",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      upvotes: 5,
      comments: 2,
      status: "open",
    },
    {
      id: "5",
      title: "Compiler Design notes for end semester",
      description:
        "Looking for comprehensive notes on Parsing Techniques and Code Optimization for end semester preparation.",
      subject: "Compiler Design",
      branch: "Computer Science",
      semester: "6",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      user: {
        id: "user5",
        name: "Vikram Singh",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      upvotes: 10,
      comments: 4,
      status: "open",
    },
  ]
