'use client'

import * as React from 'react'
import { useState } from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Button } from './ui/Button'
import { ModelForm } from './ModelForm'
import { HardwareForm } from './HardwareForm'
import { Results } from './Results'
import { ModelParams, CalculationResults } from '@/lib/types'
import { DEFAULT_CONTEXT_LENGTH, DEFAULT_BATCH_SIZE, DEFAULT_NUM_LAYERS, DEFAULT_HIDDEN_SIZE } from '@/lib/constants'
import { TypewriterText } from './TypewriterText'
import { AnimatePresence, motion } from 'framer-motion'

export function Calculator() {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    { title: 'Model Selection', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'LLM Settings', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' }
  ]
  
  // Model params
  const [modelUrl, setModelUrl] = useState('')
  const [modelSize, setModelSize] = useState('7')
  const [customModelSize, setCustomModelSize] = useState<number | null>(null)
  const [mode, setMode] = useState('Inference')
  const [modelError, setModelError] = useState('')
  const [originalModelSize, setOriginalModelSize] = useState<string | null>(null)
  
  // Hardware params
  const [quantType, setQuantType] = useState('FP16 (16-bit floating point)')
  const [contextLength, setContextLength] = useState(DEFAULT_CONTEXT_LENGTH)
  const [batchSize, setBatchSize] = useState(DEFAULT_BATCH_SIZE)
  
  // Advanced params
  const [numLayers, setNumLayers] = useState(DEFAULT_NUM_LAYERS)
  const [hiddenSize, setHiddenSize] = useState(DEFAULT_HIDDEN_SIZE)
  const [efficientAttention, setEfficientAttention] = useState(true)

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Model Selection
        if (modelUrl && modelUrl.trim() !== '') {
          return !modelError && customModelSize;
        }
        return modelSize && modelSize !== 'custom' && modelSize !== '';
      case 1: // Hardware Configuration
        const basicValid = contextLength > 0 && batchSize > 0;
        if (showAdvanced) {
          return basicValid && numLayers > 0 && hiddenSize > 0;
        }
        return basicValid;
      default:
        return true;
    }
  }

  const validateInputs = () => {
    if (modelUrl && !customModelSize) {
      return false;
    }

    const modelSizeNum = modelUrl ? customModelSize : parseFloat(modelSize);
    if (!modelSizeNum || modelSizeNum <= 0) {
      return false;
    }

    if (contextLength <= 0 || batchSize <= 0) {
      return false;
    }

    if (showAdvanced) {
      if (numLayers <= 0 || hiddenSize <= 0) {
        return false;
      }
    }

    return true;
  }

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setShowHelp(false);
      }
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHelp(false);
    }
  }

  const fetchModelData = async () => {
    if (!modelUrl) {
      setModelError('');
      setCustomModelSize(null);
      setModelSize('7');
      return;
    }

    const cleanedUrl = modelUrl.trim()
      .replace('https://huggingface.co/', '')
      .replace(/^\/+|\/+$/g, '');

    setIsLoading(true);

    try {
      const response = await fetch('/api/fetch-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model_url: cleanedUrl })
      });
      
      const data = await response.json();
      if (data.success) {
        setCustomModelSize(data.params_size);
        setModelSize(`${data.params_size}B`);
        setOriginalModelSize(`${data.original_size}`);
        setQuantType(data.quant_type);
        setModelError('');
      } else {
        setModelError(data.error || 'Error fetching model data');
        setCustomModelSize(null);
        setModelSize('7');
      }
    } catch (error) {
      setModelError('Error connecting to server');
      setCustomModelSize(null);
      setModelSize('7');
    } finally {
      setIsLoading(false);
    }
  }

  const calculate = async () => {
    if (!validateInputs()) {
      return;
    }
    
    const modelSizeValue = modelUrl ? customModelSize : modelSize;
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_size: modelSizeValue,
          quant_type: quantType,
          context_length: parseInt(contextLength.toString()),
          batch_size: parseInt(batchSize.toString()),
          num_layers: parseInt(numLayers.toString()),
          hidden_size: parseInt(hiddenSize.toString()),
          mode: mode,
          efficient_attention: efficientAttention,
          modelUrl: modelUrl || 'Custom Configuration'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      } else {
        alert(data.error || 'Error calculating requirements');
      }
    } catch (error) {
      alert('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Updating...';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Updating...';
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return 'Updating...';
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Column - Configuration */}
      <div className="w-[350px] lg:w-[400px] min-w-[300px] max-w-[25vw] flex-none bg-gradient-to-b from-[#0a0118] via-[#121212] to-[#0a0118] border-r border-white/10 overflow-y-auto custom-scrollbar backdrop-blur-sm">
        {/* Premium Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0118] to-transparent pb-6 pt-4 px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-purple-900 p-2 lg:p-3 rounded-xl shadow-xl">
                  <svg className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                LLM Hardware Calculator
              </h1>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <ModelForm
            modelUrl={modelUrl}
            modelSize={modelSize}
            originalSize={originalModelSize}
            mode={mode}
            modelError={modelError}
            isLoading={isLoading}
            showHelp={showHelp}
            onModelUrlChange={setModelUrl}
            onModelSizeChange={setModelSize}
            onModeChange={setMode}
            onShowHelpToggle={() => setShowHelp(!showHelp)}
            onFetchModel={fetchModelData}
          />

          <HardwareForm
            quantType={quantType}
            contextLength={contextLength}
            batchSize={batchSize}
            numLayers={numLayers}
            hiddenSize={hiddenSize}
            efficientAttention={efficientAttention}
            showAdvanced={showAdvanced}
            onQuantTypeChange={setQuantType}
            onContextLengthChange={setContextLength}
            onBatchSizeChange={setBatchSize}
            onNumLayersChange={setNumLayers}
            onHiddenSizeChange={setHiddenSize}
            onEfficientAttentionChange={setEfficientAttention}
            onShowAdvancedToggle={() => setShowAdvanced(!showAdvanced)}
          />

          {/* Calculate Button */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-900 rounded-lg blur opacity-25" />
            <Button
              onClick={calculate}
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-purple-500 to-purple-900 text-white border-0 hover:from-purple-600 hover:to-purple-900 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculating...</span>
                </div>
              ) : (
                'Calculate Requirements'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Results */}
      <div className="flex-1 min-w-0 overflow-hidden bg-gradient-to-b from-[#0a0118] via-[#121212] to-[#0a0118]">
        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                y: -20,
                transition: { duration: 0.3 }
              }}
              className="flex items-center justify-center h-full text-gray-400"
            >
              <TypewriterText />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="h-full overflow-y-auto custom-scrollbar"
            >
              <Results results={results} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 