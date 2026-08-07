export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const CONTAINER = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
} as const;

export const Z_INDEX = {
  background: -1,
  base: 0,
  content: 10,
  overlay: 20,
  navbar: 50,
  modal: 100,
  toast: 200,
} as const;

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  verySlow: 1.2,
} as const;
