import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});
const apiV2 = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_2,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Request interceptor for adding auth token
const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0Iiwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJuYW1lIjoidGVzdDQiLCJvcmdJZCI6MTUyLCJpYXQiOjE3NTA5Mjg0MzIsImV4cCI6MTc1MzUyMDQzMn0.tJbZIt2hohPv9joNTk9BssTCXtqF3f8TYFY2tSBQPuFzWqMs3fTZkLIwVsd5qmYI-zc-QJ7pygtXRsdAW3j1rw"
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
apiV2.interceptors.request.use(
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

export { apiV2 };
export default api;
