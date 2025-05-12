import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tutorial-app');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const sampleCourses = [
  {
    title: 'Introduction to Web Development',
    description: 'A comprehensive course on the fundamentals of web development, covering HTML, CSS, and JavaScript.',
    price: 0,
    level: 'beginner',
    category: 'Web Development',
    tags: ['HTML', 'CSS', 'JavaScript'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    isPublished: true,
    sections: [
      {
        title: 'Getting Started with HTML',
        order: 0,
        lessons: [
          {
            title: 'HTML Basics',
            description: 'Learn the fundamentals of HTML structure',
            type: 'video',
            content: 'https://example.com/video1.mp4',
            duration: 15,
            order: 0
          },
          {
            title: 'HTML Elements',
            description: 'Understanding different HTML elements',
            type: 'text',
            content: 'HTML elements are the building blocks of HTML pages...',
            duration: 10,
            order: 1
          }
        ]
      }
    ]
  },
  {
    title: 'JavaScript for Beginners',
    description: 'Start your journey with JavaScript programming language from scratch.',
    price: 19.99,
    level: 'beginner',
    category: 'Programming',
    tags: ['JavaScript', 'ES6', 'Programming'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
    isPublished: true,
    sections: [
      {
        title: 'JavaScript Fundamentals',
        order: 0,
        lessons: [
          {
            title: 'Variables and Data Types',
            description: 'Understanding JavaScript variables',
            type: 'video',
            content: 'https://example.com/js1.mp4',
            duration: 20,
            order: 0
          }
        ]
      }
    ]
  },
  {
    title: 'React: Build Modern Web Applications',
    description: 'Learn to build powerful web applications with React.js',
    price: 29.99,
    level: 'intermediate',
    category: 'Web Development',
    tags: ['React', 'JavaScript', 'Frontend'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    isPublished: true,
    sections: [
      {
        title: 'React Components',
        order: 0,
        lessons: [
          {
            title: 'Component Basics',
            description: 'Understanding React components',
            type: 'video',
            content: 'https://example.com/react1.mp4',
            duration: 25,
            order: 0
          }
        ]
      }
    ]
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});

    console.log('Existing data cleared');

    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    });

    // Create instructor user
    const instructorUser = await User.create({
      name: 'John Instructor',
      email: 'instructor@example.com',
      password: hashedPassword,
      role: 'instructor',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    });

    // Add instructor id to courses
    const coursesWithInstructor = sampleCourses.map(course => {
      return {
        ...course,
        instructor: instructorUser._id
      };
    });

    // Insert courses
    const createdCourses = await Course.insertMany(coursesWithInstructor);

    // Update instructor with created courses
    await User.findByIdAndUpdate(
      instructorUser._id,
      { $push: { createdCourses: { $each: createdCourses.map(course => course._id) } } }
    );

    console.log('Data imported!');
    console.log(`Created ${createdCourses.length} courses`);
    process.exit();
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Execute the script
connectDB().then(() => {
  importData();
}); 