/**
 * Application Configuration
 *
 * VITE_API_BASE_URL is baked in at build time (Vercel: set under Environment Variables, then redeploy).
 * If missing on production, DEFAULT_PRODUCTION_API is used so the live site never calls localhost.
 */
const DEFAULT_PRODUCTION_API = 'https://cyto0plasm-cerebroai-backend.hf.space';

function resolveApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();

  if (fromEnv && !fromEnv.includes('YOUR-HF') && !fromEnv.includes('YOUR_USERNAME')) {
    return fromEnv.replace(/\/$/, '');
  }

  if (import.meta.env.PROD) {
    return DEFAULT_PRODUCTION_API;
  }

  return 'http://localhost:8000';
}

export const CONFIG = {
  API_BASE_URL: resolveApiBaseUrl(),

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
