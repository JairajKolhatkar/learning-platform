import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const mockNotifications = [
    { id: 1, title: 'New course available', time: '5 minutes ago' },
    { id: 2, title: 'Assignment reminder', time: '1 hour ago' },
    { id: 3, title: 'Your course progress', time: '1 day ago' }
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            LearnHub
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex ml-10 space-x-8">
            <a href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </a>
            <div className="relative group">
              <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                Courses <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <a href="/courses/web-development" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Web Development
                  </a>
                  <a href="/courses/data-science" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Data Science
                  </a>
                  <a href="/courses/mobile-development" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Mobile Development
                  </a>
                  <a href="/courses/design" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Design
                  </a>
                </div>
              </div>
            </div>
            <a href="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              About
            </a>
            <a href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </a>
          </nav>
        </div>
        
        {/* Search bar */}
        <div className="hidden md:flex items-center relative">
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="py-2 pl-10 pr-4 w-64 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        
        {/* User Navigation */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Dark mode toggle */}
              <button 
                onClick={toggleDarkMode} 
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Bell className="h-5 w-5" />
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Notifications</h3>
                      </div>
                      {mockNotifications.map(notification => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{notification.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                        </div>
                      ))}
                      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        <a href="/notifications" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                          View all notifications
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User menu */}
              <div className="relative ml-3">
                <div>
                  <button 
                    type="button" 
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <img 
                      className="h-8 w-8 rounded-full" 
                      src={user?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"} 
                      alt="User profile" 
                    />
                  </button>
                </div>
                
                {/* Dropdown menu, show/hide based on menu state. */}
                <div className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Your Profile
                    </a>
                    {user?.role === 'admin' && (
                      <a href="/admin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Admin Dashboard
                      </a>
                    )}
                    {user?.role === 'instructor' && (
                      <a href="/instructor" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Instructor Dashboard
                      </a>
                    )}
                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Settings
                    </a>
                    <button 
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile logout button */}
              <button 
                onClick={logout} 
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 md:hidden"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="hidden md:flex space-x-4">
              <a 
                href="/login" 
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Log in
              </a>
              <a 
                href="/register" 
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              >
                Sign up
              </a>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Home
            </a>
            <a 
              href="/courses" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Courses
            </a>
            <a 
              href="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              About
            </a>
            <a 
              href="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Contact
            </a>
            
            {!isAuthenticated && (
              <>
                <a 
                  href="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Log in
                </a>
                <a 
                  href="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;