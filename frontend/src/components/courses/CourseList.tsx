import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import CourseCard from './CourseCard';
import { Course as FrontendCourse } from '../../types';
import { Course as ApiCourse } from '../../services/courseService';

interface CourseListProps {
  courses: FrontendCourse[] | ApiCourse[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique categories/tags from courses
  const categories = Array.from(new Set(courses.flatMap(course => {
    // Handle both APIs (tags vs category)
    if ('tags' in course) {
      return course.tags;
    } else if ('category' in course) {
      return [course.category];
    }
    return [];
  })));
  
  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle category/tags filtering
    let matchesCategory = selectedCategory === 'all';
    if (!matchesCategory) {
      if ('tags' in course && course.tags) {
        matchesCategory = course.tags.includes(selectedCategory);
      } else if ('category' in course) {
        matchesCategory = course.category === selectedCategory;
      }
    }
    
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Create adapted courses for CourseCard
  const adaptedCourses = filteredCourses.map(course => {
    if ('id' in course) {
      // Already in frontend format
      return course as FrontendCourse;
    } else {
      // Convert API format to frontend format
      return {
        id: course._id,
        title: course.title,
        description: course.description,
        instructor: typeof course.instructor === 'string' 
          ? { id: course.instructor, name: 'Instructor', email: '', role: 'instructor' } 
          : course.instructor as any,
        thumbnail: course.thumbnailUrl || '',
        price: course.price,
        isFree: course.price === 0,
        rating: typeof course.rating === 'object' ? course.rating.average : course.rating,
        enrolledCount: course.enrolledCount,
        duration: course.duration,
        level: course.level,
        tags: course.tags || [course.category],
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      } as FrontendCourse;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Explore Courses
          </h2>
          
          <div className="relative w-full md:w-64 lg:w-80">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price
              </label>
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Free</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Paid</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {adaptedCourses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adaptedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;