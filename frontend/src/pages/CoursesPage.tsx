import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import Layout from '../components/layout/Layout';
import CourseList from '../components/courses/CourseList';
import { useCourses } from '../context/CourseContext';

const CoursesPage: React.FC = () => {
  const { courses, loading, error, fetchCourses, clearError } = useCourses();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <Layout>
      <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Explore Our Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse our comprehensive collection of courses designed to help you master new skills and advance your career.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button 
                onClick={() => {
                  clearError();
                  fetchCourses();
                }}
                className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No courses available at the moment.</p>
            </div>
          ) : (
            <CourseList courses={courses} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;