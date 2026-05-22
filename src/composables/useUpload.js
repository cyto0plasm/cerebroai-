import { ref } from 'vue';
import { CONFIG } from '../config';

/**
 * Reusable Drag and Drop & Image Upload validation composable
 * @returns {object}
 */
export function useUpload() {
  const isDragging = ref(false);
  const uploadError = ref(null);
  const selectedFile = ref(null);
  const previewUrl = ref(null);
  
  // Drag over boundary
  const handleDragOver = (e) => {
    e.preventDefault();
    isDragging.value = true;
  };
  
  // Leave drag boundary
  const handleDragLeave = (e) => {
    e.preventDefault();
    isDragging.value = false;
  };
  
  // Validate standard file specifications
  const validateFile = (file) => {
    uploadError.value = null;
    
    // File missing
    if (!file) {
      uploadError.value = 'No file registered.';
      return false;
    }
    
    // Validate format
    if (!CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      uploadError.value = `Unsupported file format. Please upload standard axial slices (${CONFIG.ALLOWED_IMAGE_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')}).`;
      return false;
    }
    
    // Validate volume constraints
    if (file.size > CONFIG.MAX_FILE_SIZE_BYTES) {
      const sizeMB = (CONFIG.MAX_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0);
      uploadError.value = `MRI slice exceeds clinical payload limit (${sizeMB}MB).`;
      return false;
    }
    
    return true;
  };
  
  // Register file and produce high-resolution local base64 preview URL
  const processFile = (file) => {
    if (!validateFile(file)) {
      selectedFile.value = null;
      previewUrl.value = null;
      return null;
    }
    
    selectedFile.value = file;
    
    // Convert to Base64 to prevent revocation issues and support localStorage persistence
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
    
    return file;
  };
  
  // Drop event handler
  const handleDrop = (e) => {
    e.preventDefault();
    isDragging.value = false;
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  // Standard file browser picker selection handler
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  // Reset all local file states
  const clearSelection = () => {
    selectedFile.value = null;
    previewUrl.value = null;
    uploadError.value = null;
  };
  
  return {
    isDragging,
    uploadError,
    selectedFile,
    previewUrl,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    clearSelection
  };
}
