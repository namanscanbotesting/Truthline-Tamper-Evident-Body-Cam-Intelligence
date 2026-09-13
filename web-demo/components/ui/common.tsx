'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { variants, transitions } from '@/lib/styles/tokens';

/**
 * Navigation link component with subtle hover animation
 */
export function NavLink({ 
  href, 
  children,
  active = false
}: { 
  href: string; 
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link href={href}>
      <motion.span
        className={`text-sm font-medium transition-colors ${
          active ? 'text-white' : 'text-slate-400 hover:text-white'
        }`}
        whileHover={{ y: -1 }}
        transition={transitions.hover}
      >
        {children}
      </motion.span>
    </Link>
  );
}

/**
 * Button component variants
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
  href?: string;
}

const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#05070d]";

const variants_styles = {
  primary: "bg-sky-500 text-slate-950 hover:bg-sky-400 focus:ring-sky-500",
  secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-600",
  outline: "border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white bg-transparent focus:ring-slate-600",
  ghost: "text-slate-300 hover:text-white hover:bg-slate-800/50 focus:ring-slate-600",
};

const sizes = {
  sm: "px-4 py-2 text-xs uppercase tracking-widest",
  md: "px-6 py-3 text-sm font-semibold",
  lg: "px-8 py-4 text-base font-semibold",
};

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  asChild = false,
  href,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  const combinedClassName = `${baseStyles} ${variants_styles[variant]} ${sizes[size]} ${className}`;

  if (asChild && href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      className={combinedClassName}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={transitions.hover}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

/**
 * Badge component for trust indicators, status labels
 */
export function Badge({ 
  children, 
  variant = 'default',
  className = ''
}: { 
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'alert' | 'info';
  className?: string;
}) {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-950/30 text-emerald-300 border-emerald-800',
    alert: 'bg-red-950/30 text-red-300 border-red-800',
    info: 'bg-sky-950/30 text-sky-300 border-sky-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Card component with subtle elevation and border
 */
export function Card({ 
  children, 
  className = '',
  hover = false
}: { 
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      className={`rounded-3xl border border-slate-800 bg-slate-900/60 p-6 ${className}`}
      {...(hover ? {
        whileHover: { 
          borderColor: '#334155',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
        transition: transitions.hover,
      } : {})}
    >
      {children}
    </motion.div>
  );
}

/**
 * Section heading with consistent typography
 */
export function SectionHeading({ 
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = ''
}: { 
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  const alignClasses = align === 'center' ? 'text-center' : 'text-left';
  
  return (
    <div className={`space-y-5 ${alignClasses} ${className}`}>
      {eyebrow && (
        <motion.p 
          className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitions.reveal}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2 
        className="text-3xl font-semibold text-white md:text-5xl"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...transitions.reveal, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          className="max-w-2xl mx-auto text-base text-slate-400"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transitions.reveal, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
