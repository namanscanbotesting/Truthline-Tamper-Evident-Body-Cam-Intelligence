/**
 * Truthline Design Tokens
 * 
 * Institutional, serious, B2G-focused design system.
 * Inspired by Linear, Vanta, Anduril — not web3/crypto or AI hype.
 */

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTE
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  // Primary institutional colors
  background: '#05070d',        // Deep navy-black, not pure black
  surface: '#0b1220',           // Surface elevation
  surfaceStrong: '#0f172a',     // Stronger surface for cards
  
  // Text colors
  textPrimary: '#e2e8f0',       // Soft white, not harsh #fff
  textSecondary: '#94a3b8',     // Muted slate
  textMuted: '#64748b',         // Subtle text
  
  // Borders and dividers
  border: '#1f2937',
  borderLight: '#334155',
  
  // Accent color - ONLY used for critical alerts (red), not decorative
  alertCritical: '#dc2626',     // Deep red for critical alerts only
  alertCriticalBg: 'rgba(220, 38, 38, 0.1)',
  
  // Success states (verification pass)
  success: '#10b981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  
  // Info/neutral accent (sparingly)
  info: '#38bdf8',              // Sky blue, restrained use
  
  // Gradients (subtle, not flashy)
  gradientSurface: 'linear-gradient(180deg, rgba(15,23,42,0.8) 0%, rgba(11,18,32,0.9) 100%)',
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────

export const typography = {
  // Font families
  fontFamily: {
    display: 'var(--font-playfair), Georgia, "Times New Roman", serif',  // Institutional serif for headlines
    body: 'var(--font-inter), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'var(--font-geist-mono), "SF Mono", Monaco, "Cascadia Code", monospace',
  },
  
  // Font sizes (based on 8px grid)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
  },
  
  // Letter spacing (tracking)
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SPACING (8px base grid)
// ─────────────────────────────────────────────────────────────────────────────

export const spacing = {
  // Base units
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  
  // Section padding (generous whitespace = confident/expensive feel)
  sectionPaddingMobile: '3rem',   // 48px
  sectionPaddingTablet: '6rem',   // 96px
  sectionPaddingDesktop: '8rem',  // 128px
};

// ─────────────────────────────────────────────────────────────────────────────
// MOTION TOKENS (Framer Motion)
// ─────────────────────────────────────────────────────────────────────────────

export const motionTokens = {
  // Easing curves (Linear-inspired, confident) - typed as cubic bezier array
  ease: [0.16, 1, 0.3, 1] satisfies readonly [number, number, number, number],
  easeIn: [0.12, 0, 0.39, 0] satisfies readonly [number, number, number, number],
  easeOut: [0.33, 1, 0.68, 1] satisfies readonly [number, number, number, number],
  easeInOut: [0.65, 0, 0.35, 1] satisfies readonly [number, number, number, number],
  
  // Durations
  duration: {
    micro: 0.15,      // 150ms - hover states, small interactions
    fast: 0.2,        // 200ms - buttons, toggles
    normal: 0.4,      // 400ms - section reveals
    slow: 0.6,        // 600ms - major transitions
    slower: 0.8,      // 800ms - 3D animations
  },
  
  // Delays
  delay: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.3,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED FRAMER MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

export const variants = {
  // Fade up reveal (most common - use for section content)
  fadeUp: {
    hidden: {
      opacity: 0,
      y: 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionTokens.duration.normal,
        ease: motionTokens.ease,
      },
    },
  },
  
  // Fade in (simple opacity transition)
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: motionTokens.duration.normal,
        ease: motionTokens.ease,
      },
    },
  },
  
  // Stagger container (for lists, feature grids)
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  
  // Stagger item (children of staggerContainer)
  staggerItem: {
    hidden: {
      opacity: 0,
      y: 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionTokens.duration.normal,
        ease: motionTokens.ease,
      },
    },
  },
  
  // Scale in (for modals, dialogs)
  scaleIn: {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: motionTokens.duration.fast,
        ease: motionTokens.easeOut,
      },
    },
  },
  
  // Slide in from right (for drawers, side panels)
  slideInRight: {
    hidden: {
      x: '100%',
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: motionTokens.duration.slow,
        ease: motionTokens.ease,
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BREAKPOINTS (Tailwind-compatible)
// ─────────────────────────────────────────────────────────────────────────────

export const breakpoints = {
  sm: 640,    // Small tablets
  md: 768,    // Tablets
  lg: 1024,   // Laptops
  xl: 1280,   // Desktops
  '2xl': 1536, // Large desktops
};

// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────────────────────

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS (Subtle, not heavy)
// ─────────────────────────────────────────────────────────────────────────────

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// ─────────────────────────────────────────────────────────────────────────────
// Z-INDEX SCALE
// ─────────────────────────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITIONS (Reusable transition objects)
// ─────────────────────────────────────────────────────────────────────────────

export const transitions = {
  // Default transition for most interactions
  default: {
    duration: motionTokens.duration.fast,
    ease: motionTokens.ease,
  },
  
  // For section reveals (slower, more deliberate)
  reveal: {
    duration: motionTokens.duration.normal,
    ease: motionTokens.ease,
  },
  
  // For hover states (snappy)
  hover: {
    duration: motionTokens.duration.micro,
    ease: motionTokens.easeOut,
  },
  
  // For 3D animations (smooth, continuous)
  continuous: {
    duration: motionTokens.duration.slower,
    repeat: Infinity,
    repeatType: 'loop' as const,
    ease: 'linear' as const,
  },
};

// Export all as a single theme object for convenience
export const theme = {
  colors,
  typography,
  spacing,
  motionTokens,
  variants,
  breakpoints,
  borderRadius,
  shadows,
  zIndex,
  transitions,
};
