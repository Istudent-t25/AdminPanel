'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus, Search, Filter, BookOpen, User, Calendar, Eye, Heart, Grid, List } from 'lucide-react'
import { Book, Subject, Teacher } from '@/types/book'
import BookModal from './BookModal'
import { toArabicIndic, formatDateArabicIndic } from '@/lib/numberUtils'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get unique grades for filter
  const uniqueGrades = Array.from(new Set(books.map(book => book.grade))).filter(grade => grade !== 'نەزانراو')

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSubject = !selectedSubject || book.subjectName === selectedSubject
    const matchesGrade = !selectedGrade || book.grade === selectedGrade
    const matchesSection = !selectedSection || (book as any).section === selectedSection
    
    return matchesSearch && matchesSubject && matchesGrade && matchesSection
  })

  const handleEdit = (book: Book) => {
    setSelectedBook(book)
    setIsAddMode(false)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedBook(null)
    setIsAddMode(true)
    setIsModalOpen(true)
  }

  const handleSave = (bookData: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => {
    if (isAddMode) {
      onAddBook(bookData)
    } else if (selectedBook) {
      onEditBook(selectedBook.id, bookData)
    }
    setIsModalOpen(false)
    setSelectedBook(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('ئایا دڵنیایت لە سڕینەوەی ئەم کتێبە؟')) {
      onDeleteBook(id)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSubject('')
    setSelectedGrade('')
    setSelectedSection('')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">بەڕێوەبردنی کتێبەکان</h2>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>زیادکردنی کتێب</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="گەڕان بە ناونیشان، بابەت، مامۆستا..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            >
              <option value="">هەموو بابەتەکان</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div className="w-full lg:w-32">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            >
              <option value="">هەموو پۆلەکان</option>
              {uniqueGrades.concat(['پۆلی حەوت']).sort((a, b) => {
                const gradeOrder = ['پۆلی حەوت', 'پۆلی هەشت', 'پۆلی نۆ', 'پۆلی دە', 'پۆلی یازدە', 'پۆلی دوازدە'];
                return gradeOrder.indexOf(a) - gradeOrder.indexOf(b);
              }).map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="w-full lg:w-32">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            >
              <option value="">هەموو بەشەکان</option>
              <option value="ئەدەبی">ئەدەبی</option>
              <option value="زانستی">زانستی</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedSubject || selectedGrade || selectedSection) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              پاککردنەوە
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600 text-right">
          {toArabicIndic(filteredBooks.length)} کتێب لە کۆی {toArabicIndic(books.length)} کتێب
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">هیچ کتێبێک نەدۆزرایەوە</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm || selectedSubject || selectedGrade 
                ? 'هیچ کتێبێک بە ئەم کرتەرەیانە نەدۆزرایەوە'
                : 'هێشتا هیچ کتێبێک زیاد نەکراوە'
              }
            </p>
            {!searchTerm && !selectedSubject && !selectedGrade && (
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                یەکەم کتێب زیاد بکە
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Book Image */}
                <div className="aspect-[3/4] bg-white border-b border-gray-200 relative">
                  {book.image && book.image !== 'نەزانراو' ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`${book.image && book.image !== 'نەزانراو' ? 'hidden' : ''} absolute inset-0 flex items-center justify-center bg-gray-100`}>
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 text-right line-clamp-2 leading-tight">
                    {book.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">{book.subjectName}</span>
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs">{book.grade}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <User className="w-3 h-3" />
                      <span className="truncate">{book.teacherName}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateArabicIndic(book.dateAdded)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-3 space-x-reverse text-xs">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Eye className="w-3 h-3" />
                          <span>{toArabicIndic(book.clickCount)}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Heart className="w-3 h-3" />
                          <span>{toArabicIndic(book.favoritesCount)}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {book.bookType}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                        title="دەستکاری"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        title="سڕینەوە"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {book.url && book.url !== 'نەزانراو' && (
                      <a
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        بینین
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  {/* Book Image */}
                  <div className="w-16 h-20 bg-white rounded border border-gray-200 flex-shrink-0 relative overflow-hidden">
                    {book.image && book.image !== 'نەزانراو' ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : null}
                    <div className={`${book.image && book.image !== 'نەزانراو' ? 'hidden' : ''} absolute inset-0 flex items-center justify-center bg-gray-100`}>
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 text-right">
                        <h3 className="font-medium text-gray-900 mb-1 truncate">
                          {book.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="text-blue-600 font-medium">{book.subjectName}</span>
                          <span className="flex items-center space-x-1 space-x-reverse">
                            <User className="w-3 h-3" />
                            <span>{book.teacherName}</span>
                          </span>
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs">{book.grade}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{book.bookType}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1 space-x-reverse">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDateArabicIndic(book.dateAdded)}</span>
                          </span>
                          <span className="flex items-center space-x-1 space-x-reverse">
                            <Eye className="w-3 h-3" />
                            <span>{toArabicIndic(book.clickCount)} بینین</span>
                          </span>
                          <span className="flex items-center space-x-1 space-x-reverse">
                            <Heart className="w-3 h-3" />
                            <span>{toArabicIndic(book.favoritesCount)} پەسەند</span>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 space-x-reverse ml-4">
                        {book.url && book.url !== 'نەزانراو' && (
                          <a
                            href={book.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded hover:bg-blue-50 transition-colors duration-200"
                          >
                            بینین
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(book)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                          title="دەستکاری"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          title="سڕینەوە"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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