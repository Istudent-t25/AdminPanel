'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Calendar, 
  Users,
  Bell,
  Plus,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  List,
  Grid,
  Loader2,
  SortAsc,
  SortDesc,
  MoreVertical,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { Alert, AlertFilter, AlertFormData, AlertStats, AlertAttachment } from '@/types/alert'
import { toArabicIndic, formatDateArabicIndic } from '@/lib/numberUtils'

// Kurdish Sorani translations
const translations = {
  alertManagement: 'بەڕێوەبردنی ئاگادارکردنەوەکان',
  currentAlert: 'ئاگادارکردنەوەی ئێستا',
  noAlert: 'هیچ ئاگادارکردنەوەیەک نییە',
  editAlert: 'دەستکاریکردنی ئاگادارکردنەوە',
  alertMessage: 'پەیامی ئاگادارکردنەوە',
  alertType: 'جۆری ئاگادارکردنەوە',
  save: 'پاشەکەوتکردن',
  cancel: 'پاشگەزبوونەوە',
  edit: 'دەستکاری',
  
  // Alert types
  info: 'زانیاری',
  warning: 'ئاگادارکردنەوە',
  error: 'هەڵە',
  success: 'سەرکەوتوو',
  delete: 'سڕینەوە',
  filter: 'پاڵاوتن',
  search: 'گەڕان',
  reset: 'ڕێکخستنەوە',
  
  // Form fields
  title: 'ناونیشان',
  message: 'پەیام',
  type: 'جۆر',
  priority: 'گرنگی',
  targetAudience: 'ئامانجکراوان',
  category: 'پۆل',
  scheduledDate: 'بەرواری دیاریکراو',
  expiryDate: 'بەرواری بەسەرچوون',
  
  // Table headers
  status: 'دۆخ',
  createdDate: 'بەرواری دروستکردن',
  actions: 'کردارەکان',
  
  // Messages
  searchPlaceholder: 'گەڕان لە ئاگادارکردنەوەکان...',
  deleteConfirmTitle: 'دڵنیابوونەوەی سڕینەوە',
  deleteConfirmMessage: 'دڵنیایت لە سڕینەوەی ئەم ئاگادارکردنەوەیە؟ ناتوانیت ئەم کردارە بگەڕێنیتەوە.',
  alertCreatedSuccess: 'ئاگادارکردنەوەکە بە سەرکەوتوویی دروستکرا.',
  alertUpdatedSuccess: 'ئاگادارکردنەوەکە بە سەرکەوتوویی نوێکرایەوە.',
  alertDeletedSuccess: 'ئاگادارکردنەوەکە بە سەرکەوتوویی سڕایەوە.',
  saveError: 'هەڵەیەک ڕوویدا لە پاشەکەوتکردنی ئاگادارکردنەوەکە.',
  
  // Additional translations
  createAlert: 'دروستکردنی ئاگادارکردنەوە',
  alerts: 'ئاگادارکردنەوە',
  
  // Audience types
  allUsers: 'هەموو بەکارهێنەران',
  students: 'قوتابیان',
  teachers: 'مامۆستایان',
  parents: 'دایک و باوکان',
  staff: 'ستاف',
  allAudiences: 'هەموو ئامانجکراوان'
}

interface AlertManagementProps {
  onAlertUpdate?: (alerts: Alert[]) => void
  initialAlerts?: Alert[]
  permissions?: {
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canPublish: boolean
  }
}

