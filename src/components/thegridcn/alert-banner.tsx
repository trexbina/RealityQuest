"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  variant?: "warning" | "danger" | "info"
}

export function AlertBanner({
  title,
  subtitle,
  variant = "warning",
  className,
  ...props
}: AlertBannerProps) {
  const variantStyles = {
    warning: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/50",
      text: "text-amber-500",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    },
    danger: {
      bg: "bg-red-500/10",
      border: "border-red-500/50",
      text: "text-red-500",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    },
    info: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/50",
      text: "text-cyan-500",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    },
  }

  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm border",
        styles.bg,
        styles.border,
        styles.glow,
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute h-[2px] w-full animate-[scan_2s_linear_infinite]",
            variant === "warning" && "bg-amber-500/50",
            variant === "danger" && "bg-red-500/50",
            variant === "info" && "bg-cyan-500/50"
          )}
        />
      </div>

      <div className="relative px-4 py-3">
        {subtitle && (
          <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            {subtitle}
          </div>
        )}
        <div
          className={cn(
            "font-mono text-lg font-bold uppercase tracking-widest",
            styles.text
          )}
        >
          {title}
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: -2px; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  )
}
