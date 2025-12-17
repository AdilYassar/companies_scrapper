import axios from 'axios';

// Use proxy in development (package.json has proxy: http://localhost:3001)
// So /api/v1 will be proxied to http://localhost:3001/api/v1
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.REACT_APP_API_KEY || 'b93ddaf670fce54bca61037e49cffe546f33af159d4f34a948446603c4cfbd7a',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // API key is already added in default headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
