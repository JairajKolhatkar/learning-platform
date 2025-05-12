import { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import User from '../models/User';
import mongoose from 'mongoose';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, category, level, price } = req.body;

    // Create course with the instructor set to the current user
    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      category,
      level,
      price: price || 0,
    });

    // Add course to instructor's created courses
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { createdCourses: course._id } }
    );

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all published courses with filtering
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req: Request, res: Response) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;
    
    // Build filter object
    const filter: any = { isPublished: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.level) {
      filter.level = req.query.level;
    }
    
    if (req.query.price) {
      if (req.query.price === 'free') {
        filter.price = 0;
      } else if (req.query.price === 'paid') {
        filter.price = { $gt: 0 };
      }
    }
    
    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    console.log('Fetching courses with filter:', filter);
    
    // Execute query with pagination
    const count = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    
    console.log(`Found ${courses.length} courses`);
    
    res.json({
      courses,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error: any) {
    console.error('Error in getCourses:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
};

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
export const getFeaturedCourses = async (req: Request, res: Response) => {
  try {
    // Get courses with highest rating or most enrolled
    const featuredCourses = await Course.find({ isPublished: true })
      .populate('instructor', 'name avatar')
      .sort({ enrolledCount: -1, 'rating.average': -1 })
      .limit(6);
    
    res.json(featuredCourses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio');
    
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Update course fields
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    res.json(updatedCourse);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor or Admin
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    await course.deleteOne();
    
    // Remove course from instructor's created courses
    await User.findByIdAndUpdate(
      course.instructor,
      { $pull: { createdCourses: course._id } }
    );
    
    res.json({ message: 'Course removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a section to a course
// @route   POST /api/courses/:id/sections
// @access  Private/Instructor
export const addSection = async (req: Request, res: Response) => {
  try {
    const { title, order } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Add new section as a subdocument
    course.sections.push({
      _id: new mongoose.Types.ObjectId(),
      title,
      order: order || course.sections.length,
      lessons: []
    } as any);
    
    await course.save();
    
    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a lesson to a section
// @route   POST /api/courses/:id/sections/:sectionId/lessons
// @access  Private/Instructor
export const addLesson = async (req: Request, res: Response) => {
  try {
    const { title, description, type, content, duration, order } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Find the section using mongoose's array methods
    const sectionIndex = course.sections.findIndex(
      section => String(section._id) === req.params.sectionId
    );
    
    if (sectionIndex === -1) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    const section = course.sections[sectionIndex];
    
    // Add new lesson
    section.lessons.push({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      type,
      content,
      duration: duration || 0,
      order: order || section.lessons.length
    } as any);
    
    // Update total course duration
    course.duration = course.sections.reduce((total, section) => {
      return total + section.lessons.reduce((sectionTotal, lesson) => {
        return sectionTotal + lesson.duration;
      }, 0);
    }, 0);
    
    await course.save();
    
    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
