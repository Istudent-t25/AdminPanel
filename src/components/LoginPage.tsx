'use client'

import { useState } from 'react'

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Non-functional login - directly go to dashboard
    onLogin()
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    // Forgot password - directly go to dashboard
    onLogin()
  }

  const handleCreateAccount = (e: React.MouseEvent) => {
    e.preventDefault()
    // Create account - directly go to dashboard
    onLogin()
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-form-inner">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="login-form-group floating-label-group">
              <input 
                type="text" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required 
                placeholder=""
              />
              <label htmlFor="email">Email or Username</label>
            </div>
            
            <div className="login-form-group floating-label-group">
              <input 
                autoComplete="off" 
                type="password" 
                id="pwd" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required 
                placeholder=""
              />
              <label htmlFor="pwd">Password</label>
            </div>
            
            <div className="login-form-group single-row center-forgot">
              <a href="#" className="link forgot-link" onClick={handleForgotPassword}>
                Forgot Password ?
              </a>
            </div>
            
            <button type="submit" className="rounded-button login-cta">
              Login
            </button>
          </form>
          
          <div className="register-div">
            Not registered yet? {' '}
            <a href="#" className="link create-account" onClick={handleCreateAccount}>
              Create an account ?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}