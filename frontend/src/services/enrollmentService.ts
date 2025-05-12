import api from './api';
import { Course } from './courseService';
import { User } from './authService';

export interface Enrollment {
  _id: string;
  user: string | User;
  course: string | Course;
  progress: number;
  completed: boolean;
  lastAccessed?: string;
  completedLessons: string[];
  certificate?: {
    issued: boolean;
    url?: string;
    issuedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentCreateData {
  courseId: string;
}

export interface PaymentData {
  courseId: string;
  paymentMethod: string;
  amount: number;
}

const enrollmentService = {
  getAllEnrollments: async (): Promise<Enrollment[]> => {
    const response = await api.get<{ enrollments: Enrollment[] }>('/enrollments');
    return response.data.enrollments;
  },

  getEnrollmentById: async (id: string): Promise<Enrollment> => {
    const response = await api.get<Enrollment>(`/enrollments/${id}`);
    return response.data;
  },

  getEnrollmentByCourseId: async (courseId: string): Promise<Enrollment | null> => {
    try {
      const response = await api.get<Enrollment>(`/enrollments/course/${courseId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  createEnrollment: async (enrollmentData: EnrollmentCreateData): Promise<Enrollment> => {
    const response = await api.post<Enrollment>('/enrollments', enrollmentData);
    return response.data;
  },

  updateProgress: async (enrollmentId: string, progress: number): Promise<Enrollment> => {
    const response = await api.patch<Enrollment>(`/enrollments/${enrollmentId}/progress`, { progress });
    return response.data;
  },

  markLessonCompleted: async (enrollmentId: string, lessonId: string): Promise<Enrollment> => {
    const response = await api.post<Enrollment>(
      `/enrollments/${enrollmentId}/lessons/${lessonId}/complete`
    );
    return response.data;
  },

  // Payment processing 
  processPayment: async (paymentData: PaymentData): Promise<{ success: boolean; paymentId: string }> => {
    const response = await api.post<{ success: boolean; paymentId: string }>(
      '/payments/process', 
      paymentData
    );
    return response.data;
  }
};

export default enrollmentService; 