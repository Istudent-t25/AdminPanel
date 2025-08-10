'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus, Search, Filter, BookOpen, User, Calendar, Eye, Heart, Grid, List, Upload, FileText } from 'lucide-react'
import { Book, Subject, Teacher } from '@/types/book'
import BookModal from './BookModal'
import JsonImportModal from './JsonImportModal'
import DataListView from './DataListView'
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
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'data-list'>('grid')
  const [isJsonImportOpen, setIsJsonImportOpen] = useState(false)

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

  const handleJsonImport = (jsonData: any[]) => {
    jsonData.forEach(bookData => {
      // Find subject by name
      const subject = subjects.find(s => s.name === bookData.subjectName)
      if (!subject) {
        console.warn(`Subject not found: ${bookData.subjectName}`)
        return
      }

      // Create book object
      const newBookData = {
        title: bookData.title,
        url: bookData.url || 'نەزانراو',
        image: bookData.image || 'نەزانراو',
        subjectName: bookData.subjectName,
        teacherName: bookData.teacherName,
        grade: bookData.grade,
        bookType: bookData.bookType
      }

      onAddBook(newBookData)
    })
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">بەڕێوەبردنی کتێبەکان</h2>
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setIsJsonImportOpen(true)}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Upload className="w-4 h-4" />
              <span>هاوردەی JSON</span>
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>زیادکردنی کتێب</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="space-y-3">
          {/* Top Row - Search and Main Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="گەڕان بە ناونیشان، بابەت، مامۆستا..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="بینینی کارت"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="بینینی لیست"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('data-list')}
                className={`p-2 ${viewMode === 'data-list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="بینینی داتا"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Row - Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Subject Filter */}
            <div className="flex-1 min-w-[120px] max-w-[200px]">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option value="">هەموو بابەتەکان</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>

            {/* Grade Filter */}
            <div className="flex-1 min-w-[100px] max-w-[150px]">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
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
            <div className="flex-1 min-w-[100px] max-w-[130px]">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option value="">هەموو بەشەکان</option>
                <option value="ئەدەبی">ئەدەبی</option>
                <option value="زانستی">زانستی</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedSubject || selectedGrade || selectedSection) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 flex-shrink-0"
              >
                پاککردنەوە
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600 text-right">
          {toArabicIndic(filteredBooks.length)} کتێب لە کۆی {toArabicIndic(books.length)} کتێب
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        {viewMode === 'data-list' ? (
          <DataListView 
            data={filteredBooks} 
            type="books" 
            title="لیستی کتێبەکان"
          />
        ) : filteredBooks.length === 0 ? (
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
              <div className="space-y-3">
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 mr-3"
                >
                  یەکەم کتێب زیاد بکە
                </button>
                <button
                  onClick={() => setIsJsonImportOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  یان بە JSON هاورده بکە
                </button>
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
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
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-gray-900 mb-2 text-right line-clamp-2 leading-tight text-sm sm:text-base">
                    {book.title}
                  </h3>
                  
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium text-xs sm:text-sm truncate">{book.subjectName}</span>
                      <span className="bg-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs flex-shrink-0">{book.grade}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-sm">{book.teacherName}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{formatDateArabicIndic(book.dateAdded)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse text-xs">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Eye className="w-3 h-3" />
                          <span>{toArabicIndic(book.clickCount)}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Heart className="w-3 h-3" />
                          <span>{toArabicIndic(book.favoritesCount)}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                        {book.bookType}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-1.5 sm:space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                        title="دەستکاری"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        title="سڕینەوە"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
          <div className="space-y-2 sm:space-y-3">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-gray-50 rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-center gap-3 sm:gap-4">
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
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0 text-right">
                        <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base line-clamp-1 sm:line-clamp-none">
                          {book.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                          <span className="text-blue-600 font-medium">{book.subjectName}</span>
                          <span className="flex items-center space-x-1 space-x-reverse">
                            <User className="w-3 h-3" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{book.teacherName}</span>
                          </span>
                          <span className="bg-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">{book.grade}</span>
                          <span className="bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">{book.bookType}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
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
                      <div className="flex items-center space-x-1.5 sm:space-x-2 space-x-reverse flex-shrink-0">
                        {book.url && book.url !== 'نەزانراو' && (
                          <a
                            href={book.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded hover:bg-blue-50 transition-colors duration-200"
                          >
                            بینین
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(book)}
                          className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                          title="دەستکاری"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          title="سڕینەوە"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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

      {/* JSON Import Modal */}
      {isJsonImportOpen && (
        <JsonImportModal
          type="books"
          onImport={handleJsonImport}
          onClose={() => setIsJsonImportOpen(false)}
        />
      )}
    </div>
  )
}