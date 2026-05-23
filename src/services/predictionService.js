import apiClient, { cancelRequest } from '../api/client';

/**
 * Prediction Service Layer
 * Abstracts API interaction details away from component state
 */
export const predictionService = {
  /**
   * Submits an MRI slice to the screening API
   * @param {File} file - The validated MRI image file
   * @returns {Promise<{ prediction: string, confidence: number }>}
   */
  async predict(file) {
    const formData = new FormData();
    // Standard key 'image' for multi-part file uploads
    formData.append('image', file);
    
    return apiClient.post('/api/predict', formData);
  },
  
  /**
   * Aborts any ongoing prediction calculation request
   */
  cancelPredict() {
    cancelRequest('post', '/api/predict');
  }
};
