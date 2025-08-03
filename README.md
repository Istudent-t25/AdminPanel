# iStudent Admin Dashboard

 Admin panel for managing student data, courses, and educational content.

## Overview

This admin dashboard provides a complete interface for educational administrators to manage students, courses, instructors, and track learning analytics.

## Key Features

### 📊 Dashboard Analytics
- **Active Students Counter**
- **Student Statistics**
- **Completion Rates**
- **Activity Monitoring**

### 🎛️ Admin Panel Features
- **Multi-section Navigation**: 
  - Home Dashboard (سەرەتا)
  - Books Management (کتێبەکان)
  - Teachers Management (مامۆستاکان و وانەکان)
  - Video Content (ڤیدیۆکان)
  - Assignments (ئەسیلەکان)
  - Analytics (شیکاری)
  - Schedule (خشتەی کات)
  - Settings (ڕێکخستنەکان)

- **User Interface**:
  - Responsive sidebar navigation
  - Search functionality
  - Notification system
  - Profile management dropdown
  - Quick action buttons

### 📚 Books & Teachers Management
- **Books Section**: Grid/List views, filtering, search, real-time updates
- **Teachers Section**: Professional card layout, subject assignment
- **Real-time Synchronization**: Books and teachers data sync automatically
- **Teacher Naming Convention**: Automatic "م." prefix for all teachers

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon system

### UI/UX Design
- **Glass Morphism**
- **Gradient Backgrounds**
- **Responsive Grid**
- **Smooth Animations**

## Project Structure

```
src/
├── app/
│   ├── api/auth/           # Authentication endpoints
│   │   ├── login/          # Login API route
│   │   └── forgot-password/ # Password reset API
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main application entry point
├── components/
│   ├── AdminPanel.tsx      # Main dashboard component
│   ├── BooksSection.tsx    # Books management interface
│   ├── TeachersSection.tsx # Teachers management interface
│   └── LoginPage.tsx       # Authentication interface
└── lib/
    └── auth.ts             # Authentication utilities
```

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
```bash
npm install
npm run dev
```

## Usage Guide

### For Administrators
1. **Login**
2. **Navigation**
3. **Student Monitoring**
4. **Data Management**

### For Connecting backend
1. **Adding New Sections**: Extend the `sidebarItems` array in `AdminPanel.tsx`
2. **Customizing Metrics**: Modify `statsCards` array for different statistics
3. **Styling Changes**: Update Tailwind classes or CSS variables in `globals.css`
4. **API Integration**: Implement actual data fetching in component lifecycle methods