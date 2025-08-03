import { Book, Subject } from '@/types/book'
import { Teacher, TeacherFormData } from '@/types/teacher'
import { bookService, mockSubjects } from './bookService'
import { teacherService, mockTeachersDetailed } from './teacherService'

// Event system for real-time updates
type EventType = 'teacher-added' | 'teacher-updated' | 'teacher-deleted' | 'book-added' | 'book-updated' | 'book-deleted'
type EventCallback = () => void

class DataManager {
  private listeners: Map<EventType, EventCallback[]> = new Map()

  // Subscribe to data changes
  subscribe(event: EventType, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  // Unsubscribe from data changes
  unsubscribe(event: EventType, callback: EventCallback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Emit events
  private emit(event: EventType) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback())
    }
  }

  // Teacher operations
  getTeachers(): Teacher[] {
    return teacherService.getTeachers()
  }

  addTeacher(teacherData: TeacherFormData): Teacher {
    const newTeacher = teacherService.addTeacher(teacherData)
    this.emit('teacher-added')
    return newTeacher
  }

  updateTeacher(id: string, teacherData: TeacherFormData): Teacher | null {
    const updatedTeacher = teacherService.updateTeacher(id, teacherData)
    if (updatedTeacher) {
      this.emit('teacher-updated')
    }
    return updatedTeacher
  }

  deleteTeacher(id: string): boolean {
    const teacher = teacherService.getTeacherById(id)
    if (!teacher) return false

    // Check if teacher has books
    const teacherBooks = this.getBooksByTeacherName(teacher.name)
    if (teacherBooks.length > 0) {
      throw new Error(`ناتوانرێت ئەم مامۆستایە بسڕیتەوە چونکە ${teacherBooks.length} کتێبی هەیە`)
    }

    const success = teacherService.deleteTeacher(id)
    if (success) {
      this.emit('teacher-deleted')
    }
    return success
  }

  // Book operations
  getBooks(): Book[] {
    return bookService.getBooks()
  }

  addBook(bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>): Book {
    const newBook = bookService.addBook(bookData)
    this.emit('book-added')
    return newBook
  }

  updateBook(id: string, bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>): Book | null {
    const updatedBook = bookService.updateBook(id, bookData)
    if (updatedBook) {
      this.emit('book-updated')
    }
    return updatedBook
  }

  deleteBook(id: string): boolean {
    const success = bookService.deleteBook(id)
    if (success) {
      this.emit('book-deleted')
    }
    return success
  }

  // Subject operations
  getSubjects(): Subject[] {
    return bookService.getSubjects()
  }

  // Helper methods
  getBooksByTeacherName(teacherName: string): Book[] {
    return this.getBooks().filter(book => book.teacherName === teacherName)
  }

  getTeacherBookCount(teacherName: string): number {
    return this.getBooksByTeacherName(teacherName).length
  }

  // Get teachers formatted for book dropdown
  getTeachersForDropdown(): Array<{id: string, name: string}> {
    return this.getTeachers().map(teacher => ({
      id: teacher.id,
      name: teacher.name
    }))
  }
}

// Export singleton instance
export const dataManager = new DataManager()