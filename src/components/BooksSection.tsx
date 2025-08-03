'use client'

import { useState, useEffect } from 'react'
import { Book, Subject, Teacher } from '@/types/book'
import { dataManager } from '@/lib/dataManager'
import BooksTable from './BooksTable'
import CompactBooksTable from './CompactBooksTable'

export default function BooksSection({ compact = false }: { compact?: boolean }) {
  const [books, setBooks] = useState<Book[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    try {
      setBooks(dataManager.getBooks())
      setSubjects(dataManager.getSubjects())
      setTeachers(dataManager.getTeachersForDropdown())
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Subscribe to data changes
    const handleTeacherChange = () => {
      setTeachers(dataManager.getTeachersForDropdown())
    }

    const handleBookChange = () => {
      setBooks(dataManager.getBooks())
    }

    dataManager.subscribe('teacher-added', handleTeacherChange)
    dataManager.subscribe('teacher-updated', handleTeacherChange)
    dataManager.subscribe('teacher-deleted', handleTeacherChange)
    dataManager.subscribe('book-added', handleBookChange)
    dataManager.subscribe('book-updated', handleBookChange)
    dataManager.subscribe('book-deleted', handleBookChange)

    return () => {
      dataManager.unsubscribe('teacher-added', handleTeacherChange)
      dataManager.unsubscribe('teacher-updated', handleTeacherChange)
      dataManager.unsubscribe('teacher-deleted', handleTeacherChange)
      dataManager.unsubscribe('book-added', handleBookChange)
      dataManager.unsubscribe('book-updated', handleBookChange)
      dataManager.unsubscribe('book-deleted', handleBookChange)
    }
  }, [])

  const handleAddBook = (bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => {
    try {
      dataManager.addBook(bookData)
    } catch (error) {
      console.error('Error adding book:', error)
      alert('هەڵەیەک ڕوویدا لە زیادکردنی کتێبەکە')
    }
  }

  const handleEditBook = (id: string, bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => {
    try {
      dataManager.updateBook(id, bookData)
    } catch (error) {
      console.error('Error updating book:', error)
      alert('هەڵەیەک ڕوویدا لە نوێکردنەوەی کتێبەکە')
    }
  }

  const handleDeleteBook = (id: string) => {
    try {
      dataManager.deleteBook(id)
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

  const TableComponent = compact ? CompactBooksTable : BooksTable

  return (
    <TableComponent
      books={books}
      subjects={subjects}
      teachers={teachers}
      onAddBook={handleAddBook}
      onEditBook={handleEditBook}
      onDeleteBook={handleDeleteBook}
    />
  )
}