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
import ApiDebugger from './components/ApiDebugger';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

  // Add direct API test on component mount
  useEffect(() => {
    // Test API connectivity with vanilla fetch
    const testApiConnection = async () => {
      try {
        console.log('Testing direct API connection...');
        
        // Test with fetch API
        const response = await fetch('http://localhost:4000/api/debug');
        const data = await response.json();
        
        console.log('Direct API test succeeded:', data);
      } catch (error) {
        console.error('Direct API test failed:', error);
      }
      
      // Also test with XMLHttpRequest for compatibility
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:4000/api/debug', true);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('XHR test succeeded:', JSON.parse(xhr.responseText));
        } else {
          console.error('XHR test failed:', xhr.statusText);
        }
      };
      xhr.onerror = () => {
        console.error('XHR network error');
      };
      xhr.send();
    };
    
    testApiConnection();
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
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <EnrollmentProvider>
            <ForumProvider>
              <TestimonialProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:id" element={<CourseDetailPage />} />
                </Routes>
                <ApiDebugger />
              </TestimonialProvider>
            </ForumProvider>
          </EnrollmentProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;