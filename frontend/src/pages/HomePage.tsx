import React, { useEffect } from 'react';
import { Search, BookOpen, Monitor, Award, Clock, Compass, RefreshCw } from 'lucide-react';
import Layout from '../components/layout/Layout';
import CourseList from '../components/courses/CourseList';
import { useCourses } from '../context/CourseContext';
import { useTestimonials } from '../context/TestimonialContext';
import TestimonialList from '../components/testimonials/TestimonialList';

const HomePage: React.FC = () => {
  const { featuredCourses, loading, error, fetchFeaturedCourses, clearError } = useCourses();
  const { testimonials, loading: testimonialsLoading, error: testimonialError } = useTestimonials();
  
  // Fetch courses on initial load
  useEffect(() => {
    fetchFeaturedCourses();
  }, [fetchFeaturedCourses]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Unlock Your Potential With Online Learning
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Discover thousands of courses from expert instructors in tech, business, design, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/courses" 
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  Explore Courses
                </a>
                <a 
                  href="/register" 
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  Join for Free
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-yellow-400 rounded-full opacity-50 blur-2xl z-0"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400 rounded-full opacity-50 blur-2xl z-0"></div>
                <img 
                  src="https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Online learning" 
                  className="rounded-lg shadow-2xl relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="w-full py-4 pl-14 pr-4 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-600 h-6 w-6" />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-200">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Why Learn With Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform provides the best learning experience with expert instructors and comprehensive courses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Diverse Courses
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access thousands of courses in programming, design, business, and more.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Monitor className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Expert Instructors
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn from industry professionals with real-world experience.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Certificates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn certificates to showcase your skills and accomplishments.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Lifetime Access
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Once enrolled, access course materials anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the most sought-after skills in today's job market
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <a href="/courses/web-development" className="group">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  Web Development
                </h3>
              </div>
            </a>
            
            <a href="/courses/data-science" className="group">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                  Data Science
                </h3>
              </div>
            </a>
            
            <a href="/courses/mobile-development" className="group">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200">
                  Mobile Development
                </h3>
              </div>
            </a>
            
            <a href="/courses/design" className="group">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200">
                  UI/UX Design
                </h3>
              </div>
            </a>
            
            <a href="/courses/business" className="group">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
                  Business
                </h3>
              </div>
            </a>
            
            <a href="/courses/marketing" className="group">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                  Marketing
                </h3>
              </div>
            </a>
          </div>
          
          <div className="text-center mt-8">
            <a 
              href="/categories" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              View all categories <Compass className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our most popular courses across different categories
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
                  fetchFeaturedCourses();
                }}
                className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </button>
            </div>
          ) : featuredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No courses available at the moment.</p>
            </div>
          ) : (
            <CourseList courses={featuredCourses} />
          )}
          
          <div className="text-center mt-12">
            <a 
              href="/courses" 
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-block"
            >
              Browse All Courses
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear from our community of learners who have transformed their careers
            </p>
          </div>
          
          {testimonialsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : testimonialError ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                {testimonialError}
              </p>
            </div>
          ) : (
            <TestimonialList testimonials={testimonials} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students and advance your career with expert-led courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register" 
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Sign Up For Free
            </a>
            <a 
              href="/courses" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              Browse Courses
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;