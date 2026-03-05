import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Token ekleme
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile')
};

// Books API
export const booksAPI = {
  getBooks: (query) => api.get('/books', { params: query }),
  getBook: (id) => api.get(`/books/${id}`),
  uploadBook: (formData) =>
    api.post('/books/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`)
};

// Reading API
export const readingAPI = {
  getProgress: (bookId) => api.get(`/reading/${bookId}/progress`),
  updateProgress: (bookId, data) =>
    api.put(`/reading/${bookId}/progress`, data),
  addBookmark: (bookId, data) =>
    api.post(`/reading/${bookId}/bookmarks`, data),
  removeBookmark: (bookId, bookmarkId) =>
    api.delete(`/reading/${bookId}/bookmarks/${bookmarkId}`),
  getStatistics: () => api.get('/reading/stats/all')
};

export default api;
