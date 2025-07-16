'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Book, Subject, Teacher } from '@/types/book'

interface BookModalProps {
  book?: Book | null
  subjects: Subject[]
  teachers: Teacher[]
  onSave: (book: Omit<Book, 'id' | 'bookId' | 'timeClicked' | 'clickCount' | 'favoritesCount' | 'dateAdded'>) => void
  onClose: () => void
}

export default function BookModal({ book, subjects, teachers, onSave, onClose }: BookModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    image: '',
    subjectName: 'نەزانراو',
    teacherName: 'م. ',
    grade: 'نەزانراو',
    bookType: 'نەزانراو'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        url: book.url === 'نەزانراو' ? '' : book.url,
        image: book.image === 'نەزانراو' ? '' : book.image,
        subjectName: book.subjectName === 'نەزانراو' ? 'نەزانراو' : book.subjectName,
        teacherName: book.teacherName === 'نەزانراو' ? 'م. ' : book.teacherName,
        grade: book.grade === 'نەزانراو' ? 'نەزانراو' : book.grade,
        bookType: book.bookType === 'نەزانراو' ? 'نەزانراو' : book.bookType
      })
    } else {
      // Reset form for new book creation
      setFormData({
        title: '',
        url: '',
        image: '',
        subjectName: 'نەزانراو',
        teacherName: 'م. ',
        grade: 'نەزانراو',
        bookType: 'نەزانراو'
      })
    }
  }, [book])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    let processedValue = value
    
    // Special handling for teacher name to ensure "م. " prefix
    if (name === 'teacherName') {
      if (!value.startsWith('م. ')) {
        // If user deletes the prefix, restore it
        if (value.length < 3) {
          processedValue = 'م. '
        } else {
          // If user types without prefix, add it
          processedValue = 'م. ' + value.replace(/^م\.\s*/, '')
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'ناونیشانی کتێب پێویستە'
    }

    // Optional validation for URL - only validate if provided and not empty
    if (formData.url.trim() && !isValidUrl(formData.url)) {
      newErrors.url = 'بەستەرەکە دروست نییە'
    }

    // Optional validation for image - only validate if provided and not empty
    if (formData.image.trim() && !isValidUrl(formData.image)) {
      newErrors.image = 'بەستەری وێنەکە دروست نییە'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      // If string doesn't start with protocol, add https://
      const urlToTest = string.startsWith('http://') || string.startsWith('https://') 
        ? string 
        : `https://${string}`
      new URL(urlToTest)
      return true
    } catch (_) {
      // Additional check for basic domain patterns
      const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
      return domainPattern.test(string.replace(/^(https?:\/\/)?(www\.)?/, ''))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Convert empty or whitespace-only fields to "نەزانراو"
      const processedData = {
        ...formData,
        url: formData.url.trim() || 'نەزانراو',
        image: formData.image.trim() || 'نەزانراو',
        subjectName: formData.subjectName.trim() || 'نەزانراو',
        teacherName: formData.teacherName.trim() === 'م.' || formData.teacherName.trim() === 'م. ' ? 'نەزانراو' : formData.teacherName.trim(),
        grade: formData.grade.trim() || 'نەزانراو',
        bookType: formData.bookType.trim() || 'نەزانراو'
      }
      onSave(processedData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {book ? 'دەستکاریکردنی کتێب' : 'زیادکردنی کتێبی نوێ'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 text-right">
              ناونیشانی کتێب *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 text-right ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ناونیشانی کتێبەکە بنووسە"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 text-right">{errors.title}</p>
            )}
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2 text-right">
              بەستەری کتێب
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 text-right ${
                errors.url ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="بەستەری کتێبەکە بنووسە (ئیختیاری)"
              dir="ltr"
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-600 text-right">{errors.url}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2 text-right">
              بەستەری وێنە
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 text-right ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="بەستەری وێنەکە بنووسە (ئیختیاری)"
              dir="ltr"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600 text-right">{errors.image}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-2 text-right">
              بابەت
            </label>
            <select
              id="subjectName"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 text-right ${
                errors.subjectName ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="نەزانراو">بابەتێک هەڵبژێرە</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subjectName && (
              <p className="mt-1 text-sm text-red-600 text-right">{errors.subjectName}</p>
            )}
          </div>

          {/* Teacher */}
          <div>
            <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700 mb-2 text-right">
              مامۆستا
            </label>
            <input
              type="text"
              id="teacherName"
              name="teacherName"
              value={formData.teacherName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 text-right ${
                errors.teacherName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ناوی مامۆستاکە بنووسە (ئیختیاری)"
            />
            {errors.teacherName && (
              <p className="mt-1 text-sm text-red-600 text-right">{errors.teacherName}</p>
            )}
          </div>

          {/* Grade */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2 text-right">
              پۆل
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 text-right ${
                errors.grade ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="نەزانراو">پۆلێک هەڵبژێرە</option>
              <option value="پۆلی یەک">پۆلی یەک</option>
              <option value="پۆلی دوو">پۆلی دوو</option>
              <option value="پۆلی سێ">پۆلی سێ</option>
              <option value="پۆلی چوار">پۆلی چوار</option>
              <option value="پۆلی پێنج">پۆلی پێنج</option>
              <option value="پۆلی شەش">پۆلی شەش</option>
              <option value="پۆلی حەوت">پۆلی حەوت</option>
              <option value="پۆلی هەشت">پۆلی هەشت</option>
              <option value="پۆلی نۆ">پۆلی نۆ</option>
              <option value="پۆلی دە">پۆلی دە</option>
              <option value="پۆلی یازدە">پۆلی یازدە</option>
              <option value="پۆلی دوازدە">پۆلی دوازدە</option>
            </select>
            {errors.grade && (
              <p className="mt-1 text-sm text-red-600 text-right">{errors.grade}</p>
            )}
          </div>

          {/* Book Type */}
          <div>
            <label htmlFor="bookType" className="block text-sm font-medium text-gray-700 mb-2 text-right">
              جۆری کتێب
            </label>
            <select
              id="bookType"
              name="bookType"
              value={formData.bookType}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 text-right ${
                errors.bookType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="نەزانراو">جۆرێک هەڵبژێرە</option>
              <option value="کتێب">کتێب</option>
              <option value="مەلزەمە">مەلزەمە</option>
            </select>
            {errors.bookType && (
              <p className="mt-1 text-sm text-red-600 text-right">{errors.bookType}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              پاشگەزبوونەوە
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              {book ? 'نوێکردنەوە' : 'زیادکردن'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}