export default function AlertManagement({ 
  onAlertUpdate,
  initialAlerts = [],
  permissions = {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canPublish: true
  }
}: AlertManagementProps) {
  // State management
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null)
  const [deletingAlertId, setDeletingAlertId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Filter state
  const [filters, setFilters] = useState<AlertFilter>({
    status: '', type: '', priority: '', searchTerm: '', category: '', targetAudience: '', dateRange: { start: '', end: '' }
  })
  
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<keyof Alert>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Form state
  const [formData, setFormData] = useState<AlertFormData>({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    targetAudience: 'all',
    category: 'general',
    isSticky: false,
    showOnLogin: false,
    showOnDashboard: true
  })

  // Mock data loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockAlerts: Alert[] = [
        { 
          id: '1', 
          title: 'نوێکردنەوەی سیستەم', 
          message: 'سیستەمەکە لە ڕۆژی هەینی کاتژمێر ٥ی ئێوارە نوێ دەکرێتەوە.', 
          type: 'info', 
          priority: 'medium', 
          status: 'active', 
          createdAt: '2024-07-20T10:00:00Z', 
          updatedAt: '2024-07-20T10:00:00Z', 
          createdBy: 'admin', 
          targetAudience: 'all', 
          category: 'maintenance', 
          isSticky: false, 
          showOnLogin: false, 
          showOnDashboard: true 
        },
        { 
          id: '2', 
          title: 'چاککردنەوەی لەناکاو', 
          message: 'چاککردنەوەی لەناکاو بۆ سێرڤەرە سەرەکییەکان ئێستا.', 
          type: 'error', 
          priority: 'urgent', 
          status: 'active', 
          createdAt: '2024-07-25T14:00:00Z', 
          updatedAt: '2024-07-25T14:00:00Z', 
          createdBy: 'admin', 
          targetAudience: 'staff', 
          category: 'maintenance', 
          isSticky: true, 
          showOnLogin: true, 
          showOnDashboard: true 
        }
      ];
      setAlerts(initialAlerts.length > 0 ? initialAlerts : mockAlerts);
      setLoading(false);
    }, 1000);
  }, [initialAlerts]);

  // Filter and sort alerts
  useEffect(() => {
    let filtered = alerts.filter(alert =>
      (alert.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
       alert.message.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (filters.status ? alert.status === filters.status : true) &&
      (filters.type ? alert.type === filters.type : true) &&
      (filters.priority ? alert.priority === filters.priority : true)
    );

    filtered.sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [alerts, filters, sortBy, sortOrder]);

  // Stats calculation
  const stats: AlertStats = useMemo(() => ({
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    scheduled: alerts.filter(a => a.status === 'scheduled').length,
    expired: alerts.filter(a => a.status === 'expired').length,
    draft: alerts.filter(a => a.status === 'draft').length,
    byPriority: { 
      urgent: alerts.filter(a => a.priority === 'urgent').length,
      high: alerts.filter(a => a.priority === 'high').length,
      medium: alerts.filter(a => a.priority === 'medium').length,
      low: alerts.filter(a => a.priority === 'low').length
    },
    byType: { 
      info: alerts.filter(a => a.type === 'info').length,
      warning: alerts.filter(a => a.type === 'warning').length,
      error: alerts.filter(a => a.type === 'error').length,
      success: alerts.filter(a => a.type === 'success').length
    }
  }), [alerts]);

  // Pagination
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  // Event handlers
  const handleSort = (column: keyof Alert) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Helper function to convert File[] to AlertAttachment[]
  const convertFilesToAttachments = (files?: File[]): AlertAttachment[] | undefined => {
    if (!files || files.length === 0) return undefined;
    
    return files.map(file => ({
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      url: URL.createObjectURL(file), // In a real app, this would be uploaded to a server
      type: file.type,
      size: file.size
    }));
  };

  const handleSave = () => {
    try {
      if (editingAlert) {
        const updatedAlerts = alerts.map(a => 
          a.id === editingAlert.id 
            ? { 
                ...a, 
                ...formData, 
                attachments: convertFilesToAttachments(formData.attachments),
                updatedAt: new Date().toISOString() 
              }
            : a
        );
        setAlerts(updatedAlerts);
        onAlertUpdate?.(updatedAlerts);
        setSuccess(translations.alertUpdatedSuccess);
        setShowEditModal(false);
        setEditingAlert(null);
      } else {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          ...formData,
          attachments: convertFilesToAttachments(formData.attachments),
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current-user'
        };
        const updatedAlerts = [...alerts, newAlert];
        setAlerts(updatedAlerts);
        onAlertUpdate?.(updatedAlerts);
        setSuccess(translations.alertCreatedSuccess);
        setShowCreateModal(false);
      }
      
      // Reset form
      setFormData({
        title: '', message: '', type: 'info', priority: 'medium', 
        targetAudience: 'all', category: 'general', isSticky: false, 
        showOnLogin: false, showOnDashboard: true
      });
    } catch (err) {
      setError(translations.saveError);
    }
  };

  const handleDelete = (id: string) => {
    try {
      const updatedAlerts = alerts.filter(a => a.id !== id);
      setAlerts(updatedAlerts);
      onAlertUpdate?.(updatedAlerts);
      setSuccess(translations.alertDeletedSuccess);
      setShowDeleteConfirm(false);
      setDeletingAlertId(null);
    } catch (err) {
      setError('هەڵەیەک ڕوویدا لە سڕینەوەی ئاگادارکردنەوەکە');
    }
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === paginatedAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(paginatedAlerts.map(a => a.id));
    }
  };

  const handleSelectAlert = (id: string) => {
    setSelectedAlerts(prev => 
      prev.includes(id) ? prev.filter(alertId => alertId !== id) : [...prev, id]
    );
  };

  // Render functions
  const renderPriorityBadge = (priority: 'urgent' | 'high' | 'medium' | 'low') => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800', 
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>{priority}</span>
  }

  const renderStatusBadge = (status: 'active' | 'scheduled' | 'expired' | 'draft' | 'archived') => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      expired: 'bg-red-100 text-red-800', 
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-purple-100 text-purple-800'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>{status}</span>
  }

  const renderTypeIcon = (type: 'info' | 'warning' | 'error' | 'success') => {
    const icons = {
      info: <Info className="w-5 h-5 text-blue-500" />,
      success: <CheckCircle className="w-5 h-5 text-green-500" />,
      error: <XCircle className="w-5 h-5 text-red-500" />,
      warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
    return icons[type]
  }

  const renderModal = (title: string, onClose: () => void, onSave: () => void, children: React.ReactNode) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md">
            {translations.cancel}
          </button>
          <button onClick={onSave} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
            {translations.save}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{translations.alertManagement}</h1>
          <p className="text-gray-600 mt-2">بەڕێوەبردن و ڕێکخستنی ئاگادارکردنەوەکان</p>
        </div>

        {/* Alert List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">لیستی ئاگادارکردنەوەکان</h2>
              {permissions.canCreate && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  دروستکردنی ئاگادارکردنەوەی نوێ
                </button>
              )}
            </div>

            {/* Table View */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="p-4">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={selectedAlerts.length === paginatedAlerts.length && paginatedAlerts.length > 0} 
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ناونیشان</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دۆخ</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">گرنگی</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">بەرواری دروستکردن</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کردارەکان</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedAlerts.map(alert => (
                    <tr key={alert.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="w-4 p-4">
                        <input 
                          type="checkbox" 
                          checked={selectedAlerts.includes(alert.id)} 
                          onChange={() => handleSelectAlert(alert.id)} 
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                        {renderTypeIcon(alert.type)}
                        <span className="mr-2">{alert.title}</span>
                      </td>
                      <td className="px-6 py-4">{renderStatusBadge(alert.status)}</td>
                      <td className="px-6 py-4">{renderPriorityBadge(alert.priority)}</td>
                      <td className="px-6 py-4">{formatDateArabicIndic(alert.createdAt)}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        {permissions.canEdit && (
                          <button 
                            onClick={() => { 
                              setEditingAlert(alert); 
                              setFormData({ ...alert, attachments: undefined }); 
                              setShowEditModal(true); 
                            }} 
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                        {permissions.canDelete && (
                          <button 
                            onClick={() => { 
                              setDeletingAlertId(alert.id); 
                              setShowDeleteConfirm(true); 
                            }} 
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  پێشوو
                </button>
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  دواتر
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {(showCreateModal || showEditModal) && renderModal(
          showEditModal ? 'دەستکاریکردنی ئاگادارکردنەوە' : 'دروستکردنی ئاگادارکردنەوەی نوێ',
          () => { setShowCreateModal(false); setShowEditModal(false); setEditingAlert(null); },
          handleSave,
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="ناونیشان" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full p-2 border rounded-lg" 
            />
            <textarea 
              placeholder="پەیام" 
              value={formData.message} 
              onChange={e => setFormData({...formData, message: e.target.value})} 
              className="w-full p-2 border rounded-lg h-24"
            />
            <div className="grid grid-cols-2 gap-4">
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value as any})} 
                className="w-full p-2 border rounded-lg"
              >
                <option value="info">زانیاری</option>
                <option value="warning">ئاگادارکردنەوە</option>
                <option value="error">هەڵە</option>
                <option value="success">سەرکەوتوو</option>
              </select>
              <select 
                value={formData.priority} 
                onChange={e => setFormData({...formData, priority: e.target.value as any})} 
                className="w-full p-2 border rounded-lg"
              >
                <option value="low">کەم</option>
                <option value="medium">مامناوەند</option>
                <option value="high">بەرز</option>
                <option value="urgent">پەلە</option>
              </select>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm mx-4" dir="rtl">
              <h3 className="text-lg font-bold text-gray-900">دڵنیابوونەوەی سڕینەوە</h3>
              <p className="mt-2 text-sm text-gray-600">دڵنیایت لە سڕینەوەی ئەم ئاگادارکردنەوەیە؟ ناتوانیت ئەم کردارە بگەڕێنیتەوە.</p>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)} 
                  className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md"
                >
                  پاشگەزبوونەوە
                </button>
                <button 
                  onClick={() => handleDelete(deletingAlertId!)} 
                  className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                >
                  سڕینەوە
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
            <XCircle className="w-6 h-6 ml-2"/>
            {error}
          </div>
        )}
        {success && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
            <CheckCircle className="w-6 h-6 ml-2"/>
            {success}
          </div>
        )}
      </div>
    </div>
  )
}