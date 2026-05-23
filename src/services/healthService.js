import axios from 'axios';
import { CONFIG } from '../config';

const PRODUCTION_API = 'https://cyto0plasm-cerebroai-backend.hf.space';

async function ping(baseUrl, timeoutMs = 12000) {
  const client = axios.create({ baseURL: baseUrl, timeout: timeoutMs });
  const { data } = await client.get('/');
  return {
    online: true,
    modelLoaded: Boolean(data.model_loaded),
    threshold: data.threshold ?? null,
    architecture: data.architecture ?? CONFIG.MODEL_DISPLAY.architecture,
    modelRepo: data.model_repo ?? null,
    loadError: data.load_error ?? null,
    status: data.status ?? 'ok',
    apiBase: baseUrl,
  };
}

export async function fetchBackendHealth() {
  const primary = CONFIG.API_BASE_URL;
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(primary);

  try {
    return await ping(primary, isLocal ? 4000 : 12000);
  } catch (primaryErr) {
    // Dev often has no local Python server — fall back to hosted API without treating it as fatal
    if (isLocal && import.meta.env.DEV) {
      try {
        return await ping(PRODUCTION_API, 15000);
      } catch {
        return offlineState(primaryErr.message || 'Analysis API unreachable');
      }
    }
    return offlineState(primaryErr.message || 'Analysis API unreachable');
  }
}

function offlineState(message) {
  return {
    online: false,
    modelLoaded: false,
    threshold: null,
    architecture: CONFIG.MODEL_DISPLAY.architecture,
    modelRepo: null,
    loadError: message,
    status: 'offline',
    apiBase: CONFIG.API_BASE_URL,
  };
}
