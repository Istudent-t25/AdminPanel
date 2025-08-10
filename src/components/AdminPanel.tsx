'use client'

import { useState } from 'react'
import { 
  User, ChevronDown, Menu, X, Home, Users, BookOpen, Settings, 
  Search, Plus, GraduationCap, Award, Clock, Activity, Play, FileText,
  PenTool, AlertTriangle, MessageSquare, ClipboardCheck, TrendingUp,
  Calendar as CalendarIcon, Save, Send, Edit, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react'
import BooksSection from './BooksSection'
import AlertManagement from './AlertManagement'
import TeachersSection from './TeachersSection'
import WritingsSection from './WritingsSection'
import { toArabicIndic, formatDateArabicIndic, formatNumberArabicIndic } from '@/lib/numberUtils'

interface AdminPanelProps {
  onLogout: () => void
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('سەرەتا')
  const [writingSubSection, setWritingSubSection] = useState('ئاگاداریەکان')
  
  // Daily speeches state
  const [dailySpeeches, setDailySpeeches] = useState<Array<{
    id: string
    title: string
    content: string
    scheduledDate: string
    status: 'scheduled' | 'published'
    createdAt: string
  }>>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [editingSpeech, setEditingSpeech] = useState<{
    id?: string
    title: string
    content: string
    scheduledDate: string
  } | null>(null)

  // Helper functions for daily speeches
  const addDailySpeech = (speechData: { title: string; content: string; scheduledDate: string; status: 'scheduled' }) => {
    const newSpeech = {
      id: Date.now().toString(),
      ...speechData,
      createdAt: new Date().toISOString()
    }
    setDailySpeeches(prev => [...prev, newSpeech])
  }

  const updateDailySpeech = (id: string, speechData: { title: string; content: string; scheduledDate: string; status: 'scheduled' }) => {
    setDailySpeeches(prev => prev.map(speech => 
      speech.id === id ? { ...speech, ...speechData } : speech
    ))
  }

  const deleteDailySpeech = (id: string) => {
    setDailySpeeches(prev => prev.filter(speech => speech.id !== id))
  }

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
      updateDailySpeech(editingSpeech.id, speechData)
    } else {
      addDailySpeech(speechData)
    }
    
    setEditingSpeech(null)
  }

  const sidebarItems = [
    { icon: Home, label: 'سەرەتا' },
    { icon: BookOpen, label: 'کتێبەکان' },
    { icon: Users, label: 'مامۆستاکان و وانەکان' },
    { icon: Play, label: 'ڤیدیۆکان' },
    { icon: FileText, label: 'ئەسیلەکان' },
    { icon: PenTool, label: 'نووسینەکان' },
    { icon: ClipboardCheck, label: 'تاقیکردنەوەکان' },
    { icon: Settings, label: 'ڕێکخستنەکان' },
  ]

  const statsCards = [
    { 
      title: 'کۆی قوتابیان', 
      value: '2,847', 
      change: '+12%', 
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      title: 'ڕێژەی تەواوکردن', 
      value: '89.2%', 
      change: '+2.1%', 
      changeType: 'positive',
      icon: Award,
      color: 'bg-purple-500'
    },
  ]

  const recentActivities = [
    { user: 'سارا ', action: 'تەواوی کرد', item: 'کۆرسی بیرکاری', time: 'پێش ٢ کاتژمێر' },
    { user: 'ئەحمەد ', action: 'تۆمار بوو لە', item: 'تاقیگەی فیزیا', time: 'پێش ٤ کاتژمێر' },
    { user: 'ئێما دەیڤیس', action: 'ناردی', item: 'ئەرکی کیمیا', time: 'پێش ٦ کاتژمێر' },
    { user: 'ئالێکس ڕۆدریگێز', action: 'چووە ناو', item: 'گرووپی خوێندنی ئەلفا', time: 'پێش ٨ کاتژمێر' },
  ]

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-x-auto" dir="rtl" style={{minWidth: '320px'}}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Right side - Logo and Title */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo and Title */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-9 h-9">
                <img 
                  src="/logo.png" 
                  alt="iStudent Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  پانێڵی بەڕێوەبردن
                </h1>
                <p className="text-xs text-gray-500">داشبۆردی بەڕێوەبردن</p>
              </div>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="گەڕان بۆ قوتابی، کۆرس..."
                className="w-full pr-10 pl-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-right"
              />
            </div>
          </div>

          {/* Left side - Profile */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-3 space-x-reverse p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {/* Profile Avatar */}
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                
                {/* Profile Info */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900">بەڕێوەبەری سەرەکی</p>
                  <p className="text-xs text-gray-500">سەرپەرشتیاری گشتی</p>
                </div>
                
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100 text-right">
                      <p className="text-sm font-medium text-gray-900">بەڕێوەبەری سەرەکی</p>
                      <p className="text-xs text-gray-500">admin@istudent.com</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors text-right">
                      ڕێکخستنی پرۆفایل
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors text-right">
                      ڕێکخستنی هەژمار
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors text-right">
                      پەسەندکراوەکان
                    </a>
                    <hr className="my-1" />
                    <button 
                      onClick={onLogout}
                      className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      چوونە دەرەوە
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
          fixed inset-y-0 right-0 z-50
          w-64 bg-white shadow-lg border-l border-gray-200
          transition-transform duration-300 ease-in-out
          lg:transition-none
        `}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-gray-900">ڕێنیشاندەر</h2>
              <button className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" onClick={() => setSidebarOpen(false)} />
              </button>
            </div>
            
            {/* Navigation Items */}
            <nav className="space-y-1">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(item.label)}
                  className={`
                    w-full flex items-center space-x-3 space-x-reverse px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm
                    ${activeSection === item.label
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-3">کردارە خێراکان</p>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Plus className="w-4 h-4" />
                  <span>زیادکردنی ئەندام</span>
                </button>
                <button className="w-full flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Plus className="w-4 h-4" />
                  <span>زیادکردنی قوتابی</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto min-h-screen bg-gray-50">
          <div className="w-full h-full">
            {activeSection === 'سەرەتا' ? (
              <div className="max-w-7xl mx-auto space-y-6 p-6">
                {/* Active Students Box */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{toArabicIndic('200')} قوتابی چالاکن لە ئێستادا</h1>
                      <p className="text-sm text-gray-600">ئەمڕۆ لە سیستەمدا چالاکن</p>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
              {statsCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      card.changeType === 'positive' 
                        ? 'text-green-700 bg-green-100' 
                        : 'text-red-700 bg-red-100'
                    }`}>
                      {toArabicIndic(card.change)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1 text-right">{toArabicIndic(card.value)}</h3>
                  <p className="text-gray-600 text-sm text-right">{card.title}</p>
                </div>
              ))}
                </div>

                {/* Charts and Activity */}
                <div className="grid grid-cols-3 gap-6">
              {/* Chart Placeholder */}
              <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">پێشکەوتنی قوتابیان</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">بینینی هەموو</button>
                </div>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">چارتی پێشکەوتنی ڕێژەی قوتابیان لێرە دەردەکەوێت</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">چالاکی نوێ</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                          <span className="font-medium text-blue-600">{activity.item}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border-t border-gray-200 pt-3">
                  بینینی هەموو چالاکیەکان
                </button>
              </div>
                </div>
              </div>
            ) : activeSection === 'کتێبەکان' ? (
              <div className="h-full flex flex-col xl:flex-row">
                {/* Books Section - Main Area */}
                <div className="flex-1 xl:w-3/5 xl:min-w-0 bg-white xl:border-l border-gray-200 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-right">کتێبەکان</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                      <BooksSection compact={false} />
                    </div>
                  </div>
                </div>
                
                {/* Teachers Section - Side Panel */}
                <div className="xl:w-2/5 xl:min-w-0 xl:max-w-lg bg-gray-50 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                      <TeachersSection />
                    </div>
                  </div>
                </div>
              </div>
            ) : activeSection === 'مامۆستاکان و وانەکان' ? (
              <div className="max-w-7xl mx-auto p-6">
                <TeachersSection />
              </div>
            ) : activeSection === 'نووسینەکان' ? (
              <WritingsSection
                dailySpeeches={dailySpeeches}
                onAddSpeech={addDailySpeech}
                onUpdateSpeech={updateDailySpeech}
                onDeleteSpeech={deleteDailySpeech}
              />
            ) : activeSection === 'تاقیکردنەوەکان' ? (
              <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 text-right flex items-center">
                    <ClipboardCheck className="w-6 h-6 ml-3" />
                    تاقیکردنەوەکان
                  </h2>
                  <div className="text-center py-12">
                    <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">بەشی تاقیکردنەوەکان</h3>
                    <p className="text-sm text-gray-500">ئەم بەشە هێشتا لە ژێر گەشەپێداندایە</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto p-6 h-full">
                <div className="w-full h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">{activeSection}</h2>
                    <p className="text-sm text-gray-600">ئەم بەشە هێشتا بەردەست نییە</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
