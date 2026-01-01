// App configuration
export const Config = {
  // Set to true to use mock data, false to use real API
  USE_MOCK_DATA: true,
  
  // API URL (used when USE_MOCK_DATA is false)
  API_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
  
  // Mock API delay (ms) - simulates network latency
  MOCK_API_DELAY: 500,
};

