import { ref } from 'vue';

/**
 * Reusable API State Management Composable
 * @param {Function} apiCallFn - The service layer promise function
 * @returns {object}
 */
export function useApi(apiCallFn) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const progress = ref(0);
  
  const execute = async (...args) => {
    loading.value = true;
    error.value = null;
    progress.value = 0;
    
    // Simulate fake progress updates for medical UI scanning visuals
    const progressInterval = setInterval(() => {
      if (progress.value < 85) {
        progress.value += Math.floor(Math.random() * 15) + 5;
      }
    }, 150);

    try {
      const response = await apiCallFn(...args);
      clearInterval(progressInterval);
      progress.value = 100;
      data.value = response;
      return response;
    } catch (err) {
      clearInterval(progressInterval);
      progress.value = 0;
      
      // Ignore cancellations as they are user-triggered
      if (err?.isCancelled) {
        console.log('[useApi]: Operation cancelled by clinical operator.');
        return null;
      }
      
      error.value = err?.message || 'A critical telemetry error occurred during deep scanning.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    error,
    loading,
    progress,
    execute
  };
}
