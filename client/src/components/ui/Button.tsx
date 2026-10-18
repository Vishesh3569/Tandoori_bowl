"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-black uppercase tracking-wider rounded-2xl border-2 border-black transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 active:shadow-none",
    md: "px-5 py-2.5 text-sm shadow-[2.5px_2.5px_0px_0px_#000] active:translate-y-0.5 active:shadow-none",
    lg: "px-6 py-3.5 text-base shadow-[3.5px_3.5px_0px_0px_#000] active:translate-y-0.5 active:shadow-none",
  };

  const variantStyles = {
    primary:
      "bg-[#FFD000] text-black hover:bg-white hover:text-[#D90429]",
    secondary:
      "bg-[#D90429] text-white hover:bg-[#A0001E]",
    danger:
      "bg-red-700 text-white hover:bg-red-800",
    outline:
      "bg-transparent text-[#FFD000] border-[#FFD000] shadow-[2px_2px_0px_0px_#FFD000] hover:bg-[#FFD000] hover:text-black",
  };

  return (
    <motion.button
      whileTap={disabled || isLoading ? undefined : { scale: 0.96 }}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};