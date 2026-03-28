import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

console.log('API Base URL:', BASE_URL);

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      });
    }
    return Promise.reject({
      message: error.response?.data?.message || 'Something went wrong.',
      status: error.response?.status,
    });
  },
);

export default apiClient;
