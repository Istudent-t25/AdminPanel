'use client'

import { useState, useEffect } from 'react'
import { Book, Subject, Teacher } from '@/types/book'
import { bookService } from '@/lib/bookService'
import BooksTable from './BooksTable'

export default function BooksSection() {
  const [books, setBooks] = useState<Book[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        setBooks(bookService.getBooks())
        setSubjects(bookService.getSubjects())
        setTeachers(bookService.getTeachers())
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddBook = (bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => {
    try {
      const newBook = bookService.addBook(bookData)
      setBooks(prev => [...prev, newBook])
    } catch (error) {
      console.error('Error adding book:', error)
      alert('هەڵەیەک ڕوویدا لە زیادکردنی کتێبەکە')
    }
  }

  const handleEditBook = (id: string, bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => {
    try {
      const updatedBook = bookService.updateBook(id, bookData)
      if (updatedBook) {
        setBooks(prev => prev.map(book => book.id === id ? updatedBook : book))
      }
    } catch (error) {
      console.error('Error updating book:', error)
      alert('هەڵەیەک ڕوویدا لە نوێکردنەوەی کتێبەکە')
    }
  }

  const handleDeleteBook = (id: string) => {
    try {
      const success = bookService.deleteBook(id)
      if (success) {
        setBooks(prev => prev.filter(book => book.id !== id))
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('هەڵەیەک ڕوویدا لە سڕینەوەی کتێبەکە')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <BooksTable
      books={books}
      subjects={subjects}
      teachers={teachers}
      onAddBook={handleAddBook}
      onEditBook={handleEditBook}
      onDeleteBook={handleDeleteBook}
    />
  )
}