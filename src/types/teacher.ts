// Types for Teacher Management system
export interface Teacher {
  id: string
  name: string
  subject: string
  subjectId: string
  dateAdded: string
}

export interface TeacherFormData {
  name: string
  subjectId: string
}

export interface TeacherWithBooks extends Teacher {
  books: string[] // Array of book IDs associated with this teacher
}