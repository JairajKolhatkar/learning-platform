import React from 'react';
import { Testimonial } from '../../context/TestimonialContext';

interface TestimonialListProps {
  testimonials: Testimonial[];
}

const TestimonialList: React.FC<TestimonialListProps> = ({ testimonials }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name} 
              className="h-12 w-12 rounded-full mr-4"
            />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white">
                {testimonial.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {testimonial.role}
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 italic">
            "{testimonial.content}"
          </p>
          <div className="flex mt-4">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} fill-current`} 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialList; 