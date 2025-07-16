'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus, Search, ChevronUp, ChevronDown } from 'lucide-react'
import { Book, Subject, Teacher } from '@/types/book'
import BookModal from './BookModal'

interface BooksTableProps {
  books: Book[]
  subjects: Subject[]
  teachers: Teacher[]
  onAddBook: (book: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => void
  onEditBook: (id: string, book: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => void
  onDeleteBook: (id: string) => void
}

export default function BooksTable({ 
  books, 
  subjects, 
  teachers, 
  onAddBook, 
  onEditBook, 
  onDeleteBook 
}: BooksTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Book | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.bookType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSort = (field: keyof Book) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortField) return 0

    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      // Alphabet sorting for strings
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      // Number sorting
      // Already numbers, no conversion needed
    } else if (sortField === 'dateAdded') {
      // Date sorting
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    } else if (sortField === 'timeClicked') {
      // Time sorting (already timestamp)
      // Already numbers, no conversion needed
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1
    }
    return 0
  })

  const SortButton = ({ field, children }: { field: keyof Book; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 space-x-reverse hover:bg-gray-100 px-2 py-1 rounded transition-colors w-full text-right"
    >
      <span>{children}</span>
      <div className="flex flex-col">
        <ChevronUp 
          className={`w-3 h-3 ${sortField === field && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
        />
        <ChevronDown 
          className={`w-3 h-3 -mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
        />
      </div>
    </button>
  )

  const handleAddBook = () => {
    setEditingBook(null)
    setIsModalOpen(true)
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setIsModalOpen(true)
  }

  const handleSaveBook = (bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => {
    if (editingBook) {
      onEditBook(editingBook.id, bookData)
    } else {
      onAddBook(bookData)
    }
    setIsModalOpen(false)
    setEditingBook(null)
  }

  const handleDeleteBook = (id: string) => {
    if (confirm('ئایا دڵنیایت لە سڕینەوەی ئەم کتێبە؟')) {
      onDeleteBook(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">کتێبەکان و مەلزەمەکان</h2>
        <button
          onClick={handleAddBook}
          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>زیادکردنی کتێبی نوێ</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="گەڕان بۆ کتێب، بابەت، یان مامۆستا..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 text-right"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <span>زنجیرە</span>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="title">ناونیشان</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="url">بەستەر</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="subjectName">بابەت</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="teacherName">مامۆستا</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="grade">پۆل</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="bookType">جۆری کتێب</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="timeClicked">کات</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="clickCount">کلیک</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="favoritesCount">دڵخواز</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <SortButton field="dateAdded">بەروار</SortButton>
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                  <span>کردارەکان</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedBooks.map((book, index) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-2 py-2 text-xs text-gray-900 text-right">{index + 1}</td>
                  <td className="px-2 py-2 text-xs font-medium text-gray-900 text-right max-w-[120px] truncate" title={book.title}>{book.title}</td>
                  <td className="px-2 py-2 text-xs text-right">
                    <a 
                      href={book.url.startsWith('http://') || book.url.startsWith('https://') ? book.url : `https://${book.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      بینین
                    </a>
                  </td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-right">{book.subjectName}</td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-right">{book.teacherName}</td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-right">{book.grade}</td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-right">{book.bookType}</td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-right">{new Date(book.timeClicked).toLocaleTimeString('ku')}</td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-right">{book.clickCount}</td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-right">{book.favoritesCount}</td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-right">{book.dateAdded}</td>
                  <td className="px-2 py-2 text-xs text-right">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all duration-200"
                        title="دەستکاریکردن"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-all duration-200"
                        title="سڕینەوە"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">هیچ کتێبێک نەدۆزرایەوە</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <BookModal
          book={editingBook}
          subjects={subjects}
          teachers={teachers}
          onSave={handleSaveBook}
          onClose={() => {
            setIsModalOpen(false)
            setEditingBook(null)
          }}
        />
      )}
    </div>
  )
}