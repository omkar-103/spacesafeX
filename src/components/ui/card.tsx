'use client';

// ============================================================
// SpaceSafe X — Aerospace Panel / Card Component
// ============================================================
// Engineering-first design: hard borders, minimal blur,
// corner accent lines for aerospace instrument aesthetic.
// Variants: default, glass, danger, warning, success, threat
// ============================================================

import React from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'glass' | 'danger' | 'warning' | 'success' | 'threat';

const cardVariantStyles: Record<CardVariant, string> = {
  default: 'bg-[#0B1220] border-[#172554] hover:border-[#1e3a5f]',
  glass: 'bg-[#0B1220]/80 border-[#172554] backdrop-blur-sm hover:border-[rgba(0,212,255,0.2)]',
  danger: 'bg-[rgba(239,68,68,0.06)] border-[rgba(239,68,68,0.25)] hover:border-[rgba(239,68,68,0.4)] hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]',
  warning: 'bg-[rgba(245,158,11,0.06)] border-[rgba(245,158,11,0.2)] hover:border-[rgba(245,158,11,0.35)]',
  success: 'bg-[rgba(16,185,129,0.06)] border-[rgba(16,185,129,0.2)] hover:border-[rgba(16,185,129,0.35)]',
  threat: 'bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.3)] hover:border-[rgba(239,68,68,0.5)] hover:shadow-[0_0_24px_rgba(239,68,68,0.12)]',
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  accent?: boolean; // Show corner accent lines
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', accent = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md border transition-all duration-200',
          cardVariantStyles[variant],
          accent && 'panel-accent',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1 p-4 pb-2', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-sm font-semibold leading-tight tracking-wide text-[#F8FAFC] uppercase',
        className
      )}
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-[#94A3B8]', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-4 pt-0', className)}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-4 pt-0 border-t border-[#172554] mt-2 pt-3', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
