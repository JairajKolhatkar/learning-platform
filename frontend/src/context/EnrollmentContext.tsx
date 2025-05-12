import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import enrollmentService, { Enrollment } from '../services/enrollmentService';

interface EnrollmentContextType {
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;
  enrollInCourse: (courseId: string) => Promise<Enrollment>;
  fetchEnrollments: () => Promise<void>;
}

const EnrollmentContext = createContext<EnrollmentContextType>({
  enrollments: [],
  isLoading: false,
  error: null,
  enrollInCourse: async () => {
    throw new Error('enrollInCourse not implemented');
  },
  fetchEnrollments: async () => {
    throw new Error('fetchEnrollments not implemented');
  }
});

export const useEnrollments = () => useContext(EnrollmentContext);

interface EnrollmentProviderProps {
  children: ReactNode;
}

export const EnrollmentProvider: React.FC<EnrollmentProviderProps> = ({ children }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const fetchEnrollments = async () => {
    if (!isAuthenticated) {
      setEnrollments([]);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const enrollmentsData = await enrollmentService.getAllEnrollments();
      setEnrollments(enrollmentsData);
    } catch (err: any) {
      console.error('Error fetching enrollments:', err);
      setError(err.message || 'Failed to fetch enrollments');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch enrollments when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrollments();
    } else {
      setEnrollments([]);
    }
  }, [isAuthenticated]);

  const enrollInCourse = async (courseId: string): Promise<Enrollment> => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to enroll in a course');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const enrollmentData = {
        courseId
      };
      
      const newEnrollment = await enrollmentService.createEnrollment(enrollmentData);
      
      // Update the local state with the new enrollment
      setEnrollments(prev => [...prev, newEnrollment]);
      
      return newEnrollment;
    } catch (err: any) {
      console.error('Error enrolling in course:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to enroll in course';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    enrollments,
    isLoading,
    error,
    enrollInCourse,
    fetchEnrollments
  };

  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
};

export default EnrollmentContext; 