import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// Define user interface with needed properties
interface IUserRequest {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user: IUserRequest;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your_jwt_secret'
      ) as IDecodedToken;

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }
      
      // Set user in request
      req.user = user as IUserRequest;

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware to check if user is an instructor
export const instructorOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, instructor access required' });
  }
};

// Middleware to check if user is an admin
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, admin access required' });
  }
};
