import axios from 'axios';
import { CONFIG } from '../config';

let healthClient = null;

function getClient() {
  if (!healthClient) {
    healthClient = axios.create({
      baseURL: CONFIG.API_BASE_URL,
      timeout: 15000,
    });
  }
  return healthClient;
}

export async function fetchBackendHealth() {
  try {
    const { data } = await getClient().get('/');
    return {
      online: true,
      modelLoaded: Boolean(data.model_loaded),
      threshold: data.threshold ?? null,
      architecture: data.architecture ?? CONFIG.MODEL_DISPLAY.architecture,
      modelRepo: data.model_repo ?? null,
      loadError: data.load_error ?? null,
      status: data.status ?? 'ok',
    };
  } catch (err) {
    return {
      online: false,
      modelLoaded: false,
      threshold: null,
      architecture: CONFIG.MODEL_DISPLAY.architecture,
      modelRepo: null,
      loadError: err.message || 'Unreachable',
      status: 'offline',
    };
  }
}
