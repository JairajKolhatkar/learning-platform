import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { Document } from 'mongoose';
import { generateToken, generateUserResponse } from '../utils/jwtUtils';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const userDoc = await User.create({
      name,
      email,
      password,
      role: role || 'student' // Default to student if role not provided
    });
    
    const user = userDoc as IUser & Document;

    if (user) {
      // Generate JWT token
      const token = generateToken((user as any)._id.toString());
      
      // Return user data and token
      res.status(201).json(generateUserResponse(user as IUser, token));
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userDoc = await User.findOne({ email });
    const user = userDoc as (IUser & Document) | null;

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      // Generate JWT token
      const token = generateToken((user as any)._id.toString());
      
      // Return user data and token
      res.json(generateUserResponse(user as IUser, token));
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses', 'title thumbnailUrl')
      .populate('createdCourses', 'title thumbnailUrl');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, avatar, bio } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.bio = bio || user.bio;
      
      // Note: We don't update email or password here for security reasons
      // Those should be separate endpoints with additional verification
      
      const updatedUser = await user.save();
      
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
