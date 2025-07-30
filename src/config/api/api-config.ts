import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZXhwIjoxNzU0MDE3Mjc3LCJpYXQiOjE3NTM4MDEyNzd9.3i1HOvaevUJ0lAGNNCoLnwKF4zGOhUy00LCbTwmN7HM"
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling responses
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle errors globally
//     return Promise.reject(error);
//   }
// );

export default api;
