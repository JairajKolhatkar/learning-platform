import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { EnrollmentProvider } from './context/EnrollmentContext';
import { ForumProvider } from './context/ForumContext';
import { TestimonialProvider } from './context/TestimonialContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';

// Environment variables setup
if (!window.env) {
  window.env = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080'
  };
}

function App() {
  // Simple routing implementation
  const [currentPage, setCurrentPage] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handleNavigate = () => {
      setCurrentPage(window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigate);
    
    // Intercept link clicks to handle routing
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href.startsWith(window.location.origin) && !anchor.getAttribute('target')) {
        e.preventDefault();
        const path = anchor.href.replace(window.location.origin, '');
        window.history.pushState({}, '', path);
        setCurrentPage(path);
      }
    });

    return () => {
      window.removeEventListener('popstate', handleNavigate);
    };
  }, []);

  const renderPage = () => {
    if (currentPage === '/') {
      return <HomePage />;
    } else if (currentPage === '/login') {
      return <LoginPage />;
    } else if (currentPage === '/register') {
      return <RegisterPage />;
    } else if (currentPage === '/courses') {
      return <CoursesPage />;
    } else if (currentPage.startsWith('/courses/') && !currentPage.includes('/learn')) {
      // Match course detail pages like /courses/1 but not /courses/1/learn
      return <CourseDetailPage />;
    } else {
      // Fallback to home page
      return <HomePage />;
    }
  };

  return (
    <AuthProvider>
      <CourseProvider>
        <EnrollmentProvider>
          <ForumProvider>
            <TestimonialProvider>
              {renderPage()}
            </TestimonialProvider>
          </ForumProvider>
        </EnrollmentProvider>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;