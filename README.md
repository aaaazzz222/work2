# Portfolio & Blog Full-Stack Application

A complete MERN stack application featuring a personal portfolio and blog system with a beautiful pink-themed UI inspired by iOS and HarmonyOS design.

## 🎨 Features

### Backend (Node.js + Express + MongoDB)
- ✅ RESTful API architecture
- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ MVC design pattern
- ✅ MongoDB with Mongoose ODM
- ✅ Secure headers with Helmet
- ✅ CORS enabled
- ✅ Comprehensive error handling

### Frontend (React + Vite)
- ✅ Beautiful pink color theme
- ✅ Responsive design (mobile-first)
- ✅ React Router for navigation
- ✅ Context API for state management
- ✅ Protected routes
- ✅ Admin dashboard
- ✅ Blog with comments
- ✅ Contact form
- ✅ Smooth animations

## 📁 Project Structure

```
stuck/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & error middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   ├── .env                # Environment variables
│   ├── server.js           # Entry point
│   └── package.json
│
└── frontend/               # React application
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── context/        # React Context
    │   ├── pages/          # Page components
    │   ├── services/       # API integration
    │   ├── App.jsx         # Main app
    │   └── index.css       # Global styles
    ├── .env                # Environment variables
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
cd /Users/zishen/Desktop/stuck
```

### 2. Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment variables
# .env file already configured:
# - PORT=4000 (changed from 5000 due to port conflict)
# - MONGO_URI=mongodb://localhost:27017/portfolio_blog
# - JWT_SECRET=your_secret_key
# - NODE_ENV=development

# Start MongoDB (if using local)
# Make sure MongoDB is running on localhost:27017

# Run the backend server
npm run dev
```

Backend will run on `http://localhost:4000`

### 3. Setup Frontend

```bash
# Open a new terminal
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Configure environment variables
# .env file is already created with:
# VITE_API_URL=http://localhost:4000/api

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173` (or similar port if 5173 is occupied)

## 📝 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Projects
- `GET /api/projects` - Get all projects (Public)
- `GET /api/projects/:id` - Get single project (Public)
- `POST /api/projects` - Create project (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Blog Posts
- `GET /api/blog` - Get all posts (Public)
- `GET /api/blog/:id` - Get single post with comments (Public)
- `POST /api/blog` - Create post (Protected)
- `PUT /api/blog/:id` - Update post (Protected, Author only)
- `DELETE /api/blog/:id` - Delete post (Protected, Author only)

### Comments
- `GET /api/blog/:postId/comments` - Get comments for a post (Public)
- `POST /api/blog/:postId/comments` - Create comment (Protected)

### Contact
- `POST /api/contact` - Submit contact form (Public)
- `GET /api/contact` - Get all messages (Protected)

## 🎯 Usage

### For Users
1. Visit the homepage
2. Browse projects and blog posts
3. Submit contact form
4. Register an account to:
   - Post comments on blog posts
   - Access admin features

### For Admins
1. Register/Login
2. Navigate to Admin Dashboard
3. Manage Projects:
   - Create, edit, delete portfolio projects
4. Manage Blog:
   - Create, edit, delete blog posts
5. View Messages:
   - See all contact form submissions

## 🎨 Design System

### Color Palette (Pink Theme)
- Primary: `#FF6B9D`
- Primary Light: `#FFB3D9`
- Primary Dark: `#E63980`
- Secondary: `#FFC2D1`
- Accent: `#FF9EBB`

### Design Principles
- iOS/HarmonyOS inspired
- Clean and minimalist
- Card-based layouts
- Smooth transitions
- Responsive grid system

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Helmet
- CORS
- dotenv

### Frontend
- React 18
- React Router 6
- Axios
- Context API
- Vite
- CSS3 (Custom styling)

## 📦 Deployment

### Backend Deployment (Render/Heroku)
1. Push code to GitHub
2. Create new web service
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Secure HTTP headers (Helmet)
- Environment variables for secrets
- CORS configuration

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

### Run Backend in Development
```bash
cd backend
npm run dev
```

### Run Frontend in Development
```bash
cd frontend
npm run dev
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### CORS Issues
- Backend currently runs on port 4000 (changed from 5000)
- Frontend runs on port 5173 or similar
- CORS is configured to allow all origins in development

### API Connection Issues
- Check `.env` file in frontend
- Verify backend is running
- Check browser console for errors

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding!** 🚀✨
