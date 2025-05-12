import api from './api';
import { User } from './authService';

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'text';
  content: string;
  duration: number;
  order: number;
}

export interface Section {
  _id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string | User;
  thumbnailUrl: string;
  price: number;
  originalPrice?: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  reviewCount?: number;
  enrolledCount: number;
  sections: Section[];
  lessonCount?: number;
  resourceCount?: number;
  learningOutcomes?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreateData {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price?: number;
  thumbnailUrl?: string;
  tags?: string[];
}

export interface CourseSearchParams {
  keyword?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

const courseService = {
  getAllCourses: async (params?: CourseSearchParams): Promise<{ courses: Course[]; total: number }> => {
    const response = await api.get<{ courses: Course[]; total: number }>('/courses', { params });
    return response.data;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData: CourseCreateData): Promise<Course> => {
    const response = await api.post<Course>('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id: string, courseData: Partial<CourseCreateData>): Promise<Course> => {
    const response = await api.put<Course>(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  // Course sections and lessons
  addSection: async (courseId: string, sectionData: { title: string }): Promise<Section> => {
    const response = await api.post<Section>(`/courses/${courseId}/sections`, sectionData);
    return response.data;
  },

  addLesson: async (
    courseId: string, 
    sectionId: string, 
    lessonData: Omit<Lesson, '_id' | 'order'>
  ): Promise<Lesson> => {
    const response = await api.post<Lesson>(`/courses/${courseId}/sections/${sectionId}/lessons`, lessonData);
    return response.data;
  }
};

export default courseService; 