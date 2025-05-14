import axios from 'axios';

// Try different API URLs in case of connectivity issues
const tryAPIUrls = [
  'http://localhost:4001/api',
  'http://localhost:8888/api', // Proxy server
  'http://127.0.0.1:4001/api',  // Try localhost IP alias
];

// Log the API URLs we're going to try
console.log('Available API URLs to try:', tryAPIUrls);

// Will be set to the first working URL
let workingApiUrl = tryAPIUrls[0];

// Test different URLs in sequence
const testApiConnectivity = async () => {
  for (const url of tryAPIUrls) {
    try {
      console.log(`Testing API URL: ${url}`);
      const response = await fetch(`${url}/test/ping`);
      
      if (response.ok) {
        console.log(`🎉 Success with API URL: ${url}`);
        workingApiUrl = url;
        return url;
      }
    } catch (err) {
      console.log(`❌ Failed with API URL: ${url}`);
    }
  }
  
  console.error('⚠️ All API URLs failed');
  return null;
};

// Try to connect to different URLs
testApiConnectivity().then(url => {
  if (url) {
    console.log(`Using API URL: ${url}`);
  }
});

// Create axios instance with default config
const api = axios.create({
  baseURL: workingApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // Set longer timeout for debugging
  timeout: 10000,
});

// Request interceptor for adding auth token and logging
api.interceptors.request.use(
  (config) => {
    // Update baseURL to the working one
    config.baseURL = workingApiUrl;
    
    console.log(`📤 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`, config.params || {});
    
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 