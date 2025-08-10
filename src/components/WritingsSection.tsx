'use client'

import { useState } from 'react'
import { AlertTriangle, MessageSquare, Upload, FileText, Plus, Search, Calendar, Edit, Trash2, Eye, Clock, X } from 'lucide-react'
import AlertManagement from './AlertManagement'
import JsonImportModal from './JsonImportModal'
import DataListView from './DataListView'
import { toArabicIndic, formatDateArabicIndic } from '@/lib/numberUtils'

interface DailySpeech {
  id: string
  title: string
  content: string
  scheduledDate: string
  status: 'scheduled' | 'published'
  createdAt: string
}

interface WritingsSectionProps {
  dailySpeeches: DailySpeech[]
  onAddSpeech: (speechData: { title: string; content: string; scheduledDate: string; status: 'scheduled' }) => void
  onUpdateSpeech: (id: string, speechData: { title: string; content: string; scheduledDate: string; status: 'scheduled' }) => void
  onDeleteSpeech: (id: string) => void
}

export default function WritingsSection({ 
  dailySpeeches, 
  onAddSpeech, 
  onUpdateSpeech, 
  onDeleteSpeech 
}: WritingsSectionProps) {
  const [writingSubSection, setWritingSubSection] = useState('ئاگاداریەکان')
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'data-list'>('calendar')
  const [isJsonImportOpen, setIsJsonImportOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [editingSpeech, setEditingSpeech] = useState<{
    id?: string
    title: string
    content: string
    scheduledDate: string
  } | null>(null)

  // Helper functions
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getMonthName = (month: number) => {
    const months = [
      'کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران',
      'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'
    ]
    return months[month]
  }

  const getSpeechForDate = (day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dailySpeeches.find(speech => speech.scheduledDate === dateStr)
  }

  const handleEditSpeech = (day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const existingSpeech = getSpeechForDate(day)
    
    setEditingSpeech({
      id: existingSpeech?.id,
      title: existingSpeech?.title || '',
      content: existingSpeech?.content || '',
      scheduledDate: dateStr
    })
  }

  const handleSaveSpeech = () => {
    if (!editingSpeech) return
    
    const speechData = {
      title: editingSpeech.title,
      content: editingSpeech.content,
      scheduledDate: editingSpeech.scheduledDate,
      status: 'scheduled' as const
    }

    if (editingSpeech.id) {
      onUpdateSpeech(editingSpeech.id, speechData)
    } else {
      onAddSpeech(speechData)
    }
    
    setEditingSpeech(null)
  }

  const handleJsonImport = (jsonData: any[]) => {
    jsonData.forEach(speechData => {
      const newSpeechData = {
        title: speechData.title,
        content: speechData.content,
        scheduledDate: speechData.scheduledDate,
        status: speechData.status || 'scheduled' as const
      }

      onAddSpeech(newSpeechData)
    })
  }

  // Filter speeches for list view
  const filteredSpeeches = dailySpeeches.filter(speech => {
    const searchLower = searchTerm.toLowerCase()
    return (
      speech.title.toLowerCase().includes(searchLower) ||
      speech.content.toLowerCase().includes(searchLower) ||
      speech.scheduledDate.includes(searchTerm)
    )
  })

  const speechExample = {
    title: "وتەی بەیانی",
    content: "ئەمڕۆ ڕۆژێکی نوێیە بۆ فێربوون و پێشکەوتن...",
    scheduledDate: "2024-01-15",
    status: "scheduled"
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 text-right">نووسینەکان</h2>
          {writingSubSection === 'وتەی ڕۆژانە' && (
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                onClick={() => setIsJsonImportOpen(true)}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>هاوردەی JSON</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Sub-tabs */}
        <div className="flex space-x-2 space-x-reverse mb-4 border-b border-gray-200">
          <button
            onClick={() => setWritingSubSection('ئاگاداریەکان')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
              writingSubSection === 'ئاگاداریەکان'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 inline-block ml-2" />
            ئاگاداریەکان
          </button>
          <button
            onClick={() => setWritingSubSection('وتەی ڕۆژانە')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
              writingSubSection === 'وتەی ڕۆژانە'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline-block ml-2" />
            وتەی ڕۆژانە
          </button>
        </div>

        {/* Content based on selected sub-tab */}
        {writingSubSection === 'ئاگاداریەکان' ? (
          <AlertManagement />
        ) : (
          <div className="space-y-6">
            {/* View Mode Toggle for Daily Speeches */}
            <div className="flex items-center justify-between">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 ${viewMode === 'calendar' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="بینینی ڕۆژمێر"
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="بینینی لیست"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('data-list')}
                  className={`p-2 ${viewMode === 'data-list' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="بینینی داتا"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>

              {viewMode === 'list' && (
                <div className="flex-1 max-w-md mx-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="گەڕان لە وتەکان..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                    />
                  </div>
                </div>
              )}
            </div>

            {viewMode === 'data-list' ? (
              <DataListView 
                data={filteredSpeeches} 
                type="speeches" 
                title="لیستی وتە ڕۆژانەکان"
              />
            ) : viewMode === 'list' ? (
              <div className="bg-white border border-gray-200 rounded-lg">
                {filteredSpeeches.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">هیچ وتەیەک نەدۆزرایەوە</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchTerm ? 'هیچ وتەیەک بە ئەم گەڕانە نەدۆزرایەوە' : 'هێشتا هیچ وتەیەک زیاد نەکراوە'}
                    </p>
                    {!searchTerm && (
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <button
                          onClick={() => setViewMode('calendar')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          بچۆ بۆ ڕۆژمێر
                        </button>
                        <button
                          onClick={() => setIsJsonImportOpen(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          یان بە JSON هاورده بکە
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredSpeeches.map((speech) => (
                      <div key={speech.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 text-right">
                            <h3 className="font-medium text-gray-900 mb-1">{speech.title}</h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{speech.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDateArabicIndic(speech.scheduledDate)}</span>
                              </div>
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Clock className="w-3 h-3" />
                                <span>{formatDateArabicIndic(speech.createdAt)}</span>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                speech.status === 'published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {speech.status === 'published' ? 'بڵاوکراوەتەوە' : 'خشتەکراوە'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse ml-4">
                            <button
                              onClick={() => {
                                const day = parseInt(speech.scheduledDate.split('-')[2])
                                handleEditSpeech(day)
                              }}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="دەستکاری"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('ئایا دڵنیایت لە سڕینەوەی ئەم وتەیە؟')) {
                                  onDeleteSpeech(speech.id)
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="سڕینەوە"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Calendar View */
              <>
                {/* Month Navigation */}
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <button
                      onClick={() => {
                        if (selectedMonth === 0) {
                          setSelectedMonth(11)
                          setSelectedYear(selectedYear - 1)
                        } else {
                          setSelectedMonth(selectedMonth - 1)
                        }
                      }}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Calendar className="w-5 h-5 text-green-700" />
                    </button>
                    <h3 className="text-lg font-semibold text-green-800">
                      {getMonthName(selectedMonth)} {toArabicIndic(selectedYear)}
                    </h3>
                    <button
                      onClick={() => {
                        if (selectedMonth === 11) {
                          setSelectedMonth(0)
                          setSelectedYear(selectedYear + 1)
                        } else {
                          setSelectedMonth(selectedMonth + 1)
                        }
                      }}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Calendar className="w-5 h-5 text-green-700" />
                    </button>
                  </div>
                  <div className="text-sm text-green-700">
                    بەڕێوەبردنی وتەکانی مانگ
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['شەممە', 'یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => {
                      const day = i + 1
                      const speech = getSpeechForDate(day)
                      const today = new Date()
                      const isToday = today.getDate() === day && 
                                    today.getMonth() === selectedMonth && 
                                    today.getFullYear() === selectedYear
                      
                      return (
                        <button
                          key={day}
                          onClick={() => handleEditSpeech(day)}
                          className={`
                            aspect-square p-2 rounded-lg border-2 transition-all duration-200 relative
                            ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-green-300'}
                            ${speech ? 'bg-green-100 border-green-300' : 'hover:bg-gray-50'}
                          `}
                        >
                          <div className="text-sm font-medium text-gray-900">{toArabicIndic(day)}</div>
                          {speech && (
                            <div className={`
                              absolute bottom-1 right-1 w-2 h-2 rounded-full
                              ${speech.status === 'published' ? 'bg-green-500' : 'bg-blue-500'}
                            `} />
                          )}
                          {isToday && (
                            <div className="absolute top-1 left-1 w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center space-x-6 space-x-reverse mt-4 pt-4 border-t border-gray-200 text-xs">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>بڵاوکراوەتەوە</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>خشتەکراوە</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Speech Editor Modal */}
            {editingSpeech && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        وتەی ڕۆژی {editingSpeech.scheduledDate}
                      </h3>
                      <button
                        onClick={() => setEditingSpeech(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        ناونیشانی وتە
                      </label>
                      <input
                        type="text"
                        value={editingSpeech.title}
                        onChange={(e) => setEditingSpeech({...editingSpeech, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                        placeholder="ناونیشانی وتەی ڕۆژانە بنووسە..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        ناوەڕۆکی وتە
                      </label>
                      <textarea
                        rows={8}
                        value={editingSpeech.content}
                        onChange={(e) => setEditingSpeech({...editingSpeech, content: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                        placeholder="وتەی ڕۆژانەت بنووسە..."
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <button
                          onClick={handleSaveSpeech}
                          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>پاشەکەوت و خشتەکردن</span>
                        </button>
                      </div>
                      
                      {editingSpeech.id && (
                        <button
                          onClick={() => {
                            if (confirm('ئایا دڵنیایت لە سڕینەوەی ئەم وتەیە؟')) {
                              onDeleteSpeech(editingSpeech.id!)
                              setEditingSpeech(null)
                            }
                          }}
                          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>سڕینەوە</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* JSON Import Modal */}
        {isJsonImportOpen && (
          <JsonImportModal
            type="speeches"
            onImport={handleJsonImport}
            onClose={() => setIsJsonImportOpen(false)}
          />
        )}
      </div>
    </div>
  )
}