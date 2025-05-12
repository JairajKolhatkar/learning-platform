import React, { useState, useEffect } from 'react';
import { Star, Clock, Users, CheckCircle, FileText, Video, Award, CreditCard, DollarSign, Play, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { useTestimonials } from '../context/TestimonialContext';
import TestimonialList from '../components/testimonials/TestimonialList';
import courseService, { Course } from '../services/courseService';
import enrollmentService from '../services/enrollmentService';

const CourseDetailPage: React.FC = () => {
  const [courseId, setCourseId] = useState<string>('');
  const [course, setCourse] = useState<Course | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  const { isAuthenticated, user } = useAuth();
  const { enrollInCourse, enrollments } = useEnrollments();
  const { testimonials, loading: testimonialsLoading, error: testimonialError, fetchTestimonialsByCourse } = useTestimonials();
  
  // Get courseId from URL
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 3) {
      setCourseId(pathParts[2]);
    }
  }, []);
  
  // Fetch course data from API
  useEffect(() => {
    if (courseId) {
      setIsLoading(true);
      setError(null);
      
      courseService.getCourseById(courseId)
        .then(courseData => {
          setCourse(courseData);
        })
        .catch(err => {
          console.error('Error fetching course:', err);
          setError('Failed to load course details. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [courseId]);

  // Check if user is already enrolled
  const isEnrolled = enrollments.some(enrollment => {
    const enrollmentCourseId = typeof enrollment.course === 'object' 
      ? ((enrollment.course as any)._id) 
      : enrollment.course;
    return enrollmentCourseId === courseId;
  });

  // Get user enrollment progress if enrolled
  useEffect(() => {
    if (isAuthenticated && user && courseId && isEnrolled) {
      // Find enrollment to get progress data
      enrollmentService.getEnrollmentByCourseId(courseId)
        .then(enrollment => {
          if (enrollment) {
            setUserProgress(enrollment.progress || 0);
            setCompletedLessons(enrollment.completedLessons || []);
          }
        })
        .catch(err => {
          console.error('Error fetching enrollment:', err);
        });
    }
  }, [isAuthenticated, user, courseId, isEnrolled]);
  
  // Fetch course testimonials when courseId is available
  useEffect(() => {
    if (courseId) {
      fetchTestimonialsByCourse(courseId);
    }
  }, [courseId, fetchTestimonialsByCourse]);
  
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    if (isEnrolled) {
      // Navigate to course content
      window.location.href = `/courses/${courseId}/learn`;
      return;
    }
    
    // If course is free, enroll directly
    if (course && course.price === 0) {
      try {
        setIsProcessing(true);
        setError(null);
        
        await enrollInCourse(courseId);
        
        setSuccess('Successfully enrolled in the course!');
        setTimeout(() => {
          window.location.href = `/courses/${courseId}/learn`;
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Failed to enroll in the course');
        console.error('Enrollment error:', err);
      } finally {
        setIsProcessing(false);
      }
      return;
    }
    
    // For paid courses, process payment
    try {
      setIsProcessing(true);
      setError(null);
      
      // In a real app, you would integrate with a payment processor here
      // For example, with Stripe:
      // 1. Create a payment intent on the backend
      // 2. Use Stripe Elements to collect payment details
      // 3. Confirm the payment
      
      // Call payment API
      const paymentResult = await enrollmentService.processPayment({
        courseId,
        paymentMethod,
        amount: course?.price || 0
      });
      
      // After successful payment, enroll in the course
      await enrollInCourse(courseId);
      
      setSuccess('Payment successful! You are now enrolled in the course.');
      setTimeout(() => {
        window.location.href = `/courses/${courseId}/learn`;
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };
  
  if (isLoading || !course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="flex flex-col space-y-8">
            {/* Hero section skeleton */}
            <div className="w-full h-64 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl animate-pulse"></div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Format the course rating
  const courseRating = typeof course.rating === 'object' 
    ? course.rating.average 
    : 0;

  // Get instructor info
  const instructorName = typeof course.instructor === 'object' 
    ? (course.instructor as any).name 
    : 'Instructor';
    
  const instructorAvatar = typeof course.instructor === 'object'
    ? (course.instructor as any).avatar || '/images/default-avatar.png'
    : '/images/default-avatar.png';

  // Get instructor bio if available
  const instructorBio = typeof course.instructor === 'object'
    ? (course.instructor as any).bio || null
    : null;

  // Calculate total lessons
  const totalLessons = course.lessonCount || 
    (course.sections?.reduce((acc, section) => acc + section.lessons.length, 0) || 0);
  
  return (
    <Layout>
      {/* Hero section with course banner */}
      <div className="relative w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: `url(${course.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></div>
        <div className="container mx-auto px-4 py-16 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-4">
                {course.category}
              </span>
              
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                {course.description.split('.')[0]}. {/* Just the first sentence for the hero */}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  <span className="ml-2 font-medium text-lg">{courseRating}</span>
                  <span className="ml-1 text-blue-200">({course.reviewCount || course.rating?.count || 0} reviews)</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-200" />
                  <span className="ml-2 text-blue-100">{course.enrolledCount.toLocaleString()} students</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-200" />
                  <span className="ml-2 text-blue-100">{course.duration} hours</span>
                </div>
                
                <span className="px-3 py-1 bg-blue-700 text-white text-sm font-medium rounded-full">
                  {course.level}
                </span>
              </div>
              
              <div className="flex items-center">
                <img 
                  src={instructorAvatar} 
                  alt={instructorName} 
                  className="h-12 w-12 rounded-full mr-3 object-cover border-2 border-white"
                />
                <div>
                  <p className="text-sm text-blue-200">Created by</p>
                  <p className="font-medium">{instructorName}</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {/* Preview video placeholder */}
              <div className="relative rounded-xl overflow-hidden shadow-xl bg-gray-900 aspect-video flex items-center justify-center group cursor-pointer">
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg transform transition-transform group-hover:scale-110">
                    <Play fill="#2563eb" className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Details - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                About This Course
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {course.tags.map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(course.learningOutcomes || [
                  "Build professional websites with HTML and CSS",
                  "Master JavaScript programming language",
                  "Create responsive layouts for all devices",
                  "Work with modern frameworks and tools",
                  "Deploy your websites to production",
                  "Optimize for performance and SEO"
                ]).map((item, index) => (
                  <div key={index} className="flex items-start bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <BookOpen className="mr-3 h-6 w-6 text-blue-600" />
                Course Content
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {course.sections?.length || 0} sections • {totalLessons} lessons • {course.duration} total hours
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
                {course.sections && course.sections.length > 0 ? (
                  course.sections.map((section, index) => (
                    <div key={section._id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <button 
                        className="flex items-center justify-between w-full text-left p-4"
                        onClick={() => toggleSection(section._id)}
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-800 dark:text-white mr-3">
                            {index + 1}.
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {section.title}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                            {section.lessons.length} lessons
                          </span>
                          {expandedSection === section._id ? 
                            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          }
                        </div>
                      </button>
                      
                      {expandedSection === section._id && (
                        <div className="bg-gray-50 dark:bg-gray-750 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <li key={lesson._id} className="py-3 flex items-center text-gray-700 dark:text-gray-300">
                                <Play className="h-4 w-4 text-gray-400 mr-3" />
                                <span className="mr-2">{index + 1}.{lessonIndex + 1}</span>
                                <span>{lesson.title}</span>
                                <span className="ml-auto text-sm text-gray-500">{lesson.duration} min</span>
                                {completedLessons.includes(lesson._id) && (
                                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No content sections available for this course yet.
                  </div>
                )}
              </div>
            </div>
            
            {/* Add Course Testimonials Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <Star className="mr-3 h-6 w-6 text-yellow-500" />
                Student Testimonials
              </h2>
              
              {testimonialsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : testimonialError ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">{testimonialError}</p>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">No reviews yet for this course.</p>
                </div>
              ) : (
                <TestimonialList testimonials={testimonials} />
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                About the Instructor
              </h2>
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {typeof course.instructor === 'object' && (
                  <>
                    <img 
                      src={instructorAvatar} 
                      alt={instructorName} 
                      className="h-24 w-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700"
                    />
                    <div>
                      <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                        {instructorName}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                        {(course.instructor as any).title || 'Professional Instructor'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        {instructorBio || 
                          "With years of experience in this field, I'm passionate about sharing knowledge and helping students achieve their goals. My courses are designed to be practical and applicable to real-world scenarios."}
                      </p>
                      
                      {typeof course.instructor === 'object' && (course.instructor as any).stats && (
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 dark:text-white">
                              {(course.instructor as any).stats.courseCount || '10+'}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Courses</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 dark:text-white">
                              {(course.instructor as any).stats.studentCount || '1000+'}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Students</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 dark:text-white">
                              {(course.instructor as any).stats.rating || '4.8'}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Rating</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Course Enrollment - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              {isEnrolled && (
                <div className="mb-6">
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your progress</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{userProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${userProgress}%` }}></div>
                  </div>
                </div>
              )}
            
              <div className="flex items-baseline mb-4">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">
                  {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                </div>
                {course.price > 0 && course.originalPrice && course.originalPrice > course.price && (
                  <>
                    <div className="ml-3 text-lg text-gray-500 dark:text-gray-400 line-through">
                      ${course.originalPrice.toFixed(2)}
                    </div>
                    <div className="ml-3 text-sm font-medium text-green-600 dark:text-green-400">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                    </div>
                  </>
                )}
              </div>
              
              {isEnrolled ? (
                <div className="mb-6">
                  <div className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 px-4 py-3 rounded-lg flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>You're already enrolled in this course</span>
                  </div>
                </div>
              ) : error ? (
                <div className="mb-6">
                  <div className="bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                </div>
              ) : success ? (
                <div className="mb-6">
                  <div className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 px-4 py-3 rounded-lg mb-4">
                    {success}
                  </div>
                </div>
              ) : null}
              
              {course.price > 0 && !isEnrolled && !success && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                    Payment Method
                  </h3>
                  <div className="flex flex-col gap-2">
                    <label className={`flex items-center p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                      paymentMethod === 'card' 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500' 
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-650'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <CreditCard className="h-5 w-5 ml-2 mr-3 text-blue-600 dark:text-blue-400" />
                      <span className={`${
                        paymentMethod === 'card'
                          ? 'text-blue-800 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>Credit/Debit Card</span>
                    </label>
                    
                    <label className={`flex items-center p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                      paymentMethod === 'paypal' 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500' 
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-650'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <DollarSign className="h-5 w-5 ml-2 mr-3 text-blue-600 dark:text-blue-400" />
                      <span className={`${
                        paymentMethod === 'paypal'
                          ? 'text-blue-800 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>PayPal</span>
                    </label>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleEnroll}
                disabled={isProcessing || !!success}
                className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 text-center ${
                  isEnrolled
                    ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20'
                    : isProcessing
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transform hover:-translate-y-1'
                }`}
              >
                {isProcessing
                  ? 'Processing...'
                  : isEnrolled
                  ? 'Continue Learning'
                  : course.price === 0
                  ? 'Enroll Now - Free'
                  : `Enroll Now - $${course.price.toFixed(2)}`}
              </button>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 dark:text-white mb-4">
                  This course includes:
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <Video className="h-5 w-5 mr-3 text-blue-500" />
                    <span>{course.duration} hours of video content</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <FileText className="h-5 w-5 mr-3 text-blue-500" />
                    <span>{course.resourceCount || totalLessons} resources</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="h-5 w-5 mr-3 text-blue-500" />
                    <span>Access to community forum</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <Award className="h-5 w-5 mr-3 text-blue-500" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 flex items-center justify-center space-x-2 border-t border-gray-200 dark:border-gray-700 pt-6">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  30-Day Money-Back Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetailPage; 