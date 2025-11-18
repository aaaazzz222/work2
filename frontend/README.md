# Portfolio & Blog Frontend

A modern, responsive React application for managing your portfolio and blog.

## Features

- **Beautiful Pink Theme** - iOS/HarmonyOS inspired design
- **Responsive Design** - Works on all devices
- **Authentication** - Secure login and registration
- **Admin Dashboard** - Manage projects and blog posts
- **Blog with Comments** - Full-featured blog system
- **Contact Form** - Easy communication
- **Protected Routes** - Secure admin access

## Pages

### Public Pages
- `/` - Home page with introduction
- `/projects` - Portfolio projects gallery
- `/blog` - Blog posts list
- `/blog/:id` - Individual blog post with comments
- `/contact` - Contact form
- `/login` - User login
- `/register` - User registration

### Protected Pages
- `/admin` - Admin dashboard for managing content (requires authentication)

## Tech Stack

- React 18
- React Router 6
- Axios for API calls
- Context API for state management
- Vite for fast development

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── Projects.jsx
│   ├── Blog.jsx
│   ├── BlogPost.jsx
│   ├── Contact.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── AdminDashboard.jsx
├── context/         # Context providers
│   └── AuthContext.jsx
├── services/        # API services
│   └── api.js
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Backend Connection

This frontend connects to the Portfolio & Blog API. Make sure the backend is running on `http://localhost:5000` before starting the frontend.

## Design

The application features a pink color scheme inspired by iOS and HarmonyOS design principles:
- Clean, minimalist interface
- Smooth animations and transitions
- Card-based layouts
- Responsive grid systems
- Modern typography

## Authentication

Users must be authenticated to:
- Access the admin dashboard
- Create/edit/delete projects
- Create/edit/delete blog posts
- Post comments on blog posts

Public users can:
- View all projects
- Read all blog posts
- Submit contact form messages
