'use client'

import { useState } from 'react'
import { X, Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react'
import { Book, Teacher } from '@/types/book'

interface JsonImportModalProps {
  type: 'books' | 'teachers' | 'speeches'
  onImport: (data: any[]) => void
  onClose: () => void
}

export default function JsonImportModal({ type, onImport, onClose }: JsonImportModalProps) {
  const [jsonText, setJsonText] = useState('')
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    errors: string[]
    data?: any[]
  } | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const bookExample = {
    title: "کتێبی بیرکاری",
    url: "https://example.com/math-book.pdf",
    image: "https://example.com/math-cover.jpg",
    subjectName: "بیرکاری",
    teacherName: "م. ئەحمەد محەمەد",
    grade: "پۆلی نۆ",
    bookType: "کتێب"
  }

  const teacherExample = {
    name: "م. فاتیمە ئەحمەد",
    subjectId: "1"
  }

  const speechExample = {
    title: "وتەی بەیانی",
    content: "ئەمڕۆ ڕۆژێکی نوێیە بۆ فێربوون و پێشکەوتن...",
    scheduledDate: "2024-01-15",
    status: "scheduled"
  }

  const validateJson = () => {
    try {
      const parsed = JSON.parse(jsonText)
      const errors: string[] = []
      
      if (!Array.isArray(parsed)) {
        errors.push('داتاکە دەبێت لە شێوەی لیستێک (Array) بێت')
        setValidationResult({ isValid: false, errors })
        return
      }

      if (parsed.length === 0) {
        errors.push('لیستەکە بەتاڵە')
        setValidationResult({ isValid: false, errors })
        return
      }

      // Validate each item based on type
      parsed.forEach((item, index) => {
        if (type === 'books') {
          validateBookItem(item, index, errors)
        } else if (type === 'teachers') {
          validateTeacherItem(item, index, errors)
        } else if (type === 'speeches') {
          validateSpeechItem(item, index, errors)
        }
      })

      setValidationResult({
        isValid: errors.length === 0,
        errors,
        data: parsed
      })
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: ['JSON فۆرماتەکە هەڵەیە']
      })
    }
  }

  const validateBookItem = (item: any, index: number, errors: string[]) => {
    const requiredFields = ['title', 'subjectName', 'teacherName', 'grade', 'bookType']
    
    requiredFields.forEach(field => {
      if (!item[field] || item[field].trim() === '') {
        errors.push(`ئایتمی ${index + 1}: خانەی "${field}" پێویستە`)
      }
    })

    // Validate grade values
    const validGrades = ['پۆلی حەوت', 'پۆلی هەشت', 'پۆلی نۆ', 'پۆلی دە', 'پۆلی یازدە', 'پۆلی دوازدە']
    if (item.grade && !validGrades.includes(item.grade)) {
      errors.push(`ئایتمی ${index + 1}: نرخی پۆل ("${item.grade}") دروست نییە`)
    }

    // Validate book type
    const validBookTypes = ['کتێب', 'مەلزەمە']
    if (item.bookType && !validBookTypes.includes(item.bookType)) {
      errors.push(`ئایتمی ${index + 1}: جۆری کتێب ("${item.bookType}") دروست نییە`)
    }

    // Validate URLs if provided
    if (item.url && item.url !== '' && !isValidUrl(item.url)) {
      errors.push(`ئایتمی ${index + 1}: بەستەری کتێب دروست نییە`)
    }
    if (item.image && item.image !== '' && !isValidUrl(item.image)) {
      errors.push(`ئایتمی ${index + 1}: بەستەری وێنە دروست نییە`)
    }
  }

  const validateTeacherItem = (item: any, index: number, errors: string[]) => {
    if (!item.name || item.name.trim() === '') {
      errors.push(`ئایتمی ${index + 1}: ناوی مامۆستا پێویستە`)
    }
    if (!item.subjectId || item.subjectId.trim() === '') {
      errors.push(`ئایتمی ${index + 1}: ناسنامەی بابەت پێویستە`)
    }
  }

  const validateSpeechItem = (item: any, index: number, errors: string[]) => {
    if (!item.title || item.title.trim() === '') {
      errors.push(`ئایتمی ${index + 1}: ناونیشانی وتە پێویستە`)
    }
    if (!item.content || item.content.trim() === '') {
      errors.push(`ئایتمی ${index + 1}: ناوەڕۆکی وتە پێویستە`)
    }
    if (!item.scheduledDate || item.scheduledDate.trim() === '') {
      errors.push(`ئایتمی ${index + 1}: بەرواری خشتەکردن پێویستە`)
    } else {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(item.scheduledDate)) {
        errors.push(`ئایتمی ${index + 1}: فۆرماتی بەروار دەبێت YYYY-MM-DD بێت`)
      }
    }
    
    // Validate status if provided
    if (item.status && !['scheduled', 'published'].includes(item.status)) {
      errors.push(`ئایتمی ${index + 1}: دۆخ دەبێت "scheduled" یان "published" بێت`)
    }
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

  const handleImport = async () => {
    if (!validationResult?.isValid || !validationResult.data) return

    setIsImporting(true)
    try {
      await onImport(validationResult.data)
      onClose()
    } catch (error) {
      console.error('Error importing data:', error)
    } finally {
      setIsImporting(false)
    }
  }

  const downloadExample = () => {
    let example
    if (type === 'books') {
      example = [bookExample]
    } else if (type === 'teachers') {
      example = [teacherExample]
    } else {
      example = [speechExample]
    }
    
    const dataStr = JSON.stringify(example, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${type}-example.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white text-right">
              هاوردەکردنی {type === 'books' ? 'کتێبەکان' : type === 'teachers' ? 'مامۆستاکان' : 'وتە ڕۆژانەکان'} بە JSON
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-green-100 text-sm mt-1">
            داتاکانت بە فۆرماتی JSON هاورده بکە
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Example and Download */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 text-right">نموونەی فۆرمات</h3>
                <button
                  onClick={downloadExample}
                  className="flex items-center space-x-2 space-x-reverse px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>داگرتنی نموونە</span>
                </button>
              </div>
              <pre className="bg-white p-3 rounded border text-sm overflow-x-auto text-left">
{JSON.stringify(
  type === 'books' ? [bookExample] : 
  type === 'teachers' ? [teacherExample] : 
  [speechExample], 
  null, 2
)}
              </pre>
            </div>

            {/* JSON Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                JSON داتاکان
              </label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder={`JSON داتاکانت لێرە بنووسە...\n\nنموونە:\n${JSON.stringify(
                  type === 'books' ? [bookExample] : 
                  type === 'teachers' ? [teacherExample] : 
                  [speechExample], 
                  null, 2
                )}`}
                dir="ltr"
              />
            </div>

            {/* Validation Button */}
            <div className="flex justify-center">
              <button
                onClick={validateJson}
                disabled={!jsonText.trim()}
                className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>پشکنینی فۆرمات</span>
              </button>
            </div>

            {/* Validation Results */}
            {validationResult && (
              <div className={`rounded-lg p-4 ${validationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center space-x-2 space-x-reverse mb-3">
                  {validationResult.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className={`font-medium ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                    {validationResult.isValid ? 'فۆرماتەکە دروستە!' : 'هەڵەکان دۆزرانەوە'}
                  </h3>
                </div>
                
                {validationResult.isValid ? (
                  <p className="text-green-700 text-sm text-right">
                    {validationResult.data?.length} ئایتم ئامادەیە بۆ هاوردەکردن
                  </p>
                ) : (
                  <ul className="space-y-1 text-sm text-red-700 text-right">
                    {validationResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              پاشگەزبوونەوە
            </button>
            <button
              onClick={handleImport}
              disabled={!validationResult?.isValid || isImporting}
              className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>{isImporting ? 'هاوردەکردن...' : 'هاوردەکردن'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}