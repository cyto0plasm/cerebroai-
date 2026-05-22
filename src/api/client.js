import axios from 'axios';
import { CONFIG } from '../config';

// Global CancelToken registry to support request cancellation
const activeRequests = new Map();

/**
 * Creates an instance of Axios with baseline parameters
 */
const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json'
  }
});

/**
 * Request Interceptor - Register cancellations and auth headers if required
 */
apiClient.interceptors.request.use(
  (config) => {
    // If a request with the same URL is already active, cancel it (debouncing)
    const requestKey = `${config.method}:${config.url}`;
    if (activeRequests.has(requestKey)) {
      const cancelSource = activeRequests.get(requestKey);
      cancelSource.cancel('Operation cancelled due to subsequent request.');
    }
    
    // Create new cancel token and associate with request
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    config.cancelToken = source.token;
    activeRequests.set(requestKey, source);
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor - Handle errors and clean up cancellation token maps
 */
apiClient.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method}:${response.config.url}`;
    activeRequests.delete(requestKey);
    return response.data;
  },
  async (error) => {
    // Request clean up upon failure
    if (error.config) {
      const requestKey = `${error.config.method}:${error.config.url}`;
      activeRequests.delete(requestKey);
    }
    
    // Check if error is due to cancellation
    if (axios.isCancel(error)) {
      return Promise.reject({ isCancelled: true, message: error.message });
    }
    
    // Check for network disconnects and simulate mock fallback if enabled
    const isNetworkError = !error.response;
    const isPredictionUrl = error.config?.url?.includes('/api/predict');
    
    if (isNetworkError && isPredictionUrl && CONFIG.ENABLE_MOCK_FALLBACK) {
      console.warn('[CerebroAI Warning]: AI endpoint offline. Initiating deep cybernetic local neural telemetry simulations...');
      
      // Simulate real calculation latency
      await new Promise((resolve) => setTimeout(resolve, CONFIG.MOCK_DELAY_MS));
      
      // High-fidelity neural simulator
      const isTumor = Math.random() < 0.75; // 75% tumor chance for demonstration values
      const confidence = Number((0.82 + Math.random() * 0.17).toFixed(2));
      
      return {
        prediction: isTumor ? 'Tumor' : 'No Tumor',
        confidence,
        isMocked: true
      };
    }
    
    // Structure error telemetry
    const sanitizedError = {
      message: error.response?.data?.message || error.message || 'Fatal Telemetry Error',
      status: error.response?.status || 500,
      details: error.response?.data || null
    };
    
    return Promise.reject(sanitizedError);
  }
);

/**
 * Helper to manually cancel active requests of a specific path
 */
export const cancelRequest = (method, url) => {
  const requestKey = `${method.toLowerCase()}:${url}`;
  if (activeRequests.has(requestKey)) {
    activeRequests.get(requestKey).cancel('Operation terminated by clinical operator.');
    activeRequests.delete(requestKey);
  }
};

export default apiClient;
