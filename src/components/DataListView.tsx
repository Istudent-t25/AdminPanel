'use client'

import { useState } from 'react'
import { Book, Teacher } from '@/types/book'

interface Speech {
  id: string
  title: string
  content: string
  scheduledDate: string
  status: 'scheduled' | 'published'
  createdAt: string
}
import { Search, Filter, Download, FileText, Eye, Calendar, User, BookOpen, MessageSquare } from 'lucide-react'
import { toArabicIndic, formatDateArabicIndic } from '@/lib/numberUtils'

interface DataListViewProps {
  data: Book[] | Teacher[] | Speech[]
  type: 'books' | 'teachers' | 'speeches'
  title: string
}

export default function DataListView({ data, type, title }: DataListViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<string>('dateAdded')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filter data based on search term
  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    if (type === 'books') {
      const book = item as Book
      return (
        book.title.toLowerCase().includes(searchLower) ||
        book.subjectName.toLowerCase().includes(searchLower) ||
        book.teacherName.toLowerCase().includes(searchLower) ||
        book.grade.toLowerCase().includes(searchLower)
      )
    } else if (type === 'teachers') {
      const teacher = item as Teacher
      return (
        teacher.name.toLowerCase().includes(searchLower) ||
        teacher.subject.toLowerCase().includes(searchLower)
      )
    } else {
      const speech = item as Speech
      return (
        speech.title.toLowerCase().includes(searchLower) ||
        speech.content.toLowerCase().includes(searchLower) ||
        speech.scheduledDate.includes(searchTerm)
      )
    }
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue: any, bValue: any

    if (type === 'books') {
      const bookA = a as Book, bookB = b as Book
      switch (sortBy) {
        case 'title':
          aValue = bookA.title
          bValue = bookB.title
          break
        case 'subject':
          aValue = bookA.subjectName
          bValue = bookB.subjectName
          break
        case 'teacher':
          aValue = bookA.teacherName
          bValue = bookB.teacherName
          break
        case 'grade':
          aValue = bookA.grade
          bValue = bookB.grade
          break
        case 'clickCount':
          aValue = bookA.clickCount
          bValue = bookB.clickCount
          break
        default:
          aValue = bookA.dateAdded
          bValue = bookB.dateAdded
      }
    } else if (type === 'teachers') {
      const teacherA = a as Teacher, teacherB = b as Teacher
      switch (sortBy) {
        case 'name':
          aValue = teacherA.name
          bValue = teacherB.name
          break
        case 'subject':
          aValue = teacherA.subject
          bValue = teacherB.subject
          break
        default:
          aValue = teacherA.dateAdded
          bValue = teacherB.dateAdded
      }
    } else {
      const speechA = a as Speech, speechB = b as Speech
      switch (sortBy) {
        case 'title':
          aValue = speechA.title
          bValue = speechB.title
          break
        case 'scheduledDate':
          aValue = speechA.scheduledDate
          bValue = speechB.scheduledDate
          break
        case 'status':
          aValue = speechA.status
          bValue = speechB.status
          break
        default:
          aValue = speechA.createdAt
          bValue = speechB.createdAt
      }
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue)
      return sortOrder === 'asc' ? comparison : -comparison
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const exportToJson = () => {
    const dataStr = JSON.stringify(sortedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${type}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 text-right">{title}</h2>
          <button
            onClick={exportToJson}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>ناردنی JSON</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="گەڕان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            >
              <option value="dateAdded">بەروار</option>
              {type === 'books' ? (
                <>
                  <option value="title">ناونیشان</option>
                  <option value="subject">بابەت</option>
                  <option value="teacher">مامۆستا</option>
                  <option value="grade">پۆل</option>
                  <option value="clickCount">بینین</option>
                </>
              ) : type === 'teachers' ? (
                <>
                  <option value="name">ناو</option>
                  <option value="subject">بابەت</option>
                </>
              ) : (
                <>
                  <option value="title">ناونیشان</option>
                  <option value="scheduledDate">بەرواری خشتەکردن</option>
                  <option value="status">دۆخ</option>
                </>
              )}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600 text-right">
          {toArabicIndic(sortedData.length)} لە کۆی {toArabicIndic(data.length)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {sortedData.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">هیچ داتایەک نەدۆزرایەوە</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'هیچ ئەنجامێک بە ئەم گەڕانە نەدۆزرایەوە' : 'هێشتا هیچ داتایەک زیاد نەکراوە'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Headers */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
              {type === 'books' ? (
                <>
                  <div className="col-span-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('title')}>
                    ناونیشان {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-2 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('subject')}>
                    بابەت {sortBy === 'subject' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-2 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('teacher')}>
                    مامۆستا {sortBy === 'teacher' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-1 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('grade')}>
                    پۆل {sortBy === 'grade' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-1 text-right">جۆر</div>
                  <div className="col-span-1 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('clickCount')}>
                    بینین {sortBy === 'clickCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-2 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('dateAdded')}>
                    بەروار {sortBy === 'dateAdded' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </>
              ) : type === 'teachers' ? (
                <>
                  <div className="col-span-4 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('name')}>
                    ناوی مامۆستا {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('subject')}>
                    بابەت {sortBy === 'subject' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-2 text-right">ژمارەی کتێب</div>
                  <div className="col-span-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('dateAdded')}>
                    بەروار {sortBy === 'dateAdded' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-4 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('title')}>
                    ناونیشان {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('scheduledDate')}>
                    بەرواری خشتەکردن {sortBy === 'scheduledDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-2 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('status')}>
                    دۆخ {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="col-span-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('dateAdded')}>
                    بەرواری دروستکردن {sortBy === 'dateAdded' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </>
              )}
            </div>

            {/* Data Rows */}
            {sortedData.map((item, index) => (
              <div key={type === 'books' ? (item as Book).id : type === 'teachers' ? (item as Teacher).id : (item as Speech).id} 
                   className="grid grid-cols-12 gap-4 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                {type === 'books' ? (
                  <>
                    {(() => {
                      const book = item as Book
                      return (
                        <>
                          <div className="col-span-3 text-right">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="font-medium text-gray-900 truncate">{book.title}</span>
                            </div>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="text-blue-600 font-medium">{book.subjectName}</span>
                          </div>
                          <div className="col-span-2 text-right">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-700 truncate">{book.teacherName}</span>
                            </div>
                          </div>
                          <div className="col-span-1 text-right">
                            <span className="bg-gray-200 px-2 py-1 rounded text-xs">{book.grade}</span>
                          </div>
                          <div className="col-span-1 text-right">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{book.bookType}</span>
                          </div>
                          <div className="col-span-1 text-right">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Eye className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 text-sm">{toArabicIndic(book.clickCount)}</span>
                            </div>
                          </div>
                          <div className="col-span-2 text-right">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 text-sm">{formatDateArabicIndic(book.dateAdded)}</span>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </>
                ) : type === 'teachers' ? (
                  <>
                    {(() => {
                      const teacher = item as Teacher
                      return (
                        <>
                          <div className="col-span-4 text-right">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <User className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="font-medium text-gray-900">{teacher.name}</span>
                            </div>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-green-600 font-medium">{teacher.subject}</span>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {toArabicIndic(0)} کتێب
                            </span>
                          </div>
                          <div className="col-span-3 text-right">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 text-sm">{formatDateArabicIndic(teacher.dateAdded)}</span>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </>
                ) : (
                  <>
                    {(() => {
                      const speech = item as Speech
                      return (
                        <>
                          <div className="col-span-4 text-right">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <MessageSquare className="w-4 h-4 text-purple-500 flex-shrink-0" />
                              <span className="font-medium text-gray-900 truncate">{speech.title}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{speech.content}</p>
                          </div>
                          <div className="col-span-3 text-right">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-purple-600 font-medium">{formatDateArabicIndic(speech.scheduledDate)}</span>
                            </div>
                          </div>
                          <div className="col-span-2 text-right">
                            <span className={`px-2 py-1 rounded text-xs ${
                              speech.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {speech.status === 'published' ? 'بڵاوکراوەتەوە' : 'خشتەکراوە'}
                            </span>
                          </div>
                          <div className="col-span-3 text-right">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 text-sm">{formatDateArabicIndic(speech.createdAt)}</span>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}