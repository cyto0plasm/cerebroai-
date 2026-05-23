import dicomParser from 'dicom-parser';
import { isDicomFile } from './imageValidation';

/**
 * Convert a DICOM file to a PNG File for API upload and preview.
 */
export async function dicomFileToPng(file) {
  const buffer = await file.arrayBuffer();
  const byteArray = new Uint8Array(buffer);
  let dataSet;

  try {
    dataSet = dicomParser.parseDicom(byteArray);
  } catch {
    throw new Error('Invalid DICOM file. Could not parse dataset.');
  }

  const rows = dataSet.uint16('x00280010');
  const cols = dataSet.uint16('x00280011');
  const bitsAllocated = dataSet.uint16('x00280100') || 16;
  const pixelRep = dataSet.uint16('x00280103') || 0;
  const slope = parseFloat(dataSet.string('x00281053') || '1') || 1;
  const intercept = parseFloat(dataSet.string('x00281052') || '0') || 0;

  const pixelElement = dataSet.elements.x7fe00010;
  if (!pixelElement || !rows || !cols) {
    throw new Error('DICOM has no readable pixel data (missing Pixel Data tag).');
  }

  const pixelBytes = new Uint8Array(
    byteArray.buffer,
    pixelElement.dataOffset,
    pixelElement.length
  );

  let samples;
  if (bitsAllocated === 8) {
    samples = pixelBytes;
  } else {
    samples = new Uint16Array(pixelBytes.buffer, pixelBytes.byteOffset, pixelBytes.byteLength / 2);
  }

  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(cols, rows);

  let min = Infinity;
  let max = -Infinity;
  const floats = new Float32Array(rows * cols);

  for (let i = 0; i < rows * cols; i++) {
    let v = samples[i];
    if (bitsAllocated > 8 && pixelRep === 1 && v > 32767) v -= 65536;
    v = v * slope + intercept;
    floats[i] = v;
    if (v < min) min = v;
    if (v > max) max = v;
  }

  const range = max - min || 1;
  for (let i = 0; i < rows * cols; i++) {
    const gray = Math.round(((floats[i] - min) / range) * 255);
    const o = i * 4;
    imageData.data[o] = gray;
    imageData.data[o + 1] = gray;
    imageData.data[o + 2] = gray;
    imageData.data[o + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('DICOM conversion failed'))), 'image/png');
  });

  const baseName = file.name.replace(/\.(dcm|dicom)$/i, '') || 'dicom_slice';
  return new File([blob], `${baseName}.png`, { type: 'image/png' });
}

export async function normalizeUploadFile(file) {
  if (isDicomFile(file)) {
    return dicomFileToPng(file);
  }
  return file;
}
