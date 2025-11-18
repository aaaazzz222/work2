# Portfolio & Blog API

A RESTful API for managing portfolio projects, blog posts, and contact messages.

## Features

- User authentication with JWT
- Project management (CRUD)
- Blog posts with comments
- Contact form
- Secure password hashing with bcrypt
- MongoDB database with Mongoose

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Projects (Portfolio)
- `GET /api/projects` - Get all projects (Public)
- `GET /api/projects/:id` - Get single project (Public)
- `POST /api/projects` - Create project (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Blog Posts
- `GET /api/blog` - Get all blog posts (Public)
- `GET /api/blog/:id` - Get single blog post with comments (Public)
- `POST /api/blog` - Create blog post (Protected)
- `PUT /api/blog/:id` - Update blog post (Protected, Author only)
- `DELETE /api/blog/:id` - Delete blog post (Protected, Author only)

### Comments
- `GET /api/blog/:postId/comments` - Get comments for a post (Public)
- `POST /api/blog/:postId/comments` - Create comment (Protected)

### Contact
- `POST /api/contact` - Submit contact form (Public)
- `GET /api/contact` - Get all messages (Protected)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio_blog
JWT_SECRET=your_secret_key
NODE_ENV=development
```

3. Start MongoDB locally

4. Run the server:
```bash
npm run dev
```

## Protected Routes

Protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```
