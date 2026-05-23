export const PREDICTION_STATUS = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  UPLOADING: 'uploading',
  SCANNING: 'scanning',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const TUMOR_CLASSES = {
  TUMOR: 'Tumor',
  NO_TUMOR: 'No Tumor',
};

export const CLINICAL_REPORTS = {
  HIGH_CONFIDENCE_TUMOR: {
    severity: 'Elevated',
    recommendation:
      'Correlate with full MRI series and clinical history. Consider specialist review and contrast-enhanced imaging if indicated.',
    findings:
      'Hyperintense region identified in cortical tissue with features suggestive of a space-occupying process. Mass effect should be evaluated on additional sequences.',
  },
  LOW_CONFIDENCE_TUMOR: {
    severity: 'Review',
    recommendation:
      'Borderline screening result. Repeat slice selection or secondary review recommended before any clinical action.',
    findings:
      'Subtle signal alteration at the parenchymal margin. Findings are indeterminate at this confidence level.',
  },
  NO_TUMOR: {
    severity: 'Within screening limits',
    recommendation:
      'No screening flag on this slice. Continue standard care pathways as clinically appropriate.',
    findings:
      'No focal abnormality flagged on this axial slice. Ventricular symmetry appears preserved within model sensitivity.',
  },
};

export const WORKFLOW_STEPS = [
  { phase: '01', title: 'Prepare slice', desc: 'Select a single axial brain MRI slice. DICOM files are converted automatically.' },
  { phase: '02', title: 'Run screening', desc: 'ResNet18 classifier returns a binary screening label with confidence.' },
  { phase: '03', title: 'Review maps', desc: 'Grad-CAM highlights regions that influenced the model output on this slice.' },
  { phase: '04', title: 'Archive', desc: 'Signed-in users store results in a private workspace. Guests work in a temporary session.' },
];

export const CAPABILITIES = [
  { metric: '2D slice', label: 'Input format', subText: 'Axial MRI · JPEG · PNG · DICOM' },
  { metric: 'Grad-CAM', label: 'Visual review', subText: 'Region-level influence map' },
  { metric: 'Private', label: 'Member workspace', subText: 'Encrypted account storage' },
  { metric: 'Guest', label: 'Try without account', subText: 'Session-only · no cloud save' },
];

export const CORE_FEATURES = [
  {
    id: 'screening',
    title: 'Slice screening',
    description: 'Upload one axial slice and receive a structured screening result with confidence and summary text.',
  },
  {
    id: 'maps',
    title: 'Activation maps',
    description: 'Inspect original input, Grad-CAM overlay, and side-by-side comparison in a dedicated plot panel.',
  },
  {
    id: 'workspace',
    title: 'Personal workspace',
    description: 'Rename studies, compare past slices, and export reports when signed in. Guests use a temporary session.',
  },
];
