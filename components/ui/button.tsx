// button.tsx
import React from "https://esm.sh/react@19";
import { clsx } from "https://esm.sh/clsx@2.1.1";
import { twMerge } from "https://esm.sh/tailwind-merge@3.4.0";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children,
  type = 'button',
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-transparent hover:bg-muted text-foreground',
    ghost: 'hover:bg-muted text-foreground'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-14 px-8 text-lg'
  };

  return (
    <button
      type={type}
      className={twMerge(
        'inline-flex items-center justify-center rounded-full font-medium transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}