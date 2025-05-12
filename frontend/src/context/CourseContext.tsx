import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import courseService, { Course, CourseSearchParams } from '../services/courseService';

interface CourseContextType {
  courses: Course[];
  featuredCourses: Course[];
  loading: boolean;
  error: string | null;
  totalCourses: number;
  searchParams: CourseSearchParams;
  fetchCourses: (params?: CourseSearchParams) => Promise<void>;
  fetchFeaturedCourses: () => Promise<void>;
  setSearchParams: (params: CourseSearchParams) => void;
  clearError: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<CourseSearchParams>({
    page: 1,
    limit: 10
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch courses based on search params
  const fetchCourses = useCallback(async (params?: CourseSearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = params || searchParams;
      console.log('Fetching courses with filters:', queryParams);
      const response = await courseService.getAllCourses(queryParams);
      console.log('Full API Response:', response);
      
      if (!response || !response.courses) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid API response format');
      }
      
      setCourses(response.courses);
      setTotalCourses(response.total);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch courses. Please check your connection.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Fetch featured courses
  const fetchFeaturedCourses = useCallback(async () => {
    try {
      setLoading(true);
      
      // Featured courses are most enrolled courses with a limit of 3
      const response = await courseService.getAllCourses({
        limit: 3,
        // You can add sorting parameters here when backend supports it
        // sort: 'enrolledCount'
      });
      
      setFeaturedCourses(response.courses);
    } catch (err: any) {
      console.error('Error fetching featured courses:', err);
      setError(err.message || 'Failed to fetch featured courses.');
      setFeaturedCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured courses on initial load
  useEffect(() => {
    fetchFeaturedCourses();
  }, [fetchFeaturedCourses]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        featuredCourses,
        loading,
        error,
        totalCourses,
        searchParams,
        fetchCourses,
        fetchFeaturedCourses,
        setSearchParams,
        clearError
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook to use course context
export const useCourses = (): CourseContextType => {
  const context = useContext(CourseContext);
  
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  
  return context;
}; 