'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, User, BookOpen, Filter } from 'lucide-react'
import { Teacher, TeacherFormData } from '@/types/teacher'
import { Subject, Book } from '@/types/book'
import { dataManager } from '@/lib/dataManager'
import TeacherModal from './TeacherModal'
import { toArabicIndic, formatDateArabicIndic } from '@/lib/numberUtils'

export default function TeachersSection() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)

  const loadData = () => {
    try {
      setTeachers(dataManager.getTeachers())
      setSubjects(dataManager.getSubjects())
      setBooks(dataManager.getBooks())
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
      setTeachers(dataManager.getTeachers())
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

  const handleAddTeacher = (teacherData: TeacherFormData) => {
    try {
      dataManager.addTeacher(teacherData)
    } catch (error) {
      console.error('Error adding teacher:', error)
      alert('هەڵەیەک ڕوویدا لە زیادکردنی مامۆستاکە')
    }
  }

  const handleEditTeacher = (id: string, teacherData: TeacherFormData) => {
    try {
      dataManager.updateTeacher(id, teacherData)
    } catch (error) {
      console.error('Error updating teacher:', error)
      alert('هەڵەیەک ڕوویدا لە نوێکردنەوەی مامۆستاکە')
    }
  }

  const handleDeleteTeacher = (id: string) => {
    if (confirm('ئایا دڵنیایت لە سڕینەوەی ئەم مامۆستایە؟')) {
      try {
        dataManager.deleteTeacher(id)
      } catch (error) {
        console.error('Error deleting teacher:', error)
        alert(error.message || 'هەڵەیەک ڕوویدا لە سڕینەوەی مامۆستاکە')
      }
    }
  }

  const handleSave = (teacherData: TeacherFormData) => {
    if (isAddMode) {
      handleAddTeacher(teacherData)
    } else if (selectedTeacher) {
      handleEditTeacher(selectedTeacher.id, teacherData)
    }
  }

  const openAddModal = () => {
    setSelectedTeacher(null)
    setIsAddMode(true)
    setIsModalOpen(true)
  }

  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setIsAddMode(false)
    setIsModalOpen(true)
  }

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSubject = !selectedSubject || teacher.subjectId === selectedSubject
    
    return matchesSearch && matchesSubject
  })

  // Get teacher's books
  const getTeacherBooks = (teacherName: string) => {
    return books.filter(book => book.teacherName === teacherName)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 text-right">بەڕێوەبردنی مامۆستاکان</h2>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>زیادکردنی مامۆستا</span>
        </button>
      </div>

      {/* Simple Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="گەڕان بۆ مامۆستا..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              dir="rtl"
            />
          </div>

          {/* Subject Filter */}
          <div className="w-full sm:w-40">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              dir="rtl"
            >
              <option value="">هەموو بابەتەکان</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedSubject) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedSubject('')
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              پاککردنەوە
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600 text-right">
          {toArabicIndic(filteredTeachers.length)} مامۆستا لە کۆی {toArabicIndic(teachers.length)} مامۆستا
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">هیچ مامۆستایەک نەدۆزرایەوە</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm || selectedSubject ? 'فلتەرەکانت بگۆڕە یان مامۆستای نوێ زیاد بکە' : 'یەکەم مامۆستات زیاد بکە'}
            </p>
            {!searchTerm && !selectedSubject && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                یەکەم مامۆستا زیاد بکە
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTeachers.map((teacher) => {
              const teacherBooks = getTeacherBooks(teacher.name)
              return (
                <div key={teacher.id} className="bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    {/* Teacher Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>

                    {/* Main Teacher Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 text-right">
                          {/* Teacher Name */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1.3' }}>
                            {teacher.name}
                          </h3>
                          
                          {/* Subject and Status Row */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              <BookOpen className="w-3 h-3 ml-1" />
                              {teacher.subject}
                            </span>
                            {teacherBooks.length > 0 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                                چالاک
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                <div className="w-2 h-2 bg-gray-400 rounded-full ml-1"></div>
                                نەچالاک
                              </span>
                            )}
                          </div>

                          {/* Statistics Row */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <BookOpen className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-gray-900">
                                {toArabicIndic(teacherBooks.length)}
                              </span>
                              <span>کتێب</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <div className="w-4 h-4 flex items-center justify-center">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              </div>
                              <span className="text-xs">
                                {formatDateArabicIndic(teacher.dateAdded)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2 flex-shrink-0">
                          <button
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="flex items-center space-x-1 space-x-reverse px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-all duration-200 font-medium"
                            title="سڕینەوەی مامۆستا"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>سڕینەوە</span>
                          </button>
                          <button
                            onClick={() => openEditModal(teacher)}
                            className="flex items-center space-x-1 space-x-reverse px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200 font-medium"
                            title="دەستکاری مامۆستا"
                          >
                            <Edit className="w-4 h-4" />
                            <span>دەستکاری</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Books Preview (if any) */}
                  {teacherBooks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          کتێبەکانی مامۆستا:
                        </div>
                        <div className="flex items-center gap-2">
                          {teacherBooks.slice(0, 3).map((book, index) => (
                            <span key={book.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                              {book.title.length > 15 ? book.title.substring(0, 15) + '...' : book.title}
                            </span>
                          ))}
                          {teacherBooks.length > 3 && (
                            <span className="text-xs text-blue-600 font-medium">
                              +{toArabicIndic(teacherBooks.length - 3)} زیاتر
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <TeacherModal
          teacher={selectedTeacher}
          subjects={subjects}
          books={books.map(book => ({ id: book.id, title: book.title }))}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}