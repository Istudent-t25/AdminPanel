'use client'

import { useState } from 'react'
import LoginPage from '@/components/LoginPage'
import AdminPanel from '@/components/AdminPanel'

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'admin'>('login')

  // Simulate login - in real app this would be handled by authentication
  const handleLogin = () => {
    setCurrentPage('admin')
  }

  const handleLogout = () => {
    setCurrentPage('login')
  }

  if (currentPage === 'admin') {
    return <AdminPanel onLogout={handleLogout} />
  }

  return <LoginPage onLogin={handleLogin} />
}