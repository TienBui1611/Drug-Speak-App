import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Development mode - set to true when using tunnel mode to disable API calls
const DEVELOPMENT_MODE = false;

// Base URL for the Drug-Speak server
// const BASE_URL = 'http://192.168.2.146:3000'; // Updated to use host machine IP for Android devices

// For Expo Go, use your laptop's IP with backend server port (3000, not 8081)
const BASE_URL = 'http://192.168.2.146:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock responses for development mode
const createMockResponse = (data) => ({ data });

// Token management
const TOKEN_KEY = 'auth_token';

export const setAuthToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    if (!DEVELOPMENT_MODE) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

export const getAuthToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

export const removeAuthToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    if (!DEVELOPMENT_MODE) {
      delete api.defaults.headers.common['Authorization'];
    }
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

// Initialize auth token on app start
export const initializeAuth = async () => {
  try {
    const token = await getAuthToken();
    if (token && !DEVELOPMENT_MODE) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
};

// Auth API endpoints
export const authAPI = {
  // Create new user and login
  signUp: async (userData) => {
    if (DEVELOPMENT_MODE) {
      console.log('Mock Sign Up:', userData);
      return createMockResponse({
        user: {
          id: 'mock-user-id',
          username: userData.username,
          email: userData.email,
          gender: userData.gender,
        },
        token: 'mock-jwt-token'
      });
    }
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Login user
  signIn: async (credentials) => {
    if (DEVELOPMENT_MODE) {
      console.log('Mock Sign In:', credentials);
      return createMockResponse({
        user: {
          id: 'mock-user-id',
          username: 'Test User',
          email: credentials.email,
          gender: 'male',
        },
        token: 'mock-jwt-token'
      });
    }
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Update user profile
  updateProfile: async (updateData) => {
    if (DEVELOPMENT_MODE) {
      console.log('Mock Profile Update:', updateData);
      return createMockResponse({
        id: 'mock-user-id',
        username: updateData.username || 'Test User',
        email: 'test@example.com',
        gender: 'male',
      });
    }
    const response = await api.patch('/users/update', updateData);
    return response.data;
  },
};

// Study Records API endpoints
export const studyRecordsAPI = {
  // Update user's study record
  updateStudyRecord: async (recordData) => {
    if (DEVELOPMENT_MODE) {
      console.log('Mock Study Record Update:', recordData);
      return createMockResponse({
        userId: 'mock-user-id',
        ...recordData
      });
    }
    const response = await api.post('/study-record', recordData);
    return response.data;
  },

  // Get all users study records (for community/leaderboard)
  getAllStudyRecords: async () => {
    if (DEVELOPMENT_MODE) {
      console.log('Mock Get All Study Records');
      return createMockResponse([
        {
          userId: 'mock-user-id',
          currentLearning: 3,
          finishedLearning: 2,
          totalScore: 150,
          user: {
            id: 'mock-user-id',
            username: 'Test User',
            email: 'test@example.com',
            gender: 'male'
          }
        },
        {
          userId: 'other-user-id',
          currentLearning: 1,
          finishedLearning: 5,
          totalScore: 200,
          user: {
            id: 'other-user-id',
            username: 'Other User',
            email: 'other@example.com',
            gender: 'female'
          }
        }
      ]);
    }
    const response = await api.get('/study-record');
    return response.data;
  },

  // Get specific user's study record
  getUserStudyRecord: async (userId) => {
    if (DEVELOPMENT_MODE) {
      console.log('Mock Get User Study Record:', userId);
      return createMockResponse({
        userId: userId,
        currentLearning: 3,
        finishedLearning: 2,
        totalScore: 150,
        user: {
          id: userId,
          username: 'Test User',
          email: 'test@example.com',
          gender: 'male'
        }
      });
    }
    const response = await api.get(`/study-record/${userId}`);
    return response.data;
  },
};

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (!DEVELOPMENT_MODE) {
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!DEVELOPMENT_MODE && error.response?.status === 401) {
      // Token expired or invalid
      await removeAuthToken();
      // You might want to redirect to login screen here
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api; 