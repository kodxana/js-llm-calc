'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'
import { Button } from './ui/Button'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface ModelFormProps {
  modelUrl: string
  modelSize: string
  originalSize: string | null
  mode: string
  modelError: string
  isLoading: boolean
  showHelp: boolean
  onModelUrlChange: (value: string) => void
  onModelSizeChange: (value: string) => void
  onModeChange: (value: string) => void
  onShowHelpToggle: () => void
  onFetchModel: () => Promise<void>
}

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

const inputAnimation = {
  rest: { scale: 1 },
  focus: { 
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  }
}

export function ModelForm({
  modelUrl,
  modelSize,
  originalSize,
  mode,
  modelError,
  isLoading,
  showHelp,
  onModelUrlChange,
  onModelSizeChange,
  onModeChange,
  onShowHelpToggle,
  onFetchModel
}: ModelFormProps) {
  const lastFetchedUrl = useRef(modelUrl);

  useEffect(() => {
    if (!modelUrl.trim() || modelUrl.trim() === lastFetchedUrl.current.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      lastFetchedUrl.current = modelUrl;
      onFetchModel();
    }, 1000);

    return () => clearTimeout(timer);
  }, [modelUrl, onFetchModel]);

  return (
    <motion.div 
      variants={formAnimation}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="bg-gradient-to-br from-[#1e1538] via-[#150d2d] to-[#1a1133] rounded-xl border border-purple-500/10 p-4 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm lg:text-base font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Hugging Face Model URL
          </label>
        </div>
        
        <div className="relative">
          <motion.div
            initial="rest"
            whileFocus="focus"
            animate="rest"
            variants={inputAnimation}
          >
            <input
              type="text"
              value={modelUrl}
              onChange={(e) => {
                onModelUrlChange(e.target.value);
                if (!e.target.value.trim()) {
                  lastFetchedUrl.current = '';
                }
              }}
              className="w-full bg-black/20 border border-purple-500/10 rounded-lg px-4 py-2.5 text-white text-sm lg:text-base focus:border-purple-500/30 transition-all duration-300 hover:border-purple-500/20"
              placeholder="e.g., Qwen/QwQ-32B-Preview"
            />
          </motion.div>
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
            </div>
          )}
        </div>
        
        {modelError && (
          <p className="mt-2 text-red-400 text-sm">{modelError}</p>
        )}
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="bg-gradient-to-br from-[#1e1538] via-[#150d2d] to-[#1a1133] rounded-xl border border-purple-500/10 p-4 shadow-xl"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm lg:text-base font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent block mb-2">
              Model Size
            </label>
            {originalSize && (
              <p className="text-sm text-purple-300/50 mb-2">
                Auto-detected: {modelSize}
              </p>
            )}
            <select
              value={modelSize}
              onChange={(e) => onModelSizeChange(e.target.value)}
              disabled={isLoading || modelUrl.trim() !== ''}
              className="w-full bg-black/20 border border-purple-500/10 rounded-lg px-4 py-2.5 text-white text-sm lg:text-base focus:border-purple-500/30 transition-colors disabled:opacity-50"
            >
              <option value="7">7B</option>
              <option value="13">13B</option>
              <option value="34">34B</option>
              <option value="70">70B</option>
              {modelSize.includes('B') && !['7B', '13B', '34B', '70B'].includes(modelSize) && (
                <option value={modelSize}>{modelSize}</option>
              )}
            </select>
          </div>

          <div>
            <label className="text-sm lg:text-base font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent block mb-2">
              Mode
            </label>
            <select
              value={mode}
              onChange={(e) => onModeChange(e.target.value)}
              className="w-full bg-black/20 border border-purple-500/10 rounded-lg px-4 py-2.5 text-white text-sm lg:text-base focus:border-purple-500/30 transition-colors"
            >
              <option value="Inference">Inference</option>
              <option value="Training">Training</option>
            </select>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 