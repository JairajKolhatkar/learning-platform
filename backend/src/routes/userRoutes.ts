import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get('/', protect, getUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', protect, getUserById);

// PUT /api/users/:id - Update user profile
router.put('/:id', protect, updateUser);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', protect, deleteUser);

export default router; 