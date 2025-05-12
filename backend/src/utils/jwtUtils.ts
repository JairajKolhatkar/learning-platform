import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '30d' }
  );
};

export const generateUserResponse = (user: IUser, token: string) => {
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      enrolledCourses: user.enrolledCourses,
      createdCourses: user.createdCourses,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token
  };
};
