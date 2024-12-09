export const GPU_ID_MAPPING = {
  // 80GB+ GPUs
  'NVIDIA H100 PCIe': 'NVIDIA H100 PCIe',
  'NVIDIA H100 SXM': 'NVIDIA H100 80GB HBM3',
  'NVIDIA A100 PCIe': 'NVIDIA A100 80GB PCIe',
  'NVIDIA A100 SXM': 'NVIDIA A100-SXM4-80GB',
  'NVIDIA H100 NVL': 'NVIDIA H100 NVL',
  
  // 48GB GPUs
  'NVIDIA RTX 6000 Ada': 'NVIDIA RTX 6000 Ada Generation',
  'NVIDIA RTX A6000': 'NVIDIA RTX A6000',
  'NVIDIA L40': 'NVIDIA L40',
  'NVIDIA L40S': 'NVIDIA L40S',
  'NVIDIA A40': 'NVIDIA A40',
  
  // 24GB GPUs
  'NVIDIA RTX 4090': 'NVIDIA GeForce RTX 4090',
  'NVIDIA RTX A5000': 'NVIDIA RTX A5000',
  'NVIDIA L4': 'NVIDIA L4',
  'NVIDIA A30': 'NVIDIA A30',
} as const;

export const DEFAULT_CONTEXT_LENGTH = 2048;
export const DEFAULT_BATCH_SIZE = 1;
export const DEFAULT_NUM_LAYERS = 32;
export const DEFAULT_HIDDEN_SIZE = 4096;

export const GPU_MAPPING = {
  'NVIDIA H100 PCIe': {
    name: 'NVIDIA H100 PCIe',
    vram: '80',
    hourly_price: 32.77,
    weekly_price: 'N/A',
    monthly_price: 'N/A'
  },
  'NVIDIA A100 PCIe': {
    name: 'NVIDIA A100 PCIe',
    vram: '80',
    hourly_price: 16.38,
    weekly_price: 13.11,
    monthly_price: 11.47
  },
  // Add other GPU mappings...
} as const;

export const QUANT_SIZES = {
  'FP16 (16-bit floating point)': 2,
  'INT8 (8-bit integer)': 1,
  'INT4 (4-bit integer)': 0.5,
} as const; 