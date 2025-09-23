// Neo-Brutalism Design Tokens
export const tokens = {
  colors: {
    bg: '#F7F7F5',
    ink: '#111111',
    accent: '#FF90E8',
    border: '#111111'
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
    '5xl': '96px'
  },

  borders: {
    width: '3px',
    widthThick: '4px'
  },

  shadows: {
    hard: '0 6px 0 rgba(0, 0, 0, 1)',
    hardSm: '0 4px 0 rgba(0, 0, 0, 1)'
  },

  radius: {
    none: '0',
    sm: '8px',
    md: '12px'
  },

  typography: {
    desktop: {
      h1: { size: '64px', lineHeight: '72px', weight: '800' },
      h2: { size: '48px', lineHeight: '56px', weight: '700' },
      h3: { size: '32px', lineHeight: '40px', weight: '700' },
      h4: { size: '20px', lineHeight: '28px', weight: '700' },
      body: { size: '16px', lineHeight: '24px', weight: '400' },
      caption: { size: '12px', lineHeight: '16px', weight: '400' }
    },
    mobile: {
      h1: { size: '40px', lineHeight: '48px', weight: '800' },
      h2: { size: '28px', lineHeight: '36px', weight: '700' },
      h3: { size: '22px', lineHeight: '30px', weight: '700' },
      h4: { size: '20px', lineHeight: '28px', weight: '700' },
      body: { size: '15px', lineHeight: '22px', weight: '400' },
      caption: { size: '12px', lineHeight: '16px', weight: '400' }
    }
  },

  container: {
    paddingDesktop: '96px',
    paddingMobile: '20px'
  },

  animation: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms'
  }
} as const;

// CSS class utilities for common patterns
export const brutalStyles = {
  // Button styles
  buttonPrimary: `
    h-12 px-6
    border-ink border-[3px] rounded-[12px]
    shadow-[0_6px_0_rgba(0,0,0,1)]
    bg-accent text-ink
    hover:-translate-y-0.5 active:translate-y-0.5
    transition-transform duration-150 ease-out
    font-medium
  `,

  buttonOutline: `
    h-12 px-6
    border-ink border-[3px] rounded-[12px]
    shadow-[0_6px_0_rgba(0,0,0,1)]
    bg-transparent text-ink
    hover:-translate-y-0.5 active:translate-y-0.5
    transition-transform duration-150 ease-out
    font-medium
  `,

  // Card styles
  card: `
    border-ink border-[3px]
    shadow-[0_6px_0_rgba(0,0,0,1)]
    bg-bg p-6
  `,

  // Input styles
  input: `
    border-ink border-[3px]
    bg-bg text-ink
    px-4 py-3
    focus:outline-none focus:ring-[3px] focus:ring-accent
  `,

  // Container styles
  container: `
    mx-auto
    px-5 md:px-24
    max-w-7xl
  `,

  // Typography
  h1: 'text-[64px] leading-[72px] md:text-[40px] md:leading-[48px] font-[800] tracking-tight',
  h2: 'text-[48px] leading-[56px] md:text-[28px] md:leading-[36px] font-bold tracking-tight',
  h3: 'text-[32px] leading-[40px] md:text-[22px] md:leading-[30px] font-bold tracking-tight',
  h4: 'text-[20px] leading-[28px] font-bold tracking-tight',
  body: 'text-[16px] leading-[24px] md:text-[15px] md:leading-[22px]',
  caption: 'text-[12px] leading-[16px]'
} as const;

// Dark mode variants
export const darkTokens = {
  colors: {
    bg: '#111111',
    ink: '#F5F5F5',
    accent: '#FF90E8',
    border: '#F5F5F5'
  },
  shadows: {
    hard: '0 6px 0 rgba(245, 245, 245, 1)',
    hardSm: '0 4px 0 rgba(245, 245, 245, 1)'
  }
} as const;