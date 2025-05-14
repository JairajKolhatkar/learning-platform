# Learning Platform

A full-stack online learning platform built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication** - Register, login, and profile management
- **Course Catalog** - Browse, search, and filter courses
- **Course Enrollment** - Enroll in courses with progress tracking
- **Payment Integration** - Support for payment methods
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Communication** - Socket.io integration for live updates

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Axios (API requests)
- Socket.io Client (real-time communication)

### Backend
- Node.js
- Express
- MongoDB Atlas
- JWT Authentication
- Socket.io (WebSocket server)
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/JairajKolhatkar/learning-platform.git
   cd learning-platform
   ```

2. Install dependencies
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the backend directory based on `.env.example`
   ```
   PORT=4001
   MONGODB_URI=mongodb://localhost:27017/learning-platform
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

4. Start the development servers
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend server (from frontend directory)
   npm run dev
   ```

5. Testing the connection
   - The backend includes test endpoints at `/api/test/ping` and `/api/test/status`
   - The frontend automatically tries to connect to the backend on startup

## Project Structure

```
├── backend                  # Backend API with Node.js/Express/TypeScript
│   ├── src                  # Source code
│   │   ├── controllers      # Request controllers
│   │   ├── middleware       # Express middleware
│   │   ├── models           # Mongoose models
│   │   ├── routes           # API routes
│   │   └── server.ts        # Server entry point
│   └── .env.example         # Example environment variables
├── frontend                 # Frontend with React/TypeScript
│   ├── public               # Static files
│   ├── src                  # React source code
│   │   ├── components       # Reusable components
│   │   ├── context          # React context providers
│   │   ├── pages            # Page components
│   │   └── services         # API services
│   └── .env.example         # Example environment variables
└── package.json             # Root package.json for project
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create a new course (admin)

### Testing
- `GET /api/test/ping` - Test API connectivity
- `GET /api/test/status` - Check server status
- `POST /api/test/echo` - Echo back request data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Thanks to all contributors who have helped with this project
- Special thanks to the open source community for their valuable tools and libraries 
