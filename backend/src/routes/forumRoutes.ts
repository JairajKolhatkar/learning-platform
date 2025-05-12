import express from 'express';
import {
  createDiscussion,
  getDiscussions,
  getDiscussionById,
  addComment,
  toggleLike,
  updateDiscussion,
  togglePin
} from '../controllers/forumController';
import { protect, instructorOnly } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes
router.post('/', protect, createDiscussion);
router.get('/', protect, getDiscussions);
router.get('/:id', protect, getDiscussionById);
router.post('/:id/comments', protect, addComment);
router.put('/:id/like', protect, toggleLike);
router.put('/:id', protect, updateDiscussion);

// Instructor/Admin only routes
router.put('/:id/pin', protect, instructorOnly, togglePin);

export default router;
