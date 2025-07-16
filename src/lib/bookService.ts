import { Book, Subject, Teacher } from '@/types/book'

// Mock data for subjects
export const mockSubjects: Subject[] = [
  { id: '1', name: 'بیرکاری' },
  { id: '2', name: 'فیزیا' },
  { id: '3', name: 'کیمیا' },
  { id: '4', name: 'ئینگلیزی' },
  { id: '5', name: 'عەرەبی' },
  { id: '6', name: 'کوردی' },
  { id: '7', name: 'مێژوو' },
  { id: '8', name: 'جوگرافیا' },
  { id: '9', name: 'زیندەزانی' },
  { id: '10', name: 'هونەر' }
]

// Mock data for teachers
export const mockTeachers: Teacher[] = [
  { id: '1', name: 'د. ئەحمەد محەمەد' },
  { id: '2', name: 'م. فاتیمە عەلی' },
  { id: '3', name: 'د. کاروان حەسەن' },
  { id: '4', name: 'م. ژیان ئیبراهیم' },
  { id: '5', name: 'د. سارا مەحمود' },
  { id: '6', name: 'م. ئاسۆ رەشید' },
  { id: '7', name: 'د. دلێر قادر' },
  { id: '8', name: 'م. هێوی عومەر' },
  { id: '9', name: 'د. ڕۆژان یوسف' },
  { id: '10', name: 'م. بەرزان سەعید' }
]

// Mock data for books
export const mockBooks: Book[] = [
  {
    id: '1',
    bookId: 'BOOK-001',
    title: 'بیرکاری بۆ پۆلی دوازدە',
    url: 'example.com/math-12.pdf',
    image: 'نەزانراو',
    subjectName: 'بیرکاری',
    teacherName: 'م. ئەحمەد محەمەد',
    grade: 'پۆلی دوازدە',
    bookType: 'کتێب',
    timeClicked: 1640995200000, // timestamp
    clickCount: 245,
    favoritesCount: 89,
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    bookId: 'BOOK-002',
    title: 'فیزیا',
    url: 'www.example.com/physics-modern.pdf',
    image: 'نەزانراو',
    subjectName: 'فیزیا',
    teacherName: 'م. کاروان حەسەن',
    grade: 'پۆلی یازدە',
    bookType: 'مەلزەمە',
    timeClicked: 1640995800000,
    clickCount: 189,
    favoritesCount: 67,
    dateAdded: '2024-01-20'
  },
  {
    id: '3',
    bookId: 'BOOK-003',
    title: 'کیمیا',
    url: 'https://example.com/organic-chemistry.pdf',
    image: 'نەزانراو',
    subjectName: 'کیمیا',
    teacherName: 'م. سارا مەحمود',
    grade: 'پۆلی دە',
    bookType: 'مەلزەمە',
    timeClicked: 1640996400000,
    clickCount: 156,
    favoritesCount: 45,
    dateAdded: '2024-02-01'
  },
  {
    id: '4',
    bookId: 'BOOK-004',
    title: 'ئینگلیزی',
    url: 'docs.google.com/document/english-grammar',
    image: 'نەزانراو',
    subjectName: 'ئینگلیزی',
    teacherName: 'م. ژیان ئیبراهیم',
    grade: 'پۆلی نۆ',
    bookType: 'کتێب',
    timeClicked: 1640997000000,
    clickCount: 298,
    favoritesCount: 112,
    dateAdded: '2024-02-05'
  },
  {
    id: '5',
    bookId: 'BOOK-005',
    title: 'مێژوو',
    url: 'archive.org/details/kurdistan-history',
    image: 'نەزانراو',
    subjectName: 'مێژوو',
    teacherName: 'م. دلێر قادر',
    grade: 'پۆلی هەشت',
    bookType: 'کتێب',
    timeClicked: 1640997600000,
    clickCount: 134,
    favoritesCount: 78,
    dateAdded: '2024-02-10'
  }
]

// Book service class
export class BookService {
  private books: Book[] = [...mockBooks]
  private subjects: Subject[] = [...mockSubjects]
  private teachers: Teacher[] = [...mockTeachers]

  // Get all books
  getBooks(): Book[] {
    return [...this.books]
  }

  // Get all subjects
  getSubjects(): Subject[] {
    return [...this.subjects]
  }

  // Get all teachers
  getTeachers(): Teacher[] {
    return [...this.teachers]
  }

  // Add a new book
  addBook(bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>): Book {
    const newBook: Book = {
      ...bookData,
      id: this.generateId(),
      bookId: this.generateBookId(),
      timeClicked: Date.now(),
      clickCount: 0,
      favoritesCount: 0,
      dateAdded: new Date().toISOString().split('T')[0]
    }
    
    this.books.push(newBook)
    return newBook
  }

  // Update an existing book
  updateBook(id: string, bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>): Book | null {
    const index = this.books.findIndex(book => book.id === id)
    if (index === -1) return null

    const existingBook = this.books[index]
    const updatedBook: Book = {
      ...existingBook,
      ...bookData,
      timeClicked: Date.now() // Update time when edited
    }
    
    this.books[index] = updatedBook
    return updatedBook
  }

  // Delete a book
  deleteBook(id: string): boolean {
    const index = this.books.findIndex(book => book.id === id)
    if (index === -1) return false

    this.books.splice(index, 1)
    return true
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Generate book ID
  private generateBookId(): string {
    const count = this.books.length + 1
    return `BOOK-${count.toString().padStart(3, '0')}`
  }
}

// Export singleton instance
export const bookService = new BookService()