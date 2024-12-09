export interface ModelParams {
  model_size: number;
  quant_type: string;
  context_length: number;
  batch_size: number;
  num_layers: number;
  hidden_size: number;
  mode: string;
  efficient_attention: boolean;
  modelUrl?: string;
}

export interface PriceInfo {
  hourly_price: number;
  weekly_price: number | 'N/A';
  monthly_price: number | 'N/A';
}

export interface GpuOption {
  name: string;
  vram: string;
  gpu_id: string;
  count: number;
  price_info?: PriceInfo;
}

export interface GpuSetup {
  category: string;
  options: GpuOption[];
  total_vram?: number;
}

export interface ModelInfo {
  name: string;
  size: string;
  quant_type: string;
  mode: string;
}

export interface CalculationResults {
  model_info: {
    name: string
    size: string
    quant_type: string
    mode: string
  }
  vram_gb: number
  storage_gb: number
  gpu_setups?: GpuSetup[]
  last_update?: string
  error?: string
} 