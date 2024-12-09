'use client'

import * as React from 'react'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-[#6D28D9] text-white hover:bg-[#5B21B6] border border-[#7C3AED] shadow-[0_0_10px_rgba(109,40,217,0.3)]',
        secondary: 'bg-[#1e1b4b] text-white hover:bg-[#1e1b4b]/80 border border-[#312e81]',
        help: 'bg-[#6D28D9] text-white hover:bg-[#5B21B6] border border-[#7C3AED] shadow-[0_0_10px_rgba(109,40,217,0.3)] min-w-[36px] min-h-[36px]'
      },
      size: {
        default: 'px-6 py-2',
        icon: 'p-2'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
)

interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants } 