import { Teacher, TeacherFormData } from '@/types/teacher'
import { mockSubjects } from './bookService'

// Mock data for teachers with more details
export const mockTeachersDetailed: Teacher[] = [
  {
    id: '1',
    name: 'د. ئەحمەد محەمەد',
    subject: 'بیرکاری',
    subjectId: '1',
    dateAdded: '2024-01-10'
  },
  {
    id: '2',
    name: 'م. فاتیمە عەلی',
    subject: 'فیزیا',
    subjectId: '2',
    dateAdded: '2024-01-12'
  },
  {
    id: '3',
    name: 'د. کاروان حەسەن',
    subject: 'کیمیا',
    subjectId: '3',
    dateAdded: '2024-01-15'
  },
  {
    id: '4',
    name: 'م. ژیان ئیبراهیم',
    subject: 'ئینگلیزی',
    subjectId: '4',
    dateAdded: '2024-01-18'
  },
  {
    id: '5',
    name: 'د. سارا مەحمود',
    subject: 'عەرەبی',
    subjectId: '5',
    dateAdded: '2024-01-20'
  }
]

// Teacher service class
export class TeacherService {
  private teachers: Teacher[] = [...mockTeachersDetailed]

  // Get all teachers
  getTeachers(): Teacher[] {
    return [...this.teachers]
  }

  // Get teacher by ID
  getTeacherById(id: string): Teacher | null {
    return this.teachers.find(teacher => teacher.id === id) || null
  }

  // Get teachers by subject
  getTeachersBySubject(subjectId: string): Teacher[] {
    return this.teachers.filter(teacher => teacher.subjectId === subjectId)
  }

  // Add a new teacher
  addTeacher(teacherData: TeacherFormData): Teacher {
    const subject = mockSubjects.find(s => s.id === teacherData.subjectId)
    if (!subject) {
      throw new Error('بابەتەکە نەدۆزرایەوە')
    }

    const newTeacher: Teacher = {
      ...teacherData,
      id: this.generateId(),
      subject: subject.name,
      dateAdded: new Date().toISOString().split('T')[0]
    }
    
    this.teachers.push(newTeacher)
    return newTeacher
  }

  // Update an existing teacher
  updateTeacher(id: string, teacherData: TeacherFormData): Teacher | null {
    const index = this.teachers.findIndex(teacher => teacher.id === id)
    if (index === -1) return null

    const subject = mockSubjects.find(s => s.id === teacherData.subjectId)
    if (!subject) {
      throw new Error('بابەتەکە نەدۆزرایەوە')
    }

    const existingTeacher = this.teachers[index]
    const updatedTeacher: Teacher = {
      ...existingTeacher,
      ...teacherData,
      subject: subject.name
    }
    
    this.teachers[index] = updatedTeacher
    return updatedTeacher
  }

  // Delete a teacher
  deleteTeacher(id: string): boolean {
    const index = this.teachers.findIndex(teacher => teacher.id === id)
    if (index === -1) return false

    this.teachers.splice(index, 1)
    return true
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }
}

// Export singleton instance
export const teacherService = new TeacherService()