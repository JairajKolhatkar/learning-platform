import express from 'express';
import {
  createCourse,
  getCourses,
  getFeaturedCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addSection,
  addLesson
} from '../controllers/courseController';
import { protect, instructorOnly } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:id', getCourseById);

// Protected routes - Instructor only
router.post('/', protect, instructorOnly, createCourse);
router.put('/:id', protect, instructorOnly, updateCourse);
router.delete('/:id', protect, instructorOnly, deleteCourse);
router.post('/:id/sections', protect, instructorOnly, addSection);
router.post('/:id/sections/:sectionId/lessons', protect, instructorOnly, addLesson);

export default router;
