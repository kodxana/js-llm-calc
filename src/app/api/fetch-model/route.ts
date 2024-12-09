import { NextResponse } from 'next/server'

interface ModelConfig {
  architectures?: string[]
  model_type?: string
  num_parameters?: number
  hidden_size?: number
  n_layer?: number
  n_positions?: number
  quantization_config?: {
    bits: number
    quant_method: string
  }
}

async function fetchModelConfig(modelUrl: string): Promise<ModelConfig> {
  const possiblePaths = [
    '/raw/main/config.json',
    '/resolve/main/config.json',
    '/raw/main/model.safetensors.index.json',
    '/resolve/main/model.safetensors.index.json'
  ];

  let lastError;
  for (const path of possiblePaths) {
    try {
      const url = `https://huggingface.co/${modelUrl}${path}`;
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Failed to fetch model config');
}

function determineQuantType(config: ModelConfig): string {
  if (config.quantization_config) {
    const bits = config.quantization_config.bits;
    if (bits === 4) return 'INT4 (4-bit integer)';
    if (bits === 8) return 'INT8 (8-bit integer)';
  }

  const modelType = config.model_type?.toLowerCase() || '';
  if (modelType.includes('int8') || modelType.includes('8bit')) {
    return 'INT8 (8-bit integer)';
  }
  if (modelType.includes('int4') || modelType.includes('4bit')) {
    return 'INT4 (4-bit integer)';
  }

  if (config.architectures?.some(arch => 
    arch.toLowerCase().includes('int8') || 
    arch.toLowerCase().includes('8bit')
  )) {
    return 'INT8 (8-bit integer)';
  }
  if (config.architectures?.some(arch => 
    arch.toLowerCase().includes('int4') || 
    arch.toLowerCase().includes('4bit')
  )) {
    return 'INT4 (4-bit integer)';
  }

  return 'FP16 (16-bit floating point)';
}

function calculateParamsSize(config: ModelConfig, modelUrl: string): number | null {
  if (config.num_parameters) {
    return Math.round((config.num_parameters / 1e9) * 100) / 100;
  }

  if (config.hidden_size && config.n_layer) {
    const hiddenSize = config.hidden_size;
    const numLayers = config.n_layer;
    const vocabSize = 32000;
    const seqLength = config.n_positions || 2048;

    const paramCount = (
      12 * hiddenSize * hiddenSize * numLayers +
      2 * hiddenSize * vocabSize +
      hiddenSize * seqLength
    );
    return Math.round((paramCount / 1e9) * 100) / 100;
  }

  const sizeMatches = [
    ...modelUrl.matchAll(/(\d+)b/gi),
    ...modelUrl.matchAll(/(\d+)[._-]b/gi),
    ...(config.model_type?.matchAll(/(\d+)b/gi) || []),
  ];

  for (const match of sizeMatches) {
    const size = parseInt(match[1]);
    if (size > 0 && size < 1000) {
      return size;
    }
  }

  if (config.architectures?.length) {
    for (const arch of config.architectures) {
      const match = arch.match(/(\d+)b/i);
      if (match) {
        const size = parseInt(match[1]);
        if (size > 0 && size < 1000) {
          return size;
        }
      }
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { model_url } = await req.json();
    const cleanUrl = model_url
      .replace('https://huggingface.co/', '')
      .replace(/^\/+|\/+$/g, '');

    try {
      const config = await fetchModelConfig(cleanUrl);
      const quant_type = determineQuantType(config);
      const params_size = calculateParamsSize(config, cleanUrl);

      if (!params_size) {
        return NextResponse.json({
          success: false,
          error: 'Could not determine model size. Please enter it manually.'
        }, { status: 400 });
      }

      const adjusted_size = params_size + 1;

      return NextResponse.json({
        success: true,
        params_size: adjusted_size,
        original_size: params_size,
        quant_type
      });
    } catch (error) {
      console.error('Error fetching model data:', error);
      return NextResponse.json({
        success: false,
        error: 'Error fetching model data. Please check the URL and try again.'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
} 