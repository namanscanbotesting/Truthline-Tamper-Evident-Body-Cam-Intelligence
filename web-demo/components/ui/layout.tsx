'use client';

import { motion } from 'framer-motion';
import { variants, transitions } from '@/lib/styles/tokens';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Section wrapper with built-in fade-up reveal animation.
 * Use this for all major page sections to maintain consistent motion.
 */
export function Section({ children, className = '', id }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants.staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/**
 * Container component with max-width and responsive padding.
 */
export function Container({ 
  children, 
  className = '',
  size = 'default'
}: { 
  children: React.ReactNode;
  className?: string;
  size?: 'narrow' | 'default' | 'wide' | 'full';
}) {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-6 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Staggered grid for feature cards, steps, etc.
 */
export function StaggerGrid({ 
  children, 
  className = '',
  columns = 3
}: { 
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <motion.div
      variants={variants.staggerContainer}
      className={`grid gap-6 ${columnClasses[columns]} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual staggered item (use inside StaggerGrid or staggerContainer)
 */
export function StaggerItem({ 
  children, 
  className = '',
  delay = 0
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: transitions.reveal.duration,
            ease: transitions.reveal.ease,
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
