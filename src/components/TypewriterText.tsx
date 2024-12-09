'use client'

import { useState, useEffect } from 'react'

const MODEL_NAMES = [
  "QwQ-32B-Preview",
  "Hymba-1.5B-Instruct",
  "Qwen2.5-Coder-32B-Instruct",
  "Llama-3.1-405B-Instruct",
  "Yi-34B-Chat",
  "Mixtral-8x7B-Instruct-v0.1",
  "Llama-2-70b-chat-hf",
  "gemma-7b-it"
]

export function TypewriterText() {
  const [text, setText] = useState('')
  const [modelIndex, setModelIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
    const currentModel = MODEL_NAMES[modelIndex]
    
    const timer = setTimeout(() => {
      if (isDeleting) {
        setText(prev => prev.slice(0, -1))
        if (text === '') {
          setIsDeleting(false)
          setModelIndex((prev) => (prev + 1) % MODEL_NAMES.length)
        }
      } else {
        setText(currentModel.slice(0, text.length + 1))
        if (text === currentModel) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timer)
  }, [text, modelIndex, isDeleting])

  return (
    <div className="text-center space-y-12 max-w-[90vw] mx-auto px-4 flex flex-col items-center justify-center min-h-screen -mt-20">
      <svg 
        className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 mx-auto mb-12 text-white/10" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold tracking-tight leading-tight">
          How much VRAM to run
        </h2>
        <div className="h-24 md:h-28 lg:h-32 xl:h-36 2xl:h-40 flex items-center justify-center">
          <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-white/90 font-bold tracking-tight">
            {text}
            <span className="animate-pulse ml-2 inline-block w-1.5 h-16 md:h-20 lg:h-24 xl:h-28 2xl:h-32 bg-white/50" />
          </span>
        </div>
      </div>
      <p className="text-2xl md:text-3xl lg:text-4xl text-white/40 mt-12">
        Configure your model settings and click Calculate
      </p>
    </div>
  )
} 