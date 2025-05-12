import React, { useState } from 'react';
import { Star, Clock, Users, Tag } from 'lucide-react';
import { Course } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useEnrollments } from '../../context/EnrollmentContext';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { isAuthenticated, user } = useAuth();
  const { enrollInCourse, enrollments } = useEnrollments();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the course ID (handle both id and _id cases for mock/real API data)
  const courseId = (course as any).id || (course as any)._id;
  
  // Check if user is already enrolled in this course
  const isEnrolled = enrollments.some(enrollment => {
    const enrollmentCourseId = typeof enrollment.course === 'object' 
      ? ((enrollment.course as any).id || (enrollment.course as any)._id) 
      : enrollment.course;
    return enrollmentCourseId === courseId;
  });

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (isEnrolled) {
      // Navigate to the course content if already enrolled
      window.location.href = '/courses/' + courseId;
      return;
    }
    
    try {
      setIsEnrolling(true);
      setError(null);
      await enrollInCourse(courseId);
      alert('Successfully enrolled in the course!');
      // Optionally redirect to the course page
      window.location.href = '/courses/' + courseId;
    } catch (err: any) {
      setError(err.message || 'Failed to enroll in the course');
      console.error('Enrollment error:', err);
    } finally {
      setIsEnrolling(false);
    }
  };

  // Get the course rating (handle both number and object format)
  const courseRating = typeof (course.rating as any) === 'object' 
    ? (course.rating as any).average 
    : course.rating;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img 
          src={course.thumbnail || (course as any).thumbnailUrl} 
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        {course.isFree && (
          <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            FREE
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
            {course.level}
          </span>
          <div className="flex items-center ml-auto">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {courseRating}
            </span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center mb-4">
          {typeof course.instructor === 'object' && (
            <>
              <img 
                src={course.instructor.avatar || (course.instructor as any).avatarUrl} 
                alt={course.instructor.name} 
                className="h-8 w-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {course.instructor.name}
              </span>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center text-xs px-2 py-1 rounded-full text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration} hours
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.enrolledCount.toLocaleString()} students
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            {course.isFree ? 'Free' : `$${course.price.toFixed(2)}`}
          </div>
          <button 
            onClick={handleEnroll}
            disabled={isEnrolling}
            className={`px-4 py-2 ${isEnrolled ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-lg transition-colors duration-200 ${isEnrolling ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isEnrolling ? 'Enrolling...' : isEnrolled ? 'Go to Course' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;