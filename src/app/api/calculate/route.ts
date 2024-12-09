import { NextResponse } from 'next/server'
import { calculateVramRequirement, calculateStorageRequirement, suggestGpu } from '@/lib/calculations'

export async function POST(req: Request) {
  try {
    const params = await req.json()
    
    // Calculate VRAM and storage requirements
    const vram_gb = calculateVramRequirement(
      params.model_size,
      params.quant_type,
      params.context_length,
      params.batch_size,
      params.num_layers,
      params.hidden_size,
      params.mode,
      params.efficient_attention
    )

    const storage_gb = calculateStorageRequirement(
      params.model_size,
      params.quant_type,
      params.context_length
    )

    // Get GPU recommendations
    const gpu_setups = suggestGpu(vram_gb)

    const results = {
      vram_gb,
      storage_gb,
      model_info: {
        name: params.modelUrl || 'Custom Configuration',
        size: `${params.model_size}B`,
        quant_type: params.quant_type,
        mode: params.mode
      },
      gpu_setups,
      last_update: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      results
    })
  } catch (error) {
    console.error('Calculation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error calculating requirements'
    }, { status: 500 })
  }
} 