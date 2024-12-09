'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface HardwareFormProps {
  quantType: string
  contextLength: number
  batchSize: number
  numLayers: number
  hiddenSize: number
  efficientAttention: boolean
  showAdvanced: boolean
  onQuantTypeChange: (value: string) => void
  onContextLengthChange: (value: number) => void
  onBatchSizeChange: (value: number) => void
  onNumLayersChange: (value: number) => void
  onHiddenSizeChange: (value: number) => void
  onEfficientAttentionChange: (value: boolean) => void
  onShowAdvancedToggle: () => void
}

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.1
    }
  }
}

const advancedAnimation = {
  hidden: { height: 0, opacity: 0 },
  show: { 
    height: "auto", 
    opacity: 1,
    transition: {
      height: {
        type: "spring",
        stiffness: 100,
        damping: 15
      },
      opacity: {
        duration: 0.2
      }
    }
  }
}

export function HardwareForm({
  quantType,
  contextLength,
  batchSize,
  numLayers,
  hiddenSize,
  efficientAttention,
  showAdvanced,
  onQuantTypeChange,
  onContextLengthChange,
  onBatchSizeChange,
  onNumLayersChange,
  onHiddenSizeChange,
  onEfficientAttentionChange,
  onShowAdvancedToggle
}: HardwareFormProps) {
  return (
    <motion.div
      variants={formAnimation}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Basic Settings */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="bg-gradient-to-br from-[#1e1538] via-[#150d2d] to-[#1a1133] rounded-xl border border-purple-500/10 p-4 shadow-xl"
      >
        <h3 className="text-sm font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-4">
          Basic Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent block mb-2">
              Quantization Type
            </label>
            <select
              value={quantType}
              onChange={(e) => onQuantTypeChange(e.target.value)}
              className="w-full bg-black/20 border border-purple-500/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500/30 transition-colors"
            >
              <option value="FP16 (16-bit floating point)">FP16 (16-bit floating point)</option>
              <option value="BF16 (16-bit brain floating point)">BF16 (16-bit brain floating point)</option>
              <option value="INT8 (8-bit integer)">INT8 (8-bit integer)</option>
              <option value="INT4 (4-bit integer)">INT4 (4-bit integer)</option>
              <option value="GPTQ (4-bit quantized)">GPTQ (4-bit quantized)</option>
              <option value="AWQ (4-bit quantized)">AWQ (4-bit quantized)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent block mb-2">
              Context Length
            </label>
            <input
              type="number"
              value={contextLength}
              onChange={(e) => onContextLengthChange(Number(e.target.value))}
              min="1"
              className="w-full bg-black/20 border border-purple-500/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500/30 transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent block mb-2">
              Batch Size
            </label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => onBatchSizeChange(Number(e.target.value))}
              min="1"
              className="w-full bg-black/20 border border-purple-500/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500/30 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Advanced Settings Toggle */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onShowAdvancedToggle}
        className="w-full flex items-center justify-between px-4 py-2 bg-gradient-to-br from-[#1e1538] via-[#150d2d] to-[#1a1133] rounded-xl border border-purple-500/10 text-white/90 hover:text-white transition-colors"
      >
        <span className="text-sm font-medium">Advanced Settings</span>
        {showAdvanced ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </motion.button>

      {/* Advanced Settings Content */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            variants={advancedAnimation}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="overflow-hidden"
          >
            <div className="space-y-4 bg-gradient-to-br from-[#1e1538] via-[#150d2d] to-[#1a1133] rounded-xl border border-purple-500/10 p-4 shadow-xl">
              <div>
                <label className="text-sm font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent block mb-2">
                  Number of Layers
                </label>
                <input
                  type="number"
                  value={numLayers}
                  onChange={(e) => onNumLayersChange(Number(e.target.value))}
                  min="1"
                  className="w-full bg-black/20 border border-purple-500/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500/30 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent block mb-2">
                  Hidden Size
                </label>
                <input
                  type="number"
                  value={hiddenSize}
                  onChange={(e) => onHiddenSizeChange(Number(e.target.value))}
                  min="1"
                  className="w-full bg-black/20 border border-purple-500/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500/30 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="efficientAttention"
                  checked={efficientAttention}
                  onChange={(e) => onEfficientAttentionChange(e.target.checked)}
                  className="rounded border-purple-500/30 bg-black/20 text-purple-500 focus:ring-purple-500/30"
                />
                <label 
                  htmlFor="efficientAttention"
                  className="text-sm font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
                >
                  Use Efficient Attention
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 