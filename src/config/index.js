/**
 * Application Configuration
 */
export const CONFIG = {
  // Base URL of the AI API server
  // In production this is set via VITE_API_BASE_URL environment variable on Vercel
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',

  // Longer timeout to handle Hugging Face Space cold starts (~30s wake-up)
  API_TIMEOUT: 60000,

  // Mock results only when developing locally — never in production builds
  ENABLE_MOCK_FALLBACK: !import.meta.env.PROD,

  MOCK_DELAY_MS: 1800,

  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp'],

  APP_NAME: 'CerebroAI',
  VERSION: '1.2.0'
};
