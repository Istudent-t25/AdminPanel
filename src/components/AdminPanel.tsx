'use client'

import { useState } from 'react'
import { 
  User, ChevronDown, Menu, X, Home, Users, BookOpen, Settings, 
  BarChart3, TrendingUp, Calendar, Bell, Search, Plus,
  GraduationCap, Award, Clock, Activity, Play, FileText
} from 'lucide-react'
import BooksSection from './BooksSection'

interface AdminPanelProps {
  onLogout: () => void
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('سەرەتا')

  const sidebarItems = [
    { icon: Home, label: 'سەرەتا' },
    { icon: BookOpen, label: 'کتێبەکان' },
    { icon: Users, label: 'مامۆستاکان و وانەکان' },
    { icon: Play, label: 'ڤیدیۆکان' },
    { icon: FileText, label: 'ئەسیلەکان' },
    { icon: BarChart3, label: 'شیکاری' },
    { icon: Calendar, label: 'خشتەی کات' },
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl" style={{minWidth: '1024px'}}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Right side - Logo and Title */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-200"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo and Title */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10">
                <img 
                  src="/logo.png" 
                  alt="iStudent Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
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
                className="w-full pr-10 pl-4 py-2 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 text-right"
              />
            </div>
          </div>

          {/* Left side - Notifications and Profile */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-3 space-x-reverse p-2 rounded-xl hover:bg-white/50 transition-all duration-200"
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
          w-72 bg-white/80 backdrop-blur-md shadow-xl border-l border-white/20
          transition-transform duration-300 ease-in-out
          lg:transition-none
        `}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-gray-900">ڕێنیشاندەر</h2>
              <button className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" onClick={() => setSidebarOpen(false)} />
              </button>
            </div>
            
            {/* Navigation Items */}
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(item.label)}
                  className={`
                    w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all duration-200
                    ${activeSection === item.label
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Add Member */}
            <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <button className="w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">زیادکردنی ئەندام</span>
              </button>
            </div>

            {/* Add Student */}
            <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
              <button className="w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">زیادکردنی قوتابی</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto min-h-screen">
          <div className="w-full h-full">
            {activeSection === 'سەرەتا' ? (
              <div className="max-w-7xl mx-auto space-y-6 p-6">
                {/* Active Students Box */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <h1 className="text-3xl font-bold mb-2">200 قوتابی چالاکن لە ئێستادا</h1>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Users className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-6">
              {statsCards.map((card, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      card.changeType === 'positive' 
                        ? 'text-green-700 bg-green-100' 
                        : 'text-red-700 bg-red-100'
                    }`}>
                      {card.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1 text-right">{card.value}</h3>
                  <p className="text-gray-600 text-sm text-right">{card.title}</p>
                </div>
              ))}
                </div>

                {/* Charts and Activity */}
                <div className="grid grid-cols-3 gap-6">
              {/* Chart Placeholder */}
              <div className="col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">پێشکەوتنی قوتابیان</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">بینینی هەموو</button>
                </div>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">چارتی پێشکەوتنی ڕێژەی قوتابیان لێرە دەردەکەوێت</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-right">چالاکی نوێ</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 space-x-reverse p-3 rounded-xl hover:bg-blue-50 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
                  بینینی هەموو چالاکیەکان
                </button>
              </div>
                </div>
              </div>
            ) : activeSection === 'کتێبەکان' ? (
              <div className="max-w-7xl mx-auto p-6">
                <BooksSection />
              </div>
            ) : (
              <div className="max-w-7xl mx-auto p-6 h-full">
                <div className="w-full h-[calc(100vh-200px)] bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeSection}</h2>
                    <p className="text-gray-600">ئەم بەشە هێشتا بەردەست نییە</p>
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