import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import testimonialService from '../services/testimonialService';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

interface TestimonialContextType {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  fetchTestimonials: () => Promise<void>;
  fetchTestimonialsByCourse: (courseId: string) => Promise<void>;
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

interface TestimonialProviderProps {
  children: ReactNode;
}

export const TestimonialProvider: React.FC<TestimonialProviderProps> = ({ children }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testimonialService.getAllTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials');
      // Fall back to sample testimonials if API fails
      setTestimonials([
        {
          id: '1',
          name: 'Jessica Thompson',
          role: 'Web Developer',
          content: 'The Web Development Bootcamp was a game-changer for me. I went from knowing nothing about coding to landing a job as a junior developer in just 4 months.',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 5
        },
        {
          id: '2',
          name: 'Michael Brown',
          role: 'Data Scientist',
          content: 'The Python for Data Science course provided a solid foundation for my career transition. The instructor was knowledgeable and the course projects were practical and relevant.',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4
        },
        {
          id: '3',
          name: 'Alex Rodriguez',
          role: 'UX Designer',
          content: 'The UI/UX Design course helped me understand the principles of good design and how to apply them. I\'ve completely transformed how I approach design projects.',
          avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonialsByCourse = async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await testimonialService.getTestimonialsByCourse(courseId);
      setTestimonials(data);
    } catch (err) {
      console.error('Error fetching course testimonials:', err);
      setError('Failed to load testimonials for this course');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch testimonials on initial load
  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <TestimonialContext.Provider
      value={{
        testimonials,
        loading,
        error,
        fetchTestimonials,
        fetchTestimonialsByCourse
      }}
    >
      {children}
    </TestimonialContext.Provider>
  );
};

// Custom hook to use testimonial context
export const useTestimonials = (): TestimonialContextType => {
  const context = useContext(TestimonialContext);
  
  if (context === undefined) {
    throw new Error('useTestimonials must be used within a TestimonialProvider');
  }
  
  return context;
}; 