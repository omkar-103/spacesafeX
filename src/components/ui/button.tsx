'use client';

// ============================================================
// SpaceSafe X — Engineering-Grade Button Component
// ============================================================
// Mission-control aesthetic: precise, functional, no gimmicks
// Variants: primary (cyan), secondary (purple), danger (red),
//           ghost (transparent), outline (bordered)
// ============================================================

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00D4FF] focus-visible:ring-offset-1 focus-visible:ring-offset-[#050816]',
    'disabled:pointer-events-none disabled:opacity-40',
    'cursor-pointer select-none',
    'active:scale-[0.96]',
    'rounded-sm',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[#00D4FF] text-[#050816] font-semibold',
          'hover:bg-[#00c4ef]',
          'hover:shadow-[0_0_20px_rgba(0,212,255,0.35)]',
          'border border-[#00D4FF]',
        ],
        secondary: [
          'bg-[#7C3AED] text-white font-semibold',
          'hover:bg-[#6d33d4]',
          'hover:shadow-[0_0_20px_rgba(124,58,237,0.35)]',
          'border border-[#7C3AED]',
        ],
        danger: [
          'bg-[#EF4444] text-white font-semibold',
          'hover:bg-[#dc3535]',
          'hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
          'border border-[#EF4444]',
        ],
        ghost: [
          'bg-transparent text-[#94A3B8]',
          'hover:bg-white/5 hover:text-[#F8FAFC]',
          'border border-transparent',
        ],
        outline: [
          'border border-[#172554] bg-transparent text-[#94A3B8]',
          'hover:border-[#00D4FF]/40 hover:text-[#F8FAFC] hover:bg-[#00D4FF]/5',
        ],
      },
      size: {
        sm: 'h-7 px-3 text-xs tracking-wide',
        md: 'h-9 px-4 text-sm',
        lg: 'h-11 px-6 text-sm tracking-wider',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

function ButtonSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="14"
      height="14"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <ButtonSpinner className={variant === 'primary' ? 'text-[#050816]' : 'text-white'} />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
