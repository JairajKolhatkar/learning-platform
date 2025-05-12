import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import userRoutes from './routes/userRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import forumRoutes from './routes/forumRoutes';
import { errorHandler } from './middleware/errorMiddleware';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Socket.io setup with permissive CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  }
});

// Apply CORS middleware - very permissive for development
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Simple test routes
app.get('/', (req, res) => {
  res.send('API is running... <a href="/api/courses">View Courses</a>');
});

// Hello world test endpoint
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// API debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host || 'Not connected',
      database: mongoose.connection.name || 'Not connected'
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: PORT
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/forum', forumRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room (course or forum)
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Send a message to a room
  socket.on('send-message', (data: { room: string, message: string, user: any }) => {
    io.to(data.room).emit('receive-message', {
      ...data,
      timestamp: new Date()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB and start server
const PORT = 4000; // Force set port to 4000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tutorial-app';

// Try to connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    console.log(`MongoDB Database: ${mongoose.connection.name}`);
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Debug endpoint: http://localhost:${PORT}/api/debug`);
      console.log(`Hello world: http://localhost:${PORT}/hello`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    
    // Start server even if MongoDB connection fails
    console.log('Starting server without MongoDB connection...');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (no MongoDB)`);
    });
  });

export { io };
