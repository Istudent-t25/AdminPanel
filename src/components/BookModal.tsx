'use client'

import { useState, useEffect } from 'react'
import { X, BookOpen, User, GraduationCap, FileText, Link, Image as ImageIcon } from 'lucide-react'
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
    bookType: 'نەزانراو',
    section: 'نەزانراو'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        url: book.url === 'نەزانراو' ? '' : book.url,
        image: book.image === 'نەزانراو' ? '' : book.image,
        subjectName: book.subjectName === 'نەزانراو' ? 'نەزانراو' : book.subjectName,
        teacherName: book.teacherName === 'نەزانراو' ? 'م. ' : book.teacherName,
        grade: book.grade === 'نەزانراو' ? 'نەزانراو' : book.grade,
        bookType: book.bookType === 'نەزانراو' ? 'نەزانراو' : book.bookType,
        section: (book as any).section || 'نەزانراو'
      })
    } else {
      setFormData({
        title: '',
        url: '',
        image: '',
        subjectName: 'نەزانراو',
        teacherName: 'م. ',
        grade: 'نەزانراو',
        bookType: 'نەزانراو',
        section: 'نەزانراو'
      })
    }
  }, [book])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    let processedValue = value
    
    // Special handling for teacher name to ensure "م. " prefix
    if (name === 'teacherName') {
      // Clear the dropdown selection when manually typing
      if (value !== formData.teacherName) {
        // Reset any selected teacher from dropdown
      }
      
      if (!value.startsWith('م. ')) {
        if (value.length === 0) {
          processedValue = 'م. '
        } else if (value.length < 3) {
          processedValue = 'م. '
        } else {
          // If user types without prefix, add it
          processedValue = 'م. ' + value.replace(/^م\.\s*/, '')
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
      // Reset section when grade changes to below grade 10
      ...(name === 'grade' && !['پۆلی دە', 'پۆلی یازدە', 'پۆلی دوازدە'].includes(value) ? { section: 'نەزانراو' } : {})
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Check if section field should be shown
  const shouldShowSection = ['پۆلی دە', 'پۆلی یازدە', 'پۆلی دوازدە'].includes(formData.grade)

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'ناونیشانی کتێب پێویستە'
    }
    if (formData.subjectName === 'نەزانراو') {
      newErrors.subjectName = 'بابەت هەڵبژاردن پێویستە'
    }
    if (formData.teacherName === 'م. ') {
      newErrors.teacherName = 'مامۆستا هەڵبژاردن پێویستە'
    }
    if (formData.grade === 'نەزانراو') {
      newErrors.grade = 'پۆل هەڵبژاردن پێویستە'
    }
    if (shouldShowSection && formData.section === 'نەزانراو') {
      newErrors.section = 'بەش هەڵبژاردن پێویستە'
    }
    if (formData.bookType === 'نەزانراو') {
      newErrors.bookType = 'جۆری کتێب هەڵبژاردن پێویستە'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (formData.url.trim() && !isValidUrl(formData.url)) {
      newErrors.url = 'بەستەرەکە دروست نییە'
    }
    if (formData.image.trim() && !isValidUrl(formData.image)) {
      newErrors.image = 'بەستەری وێنەکە دروست نییە'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      const urlToTest = string.startsWith('http://') || string.startsWith('https://') 
        ? string 
        : `https://${string}`
      new URL(urlToTest)
      return true
    } catch (_) {
      const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
      return domainPattern.test(string.replace(/^(https?:\/\/)?(www\.)?/, ''))
    }
  }

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === 1) {
      handleNext()
      return
    }

    if (validateStep2()) {
      const bookData = {
        title: formData.title.trim(),
        url: formData.url.trim() || 'نەزانراو',
        image: formData.image.trim() || 'نەزانراو',
        subjectName: formData.subjectName,
        teacherName: formData.teacherName,
        grade: formData.grade,
        bookType: formData.bookType,
        ...(shouldShowSection ? { section: formData.section } : {})
      }
      
      onSave(bookData as any)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] lg:max-w-4xl h-full max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-white text-right">
              {book ? 'دەستکاری زانیاریەکانی کتێب' : 'زیادکردنی کتێبی نوێ'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors text-white flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 hidden sm:block">
            {book ? 'گۆڕانکاری لە زانیاریەکانی کتێبەکە بکە' : 'زانیاریەکانی کتێبەکە بە وردی پڕ بکەرەوە'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 space-x-reverse">
            <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-medium text-xs sm:text-sm ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                ١
              </div>
              <span className={`text-xs sm:text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'} hidden sm:inline`}>
                زانیاریە سەرەکیەکان
              </span>
              <span className={`text-xs font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'} sm:hidden`}>
                سەرەکی
              </span>
            </div>
            <div className={`w-8 sm:w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-medium text-xs sm:text-sm ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                ٢
              </div>
              <span className={`text-xs sm:text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'} hidden sm:inline`}>
                زانیاریە زێدەکان
              </span>
              <span className={`text-xs font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'} sm:hidden`}>
                زێدە
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {currentStep === 1 ? (
              /* Step 1: Main Information */
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right flex items-center">
                    <BookOpen className="w-5 h-5 ml-3 text-blue-600" />
                    زانیاریە سەرەکیەکان
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="lg:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        ناونیشانی کتێب *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="ناونیشانی کتێبەکە بە وردی بنووسە..."
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600 text-right">{errors.title}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        بابەت *
                      </label>
                      <select
                        id="subjectName"
                        name="subjectName"
                        value={formData.subjectName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right ${
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
                        مامۆستا *
                      </label>
                      <div className="space-y-2">
                        <select
                          id="teacherSelect"
                          name="teacherSelect"
                          value={teachers.find(t => t.name === formData.teacherName)?.id || ''}
                          onChange={(e) => {
                            const selectedTeacher = teachers.find(t => t.id === e.target.value)
                            if (selectedTeacher) {
                              setFormData(prev => ({ ...prev, teacherName: selectedTeacher.name }))
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right"
                        >
                          <option value="">مامۆستایەک هەڵبژێرە</option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </option>
                          ))}
                        </select>
                        
                        <div className="relative">
                          <span className="text-sm text-gray-500 text-right block mb-1">یان ناوی نوێ بنووسە:</span>
                          <input
                            type="text"
                            id="teacherName"
                            name="teacherName"
                            value={formData.teacherName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right ${
                              errors.teacherName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="م. ناوی مامۆستا بنووسە..."
                            dir="rtl"
                          />
                        </div>
                      </div>
                      {errors.teacherName && (
                        <p className="mt-1 text-sm text-red-600 text-right">{errors.teacherName}</p>
                      )}
                    </div>

                    {/* Grade */}
                    <div>
                      <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        پۆل *
                      </label>
                      <select
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right ${
                          errors.grade ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="نەزانراو">پۆلێک هەڵبژێرە</option>
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

                    {/* Section - Only for grades 10 and above */}
                    {shouldShowSection && (
                      <div>
                        <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                          بەش *
                        </label>
                        <select
                          id="section"
                          name="section"
                          value={formData.section}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right ${
                            errors.section ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="نەزانراو">بەشێک هەڵبژێرە</option>
                          <option value="ئەدەبی">ئەدەبی</option>
                          <option value="زانستی">زانستی</option>
                        </select>
                        {errors.section && (
                          <p className="mt-1 text-sm text-red-600 text-right">{errors.section}</p>
                        )}
                      </div>
                    )}

                    {/* Book Type */}
                    <div>
                      <label htmlFor="bookType" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        جۆری کتێب *
                      </label>
                      <select
                        id="bookType"
                        name="bookType"
                        value={formData.bookType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right ${
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
                  </div>
                </div>
              </div>
            ) : (
              /* Step 2: Additional Information */
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right flex items-center">
                    <Link className="w-5 h-5 ml-3 text-green-600" />
                    زانیاریە زێدەکان
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.url ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://example.com/book.pdf"
                        dir="ltr"
                      />
                      {errors.url && (
                        <p className="mt-1 text-sm text-red-600 text-right">{errors.url}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 text-right">بەستەری PDF یان وێبسایتی کتێبەکە</p>
                    </div>

                    {/* Image */}
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        بەستەری وێنەی کتێب
                      </label>
                      <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.image ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://example.com/cover.jpg"
                        dir="ltr"
                      />
                      {errors.image && (
                        <p className="mt-1 text-sm text-red-600 text-right">{errors.image}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 text-right">وێنەی بەرگی کتێبەکە</p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-700 mb-3 text-right">پێشبینینی وێنە:</p>
                      <div className="w-32 h-40 border border-gray-300 rounded-lg overflow-hidden bg-gray-100 mx-auto">
                        <img
                          src={formData.image}
                          alt="پێشبینینی وێنە"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <div className="hidden w-full h-full flex items-center justify-center text-gray-500 text-xs">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  گەڕانەوە
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                پاشگەزبوونەوە
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              {currentStep === 1 ? 'بەردەوامبوون' : (book ? 'نوێکردنەوە' : 'زیادکردن')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}