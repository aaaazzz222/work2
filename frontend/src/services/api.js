import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials)
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`)
};

// Blog API
export const blogAPI = {
  getAll: () => api.get('/blog'),
  getById: (id) => api.get(`/blog/${id}`),
  create: (postData) => api.post('/blog', postData),
  update: (id, postData) => api.put(`/blog/${id}`, postData),
  delete: (id) => api.delete(`/blog/${id}`)
};

// Comments API
export const commentsAPI = {
  getByPostId: (postId) => api.get(`/blog/${postId}/comments`),
  create: (postId, commentData) => api.post(`/blog/${postId}/comments`, commentData)
};

// Contact API
export const contactAPI = {
  submit: (messageData) => api.post('/contact', messageData),
  getAll: () => api.get('/contact')
};

export default api;
