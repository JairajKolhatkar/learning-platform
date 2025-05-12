import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import User from '../models/User';

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const { courseId, paymentMethod, paymentId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      paymentAmount: course.price,
      paymentMethod: paymentMethod || (course.price === 0 ? 'free' : undefined),
      paymentId
    });

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { enrolledCourses: courseId } }
    );

    // Increment course enrollment count
    await Course.findByIdAndUpdate(
      courseId,
      { $inc: { enrolledCount: 1 } }
    );

    res.status(201).json({
      success: true,
      enrollment,
      message: 'Successfully enrolled in the course'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's enrollments
// @route   GET /api/enrollments
// @access  Private
export const getUserEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: 'course',
        select: 'title thumbnailUrl instructor level category duration sections',
        populate: {
          path: 'instructor',
          select: 'name avatar'
        }
      })
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:id
// @access  Private
export const updateEnrollmentProgress = async (req: Request, res: Response) => {
  try {
    const { progress } = req.body;
    
    // Find enrollment
    const enrollment = await Enrollment.findById(req.params.id);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Verify ownership
    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this enrollment' });
    }
    
    // Update progress
    enrollment.progress = progress;
    
    // If progress is 100%, mark as completed
    if (progress === 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }
    
    await enrollment.save();
    
    res.json(enrollment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course completion statistics for instructor
// @route   GET /api/enrollments/stats
// @access  Private/Instructor
export const getEnrollmentStats = async (req: Request, res: Response) => {
  try {
    // Get instructor's courses
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(course => course._id);
    
    // Get enrollment stats
    const totalEnrollments = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const completedEnrollments = await Enrollment.countDocuments({ 
      course: { $in: courseIds },
      isCompleted: true
    });
    
    // Get average progress
    const enrollments = await Enrollment.find({ course: { $in: courseIds } });
    const totalProgress = enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
    const averageProgress = totalProgress / (enrollments.length || 1);
    
    res.json({
      totalEnrollments,
      completedEnrollments,
      averageProgress,
      completionRate: (completedEnrollments / (totalEnrollments || 1)) * 100
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
