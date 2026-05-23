import { CONFIG } from '../config';

export function getFileExtension(name) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

export function isDicomFile(file) {
  const ext = getFileExtension(file.name);
  return CONFIG.DICOM_EXTENSIONS.includes(ext) || file.type === 'application/dicom';
}

export function validateFileMeta(file) {
  if (!file) return { ok: false, error: 'No file selected.' };

  const ext = getFileExtension(file.name);
  const isDicom = isDicomFile(file);
  const mimeOk = CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type) || isDicom;
  const extOk = CONFIG.ALLOWED_EXTENSIONS.includes(ext);

  if (!mimeOk && !extOk) {
    return {
      ok: false,
      error: `Unsupported format. Use ${CONFIG.ALLOWED_EXTENSIONS.filter(e => !CONFIG.DICOM_EXTENSIONS.includes(e)).join(', ')} or DICOM (.dcm).`,
    };
  }

  if (file.size > CONFIG.MAX_FILE_SIZE_BYTES) {
    const mb = (CONFIG.MAX_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0);
    return { ok: false, error: `File exceeds ${mb} MB limit.` };
  }

  if (file.size < 1024) {
    return { ok: false, error: 'File is too small to be a valid MRI slice.' };
  }

  return { ok: true };
}

export function validateImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      if (width < CONFIG.MIN_IMAGE_DIMENSION || height < CONFIG.MIN_IMAGE_DIMENSION) {
        resolve({
          ok: false,
          error: `Image too small (${width}×${height}). Minimum ${CONFIG.MIN_IMAGE_DIMENSION}px per side.`,
        });
        return;
      }
      if (width > CONFIG.MAX_IMAGE_DIMENSION || height > CONFIG.MAX_IMAGE_DIMENSION) {
        resolve({
          ok: false,
          error: `Image too large (${width}×${height}). Maximum ${CONFIG.MAX_IMAGE_DIMENSION}px per side.`,
        });
        return;
      }
      const ratio = Math.max(width, height) / Math.min(width, height);
      if (ratio > CONFIG.MAX_ASPECT_RATIO) {
        resolve({
          ok: true,
          warning: true,
          width,
          height,
          error: `Unusual aspect ratio (${width}×${height}). Confirm this is an axial MRI slice.`,
        });
        return;
      }
      resolve({ ok: true, width, height });
    };
    img.onerror = () => resolve({ ok: false, error: 'Could not decode image. File may be corrupt.' });
    img.src = dataUrl;
  });
}
