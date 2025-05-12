import express from 'express';
import {
  enrollInCourse,
  getUserEnrollments,
  updateEnrollmentProgress,
  getEnrollmentStats
} from '../controllers/enrollmentController';
import { protect, instructorOnly } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes
router.post('/', protect, enrollInCourse);
router.get('/', protect, getUserEnrollments);
router.put('/:id', protect, updateEnrollmentProgress);

// Instructor only routes
router.get('/stats', protect, instructorOnly, getEnrollmentStats);

export default router;
