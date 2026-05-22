/**
 * Application Constants and Enums
 */

export const PREDICTION_STATUS = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  UPLOADING: 'uploading',
  SCANNING: 'scanning', // AI telemetry scanning phase
  SUCCESS: 'success',
  ERROR: 'error'
};

export const TUMOR_CLASSES = {
  TUMOR: 'Tumor',
  NO_TUMOR: 'No Tumor'
};

export const MOCK_DIAGNOSTIC_REPORTS = {
  HIGH_CONFIDENCE_TUMOR: {
    severity: 'High Alert',
    recommendation: 'Immediate neurosurgical consultation recommended. Schedule high-resolution contrast-enhanced Brain MRI (T1w + Gadolinium) for precision staging and tumor volumetric mapping.',
    findings: 'Abnormal hyperintense region localized in the cerebral cortex. Secondary mass effect observed on the lateral ventricles. AI-computed morphology suggests glioma or meningioma pathogrouping.'
  },
  LOW_CONFIDENCE_TUMOR: {
    severity: 'Moderate Alert',
    recommendation: 'Schedule a secondary diagnostic run. Clinical evaluation recommended with focus on anatomical asymmetry in the temporal lobe. Consider MRS (Magnetic Resonance Spectroscopy).',
    findings: 'Subtle high-signal-intensity boundary noted in the parenchymal region. Minimal structural shift; boundary margins are diffuse. Telemetry confidence requires clinical correlation.'
  },
  NO_TUMOR: {
    severity: 'Normal Telemetry',
    recommendation: 'No action required under standard neuro-oncological criteria. Schedule regular periodic follow-ups for diagnostic profiling as clinically indicated.',
    findings: 'Parenchyma, cerebral hemispheres, and sulci are within normal anatomical parameters. Mass margins are flat and normal. Ventricles are symmetric, with no mass effect detected.'
  }
};

export const WORKFLOW_STEPS = [
  {
    phase: '01',
    title: 'Pre-Processing & Denoising',
    desc: 'The system strips non-brain skull pixels, normalizes slice intensity, and applies anisotropic diffusion filtering to eliminate radiofrequency noise.'
  },
  {
    phase: '02',
    title: 'Multi-Modal Segmentation',
    desc: 'Dense neural layers scan individual 2D MRI axial slices, executing pixel-by-pixel tissue classification across gray matter, white matter, and lesion structures.'
  },
  {
    phase: '03',
    title: 'Deep Feature Extraction',
    desc: 'Convolutional layers extract morphological, spatial, and textural vectors to differentiate benign masses from infiltrative malignant glioma boundaries.'
  },
  {
    phase: '04',
    title: 'Confidence Telemetry',
    desc: 'The classification engine processes vector layers via Softmax, producing a final tumor diagnosis and corresponding volumetric confidence parameters.'
  }
];

export const BENCHMARKS = [
  { metric: '98.4%', label: 'Classification Accuracy', subText: 'Validated on 10k+ verified MRIs' },
  { metric: '< 450ms', label: 'Average Telemetry Speed', subText: 'GPU-accelerated parallel processing' },
  { metric: '99.1%', label: 'Sensitivity / Recall', subText: 'Extremely low false negative threshold' },
  { metric: '42+', label: 'Hospital Clusters Synced', subText: 'Real-time telemetry networks active' }
];

export const CORE_FEATURES = [
  {
    id: 'deep-telemetry',
    title: 'Anatomical Segmentation',
    description: 'Automatic isolation of suspicious cellular structures utilizing high-density voxel layers for maximum spatial localization.'
  },
  {
    id: 'speed',
    title: 'GPU Parallel Scanning',
    description: 'Runs deep convolutional neural models in sub-second times, bypassing standard manual clinical triage queues.'
  },
  {
    id: 'history',
    title: 'Dynamic Scan Tracking',
    description: 'Keeps clinical records locally isolated, allowing instant historical telemetry analysis and side-by-side diagnostic comparison.'
  }
];
