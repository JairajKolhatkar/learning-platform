# Learning Platform

A full-stack online learning platform built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication** - Register, login, and profile management
- **Course Catalog** - Browse, search, and filter courses
- **Course Enrollment** - Enroll in courses with progress tracking
- **Payment Integration** - Support for payment methods
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Axios (API requests)

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

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
   - Create a `.env` file in the backend directory
   ```
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/learning-platform
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend server (from frontend directory)
   npm run dev
   ```

## Project Structure

```
├── backend                  # Backend API with Node.js/Express
│   ├── controllers          # Request controllers
│   ├── middleware           # Express middleware
│   ├── models               # Mongoose models
│   ├── routes               # API routes
│   └── server.js            # Server entry point
├── frontend                 # Frontend with React
│   ├── public               # Static files
│   └── src                  # React source code
│       ├── components       # Reusable components
│       ├── context          # React context providers
│       ├── pages            # Page components
│       └── services         # API services
└── package.json             # Root package.json for project
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Thanks to all contributors who have helped with this project
- Special thanks to the open source community for their valuable tools and libraries 
