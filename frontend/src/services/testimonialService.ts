import api from './api';
import { Testimonial } from '../context/TestimonialContext';

interface ApiTestimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  courseId?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

const testimonialService = {
  getAllTestimonials: async (): Promise<Testimonial[]> => {
    const response = await api.get<{ testimonials: ApiTestimonial[] }>('/testimonials');
    
    // Convert API testimonial format to frontend format
    return response.data.testimonials.map(testimonial => ({
      id: testimonial._id,
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      avatar: testimonial.avatar,
      rating: testimonial.rating
    }));
  },
  
  getTestimonialById: async (id: string): Promise<Testimonial> => {
    const response = await api.get<ApiTestimonial>(`/testimonials/${id}`);
    
    return {
      id: response.data._id,
      name: response.data.name,
      role: response.data.role,
      content: response.data.content,
      avatar: response.data.avatar,
      rating: response.data.rating
    };
  },
  
  getTestimonialsByCourse: async (courseId: string): Promise<Testimonial[]> => {
    const response = await api.get<{ testimonials: ApiTestimonial[] }>(`/testimonials/course/${courseId}`);
    
    return response.data.testimonials.map(testimonial => ({
      id: testimonial._id,
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      avatar: testimonial.avatar,
      rating: testimonial.rating
    }));
  },
  
  createTestimonial: async (data: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
    const response = await api.post<ApiTestimonial>('/testimonials', data);
    
    return {
      id: response.data._id,
      name: response.data.name,
      role: response.data.role,
      content: response.data.content,
      avatar: response.data.avatar,
      rating: response.data.rating
    };
  }
};

export default testimonialService; 