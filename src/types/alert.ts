// Alert Management Types
export interface Alert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'staff'
  scheduledDate?: string
  expiryDate?: string
  status: 'draft' | 'scheduled' | 'active' | 'expired' | 'archived'
  createdAt: string
  updatedAt: string
  createdBy: string
  isSticky: boolean
  showOnLogin: boolean
  showOnDashboard: boolean
  category: 'general' | 'academic' | 'administrative' | 'emergency' | 'maintenance'
  attachments?: AlertAttachment[]
  readBy?: string[]
  dismissedBy?: string[]
}

export interface AlertAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface AlertFilter {
  status: string
  type: string
  priority: string
  targetAudience: string
  category: string
  dateRange: {
    start?: string
    end?: string
  }
  searchTerm: string
}

export interface AlertFormData {
  title: string
  message: string
  type: Alert['type']
  priority: Alert['priority']
  targetAudience: Alert['targetAudience']
  category: Alert['category']
  scheduledDate?: string
  expiryDate?: string
  isSticky: boolean
  showOnLogin: boolean
  showOnDashboard: boolean
  attachments?: File[]
}

export interface AlertStats {
  total: number
  active: number
  scheduled: number
  expired: number
  draft: number
  byPriority: {
    urgent: number
    high: number
    medium: number
    low: number
  }
  byType: {
    info: number
    warning: number
    error: number
    success: number
  }
}