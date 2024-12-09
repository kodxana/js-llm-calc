interface QuantizationSizes {
  [key: string]: {
    bytes: number,
    storage: number
  };
}

const QUANT_SIZES: QuantizationSizes = {
  'FP32 (32-bit floating point)': { bytes: 4, storage: 8.0 },
  'FP16 (16-bit floating point)': { bytes: 2, storage: 4.0 },
  'FP8 (8-bit floating point)': { bytes: 1, storage: 2.0 },
  'INT4 (4-bit integer)': { bytes: 0.5, storage: 1.0 }
}

export function calculateVramRequirement(
  modelSize: string | number,
  quantType: string,
  contextLength: number,
  batchSize: number,
  numLayers: number,
  hiddenSize: number,
  mode: string,
  efficientAttention: boolean
): number {
  // Handle unknown model size
  if (modelSize === 'Unknown') return 0;

  // Convert inputs to proper types
  try {
    const modelSizeBillion = typeof modelSize === 'string' ? parseFloat(modelSize) : modelSize;
    contextLength = Number(contextLength);
    batchSize = Number(batchSize);
    numLayers = Number(numLayers);
    hiddenSize = Number(hiddenSize);

    // Get bytes per parameter, default to FP16 if unknown
    const bytesPerUnit = QUANT_SIZES[quantType]?.bytes ?? 2;

    // Calculate total parameters and base memory
    const totalParameters = modelSizeBillion * 1e9;
    const paramsMemoryGb = (totalParameters * bytesPerUnit) / 1e9;

    // Calculate attention-related memory
    const headDim = 64;
    const numHeads = hiddenSize / headDim;

    const qkvMemory = 3 * batchSize * contextLength * hiddenSize * bytesPerUnit / 1e9;
    const outputMemory = batchSize * contextLength * hiddenSize * bytesPerUnit / 1e9;

    let attnScoresMemory = 0;
    if (!efficientAttention) {
      attnScoresMemory = batchSize * numHeads * (contextLength ** 2) * bytesPerUnit / 1e9;
    }

    const activationMemoryPerLayer = qkvMemory + attnScoresMemory + outputMemory;

    let totalVramGb: number;
    if (mode === 'Training') {
      const totalActivationMemory = activationMemoryPerLayer * numLayers;
      totalVramGb = (paramsMemoryGb * 2) + totalActivationMemory;
    } else {
      const totalActivationMemory = activationMemoryPerLayer;
      totalVramGb = paramsMemoryGb + totalActivationMemory;
    }

    return Math.round(totalVramGb * 100) / 100;
  } catch (error) {
    throw new Error("Invalid input parameters");
  }
}

export function calculateStorageRequirement(
  modelSize: string | number,
  quantType: string,
  contextLength: number
): number {
  const modelSizeBillion = typeof modelSize === 'string' ? parseFloat(modelSize) : modelSize;
  
  // Get storage per billion parameters, default to FP32 if unknown
  const storagePerBillionParams = QUANT_SIZES[quantType]?.storage ?? 8.0;

  const modelStorageGb = modelSizeBillion * storagePerBillionParams;
  const operationalOverheadGb = contextLength * 0.001;
  const additionalStorageGb = 100;

  return Math.round((modelStorageGb + operationalOverheadGb + additionalStorageGb) * 100) / 100;
}

export function suggestGpu(totalMemoryGb: number) {
  const gpus = [
    { name: 'NVIDIA H100', memory: 80, maxGpus: 8 },
    { name: 'NVIDIA A100', memory: 80, maxGpus: 8 },
    { name: 'NVIDIA A6000', memory: 48, maxGpus: 10 },
    { name: 'NVIDIA A40', memory: 48, maxGpus: 10 },
    { name: 'NVIDIA L40', memory: 48, maxGpus: 8 },
    { name: 'NVIDIA RTX 4090', memory: 24, maxGpus: 8 },
    { name: 'NVIDIA RTX 3090', memory: 24, maxGpus: 8 },
    { name: 'NVIDIA L4', memory: 24, maxGpus: 8 },
    { name: 'NVIDIA RTX 4000', memory: 16, maxGpus: 8 },
  ];

  // Group GPUs by memory size
  const groupedGpus = new Map<number, typeof gpus>();
  gpus.forEach(gpu => {
    if (!groupedGpus.has(gpu.memory)) {
      groupedGpus.set(gpu.memory, []);
    }
    groupedGpus.get(gpu.memory)?.push(gpu);
  });

  const possibleSetups = [];
  const memorySizes = Array.from(groupedGpus.keys()).sort((a, b) => b - a);

  for (const memSize of memorySizes) {
    const gpuList = groupedGpus.get(memSize) || [];
    const maxGpus = Math.max(...gpuList.map(gpu => gpu.maxGpus));

    for (let numGpus = 1; numGpus <= maxGpus; numGpus++) {
      const totalGpuMemory = memSize * numGpus;
      if (totalGpuMemory >= totalMemoryGb) {
        const compatibleGpus = gpuList
          .filter(gpu => numGpus <= gpu.maxGpus)
          .map(gpu => gpu.name);

        if (compatibleGpus.length > 0) {
          possibleSetups.push({
            category: `${numGpus} x ${memSize}GB GPUs`,
            options: compatibleGpus.map(name => ({
              name,
              vram: memSize.toString(),
              count: numGpus,
              // Add your price info here
            }))
          });
          break;
        }
      }
    }
  }

  return possibleSetups;
} 