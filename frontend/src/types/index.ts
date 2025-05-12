export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: User;
  thumbnail: string;
  price: number;
  isFree: boolean;
  rating: number;
  enrolledCount: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  type: 'video' | 'pdf' | 'text';
  content: string;
  order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface ForumPost {
  id: string;
  courseId: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}