// Types for Books & Booklets system
export interface Book {
  id: string
  bookId: string
  title: string
  url: string
  image: string
  subjectName: string
  teacherName: string
  grade: string
  bookType: string
  timeClicked: number
  clickCount: number
  favoritesCount: number
  dateAdded: string
}

export interface Subject {
  id: string
  name: string
}

export interface Teacher {
  id: string
  name: string
  subject?: string
  subjectId?: string
}

export interface BookFormData {
  title: string
  url: string
  image: string
  subjectId: string
  teacherId: string
  grade: string
  bookType: string
}