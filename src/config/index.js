const DEFAULT_PRODUCTION_API = 'https://cyto0plasm-cerebroai-backend.hf.space';

function resolveApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();
  if (fromEnv && !fromEnv.includes('YOUR-HF') && !fromEnv.includes('YOUR_USERNAME')) {
    return fromEnv.replace(/\/$/, '');
  }
  if (import.meta.env.PROD) return DEFAULT_PRODUCTION_API;
  return 'http://localhost:8000';
}

export const CONFIG = {
  API_BASE_URL: resolveApiBaseUrl(),
  API_TIMEOUT: 60000,
  ENABLE_OFFLINE_FALLBACK: false,

  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  MIN_IMAGE_DIMENSION: 128,
  MAX_IMAGE_DIMENSION: 8192,
  MAX_ASPECT_RATIO: 4,

  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.bmp', '.dcm', '.dicom'],
  DICOM_EXTENSIONS: ['.dcm', '.dicom'],

  MODEL_DISPLAY: {
    architecture: 'ResNet18',
    inputSize: '224×224',
    version: '2.0.0',
  },

  APP_NAME: 'AxialMRI',
  APP_TAGLINE: 'Axial slice screening workspace',
  VERSION: '2.0.0',
};
