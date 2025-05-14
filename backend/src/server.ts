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
import testRoutes from './routes/testRoutes';
import { errorHandler } from './middleware/errorMiddleware';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the public directory
app.use(express.static('public'));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/test', testRoutes);

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
const PORT = process.env.PORT || 4001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform';

console.log('Attempting to connect to MongoDB Atlas...');

// Set mongoose connection options
mongoose.set('strictQuery', false);

// Connect to MongoDB with improved error handling
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    
    // Start the server after successful MongoDB connection
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    console.log('Starting server without MongoDB connection for development purposes...');
    
    // Start the server anyway for development purposes
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (MongoDB connection failed, running in limited mode)`);
    });
  });

export { io };
