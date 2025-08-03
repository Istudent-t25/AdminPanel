'use client'

import { useState, useEffect } from 'react'
import { X, User, BookOpen } from 'lucide-react'
import { Teacher, TeacherFormData } from '@/types/teacher'
import { Subject } from '@/types/book'

interface TeacherModalProps {
  teacher?: Teacher | null
  subjects: Subject[]
  books: Array<{id: string, title: string}>
  onSave: (teacher: TeacherFormData) => void
  onClose: () => void
}

export default function TeacherModal({ teacher, subjects, books, onSave, onClose }: TeacherModalProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    subjectId: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        subjectId: teacher.subjectId
      })
    } else {
      // For new teachers, start with "م. " prefix
      setFormData({
        name: 'م. ',
        subjectId: ''
      })
    }
  }, [teacher])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Special handling for teacher name to ensure "م. " prefix
    if (name === 'name') {
      let processedValue = value
      
      // If user is typing and doesn't start with "م. ", add it
      if (processedValue && !processedValue.startsWith('م. ')) {
        // Remove any existing "م." or "م " to avoid duplicates
        processedValue = processedValue.replace(/^م\.?\s*/, '')
        processedValue = 'م. ' + processedValue
      }
      
      setFormData(prev => ({ ...prev, [name]: processedValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim() || formData.name.trim() === 'م.') {
      newErrors.name = 'ناوی مامۆستا پێویستە'
    } else if (formData.name.trim().length < 5) { // "م. " + at least 2 characters
      newErrors.name = 'ناوی مامۆستا دەبێت لانیکەم ٢ پیت بێت لە دوای م.'
    } else if (!formData.name.startsWith('م. ')) {
      newErrors.name = 'ناوی مامۆستا دەبێت بە "م. " دەست پێ بکات'
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'بابەت هەڵبژاردن پێویستە'
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  // Get books for selected subject
  const subjectBooks = books.filter(book => {
    // This would need to be implemented based on your book-subject relationship
    return true // For now, show all books
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 text-right">
            {teacher ? 'دەستکاریکردنی مامۆستا' : 'زیادکردنی مامۆستای نوێ'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Teacher Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 text-right">
              <User className="w-4 h-4 inline-block ml-2" />
              ناوی مامۆستا *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="م. ناوی مامۆستا بنووسە..."
              dir="rtl"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 text-right">{errors.name}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-2 text-right">
              <BookOpen className="w-4 h-4 inline-block ml-2" />
              بابەت *
            </label>
            <select
              id="subjectId"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                errors.subjectId ? 'border-red-500' : 'border-gray-300'
              }`}
              dir="rtl"
            >
              <option value="">بابەت هەڵبژێرە...</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subjectId && (
              <p className="mt-1 text-sm text-red-600 text-right">{errors.subjectId}</p>
            )}
          </div>


          {/* Books Information (if subject is selected) */}
          {formData.subjectId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2 text-right">
                کتێبەکانی بابەتی هەڵبژێردراو
              </h3>
              <div className="text-sm text-blue-700 text-right">
                {subjectBooks.length > 0 ? (
                  <ul className="space-y-1">
                    {subjectBooks.slice(0, 3).map(book => (
                      <li key={book.id} className="flex items-center space-x-2 space-x-reverse">
                        <BookOpen className="w-3 h-3" />
                        <span>{book.title}</span>
                      </li>
                    ))}
                    {subjectBooks.length > 3 && (
                      <li className="text-blue-600">+ {subjectBooks.length - 3} کتێبی تر</li>
                    )}
                  </ul>
                ) : (
                  <p>هیچ کتێبێک بۆ ئەم بابەتە تۆمار نەکراوە</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              {teacher ? 'نوێکردنەوە' : 'زیادکردن'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
            >
              پاشگەزبوونەوە
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}