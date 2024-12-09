'use client'

import * as React from 'react'
import { CalculationResults, GpuSetup } from '@/lib/types'
import { motion } from 'framer-motion'

interface ResultsProps {
  results: CalculationResults
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  }
}

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  }
}

export function Results({ results }: ResultsProps) {
  if (!results || !results.model_info) return null;

  const showNoGpuWarning = !results.gpu_setups || results.gpu_setups.length === 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full p-4 md:p-6 pt-8 md:pt-12 bg-gradient-to-b from-[#0a0118] via-[#121212] to-[#0a0118]"
    >
      <div className="h-full w-full max-w-[1920px] mx-auto">
        {/* Model Details */}
        <motion.div 
          whileHover="hover"
          initial="rest"
          animate="rest"
          variants={{
            ...item,
            hover: cardHover.hover,
            rest: cardHover.rest
          }}
          className="bg-gradient-to-br from-[#1e1538] via-[#150d2d] to-[#1a1133] rounded-2xl border border-purple-500/10 p-4 md:p-6 mb-4 shadow-2xl backdrop-blur-xl hover:shadow-purple-500/5 transition-shadow duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">Model Details</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-3 md:gap-4">
            {[
              { label: 'Model', value: results.model_info.name },
              { label: 'Size', value: results.model_info.size },
              { label: 'Quantization', value: results.model_info.quant_type },
              { label: 'Mode', value: results.model_info.mode }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-[#1a1133]/50 to-purple-950/30 rounded-xl p-3 border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300">
                <h3 className="text-sm lg:text-base font-medium text-purple-300/70 mb-1">{item.label}</h3>
                <p className="text-base lg:text-lg text-white/90 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-3 md:gap-4 mb-4">
          {/* GPU Memory Required */}
          <motion.div
            whileHover="hover"
            initial="rest"
            animate="rest"
            variants={{
              ...item,
              hover: cardHover.hover,
              rest: cardHover.rest
            }}
            className="flex flex-col bg-gradient-to-br from-[#0f172a] via-[#0c1322] to-[#1e293b] rounded-2xl border border-white/5 p-4 md:p-6 shadow-2xl backdrop-blur-xl hover:shadow-sky-500/5 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              <h2 className="text-lg lg:text-xl xl:text-2xl font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">GPU Memory Required</h2>
            </div>
            <div className="bg-gradient-to-br from-black/60 to-sky-950/10 rounded-xl p-4 border border-white/5">
              <motion.p 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-sky-500"
              >
                {results.vram_gb.toFixed(2)} GB
              </motion.p>
              <p className="text-sm text-sky-300/60 mt-1">Minimum GPU memory required</p>
            </div>
          </motion.div>

          {/* Storage Required */}
          <motion.div
            whileHover="hover"
            initial="rest"
            animate="rest"
            variants={{
              ...item,
              hover: cardHover.hover,
              rest: cardHover.rest
            }}
            className="flex flex-col bg-gradient-to-br from-[#0f2922] via-[#0c1f1b] to-[#1e3b31] rounded-2xl border border-white/5 p-4 md:p-6 shadow-2xl backdrop-blur-xl hover:shadow-emerald-500/5 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z"/>
              </svg>
              <h2 className="text-lg lg:text-xl xl:text-2xl font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">Storage Required</h2>
            </div>
            <div className="bg-gradient-to-br from-black/60 to-emerald-950/10 rounded-xl p-4 border border-white/5">
              <motion.p 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-emerald-500"
              >
                {results.storage_gb.toFixed(2)} GB
              </motion.p>
              <p className="text-sm text-emerald-300/60 mt-1">Total storage space needed</p>
            </div>
            <p className="text-xs text-emerald-300/40 mt-4">
              Note: Storage costs are not included in the GPU pricing. Additional charges will apply for persistent storage.
            </p>
          </motion.div>
        </motion.div>

        {/* GPU Recommendations or Warning */}
        {showNoGpuWarning ? (
          <motion.div variants={item} className="bg-gradient-to-br from-[#2d1c1c] via-[#1f1414] to-[#2d1c1c] rounded-2xl border border-red-500/10 p-4 md:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-3 text-red-400">
              <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div>
                <h3 className="text-lg font-medium mb-2">Model Requirements Exceed Available Resources</h3>
                <p className="text-red-300/70 mb-4">
                  This model requires {results.vram_gb.toFixed(2)}GB of VRAM, which exceeds the maximum available GPU memory on RunPod (8x 80GB = 640GB per pod).
                </p>
                <div className="space-y-2 text-sm text-red-300/60">
                  <p>Consider the following options:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Use a smaller model variant</li>
                    <li>Try a quantized version (e.g., 4-bit or 8-bit quantization)</li>
                    <li>Reduce the batch size or context length</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={item} className="bg-gradient-to-br from-[#1e1538] via-[#150d2d] to-[#1a1133] rounded-2xl border border-purple-500/10 p-4 md:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                </svg>
                <h2 className="text-lg lg:text-xl xl:text-2xl font-medium bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">GPU Recommendations</h2>
              </div>
              {results.last_update && (
                <span className="text-xs text-violet-300/50">
                  Prices updated: {new Date(results.last_update).toLocaleString()}
                </span>
              )}
            </div>

            <div className="space-y-6 md:space-y-8">
              {results.gpu_setups?.map((setup, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                    <h3 className="text-lg lg:text-xl xl:text-2xl font-medium text-violet-400">{setup.category}</h3>
                    {setup.options[0] && (
                      <span className="text-sm lg:text-base text-violet-300/50">
                        (Total VRAM: {Number(setup.options[0].vram) * setup.options[0].count}GB)
                      </span>
                    )}
                  </div>

                  <div className="grid auto-rows-fr gap-3 md:gap-4"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))'
                    }}
                  >
                    {setup.options.map((option, optIndex) => (
                      <motion.div 
                        key={optIndex}
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                        variants={{
                          ...item,
                          hover: cardHover.hover,
                          rest: cardHover.rest
                        }}
                        className="flex flex-col group bg-gradient-to-br from-black/60 to-violet-950/10 rounded-xl border border-white/5 p-4 hover:border-violet-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-base lg:text-lg xl:text-xl font-medium text-white/90 group-hover:text-white transition-colors">
                                {option.name}
                              </h4>
                              <p className="text-sm lg:text-base text-violet-300/50">
                                {option.vram}GB per GPU
                              </p>
                            </div>
                            {option.price_info && (
                              <div className="text-right">
                                <p className="text-base lg:text-lg font-medium text-white/90 group-hover:text-white transition-colors">
                                  ${option.price_info.hourly_price.toFixed(2)}/hr
                                </p>
                                <p className="text-xs lg:text-sm text-violet-300/50">
                                  (${(option.price_info.hourly_price * option.count).toFixed(2)}/hr total)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {option.price_info && (
                          <div className="mt-auto pt-3 border-t border-white/5">
                            <h5 className="text-xs lg:text-sm font-medium text-violet-400 mb-2">Savings Plans</h5>
                            <div className="grid grid-cols-2 gap-3 text-xs lg:text-sm">
                              <div>
                                <span className="text-violet-300/50 block">Weekly Commit</span>
                                {option.price_info.weekly_price !== 'N/A' ? (
                                  <>
                                    <span className="text-white/90">
                                      ${(option.price_info.weekly_price as number).toFixed(2)}/hr
                                    </span>
                                    <span className="text-violet-300/30 block">
                                      {option.count}x ${(option.price_info.weekly_price as number).toFixed(2)}/hr
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-violet-300/30">Not available</span>
                                )}
                              </div>
                              <div>
                                <span className="text-violet-300/50 block">Monthly Commit</span>
                                {option.price_info.monthly_price !== 'N/A' ? (
                                  <>
                                    <span className="text-white/90">
                                      ${(option.price_info.monthly_price as number).toFixed(2)}/hr
                                    </span>
                                    <span className="text-violet-300/30 block">
                                      {option.count}x ${(option.price_info.monthly_price as number).toFixed(2)}/hr
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-violet-300/30">Not available</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs lg:text-sm text-violet-300/40 mt-6">
              * Prices shown are for RunPod Secure Cloud compute only. Additional costs apply for persistent storage.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
} 