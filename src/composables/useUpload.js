import { ref } from 'vue';
import { normalizeUploadFile } from '../utils/dicomToImage';
import { validateFileMeta, validateImageDimensions } from '../utils/imageValidation';

export function useUpload() {
  const isDragging = ref(false);
  const uploadError = ref(null);
  const uploadWarning = ref(null);
  const selectedFile = ref(null);
  const selectedFiles = ref([]);
  const previewUrl = ref(null);
  const imageMeta = ref(null);
  const processing = ref(false);

  const readPreview = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });

  const processFile = async (file) => {
    uploadError.value = null;
    uploadWarning.value = null;
    processing.value = true;

    try {
      const meta = validateFileMeta(file);
      if (!meta.ok) {
        uploadError.value = meta.error;
        selectedFile.value = null;
        previewUrl.value = null;
        return null;
      }

      const normalized = await normalizeUploadFile(file);
      const dataUrl = await readPreview(normalized);
      const dim = await validateImageDimensions(dataUrl);

      if (!dim.ok) {
        uploadError.value = dim.error;
        selectedFile.value = null;
        previewUrl.value = null;
        return null;
      }

      if (dim.warning) {
        uploadWarning.value = dim.error;
      }

      selectedFile.value = normalized;
      previewUrl.value = dataUrl;
      imageMeta.value = { width: dim.width, height: dim.height };
      return normalized;
    } catch (err) {
      uploadError.value = err.message || 'Could not process file.';
      selectedFile.value = null;
      previewUrl.value = null;
      return null;
    } finally {
      processing.value = false;
    }
  };

  const processMultiple = async (fileList) => {
    uploadError.value = null;
    const files = Array.from(fileList).slice(0, 8);
    const results = [];

    for (const f of files) {
      const meta = validateFileMeta(f);
      if (!meta.ok) {
        uploadError.value = meta.error;
        return [];
      }
    }

    processing.value = true;
    try {
      for (const f of files) {
        const normalized = await normalizeUploadFile(f);
        const dataUrl = await readPreview(normalized);
        const dim = await validateImageDimensions(dataUrl);
        if (!dim.ok) {
          uploadError.value = `${f.name}: ${dim.error}`;
          return [];
        }
        results.push({ file: normalized, previewUrl: dataUrl, width: dim.width, height: dim.height });
      }
      selectedFiles.value = results;
      if (results[0]) {
        selectedFile.value = results[0].file;
        previewUrl.value = results[0].previewUrl;
        imageMeta.value = { width: results[0].width, height: results[0].height };
      }
      return results;
    } catch (err) {
      uploadError.value = err.message || 'Batch processing failed.';
      return [];
    } finally {
      processing.value = false;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    isDragging.value = true;
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    isDragging.value = false;
  };

  const handleDrop = async (e, multiple = false) => {
    e.preventDefault();
    isDragging.value = false;
    const files = e.dataTransfer?.files;
    if (!files?.length) return;
    if (multiple && files.length > 1) {
      await processMultiple(files);
    } else {
      await processFile(files[0]);
    }
  };

  const handleFileChange = async (e, multiple = false) => {
    const files = e.target.files;
    if (!files?.length) return;
    if (multiple && files.length > 1) {
      await processMultiple(files);
    } else {
      await processFile(files[0]);
    }
    e.target.value = '';
  };

  const clearSelection = () => {
    selectedFile.value = null;
    selectedFiles.value = [];
    previewUrl.value = null;
    uploadError.value = null;
    uploadWarning.value = null;
    imageMeta.value = null;
  };

  return {
    isDragging,
    uploadError,
    uploadWarning,
    selectedFile,
    selectedFiles,
    previewUrl,
    imageMeta,
    processing,
    processFile,
    processMultiple,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    clearSelection,
  };
}
