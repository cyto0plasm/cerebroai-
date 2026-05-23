import axios from 'axios';
import { CONFIG } from '../config';

const activeRequests = new Map();

const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const requestKey = `${config.method}:${config.url}`;
    if (activeRequests.has(requestKey)) {
      activeRequests.get(requestKey).cancel('Superseded by a newer request.');
    }
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    config.cancelToken = source.token;
    activeRequests.set(requestKey, source);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method}:${response.config.url}`;
    activeRequests.delete(requestKey);
    return response.data;
  },
  async (error) => {
    if (error.config) {
      const requestKey = `${error.config.method}:${error.config.url}`;
      activeRequests.delete(requestKey);
    }

    if (axios.isCancel(error)) {
      return Promise.reject({ isCancelled: true, message: error.message });
    }

    const sanitizedError = {
      message:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Analysis service unavailable.',
      status: error.response?.status || 500,
      details: error.response?.data || null,
    };

    return Promise.reject(sanitizedError);
  }
);

export const cancelRequest = (method, url) => {
  const requestKey = `${method.toLowerCase()}:${url}`;
  if (activeRequests.has(requestKey)) {
    activeRequests.get(requestKey).cancel('Request cancelled.');
    activeRequests.delete(requestKey);
  }
};

export default apiClient;
