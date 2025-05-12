import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  updateUserProfile 
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateUserProfile);

export default router;
