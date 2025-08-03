'use client'

import { useState } from 'react'
import { Plus, Search, BookOpen, User, Eye } from 'lucide-react'
import { Book, Subject, Teacher } from '@/types/book'
import BookModal from './BookModal'
import { toArabicIndic } from '@/lib/numberUtils'

interface CompactBooksTableProps {
  books: Book[]
  subjects: Subject[]
  teachers: Teacher[]
  onAddBook: (book: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => void
  onEditBook: (id: string, book: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => void
  onDeleteBook: (id: string) => void
}

export default function CompactBooksTable({ 
  books, 
  subjects, 
  teachers, 
  onAddBook, 
  onEditBook, 
  onDeleteBook 
}: CompactBooksTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  }).slice(0, 10) // Show only first 10 books in compact view

  const handleSave = (bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => {
    if (isAddMode) {
      onAddBook(bookData)
    } else if (selectedBook) {
      onEditBook(selectedBook.id, bookData)
    }
  }

  const openAddModal = () => {
    setSelectedBook(null)
    setIsAddMode(true)
    setIsModalOpen(true)
  }

  const openEditModal = (book: Book) => {
    setSelectedBook(book)
    setIsAddMode(false)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <button
        onClick={openAddModal}
        className="w-full flex items-center justify-center space-x-2 space-x-reverse px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <Plus className="w-4 h-4" />
        <span>کتێبی نوێ</span>
      </button>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="گەڕان..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          dir="rtl"
        />
      </div>

      {/* Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-900">{toArabicIndic(books.length)}</div>
          <div className="text-xs text-blue-700">کۆی کتێبەکان</div>
        </div>
      </div>

      {/* Books List */}
      <div className="space-y-2">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => openEditModal(book)}
            className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate text-right">
                  {book.title}
                </h4>
                <p className="text-xs text-gray-500 truncate text-right">
                  {book.subjectName}
                </p>
                <div className="flex items-center space-x-2 space-x-reverse mt-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600 truncate">
                    {book.teacherName}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{book.grade}</span>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Eye className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{toArabicIndic(book.clickCount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-600 mb-1">هیچ کتێبێک نەدۆزرایەوە</h3>
          <p className="text-xs text-gray-500">
            {searchTerm ? 'گەڕانەکەت بگۆڕە' : 'یەکەم کتێبت زیاد بکە'}
          </p>
        </div>
      )}

      {books.length > 10 && (
        <div className="text-center pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            {toArabicIndic(Math.max(0, books.length - 10))} کتێبی تر هەیە
          </span>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <BookModal
          book={selectedBook}
          subjects={subjects}
          teachers={teachers}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}