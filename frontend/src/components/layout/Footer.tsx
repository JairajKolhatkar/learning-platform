import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">LearnHub</h3>
            <p className="text-gray-400 mb-4">
              Empowering learners worldwide with quality education that's accessible to everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Courses
                </a>
              </li>
              <li>
                <a href="/instructors" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Instructors
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="/courses/web-development" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Web Development
                </a>
              </li>
              <li>
                <a href="/courses/mobile-development" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Mobile Development
                </a>
              </li>
              <li>
                <a href="/courses/data-science" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Data Science
                </a>
              </li>
              <li>
                <a href="/courses/design" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  UI/UX Design
                </a>
              </li>
              <li>
                <a href="/courses/marketing" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Digital Marketing
                </a>
              </li>
              <li>
                <a href="/courses/business" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Business
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="flex items-center text-gray-400 mb-2">
              <Mail size={16} className="mr-2" />
              info@learnhub.com
            </p>
            <h4 className="text-lg font-semibold mt-6 mb-4">Subscribe to Newsletter</h4>
            <form className="flex flex-col">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md bg-gray-800 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="/terms" className="text-gray-500 text-sm hover:text-blue-400 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="/privacy" className="text-gray-500 text-sm hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/cookies" className="text-gray-500 text-sm hover:text-blue-400 transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;